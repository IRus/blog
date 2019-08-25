---
title: "SLF4J Fluent Logging API in Kotlin"
date: 2019-08-26
categories:
  - Kotlin
  - Highlights
---

SLF4J 2.0.0 introduced new logging API:

```kotlin
logger.atInfo().log("Hello world")
```

New fluent api looks more verbose in simple cases like this. Let's compare it to traditional API:

```kotlin
// traditional
logger.info("Hello world")

// fluent
logger.atInfo().log("Hello world")
```

You may think that more advanced use-cases will be more readable or shorter. Let's check:

```kotlin
logger.debug("Temperature set to {}. Old temperature was {}.", newT, oldT)

logger.atDebug().addArgument(newT).addArgument(oldT).log("Temperature set to {}. Old temperature was {}.")

logger.atDebug().log("Temperature set to {}. Old temperature was {}.", newT, oldT)

logger.atDebug().addArgument(newT).log("Temperature set to {}. Old temperature was {}.", oldT)
```

But actually not. Traditional API more readable and shorter than new one, so what the point of this shiny-new-fluent API?

First, it laziness, you can use [`Supplier`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Supplier.html) to provide argument:

```kotlin
fun newT() = // costly computation
logger.atDebug().addArgument { newT() }.log("Temperature set to {}. Old temperature was {}.", oldT)
```

Second, now it's much easier to extend API, for example, it's possible to provide multiple [`Markers`](https://www.slf4j.org/apidocs/org/slf4j/Marker.html):

```kotlin
logger.atInfo().addMarker(DB).addMarker(SECURITY).log("SQL Injection attempt: '{}'", sql)
```

## SLF4J and Kotlin

Yes, this new fluent API accommodates a variety of present and future features without combinatorial explosion, and without requiring separate logging facades. But currently I feel like Kotlin [inline](https://kotlinlang.org/docs/reference/inline-functions.html) [extension](https://kotlinlang.org/docs/reference/extensions.html) functions solve main problem (laziness) of traditional API in simple an elegant way, without any overhead:

```kotlin
// Lazy debug
logger.debug { "Temperature set to ${newT()}. Old temperature was $oldT." }

// vs fluent:
logger.atDebug().addArgument { newT() }.log("Temperature set to {}. Old temperature was {}.", oldT)

// first statement, decompiled to java:
if (logger.isDebugEnabled()) {
     String var6 = "Temperature set to " + newT() + ". Old temperature was " + oldT + '.';
     logger.debug(var6);
}

// debug function source
inline fun Logger.debug(msg: () -> String) {
    if (isDebugEnabled) {
        debug(msg())
    }
}
```

## Conclusion

1. New API enables new and future features, but sacrifices brevity and readability;
1. Kotlin nicely solves existing API problems, without runtime overhead, thanks to inline functions.

### See also:

* [typical bug with traditional logging API](https://github.com/qos-ch/slf4j/pull/209/files)
* [SLF4J user manual: Fluent Logging API](https://www.slf4j.org/manual.html#fluent)
* [google/flogger](https://github.com/google/flogger)
