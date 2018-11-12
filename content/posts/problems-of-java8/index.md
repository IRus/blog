---
title: "Первые грабли Java 8"
date: 2014-11-26
categories:
  - JVM
  - Highlights
---

![Java Professionals By](java-prof-by.jpg)

Моя первая попытка выступить на [Java Professionals BY: Meetup #2](http://events.dev.by/java-professionals-meetup-2) вышла комом, с самого начала все не заладилось и я смог победить волнение и кашу в голове только к концу доклада. Опыт получен, и надеюсь аудитория поняла и простила меня 😀

![](meetup.jpg)

На самом деле проблем в Java 8 нету 😉 Есть проблемы перехода с предыдущих версий языка, а остальное – проблемы неправильного использования.

## Bug or Feature?

К выпуску Java 8 Oracle предоставила гайд: [Compatibility Guide for JDK 8](http://www.oracle.com/technetwork/java/javase/8-compatibility-guide-2156366.html), но также надо помнить, что переходя с Java 6 на Java 8 нужно учитывать [также несовместимости 6 и 7 версии](http://www.oracle.com/technetwork/java/javase/compatibility-417013.html) (тем кто верит, что Java на 100% обратно совместима лучше не открывать ссылку) и так далее.

Что же должно волновать обычного разработчика, при переходе с 7 на 8 Java?

Пофикшенные баги наподобие этих:

[JDK-6559590](http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6559590) – изменилось поведение `String.split("")`, как следствие в некоторых случаях можно словить `ArrayIndexOutOfBoundsException`, а что еще хуже в тихую закораптить данные (например не используя первый символ, который всего был пустой строкой).

```bash
user@r2d2:~$ cat Test.java 
import java.util.Arrays;

public class Test {

    public static void main(String[] args) {
        System.out.println(Arrays.toString("123".split("")));
    }
}
user@r2d2:~$ /usr/lib/jvm/java-8-oracle/bin/javac Test.java
user@r2d2:~$ /usr/lib/jvm/java-8-oracle/jre/bin/java Test
[1, 2, 3]
user@r2d2:~$ /usr/lib/jvm/java-7-oracle/bin/javac Test.java
user@r2d2:~$ /usr/lib/jvm/java-7-oracle/jre/bin/java Test
[, 1, 2, 3]
```

[JDK-8021591](http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8021591) – в коллекциях `CopyOnWriteArrayList/CopyOnWriteArraySet/AbstractCollection` методы `removeAll(Collection)/retainAll(Collection)` не кидали NPE при передачи в них null. Как следствие перейдя с 4,5,6,7 на 8-ку можно ловить NPE пачками. 

```java
// AbstractCollection.java
// Java 7 ---------------------------------------- / Java 8 ----------------------------------
public boolean removeAll(Collection<?> c) {        public boolean removeAll(Collection<?> c) {
                                                  >    Objects.requireNonNull(c);
    boolean modified = false;                          boolean modified = false;
    Iterator<?> it = iterator();                       Iterator<?> it = iterator();
    while (it.hasNext()) {                             while (it.hasNext()) {
        if (c.contains(it.next())) {                       if (c.contains(it.next())) {
            it.remove();                                       it.remove();
            modified = true;                                   modified = true;
        }                                                  }
    }                                                  }
    return modified;                                   return modified;
}                                                  }

// Same in retainAll method

```

## Default methods

Должны использоваться аккуратно! Нужно понимать, что цель default методов в возможности расширения интерфейса, без потери совместимости со старым кодом:

> Default methods enable new functionality to be added to the interfaces of libraries and ensure binary compatibility with code written for older versions of those interfaces.

— [What's New in JDK 8](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html)

Использование default методов не по назначению может привести к излишнему усложнению кода:

```java
public class DefaultMethods {

    public static void main(String[] args) {

        // WTF is happens here!?
        Tiger tiger = new Tiger();
        tiger.meow();
        tiger.sayMeow();
        tiger.saySuperMeow();

        Cat cat = new Tiger();
        cat.meow();
        cat.sayMeow();
    }
}

class Cat implements Feline {
    public void sayMeow() {
        meow();
    }
}

class Tiger extends Cat implements Predator {
    public void saySuperMeow() {
        super.meow();
    }
}

interface Feline {
    default void meow() {
        System.out.println("Meow");
    }
}

interface Predator extends Feline {
    default void meow() {
        System.out.println("Rrrr");
    }
}
```

Разобраться в этой жести нам помогут простые правила (которые описаны в `jsr335-final/spec/H.html`):

  * A concrete implementation in the class wins
  * The lowest implementation in the implemented interfaces wins
  * If there are multiple implementations available through different interfaces that are on different paths up through the class hierarchy, the program doesn’t compile

Оставлю возможность понять что тут происходит вам самим. Для тех кому лень запускать ниже приведен вывод:
  
```
Rrrr
Rrrr
Meow
Rrrr
Rrrr
```

## Executing Streams in Parallel

Определенно Stream API это крутое нововведение в Java 8. Особенно многим понравилось возможность "ускорить" вычисления используя параллельные стримы. К сожалению в действительности это все не так однозначно, и сейчас я это продемонстрирую:

```java
import java.util.stream.IntStream;

public class JavaStreams {

    public static void main(String[] args) {
        test();
        test();
        test();
    }

    public static void test() {

        new Thread(() -> {
            long start = System.currentTimeMillis();

            long g = IntStream
                    .range(1, 100)
                    .map(x -> x * 2)
                    .sum();

            long stop = System.currentTimeMillis();
            System.out.println("Run1. Execution time: " + (stop-start) + "ms. Result: " + g);
        }).start();

        new Thread(() -> {
            long start = System.currentTimeMillis();

            long g = IntStream
                    .range(1, 100)
                    .map(x -> {
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                        }
                        return 42;
                    })
                    .sum();

            long stop = System.currentTimeMillis();
            System.out.println("Run2. Execution time: " + (stop-start) + "ms. Result: " + g);
        }).start();
    }
}
```

Симулируем типичное веб приложение: к нам приходят пользователи и выполняют какие-то операции в параллельных потоках. Без использования параллельных стримов мы получаем такие результаты:

```
Run1. Execution time: 7ms. Result: 9900
Run1. Execution time: 9ms. Result: 9900
Run1. Execution time: 0ms. Result: 9900
Run2. Execution time: 9919ms. Result: 4158
Run2. Execution time: 9921ms. Result: 4158
Run2. Execution time: 9915ms. Result: 4158
```

Очевидно что 9 секунд на отдачу результата во втором случае это очень много. Давайте применим параллельные стримы:

```java
import java.util.stream.IntStream;

public class JavaStreams {

    public static void main(String[] args) {
        test();
        test();
        test();
    }

    public static void test() {

        new Thread(() -> {
            long start = System.currentTimeMillis();

            long g = IntStream
                    .range(1, 100)
                    .parallel()
                    .map(x -> x * 2)
                    .sum();

            long stop = System.currentTimeMillis();
            System.out.println("Run1. Execution time: " + (stop-start) + "ms. Result: " + g);
        }).start();

        new Thread(() -> {
            long start = System.currentTimeMillis();

            long g = IntStream
                    .range(1, 100)
                    .parallel()
                    .map(x -> {
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                        }
                        return 42;
                    })
                    .sum();

            long stop = System.currentTimeMillis();
            System.out.println("Run2. Execution time: " + (stop-start) + "ms. Result: " + g);
        }).start();
    }
}
```

```
Run1. Execution time: 8ms. Result: 9900
Run1. Execution time: 21ms. Result: 9900
Run1. Execution time: 4936ms. Result: 9900
Run2. Execution time: 5024ms. Result: 4158
Run2. Execution time: 5013ms. Result: 4158
Run2. Execution time: 5026ms. Result: 4158
```

Замечательно! С 9 секунд до 5! Отличный результат. Стойте, WAT?

![WAT](wat.jpg)

4936ms? WAT? Запустим еще раз:

```
Run1. Execution time: 9ms. Result: 9900
Run1. Execution time: 9ms. Result: 9900
Run1. Execution time: 28ms. Result: 9900
Run2. Execution time: 4308ms. Result: 4158
Run2. Execution time: 4921ms. Result: 4158
Run2. Execution time: 5510ms. Result: 4158
```

И еще один разок:

```
Run1. Execution time: 6ms. Result: 9900
Run1. Execution time: 11ms. Result: 9900
Run2. Execution time: 5016ms. Result: 4158
Run1. Execution time: 5533ms. Result: 9900
Run2. Execution time: 5621ms. Result: 4158
Run2. Execution time: 6418ms. Result: 4158
```

Не ну все понятно скажете вы – мы же загрузили процессор второй задачей, вот он бедный с первой не справляется.

Ок, тогда давайте скажем первому стриму выполняться последовательно, а второму продолжать выполняться в параллели, несколько запусков и типичный результат:

```
Run1. Execution time: 9ms. Result: 9900
Run1. Execution time: 1ms. Result: 9900
Run1. Execution time: 1ms. Result: 9900
Run2. Execution time: 5016ms. Result: 4158
Run2. Execution time: 6825ms. Result: 4158
Run2. Execution time: 6916ms. Result: 4158
```

![Not Sure](fry.jpg)

Как же работают стримы внутри? Заглянем в имплементацию `Stream`, а точнее `BaseStream`, которая представлена классом `AbstractPipeline`. В нем есть метод `parallel()` в котором выставляется внутренне свойство **parallel** в `true` и возвращается стрим. Где же используется данное свойство `parallel`? Как мы знаем стримы ленивые и если в стриме не будет указан терминальная операция, то он не будет выполняться. Какие мы знаем терминальные операции? Самая очевидная операция это `reduce`, которая вызывает метод `AbstractPipeline#evaluate` передавая туда операцию `ReduceOps`. Соответственно перед выполнением в зависимости от свойства `parallel` стрим будет выполняться либо параллельно либо последовательно. Итак наша дорога через интерфейс `TerminalOp` пришла к одной из реализаций: `ReduceOp` и методу `evaluateParallel`, который возвращает `ReduceTask#invoke#get`. Сам `ReduceTask` – является `ForkJoinTask` который будет выполняться на `ForkJoinPool`. Но мы же не создаем свой пул, какой пул используется? А используется `ForkJoinPool#commonPool` (размер которого равен количеству процессоров минус 1), который один на всех. Собственно в этом и корень всех проблем – долгох живущие параллельные стримы "съедают" пул и не дают другим параллельным стримам выполниться.

Что делать? Не использовать parallel stream в многопользовательских приложениях и для маленьких задач.

Q. Как запустить стрим в своем пуле?
  
A. Создать свой `ForkJoinPool` и отправить на выполнение таск с `Stream`:
  
```java
ForkJoinPool forkJoinPool = new ForkJoinPool(2);
forkJoinPool.submit(() ->
    //parallel task here, for example
    IntStream.range(1, 1_000_000).parallel().filter(PrimesPrint::isPrime).collect(toList())
).get();
```

Q. Одна из библиотек внутри использует parallel stream, что делать?
  
A. Писать разработчикам библиотеки и бить их по пальцам. Конечно можно ограничить пул: **-Djava.util.concurrent.ForkJoinPool.common.parallelism=1**, но это только усугубит ситуацию. Конечно можно и увеличить пул, в таком случае производительность будет низкая но более предсказуема. В целом я не нашел способа глобально запретить стримам использовать параллелизм.

Поиграемся с размером пула:

```
parallelism=1

Run1. Execution time: 13ms. Result: 9900
Run1. Execution time: 4924ms. Result: 9900
Run1. Execution time: 4918ms. Result: 9900
Run2. Execution time: 5018ms. Result: 4158
Run2. Execution time: 9919ms. Result: 4158
Run2. Execution time: 13548ms. Result: 4158
```

```
parallelism=10

Run1. Execution time: 12ms. Result: 9900
Run1. Execution time: 18ms. Result: 9900
Run2. Execution time: 2011ms. Result: 4158
Run1. Execution time: 2022ms. Result: 9900
Run2. Execution time: 2311ms. Result: 4158
Run2. Execution time: 2431ms. Result: 4158

```

```
parallelism=100

Run1. Execution time: 91ms. Result: 9900
Run1. Execution time: 118ms. Result: 9900
Run1. Execution time: 111ms. Result: 9900
Run2. Execution time: 414ms. Result: 4158
Run2. Execution time: 399ms. Result: 4158
Run2. Execution time: 382ms. Result: 4158
```

```
parallelism=1000

Run1. Execution time: 333ms. Result: 9900
Run1. Execution time: 356ms. Result: 9900
Run1. Execution time: 362ms. Result: 9900
Run2. Execution time: 439ms. Result: 4158
Run2. Execution time: 475ms. Result: 4158
Run2. Execution time: 468ms. Result: 4158

```

```
parallelism=10000

Run1. Execution time: 365ms. Result: 9900
Run1. Execution time: 448ms. Result: 9900
Run1. Execution time: 450ms. Result: 9900
Run2. Execution time: 542ms. Result: 4158
Run2. Execution time: 535ms. Result: 4158
Run2. Execution time: 543ms. Result: 4158
```

_Все тесты выполнялись на Intel(R) Core(TM) i5-3317U CPU @ 1.70GHz_

Чтобы далеко не ходить оставлю ссылку на доклад второго спикера "[Алексей Руцкой: Как развиваться Java-разработчику](https://docs.google.com/presentation/d/1-31Yx3GxPmGuT7dFr6OcXRrxUR5aTqn3HfjyjGglcGY/edit?pli=1#slide=id.p)" ([pdf](Как%20развиваться%20Java-разработчику%20-%20Алексей%20Руцкой.pdf))

На этом спасибо за внимание и я всегда рад вашим комментариям 🙂
