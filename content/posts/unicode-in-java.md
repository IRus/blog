---
title: "Unicode in Java"
date: 2015-06-11
categories:
  - JVM
---

How many times "Hello World!" will be printed? 😉

```java
public class Main {
    public static void main(String... args) {
        // The comment below is no typo.
        // \u000d System.out.println("Hello World!");
        System.out.println("Hello World!");
    }
}
```

[answer](http://stackoverflow.com/questions/30727515/why-is-executing-java-code-in-comments-allowed)
