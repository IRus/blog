---
title: "Mockito 2.1"
date: 2017-04-27
categories:
  - JVM
---

Наконец-то дошли руки посмотреть на [Mockito 2](https://github.com/mockito/mockito/wiki/What%27s-new-in-Mockito-2).

Из того что мне показалось интересным:

* CGLIB заменили ByteBuddy
* Частичная поддержка Java 8
* MockitoExtension для Junit 5 (3rd party)
* final class теперь можно мокать (опционально и вообще не делайте так)

Итого хотя я долго не подходил к новому мокито, оказалось что это практически "проходной релиз", и теперь я буду пытаться апгредиться на проектах где использую мокито.

```kotlin
testCompile("org.mockito:mockito-core:2.7.22")
```
