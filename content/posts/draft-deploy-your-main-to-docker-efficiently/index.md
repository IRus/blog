---
draft: true
title: "Pack Kotlin applications in Docker"
title: "Deploy your main to docker efficiently"
date: 2017-06-20
categories:
  - Kotlin
---
Let's write hello world in Kotlin:

We start with `build.gradle`:

```kotlin
plugins {
    id "org.jetbrains.kotlin.jvm" version "1.1.2"
}

repositories {
    jcenter()
}

dependencies {
    compile("org.jetbrains.kotlin:kotlin-stdlib:1.1.2")
    testCompile("junit:junit:4.12")
}
```

and then we write some kotlin code:

```kotlin
// Hello.kt
package by.ibragimov.blog

fun main(args: Array<String>) {
    println("Hello, World!")
}
```

So far so good, we can run `main` from Intellij Idea, and this program will print "Hello, World!" for us. But how to run this code in container?

First of all if we compile `Kotlin.kt` file we will get `HelloKt.class` with our main method:

```
$ javap HelloKt.class
Compiled from "Hello.kt"
public final class by.ibragimov.blog.HelloKt {
  public static final void main(java.lang.String[]);
}
```

Let's build out project:

```
$ ./gradlew clean build
```

And try to run main:

```
$ java -classpath build/libs/kotlin-docker.jar by.ibragimov.blog.HelloKt 
Exception in thread "main" java.lang.NoClassDefFoundError: kotlin/jvm/internal/Intrinsics
        at by.ibragimov.blog.HelloKt.main(Hello.kt)
Caused by: java.lang.ClassNotFoundException: kotlin.jvm.internal.Intrinsics
        at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:335)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 1 more
```

Ooops, we miss some dependencies. Even basic kotlin program depends on `kotlin-runtime`, and real world applications also relies on `kotlin-stdlib`.  

Let's fix this error:

```
$ java -classpath build/libs/kotlin-docker.jar:kotlin-runtime-1.1.2.jar:kotlin-stdlib-1.1.2.jar by.ibragimov.blog.HelloKt 
Hello, World!
```

Good, we finally run typical hello world application. But in real projects much more dependencies and manage they manually bad idea. So how we can distribute our `main`? 

Most popular sollution so called "fat jat" or "shadow jar". This means that we pack our classes and all their dependencies in single jar. In gradle we can use [Shadow Plugin](https://plugins.gradle.org/plugin/com.github.johnrengelman.shadow) for this purpose.

Setup is trivial, just change plugins section like this:

```kotlin
plugins {
    id "org.jetbrains.kotlin.jvm" version "1.1.2"
    id "com.github.johnrengelman.shadow" version "2.0.0"
}
```

And run `shadowJar` task:

```
$ ./gradlew shadowJar
```

And now it's much easier to run our code:

```
java -classpath build/libs/kotlin-docker-all.jar by.ibragimov.blog.HelloKt 
```

So that's it, create jar, and pack in docker, right?

Not so fast. Problem here that every layer of our image will have our code and all our dependencies. So if your fat jar weight like 30mb, than every build will increase size of docker image by 30mb. After 100 build total size of image will be like 3Gb+.

We can solve this problem with application plugin.

Again, edit plugins section and declare `mainClassName`:

```kotlin
plugins {
    id "org.jetbrains.kotlin.jvm" version "1.1.2"
    id "application"
}

mainClassName = "by.ibragimov.blog.HelloKt"
```

[Application plugin](https://docs.gradle.org/current/userguide/application_plugin.html) provides few tasks for us: `run distTar distZip installDist`.

We will use `installDist`:

```
$ ./gradlew clean installDist
```

Plugin create for us folder under `build/install`:

```
$ tree build/install/
build/install/
└── kotlin-docker
    ├── bin
    │   ├── kotlin-docker
    │   └── kotlin-docker.bat
    └── lib
        ├── annotations-13.0.jar
        ├── kotlin-docker.jar
        └── kotlin-stdlib-1.1.2.jar

3 directories, 5 files
```

Where we can find bash script for our application:

```
$ ./build/install/kotlin-docker/bin/kotlin-docker
Hello, World!
```

So it's looks much better: `application` plugin create folder with run scripts, our jar and dependencies. When we update our code only our jar updated, so overhead for docker images will be minimal. Let's check that.

First we need to write our dockerfile:

```Dockerfile
FROM java:8
COPY build/install/kotlin-docker /usr/src/app
WORKDIR /usr/src/app
CMD ["./bin/kotlin-docker"]
```

Than we build docker image with tag 1:

```
$ ./gradlew clean installDist
$ docker build -t ibragimov/hello:1 .
```

And finally run container from this image:

```
$ docker run ibragimov/hello:1
Hello, World!
```

Now, check the size of our image:

```
$ docker images | head -n 9
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
ibragimov/hello                     1                   799fda48048a        27 seconds ago      644.1 MB
<none>                              <none>              9d0f2da114de        About an hour ago   644.1 MB
<none>                              <none>              a8c8fd43933b        About an hour ago   644.1 MB
<none>                              <none>              a5acda956b51        3 weeks ago         90.76 MB
<none>                              <none>              54cc48d98e85        3 weeks ago         105.4 MB
<none>                              <none>              da8875da5465        3 weeks ago         156.9 MB
ubuntu                              17.04               e31f19d079cc        4 weeks ago         90.76 MB
ubuntu                              16.10               1b1ddabad182        4 weeks ago         105.4 MB
```

So size of our image 644.1 MB! It's a lot, but we don't care about our base image now. Let's make changes in our code, and create new layer.

Make changes:

```kotlin
// Hello.kt
package by.ibragimov.blog

fun main(args: Array<String>) {
    println("Hello, Docker!")
}
```

Build new image with tag "2":

```
$ ./gradlew clean installDist
$ docker build -t ibragimov/hello:2 .
```

Let's check that all work correctly:

```
$ docker run ibragimov/hello:2
Hello, Docker!
```

And see what changed:

```
$ docker images | head -n 9
REPOSITORY                          TAG                 IMAGE ID            CREATED              SIZE
ibragimov/hello                     2                   9f56f46036e4        29 seconds ago       644.1 MB
ibragimov/hello                     1                   799fda48048a        About a minute ago   644.1 MB
<none>                              <none>              9d0f2da114de        About an hour ago    644.1 MB
<none>                              <none>              a8c8fd43933b        About an hour ago    644.1 MB
<none>                              <none>              a5acda956b51        3 weeks ago          90.76 MB
<none>                              <none>              54cc48d98e85        3 weeks ago          105.4 MB
<none>                              <none>              da8875da5465        3 weeks ago          156.9 MB
ubuntu                              17.04               e31f19d079cc        4 weeks ago          90.76 MB
```

Hmm, looks like nothing. Let's introspect our image:

```

find ./build/install | xargs touch -t 0000000000.00
https://github.com/moby/moby/issues/15771

xargs touch -t 200001010000.00 // https://stackoverflow.com/a/26612694/1538877
