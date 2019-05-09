---
title: "Coroutines versus complexity: Trampolines"
date: 1970-01-01
draft: true
categories:
  - Kotlin
  - Highlights
---

https://adamschoenemann.dk/posts/2019-02-12-trampolines.html

This post will *not* be about Haskell but rather focus on Kotlin.
[My dayjob][9] is half Haskell half Kotlin (and a tiny bit of Typescript) so I frequently have to write Kotlin code.
Kotlin is certainly no Haskell but it does adress *some* of the *worst* pain points of Java and lets you sort-of write code in a functional style.
Even if you're not familiar with Kotlin but with other "modern" programming languages you should be able to follow along.
Also, there is nothing specific to Kotlin in this post that you couldn't (with relative ease) implement in any other "modern" mainstream programming language.
I'll keep the code as simple and "obvious" as possible.
You can find a [quick overview of the Kotlin syntax][5] here.

Many algorithms are most naturally expressed using recursion, but the JVM is just not very good at this since it quickly runs out of stack frames.
You can of course always increase the JVM stack size but this hampers the portability and safety of the code when deployed.

A special case of recursion is called **tail-recursion**.
A tail-recursive function has recursive calls *only immediately after a return*.
Or as stated in [this StackOverflow answer][6]: 

> ... the return value of any given recursive step is the same as the return value of the next recursive call.

For (a contrived) example:

```kotlin
fun countdown(n: Long): Long = if (n <= 0) then n else countdown(n-1)
```

Such functions can be optimized into an iterative style through *tail-recursion optimization*.
You can probably imagine in your head how to rewrite `countdown` above using just a loop, and the same general transformation can be done by a compiler.
In fact, Kotlin is capable of tail-recursion optimization but there is not always an easy way to express an algorithm with tail-recursion only.
Instead, we can rewrite our recursive code using **trampolines**.
[Wikipedia][1] has this to say about trampolines:

> ... a trampoline is a loop that iteratively invokes thunk-returning functions (continuation-passing style). A single trampoline suffices to express all control transfers of a program; a program so expressed is trampolined, or in trampolined style; converting a program to trampolined style is trampolining. Programmers can use trampolined functions to implement tail-recursive function calls in stack-oriented programming languages.

There are multiple blog posts out there ([this][2], [that][3] and [this one][4]) explaining trampolines (typically in Javascript), but what they all fail to mention (as does wikipedia) is that trampolines can in fact *also* be used to express recursive functions in general, and not *only* tail-recursive functions.
We'll see how shortly but first an example of trampolining a function.

It is straightforward to port existing recursive code to trampolined code.
For example the factorial function[^fn1].

```kotlin
fun factorial(n: Long): Long = if (n <= 1) n else n * factorial(n - 1)
```
Note that it is *not* tail-recursive, because the last statement in the recursive case is not simply a recursive call but is "guarded" underneath the multiplication.

We can rewrite `factorial` with trampolines as such:

```kotlin
fun tfactorial(n: Long): Trampoline<Long> =
        if (n <= 1) done(n)
        else delay(fun () = tfactorial(n - 1)).flatMap(fun (m) = done(m * n))

fun fact(n: Long) = tfactorial(n).run()
```

If you're not familiar with Kotlin, the most foreign syntax for you is probably the anonymous (lambda) functions.
The `fun () = ...` argument to `delay` introduces an anonymous function[^fn2] that doesn't depend on its arguments and computes `tfactorial(n - 1)` thus effectively delaying the execution of the recursive call to `tfactorial`.
The expression `fun (m) = done(m * n)` binds `m` to the result of recursive call on which we call `flatMap`.

Note that the structure of the code remains the same as in the un-trampolined version, but we wrap the branches in the appropriate trampoline combinators and use `flatMap` to use the result of a recursive call.
I'll explain the meaning of the combinators soon.

# Stack-based trampolines
The principle of a trampoline is that instead of expressing the recursion directly in Kotlin we instead build up a data structure that encodes the recursion.
Upon evaluation we then manually maintain a stack on which we store the continuations.
We use a loop to iterate through the computation without using the JVM's function stack.

Before we begin, we need a proper stack data structure.
Kotlin's built-in list is unfortunately terrible for this purpose, so we'll quickly handroll our own.

```kotlin
sealed class ConsList<out A> {
    object Nil : ConsList<Nothing>()
    data class Cons<A>(val hd: A, val tl: ConsList<A>) : ConsList<A>()

    fun unsafeHead(): A = when (this) {
        Nil -> throw RuntimeException("unsafeHead: head on empty list")
        is Cons -> hd
    }

    fun unsafeTail(): ConsList<A> = when (this) {
        Nil -> throw RuntimeException("unsafeTail: tail on empty list")
        is Cons -> tl
    }

    val isEmpty get() = this is Cons
}
val nil = Nil
infix fun <T>T.cons(l: ConsList<T>): ConsList<T> = Cons(this, l)
```
This is just a standard persistent linked list and a helper "infix" function used to extend it at its head.

A trampoline is built using three combinators:

- `done` encodes a base case in the recursive computation.
- `delay` encodes a recursive call that does not depend on any other recursive calls.
   It delays the recursive call by placing it under a function with unit domain (that is, a function that just ignores its result, also called a *thunk* or a *suspension*).
- `flatMap` lets you continue with the computation after the result of a recursive call.

I've not written down the type signatures, but perhaps you can spot that a trampoline forms a monad!
It's not important but an interesting aside.

We can encode these combinators in Kotlin as such:

```kotlin
sealed class Trampoline<out T> {
    private data class Done<out T>(val t: T) : Trampoline<T>() {}

    // Delay is a specialization of FlatMap but improves performance
    private data class Delay<out T>(
      val suspension: () -> Trampoline<T>
    ) : Trampoline<T>()

    private data class FlatMap<T, out U>(
      val waitFor: Trampoline<T>,
      val cont: (T) -> Trampoline<U>
    ) : Trampoline<U>()

    fun <U> flatMap(to: (T) -> Trampoline<U>): Trampoline<U> = FlatMap(this, to)
}
fun <T> done(t: T): Trampoline<T> = Done(t)
fun <T> delay(suspension: () -> Trampoline<T>): Trampoline<T> = Delay(suspension)
// or just FlatMap(done(Unit), { suspension() })
```

The `Suspend` constructor is not strictly necessary in terms of expressivity, since it can be encoded in terms of `FlatMap`.
However, it does allow a significant performance improvement since we can avoid allocating a continuation on the stack.

<aside class="notice">
The astute reader may note that `Done` and `FlatMap` are actually the constructors of the free monad over the functor `F[A] = () → A`.
</aside>

Now we can define how to run a trampolined computation. This is the signature:

```kotlin
fun <T> run(tramp: Trampoline<T>): T
```
The backbone of the algorithm is a while loop that runs until the trampoline is `Done` *and* there are no continuations left.
We keep track of the current result (call it `r`) which initially is `tramp`.
We'll define `stack` to be a list of continuations to be run after a recursive call is `done`.
Now it is a simple matter of inspecting the current result `r`:

- If `r` is `Done` then
  - If there are continuations in `stack` then pop the first one and call it with `r.t`.
    Then set `stack` to be the rest.
  - Otherwise we are done and we return the result inside `r`.
- If `r` is `Suspend` then we force the suspension and set `r` to be the resulting trampoline.
- If `r` is `FlatMap` then we pop `r.cont` on the continuation stack and set `r = r.waitFor`.

Here is the full Kotlin code:

```kotlin
fun <T> run(tramp: Trampoline<T>): T {
    var r = tramp as Trampoline<Any>
    var stack: ConsList<(Any) -> Trampoline<Any>> = nil
    while (true) {
        when (r) {
            is Done ->
                if (stack.isEmpty) {
                    return r.t as T
                } else {
                    r = stack.unsafeHead()(r.t)
                    stack = stack.unsafeTail()
                }
            is Delay -> {
                r = r.suspension()
            }
            is FlatMap<*, *> -> {
                stack = (r.cont as (Any) -> Trampoline<Any>) cons stack
                r = r.waitFor as Trampoline<Any>
            }
        }
    }
}
```

Unfortunately we have to subvert Kotlin's type system in order to implement this, because it lacks heterogenous lists.
It is perfectly safe though since a continuation will always be called with a result of the type it expects.

To show it off on a slightly more complicated example, here is the Fibonacci function:

```kotlin
fun fib(n: Long): Trampoline<Long> =
        if (n <= 1)
            done(n)
        else delay { fib(n - 1) }.flatMap { n1 ->
            fib(n - 2).flatMap { n2 -> done(n1 + n2) }
        }
```

If we code-golf it a bit and add a few helper combinators we can also express it in an "applicative" style:

```kotlin
fun fib2(n: Long): Trampoline<Long> =
        if (n <= 1)
            done(n)
        else delay { fib2(n - 1) }.zip(fib2(n - 2)).map { (n1, n2) -> n1 + n2 }
```

That's it!
Trampolined code does not run as fast as natively recursive code of course.
`FlatMap` is the biggest sinner since it requires allocating a continuation on the (heap-allocated) stack.
While it may not be super performant, trampolined code is completely guarded against stack-overflow errors!
If you can catch `StackOverFlowError`s (or their equivalent) in your language, you can even run an un-trampolined version first and then resort to the trampolined algorithm if you run out of stack space.

There are other approaches to implementing trampolines.
For example [Scalaz][7] directly composes trampolines when `flatMap`ing and PureScript uses a (much more complicated) technique described in [Reflection without Remorse][8].
I can't speak to their performance characteristics compared to the approach I've delineated here, and I don't have the time for a proper comparison.
They're probably faster but this approach wins on simplicity in my opinion.

Converting normal recursive code to trampolined code is in general not difficiult:

- base cases are wrapped in `done`.
- recursive calls are wrapped in `delay`.
- if you need to depend on the result of a recursive call, call `flatMap` on it and define the rest of your computation in the lambda function.

As such, we can write our recursive algorithms and then later mechanically trampoline them to get rid of those pesky `StackOverflowError`s.

[1]:https://en.wikipedia.org/wiki/Trampoline_(computing)
[2]:https://blog.logrocket.com/using-trampolines-to-manage-large-recursive-loops-in-javascript-d8c9db095ae3
[3]:https://www.datchley.name/recursion-tail-calls-and-trampolines/
[4]:http://raganwald.com/2013/03/28/trampolines-in-javascript.html
[5]:https://kotlinlang.org/docs/reference/basic-syntax.html
[6]:https://stackoverflow.com/questions/33923/what-is-tail-recursion
[7]:https://scalaz.github.io/scalaz/scalaz-2.9.1-6.0.4/doc.sxr/scalaz/Free.scala.html
[8]:http://okmij.org/ftp/Haskell/zseq.pdf
[9]:http://deondigital.com/
[^fn1]: Of course, the factorial function can be implemented simply and effectively with both loops and tail-recursion but we'll use its recursive formulation here for expositional purposes.
[^fn2]: Kotlin has some much more ergonomic syntax for lambda functions but I felt this was clearer in case the reader is not familiar with Kotlin.
