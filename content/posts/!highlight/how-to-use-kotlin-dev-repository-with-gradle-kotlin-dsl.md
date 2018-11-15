---
title: "How to use Kotlin Dev repository with Gradle Kotlin DSL"
date: 2018-11-14
categories:
  - Kotlin
  - Highlights
---

If you try to use some dev version of kotlin, for example:

```kotlin
// file: build.gradle.kts
plugins {
    kotlin("jvm").version("1.3.20-dev-1612")
}
```

You will get the following exception:

```
* What went wrong:
Plugin [id: 'org.jetbrains.kotlin.jvm', version: '1.3.20-dev-1612'] was not found in any of the following sources:

- Gradle Core Plugins (plugin is not in 'org.gradle' namespace)
- Plugin Repositories (could not resolve plugin artifact 'org.jetbrains.kotlin.jvm:org.jetbrains.kotlin.jvm.gradle.plugin:1.3.20-dev-1612')
  Searched in the following repositories:
    BintrayJCenter
    Gradle Central Plugin Repository
```

In old-fashion `buildscript` block you can define `repositories`, but with shiny new `plugins` block it's impossible. So you need to edit your `settings.gradle.kts`, and add `pluginManagement` block in it:

```kotlin
pluginManagement {
    repositories {
        jcenter()
        gradlePluginPortal()
        maven { url = uri("https://kotlin.bintray.com/kotlin-dev") }
    }
}
```

_Fun fact: Kotlin has own subdomain in bintray: `kotlin.bintray.com`_

And don't forget edit `repositories` block in `build.gradle.kts` for artifacts resolving:

```kotlin
repositories {
    jcenter()
    maven { url = uri("https://kotlin.bintray.com/kotlin-dev") }
}
```

Actually, you can do a lot of thing with `pluginManagement`, like changing versions, or specify artifact for requested plugin id. Consult gradle [documentation (5.0-rc-2)](https://docs.gradle.org/5.0-rc-2/userguide/plugins.html) for more details.

Have a nice Kotlin!
