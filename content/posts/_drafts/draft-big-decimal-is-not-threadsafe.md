---
draft: true
title: "BigDecimal is not thread safe"
date: 1970-01-01
categories:
  - JVM
---

java.­math.­BigDecimal toString is not thread safe

http://vmlens.com/articles/java-math-BigDecimal-toString-is-not-threadsafe/
https://www.reddit.com/r/java/comments/6wxmxa/bigdecimal_tostring_is_not_thread_safe/?st=j8cykj6e&sh=55ea3a8e

    BigDecimal caches the result of toString() in a non-volatile private field stringCache without synchronization.

    ARM processors like to reorder memory reads and writes.

    EDIT: The implementation of Java they used has a bug regarding memory barriers and final fields.

    Therefore, it's possible that BigDecimal.stringCache will contain a non-null reference to a string that hasn't been fully constructed yet and has null as a backing array, because the write to BigDecimal.stringCache gets reordered to happen before the write to String.value.
    Another thread might see that non-null BigDecimal.stringCache reference, assume the string is ready to use and crash.


    I'll just add that BigDecimal.stringCache was volatile (which would prevent the bug) in early versions of Java 6 and it was brokenchanged probably in update 25 as a part of "performance improvements".
