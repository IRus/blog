---
title: "Gradle 5.0: Java heap space"
date: 2018-11-15
categories:
  - Gradle
  - Highlights
---

Today I try to update my work project to latest and greatest gradle 5.0-rc-2, 
and _all works fine on my machine_, but on CI I get the following error:

```
$ export GRADLE_USER_HOME="$(pwd)/.gradle"
$ ./gradlew check installDist
Downloading https://services.gradle.org/distributions/gradle-5.0-rc-2-all.zip
...........................................................................................................................

Welcome to Gradle 5.0-rc-2!

Here are the highlights of this release:
 - Kotlin DSL 1.0
 - Task timeouts
 - Dependency alignment aka BOM support
 - Interactive `gradle init`

For more details see https://docs.gradle.org/5.0-rc-2/release-notes.html

WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by org.codehaus.groovy.vmplugin.v7.Java7$1 (file:/builds/business-tools/.gradle/wrapper/dists/gradle-5.0-rc-2-all/a13m7fbwqqf008nfq7826hc3r/gradle-5.0-rc-2/lib/groovy-all-1.0-2.5.3.jar) to constructor java.lang.invoke.MethodHandles$Lookup(java.lang.Class,int)
WARNING: Please consider reporting this to the maintainers of org.codehaus.groovy.vmplugin.v7.Java7$1
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':buildSrc'.
> Could not open cache directory awcx1ns6ov4f85padchiv40ym (/builds/business-tools/.gradle/caches/5.0-rc-2/gradle-kotlin-dsl/awcx1ns6ov4f85padchiv40ym).
   > Java heap space

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 6.0.
Use '--warning-mode all' to show the individual deprecation warnings.
See https://docs.gradle.org/5.0-rc-2/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 2m 30s
ERROR: Job failed: exit code 1
```

Also, in the same build, I updated build image from `openjdk:10.0.2-jdk` to `openjdk:11.0.1-jdk`.

So what can be broken:

1. openjdk:11.0.1-jdk;
1. gradle 5.0-rc-2;
1. `Could not open cache directory` - dude, just clean CI cache!

Cleaning caches, simple solution! Gitlab UI -> **Clean Runners Caches**, nope, doesn't help.

Okay, okay, let's downgrade JDK! Nope, doesn't help. Also on my machine,
I'm running JDK 11, so should catch the 
problem with JDK before CI.

So obviously problem with gradle, downgrade to 4.10.2... And yes, build passed!

Actually even before I mentioned that something related to `Xmx` changed in gradle 
wrapper (I always check all changes that I checkout in a repository).

```diff
--- gradlew	(revision 348719af7076745db56e62d44a0c8f4572994b33)
+++ gradlew	(date 1542307822000)
@@ -28,7 +28,7 @@
 APP_BASE_NAME=`basename "$0"`
 
 # Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
-DEFAULT_JVM_OPTS=""
+DEFAULT_JVM_OPTS='"-Xmx64m"'
 
 # Use the maximum available, or set MAX_FD != -1 to use that value.
 MAX_FD="maximum"
```

So new `Xmx` for gradle wrapper is 64Mb, but why build fails only on CI?

> At that point I remembered that _Java heap space_ is general 
> message in OutOfMemoryError: `java.lang.OutOfMemoryError: Java heap space`. 

After some investigation I found out a key difference between local and CI setup:
on CI gradle daemon is disabled!

I added this line to `gradle.properties` to check my assumption:

```properties
org.gradle.daemon=false
```

And boom, the build fails locally too!

## Why?

So daemon mode is disabled, and when I running `./gradlew ...` I actually run single 
java process with main class `org.gradle.wrapper.GradleWrapperMain` with default 
heap size of `64Mb`.

When daemon is enabled actual work delegates to daemon process, 
and daemon process has `128Mb` of heap. 

## How to fix?

Option 1: Set Environment variable with bigger heap size:

```yaml
variables:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false -Dorg.gradle.jvmargs=-Xmx128m"
```

Option 2: Set this property in `gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx128m
```

Documentation reference: [Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)

That it! Simple advice to give your Gradle JVM process more memory.

## How much memory?

What if I give even more memory to process? Like 256mb or 512Mb, is it will speed up build?

So I disabled daemon mode, and try few heap sizes 128, 256, 512:

```properties
# gradle.properties
# -Xmx128m, -Xmx256m, -Xmx512m
org.gradle.jvmargs=-Xmx128m
org.gradle.daemon=false
```

And for my project no difference at all: 29-30sec with any heap size. I opened 
visual vm and found that pressure really small, and 128mb enough for my project.

![Heap and CPU in Visual VM](./visualvm.png)

Also, I found an interesting thing, even if You'll disable daemon mode, and you set 
non default heap amount, gradle will start another JVM with the same name as a regular daemon, 
but this JVM will stop after build complete.

![Two processes](./two-processes.png)

_Bonus_: to speed up build you can use parallel execution:

```properties
org.gradle.parallel=true
```

In my case speed up was 33% or 10 sec on a local machine.

## Conclusion

It's always important to understand what and how you run. 
