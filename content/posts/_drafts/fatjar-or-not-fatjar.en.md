---
title: "Right way to pack Kotlin application"
date: 1970-01-01
draft: true
categories:
  - Kotlin
  - Gradle
  - Highlights
---


С приходом контейнеризации, да и в общем-то до неё 

jlink, gradle application plugin + docker, substract vm

http://docs.oracle.com/javase/8/docs/technotes/guides/deploy/self-contained-packaging.html


В двух словах: собрать например через Gradle application plugin все джарки в одну папку, натравить jdeps, получить от него список модулей и собрать Java runtime image


## List java modules:

```bash
jdeps --list-deps lib/*
```

## Build java runtime:

```bash
jlink --no-header-files --no-man-pages --compress=2 --strip-debug --add-modules java.base,java.logging,java.management,java.naming,java.security.jgss,java.security.sasl --output java-runtime
```

## Run application script with custom java runtime:

```bash
JAVA_HOME="../java-runtime/" ./reporter
```
