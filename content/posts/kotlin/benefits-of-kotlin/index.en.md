---
title: "Benefits of Kotlin"
date: 2019-08-25
categories:
  - Kotlin
  - Highlights
---

This post was triggered by following tweet:

![](./haters-tweet.png)
 
Again and again I see as people compare languages/frameworks/approaches using only qualities which makes **X** looking better than **Y**, completely ignoring benefits that **Y** gives.

There are was some java code in OkHttp library, and it's **backward-compatible** replacement written in Kotlin. Cool thing is, that even when Kotlin code backward compatible, it do much more than Java and already more readable and concise!

Also, you shouldn't do conclusions based on single observations, for example [Uber's research](https://eng.uber.com/measuring-kotlin-build-performance/) concluded that:

> Overall, Kotlin resulted in 40 percent fewer lines of source code than Java

And what the point to mention lombok in case, where is no benefits from using it, huh?

---

But how we should edit old java class to make it closer to Kotlin version?

We should add nullability annotations. And not only annotations, but some plugin to check in compile time, that you didn't ignore this annotations, so it's adds additional complexity to build configuration and increasing compile time. Also, to fail-fast and get nice formatted exception, will be good practise to add some `preconditions` for method params:

```java
public final class Credentials {
    private Credentials() {
    }

    /** Returns an auth credential for the Basic scheme. */
    @NotNull
    public static String basic(
        @NotNull final String username, 
        @NotNull final String password
    ) {
        Objects.requireNonNull(username, "username should be not null");
        Objects.requireNonNull(password, "password should be not null");
        
        return basic(username, password, ISO_8859_1);
    }

    @NotNull
    public static String basic(
        @NotNull final String username, 
        @NotNull final String password, 
        @NotNull final Charset charset
    ) {
        Objects.requireNonNull(username, "username should be not null");
        Objects.requireNonNull(password, "password should be not null");
        Objects.requireNonNull(charset, "charset should be not null");

        String usernameAndPassword = username + ":" + password;
        String encoded = ByteString.encodeString(usernameAndPassword, charset).base64();
        return "Basic " + encoded;
    }
}
```

Also, current api looks not native for Kotlin, and I'll rather write such helper method in this way:

```kotlin
data class BasicCredentials(
    val username: String,
    val password: String
)

fun BasicCredentials.toHeader(charset: Charset = ISO_8859_1): String {
    val encoded = "$username:$password".encode(charset).base64()
    return "Basic $encoded"
}

// Never mess with params order, clear and readable, fluent
BasicCredentials(username = "e", password = "1337").toHeader()
```

I'm even will not try to write this is Java, because data class will be represented as 20-30 lines of boilerplate, and Java doesn't have extensions, default and named params, so I have to create this strange class without instance, just to put some static methods inside it!

I'll continue invest my time in Kotlin, because I believe I can do better with it! The language that supports coroutines, multiplatform and gives a joy.
