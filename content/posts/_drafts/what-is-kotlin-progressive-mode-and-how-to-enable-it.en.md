---
title: "What is Kotlin's progressive mode, and how to enable it"
date: 1970-01-01
draft: true
categories:
  - Kotlin
  - Highlights
---


```
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all { task ->
    if (task.name.contains("Test") || task.name.contains("Jmh")) {
        task.kotlinOptions.freeCompilerArgs += experimentalsInTestEnabled
    } else {
        task.kotlinOptions.freeCompilerArgs += experimentalsEnabled
    }
}
```
