---
title: "Koin Puzzler"
date: 2024-08-11
categories:
    - Kotlin
    - Highlights
---

I started using Koin starting from version 2.0.1, almost five years ago. Back then, I hadn’t yet seen how it was
possible to write even large Kotlin applications that would be easy to test without using something from the set:
spring-context, guice, koin, kodein, etc.

At that time, to get an “isolated” Koin context instead of the default global one, you had to use the following
approach:

```kotlin
suspend fun main() {
    val agentModule = module {
        single<AgentApplication>()
        // ...
    }

    val modules = listOf(
        agentModule,
        // ...
    )

    val koinApp = koinApplication {
        modules(modules)
    }

    koinApp.koin.get<AgentApplication>().start()
}
```

But, if we look at documentation, we will see that the recommended way to start the application is as follows:

```kotlin
val myModule = module {
    singleOf(::MyPresenter)
}

fun main() {
    startKoin {
        modules(myModule)
    }
}
```

Which will register global koin instance, leading to application architecture issues. By introducing a global singleton,
we risk introducing the following issues into the application’s architecture without a good reason: lack of isolation in
tests, tight coupling, and hidden dependencies.

1. Testing problems: Global singletons make it difficult to create isolated unit tests since they are hard to mock or stub. This violates testability principles.
2. Tight coupling: Global instances create strong dependencies between different parts of the application, which contradicts the principles of modularity and makes it harder to implement changes.
3. Hidden dependencies: Global singletons can obscure the actual dependencies of classes, making the code harder to understand and leading to implicit couplings.

Overall, such an approach is less flexible and testable.

### Koin uses a global singleton by default!

And we could have stopped there, but recently I noticed some interesting behavior in Koin:

```kotlin
class A(private val b: B) {
    fun print() = b.print()
}

class B(val name: String) {
    fun print() = println(name)
}


val moduleA = module {
    single { A(get()) }
}

fun main() {
    val app1 = koinApplication {
        modules(module {
            single { B("app1") }
        })
        modules(moduleA)
    }

    val app2 = koinApplication {
        modules(module {
            single { B("app2") }
        })
        modules(moduleA)
    }

    app1.koin.get<A>().print()
    app2.koin.get<A>().print()
}
```

Surprisingly, the output of this code will be:

```
app1
app1
```

By why?

It's not because `koinApplication` is using a global mutable singleton, but because `val a = module {}` is global and mutable as well!

### Modules in Koin are mutable!

When `app1` is created, it registers a module with a single instance of `B("app1")`. When app2 is created, it registers a module with a single instance of `B("app2")`. But the `moduleA` is shared between both applications, so the first registered module will be used to "initialize" `moduleA`, and instance `B("app1")` will be used in both applications.

At first, I was thinking that this is behaviour introduced by Koin 3.0, but it's not. It's been there since the beginning. I'm just being lucky to not define global modules before.

So, the lesson learned is: never define module globally, or better use module providers:

```kotlin
val moduleA = {
    module {
        single { A(get()) }
    }
}

fun main() {
    val app1 = koinApplication {
        modules(module {
            single { B("app1") }
        })
        modules(moduleA())
    }

    val app2 = koinApplication {
        modules(module {
            single { B("app2") }
        })
        modules(moduleA())
    }

    app1.koin.get<A>().print()
    app2.koin.get<A>().print()
}
```

Which will output:

```
app1
app2
```

as expected.

And it's very easy to miss this behavior, as it's not documented anywhere. So, be careful with Koin modules!

## Conclusion

Koin is a great library, but I'll not recommend it anymore for backend applications. I think it should update its defaults for more sensible, or at least document such behavior.
