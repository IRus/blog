---
title: "Builder Pattern in Kotlin"
date: 1970-01-01
draft: true
categories:
  - Kotlin
  - Java
  - Highlights
---

https://habr.com/ru/company/jugru/blog/438866/

So question is: "How Builder Pattern will look in Kotlin?". 

## Builders in Java

Let's start with simple Java example of builder:

```java
public class User {
    private final String firstName;
    private final String lastName;

    User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        String firstName;
        String lastName;

        Builder firstName(String value) {
            this.firstName = value;
            return this;
        }

        Builder lastName(String value) {
            this.lastName = value;
            return this;
        }

        public User build() {
            return new User(firstName, lastName);
        }
    }
}
```

```java
// construct
final var user = User.builder()
        .firstName("John")
        .lastName("Doe")
        .build();
```

As you can see, in Java you'll need 38 lines of code to construct simple immutable object with two fields. And, one extra object of class `Builder` will be created.

If you never code Java before, you can wonder: what problem solves this extra builder object in first place? Why I can't just write something like:

```java
public class User {
    private final String firstName;
    private final String lastName;

    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
```

```java
// construct
final var user = new User("John", "Doe");
```

Indeed, for object with just a few properties it's better solution you'll get immutable object, with less code and Garbage Collector pressure. Problem kicks in when number of properties in `User` grows, you got some mandatory and optional(nullable) fields, and some fields with default value. Java constructors just not scale for these use-cases.

So what can Kotlin offers for solving this problems?

## Builders in Kotlin

In Kotlin you don't need Builders, period.

Let's rewrite previous example in Kotlin:

```kotlin
class User(
    val firstName: String,
    val lastName: String
)
```

```kotlin
// construct
val user = User(
    firstName = "John",
    lastName = "Doe"
)
```

That's it, this is how define and create immutable class with single constructors and default getters.

**Wow!** *— you, maybe.*

Does it solve issues that builder pattern solves? Yes!

With help of default and named arguments, and Kotlin nullable type it's easy to express all for what builders used:

```kotlin
class User(
    val firstName: String,
    val lastName: String,
    val age: Int = 0,
    val children: List<User>? = null
)
```

```kotlin
val user1 = User(
    firstName = "John",
    lastName = "Doe"
)

val user2 = User(
    firstName = "John",
    lastName = "Doe",
    age = 42
)

val user3 = User(
    firstName = "John",
    lastName = "Doe",
    children = listOf(
        User(
            firstName = "Bob",
            lastName = "Dylan"
        )
    ),
    age = 42
)
```

And still, there are no extra objects and boilerplate that you need to read and understand.



