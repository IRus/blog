---
title: "Small scopes and SRP rocks, isn’t it?"
date: 2017-05-23
categories:
  - Kotlin
  - Highlights
---

We discussing [recent post](http://www.yegor256.com/2017/05/17/single-statement-unit-tests.html) by "OOP" funboy Yegor Bugayenko.

My thoughts that it's not about FP or OOP, objects or functions, it's all about [SRP](https://en.wikipedia.org/wiki/Single_responsibility_principle). Like we have two initialization blocks in one method, and then we test results of these blocks. We can move this blocks in lambdas/functions/classes, but in general it's just two functions that produces `a` and `b` and then we compare `a` and `b`. After working with [Kotlin](http://kotlin.link/ "Kotlin Programming Language") I'll write this test like:

```java
@Test
void testIntStream() {
    final long seed = System.currentTimeMillis();

    assertEquals(
        run(() -> {
            final Random r1 = new Random(seed);
            final int[] a = new int[SIZE];
            for (int i = 0; i < SIZE; i++) {
                a[i] = r1.nextInt();
            }
            return a;
        }),
        run(() -> {
            final Random r2 = new Random(seed);
            return r2.ints().limit(SIZE).toArray();
        })
    );
}
```

Just like in Yegor's solution my test have only one statement: `assertEquals`.
  
My approach much more clean, and for every new test I don't write any boilerplate for the glory of "OOP" God.

Just like Yegor's solution, my approach have same benefits over original test:

  * Reusability — I can easy extract lambda from test, and reuse between number of test.
  * Brevity — It's much less code with in place lambdas.
  * Readability
  * Immutability

In post Yegor's approach seems good, but it doesn't scale to real applications.

`run` function for the reference:

```java
public static <R> R run(Producer<R> producer) {
    return producer.produce();
}
```

## Kotlin version

So also I'd like to add Kotlin example for this test, it's much more readable even than Java version with lambdas (no surprise here)

```kotlin
@Test fun testIntStream() {
        val seed = System.currentTimeMillis()

        assertArrayEquals(
            expected = {
                val r1 = Random(seed)
                IntArray(SIZE).also { array ->
                    for (i in 0..SIZE - 1) {
                        array[i] = r1.nextInt()
                    }
                }
            },
            actual = {
                val r2 = Random(seed)
                r2.ints().limit(SIZE.toLong()).toArray()
            }
        )
    }
```

I am using JUnit 5 for this test, and was expecting that JUnit 5 has methods that accepts lambdas for assert, but unfortunately – there are no such signature. So I added it:

```kotlin
fun assertArrayEquals(expected: () -> IntArray, actual: () -> IntArray) {
    Assertions.assertArrayEquals(expected.invoke(), actual.invoke())
}
```

I think will be nice to have support library for JUnit 5 with such methods.

