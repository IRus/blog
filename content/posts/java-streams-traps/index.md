---
title: "Ловушки Java Streams"
date: 2015-02-25
categories:
  - JVM
  - Highlights
---

Привет, и в очередной раз мы поговорим про новшества Java 8, а точнее `Files.lines()`.

Что может быть проще:

```java
public class FilesLines {

    public static void main(String[] args) throws Exception {
        Path path = Paths.get("/home/ruslan/test.txt");

        for (int i = 0; i < 10000; i++) {
            Files.lines(path).count();
        }
    }
}
```

Создаем стринговый стрим из файла делаем какие-то операции со стримом и продолжаем работу, стрим же сам о всем позаботиться.

Запустим этот код под Ubuntu 14.04

```bash
java -version
java version "1.8.0_31"
Java(TM) SE Runtime Environment (build 1.8.0_31-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.31-b07, mixed mode)
```

Результат:

```
Exception in thread "main" java.nio.file.FileSystemException: /home/ruslan/test.txt: Too many open files
    at sun.nio.fs.UnixException.translateToIOException(UnixException.java:91)
    at sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:102)
    at sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:107)
    at sun.nio.fs.UnixFileSystemProvider.newByteChannel(UnixFileSystemProvider.java:214)
    at java.nio.file.Files.newByteChannel(Files.java:361)
    at java.nio.file.Files.newByteChannel(Files.java:407)
    at java.nio.file.spi.FileSystemProvider.newInputStream(FileSystemProvider.java:384)
    at java.nio.file.Files.newInputStream(Files.java:152)
    at java.nio.file.Files.newBufferedReader(Files.java:2784)
    at java.nio.file.Files.lines(Files.java:3744)
    at java.nio.file.Files.lines(Files.java:3785)
    at by.ibragimov.jpress.FilesLines.main(FilesLines.java:14)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:483)
    at com.intellij.rt.execution.application.AppMain.main(AppMain.java:140)
```

![WTF](wtf.jpg)

Что-же говорит нам документация? Посмотрим: `File#lines(Path path)` не содержит ничего подозрительного, но внутри просто делегирует вызов в `Files#lines(Path path, Charset cs)`, а вот тут уже JavaDoc'и на намекают:

```java
/**
 * ...
 * The returned stream encapsulates a {@link Reader}.  If timely
 * disposal of file system resources is required, the try-with-resources
 * construct should be used to ensure that the stream's
 * {@link Stream#close close} method is invoked after the stream operations
 * are completed.
 * ...
 */
```

Ну и исправленная версия напоследок:

```java
public class FilesLines {

    public static void main(String[] args) throws Exception {
        Path path = Paths.get("/home/ruslan/test.txt");

        for (int i = 0; i < 10000; i++) {
            try (Stream<String> stream = Files.lines(path)) {
                stream.count();
            }
        }
    }
}
```

Вывод как всегда один: читайте документацию.

https://stackoverflow.com/questions/34072035/why-is-files-lines-and-similar-streams-not-automatically-closed/34073306#34073306
 
> @Brian Goetz:
> 
> Yes, this was a deliberate decision. We considered both alternatives.
> 
> The operating design principle here is "the entity that acquires a resource should release the resource". Files don't auto-close when you read to EOF; we expect files to be closed explicitly. Streams that are backed by IO resources are the same.
> 
> Fortunately, the language provides a mechanism for automating this for you: try-with-resources. Because Stream implements AutoCloseable, you can do:
> 
> ```
> try (Stream<String> s = Files.lines(...)) {
>     s.forEach(...);
> }
> ```
> 
> The argument that "it would be really convenient to auto-close so I could write it as a one-liner" is nice, but would mostly be the tail wagging the dog. If you opened a file or other resource, you should also be prepared to close it. Effective and consistent resource management trumps "I want to write this in one line", and we chose not to distort the design just to preserve the one-line-ness.

> @Tagir Valeev:
> 
> I have more specific example in addition to @BrianGoetz answer. Don't forget that the Stream has escape-hatch methods like iterator(). Suppose you are doing this:
> 
> ```
> Iterator<String> iterator = Files.lines(path).iterator();
> ```
> 
> After that you may call hasNext() and next() several times, then just abandon this iterator: Iterator interface perfectly supports such use. There's no way to explicitly close the Iterator, the only object you can close here is the Stream. So this way it would work perfectly fine:
> 
> ```
> try(Stream<String> stream = Files.lines(path)) {
>     Iterator<String> iterator = stream.iterator();
>     // use iterator in any way you want and abandon it at any moment
> } // file is correctly closed here.
> ```
> 
