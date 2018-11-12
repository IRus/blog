---
draft: true
title: "Java 9 vs Kotlin"
date: 1970-01-01
categories:
  - Kotlin
---

Я плотно занялся Java 9 (точнее Java 9 Modules, jlink) в рамках [Bootique](https://bootique.io/) и по этому поводу решил провести сравнение Java 9 и Kotlin. Цель - понять внесла ли Java 9 какие-то изменения которые делают её более привлекательной на фоне Kotlin.

### Collection Literals 

List.of() <- limited with 11 methods not even 22! :)
Set.of() <- limited with 11 methods not even 22! :)
Map.of() <- limited with 11 methods not even 22! :)
Map.ofEntries()

Проблема - List.of возвращает как бы немутабльный и будет кидать эксепшен! Doh!

### Pair?

Map.entry(key, value)

### ?:

name ?: "Bob"

Objects.requireNonNullElse(name, "Bob")

Objects.requireNonNullElseGet(name,  () -> "Bob")

Optional.ofNullable(name).orElse("Bob")

optional.or(...)
optional.ifPresentOrElse(...)

### Optional + Stream

peopleStream.map(Person::name).flatMap(Optional::stream)

### Streams

Scanner.token, Matcher.results, ServiceLoader.streams, LocalDate.dateUtils,
StackWalker.walk, ClassLoader.resources, Process.children/descendants,
Catalog.catalogs, DriverManager.drivers

Files.lines - uses memory mapped file (parallel stream)

Новые методы
takeWhile
dropWhile

Stream.iterate(BigInteger.ZERO, n -> n.compareTo(limit) < 0, n -> n.add(BigInteger.ONE))

New collectors: flatMapping/filtering

### I/O

readAllBytes(readNBytes):
url.openStream().readAllBytes();

InputStream.transferTo(OutputStream)


### Regex

Matcher.replaceFirst/replaceAll

## Более значительные изменения 


### Process API

```java
final Process process = new ProcessBuilder("/bin/ls", "-la").start();
final String out = new String(process.getInputStream().readAllBytes(), Charset.forName("UTF-8"));
System.out.println("Done! Out: ");
System.out.println(out);
```

### Http Client

```java
final HttpClient httpClient = HttpClient.newBuilder()
    .followRedirects(HttpClient.Redirect.ALWAYS)
    .build();

final HttpRequest httpRequest = HttpRequest.newBuilder()
    .uri(new URI("https://heap.by"))
    .GET()
    .build();

final HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandler.asString());
```

### Deprecated

Как видят `@Deprecated` Java разработчики:

```java
@Deprecated(since = "9", forRemoval = true)
public class ClassThatIWrote {
    // ...
}
```

Как вижу `@Deprecated` я:

```java
@Deprecated(since = "9", forRemoval = true)
public @interface Deprecated {
    // ...
}
```

```kotlin

```

jdeprscan

### Изменения в языке:

* `_` теперь нельзя использовать в качестве имени переменной;
* try-with-resource может быть использован с effectively final variable;
* interfaces с private и private static methods

@SafeVarargs можно писать на приватных методах.

Diamond с анонимными классами
List<String> alwaysJava = new ArrayList<>() {
    public String get(int n) { return "Kotlin Kotlin Kotlin"; }
};

Multi-Release JARs

Resource files are now UTF-8

Search in documentation

jshell


BigInteger.TWO - ждем появление BigInteger.THREE


Java 10 https://habrahabr.ru/post/349868/




























