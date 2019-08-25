---
title: "How to use Apache AsyncHttpClient with Kotlin Coroutines"
date: 2017-06-08
categories:
  - Kotlin
  - Highlights
---

**upd.** Code updated to work with Kotlin 1.3 and stable coroutines.

If you try to use Apache Async HttpClient with Kotlin coroutines you will found that their API (`execute` method) returns `java.util.concurrent.Future` that can't be simply used with coroutines. But, you also allowed to pass future callback to `execute` method:

```java
// interface HttpAsyncClient
Future<HttpResponse> execute(
    HttpUriRequest request,
    FutureCallback<HttpResponse> callback
);
```

Let's take a look at `FutureCallback` interface:

```java
public interface FutureCallback<T> {
    void completed(T result);
    void failed(Exception ex);
    void cancelled();
}
```

## Step 1: Init.

There are many in common between `CompletableFuture` and `FutureCallback` API, so let's create `CompletableFuture` and wrap current method call to return it:

```kotlin
fun HttpAsyncClient.execute(request: HttpUriRequest): CompletableFuture<HttpResponse> {
    val future = CompletableFuture<HttpResponse>()

    this.execute(request, object : FutureCallback<HttpResponse> {
        override fun completed(result: HttpResponse) {
            future.complete(result)
        }

        override fun cancelled() {
            future.cancel(false)
        }

        override fun failed(ex: Exception) {
            future.completeExceptionally(ex)
        }
    })

    return future
}
```

So what happens here:

We create extension function for `HttpAsyncClient`, and we can use this function in more natural way:

```kotlin
override suspend fun getCount(url: String): Int {
    // ...
    val response = httpClient./* calling extension */execute(request)./* kotlinx.coroutines extension */await()
    // ...
}
```

On first method's line we create a new incomplete instance of `CompletableFuture` and return it on last line. We use this instance inside `FutureCallback`. So when some method of callback will be called, our future will change state.

Another important part – `suspend` [doc](http://kotlinlang.org/docs/reference/coroutines.html) modifier on function, that mean that function can be suspended.

## Step 2: Refactor.

Imagine that we have few methods `execute` and we want to reuse code. Then again: [extension functions](http://kotlinlang.org/docs/reference/extensions.html) and [class delegation](http://kotlinlang.org/docs/reference/delegation.html) to the rescue!

```kotlin
class CompletableFutureCallback<T>(
    val completableFuture: CompletableFuture<T>
) : FutureCallback<T>, Future<T> by completableFuture, CompletionStage<T> by completableFuture {
    override fun failed(ex: Exception) {
        completableFuture.completeExceptionally(ex)
    }

    override fun cancelled() {
        completableFuture.cancel(false)
    }

    override fun completed(result: T) {
        completableFuture.complete(result)
    }
}

suspend fun <T> CompletableFutureCallback<T>.await(): T = this.completableFuture.await()
```

And now we can use this class like this:

```kotlin
fun HttpAsyncClient.execute(request: HttpUriRequest): CompletableFutureCallback<HttpResponse> {
    val future = CompletableFutureCallback(CompletableFuture<HttpResponse>())

    this.execute(request, future)

    return future
}

// Somewhere

client.execute(request)./* our extension */await()
```

So that's it, most simple approach to use `HttpAsyncClient` with coroutines.

## Step 3: Performance.

You can see that we create at least one instance of `CompletableFuture`, so we do one allocation of `CompletableFuture` for every call. Is it necessary?

What we do: we create instance of `CompletableFuture` and then suspend on it with help of `CompletableFuture.await()` extension. You can see that `await` uses `suspendCancellableCoroutine` function under the hood. Can we use this function directly? Sure, why not:

```kotlin
import kotlinx.coroutines.CancellableContinuation
import kotlinx.coroutines.cancelFutureOnCancellation
import kotlinx.coroutines.suspendCancellableCoroutine
import org.apache.http.HttpResponse
import org.apache.http.client.methods.HttpUriRequest
import org.apache.http.concurrent.FutureCallback
import org.apache.http.nio.client.HttpAsyncClient

suspend fun HttpAsyncClient.execute(request: HttpUriRequest): HttpResponse {
    return suspendCancellableCoroutine { cont: CancellableContinuation<HttpResponse> ->
        val future = this.execute(request, object : FutureCallback<HttpResponse> {
            override fun completed(result: HttpResponse) {
                cont.resumeWith(Result.success(result))
            }

            override fun cancelled() {
                if (cont.isCancelled) return
                cont.resumeWith(Result.failure(CancellationException("Cancelled")))
            }

            override fun failed(ex: Exception) {
                cont.resumeWith(Result.failure(ex))
            }
        })

        cont.cancelFutureOnCancellation(future);
        Unit
    }
}
```

Looks good, we use low-level `suspendCancellableCoroutine` function from standard library, and also we support cancellation of `Future`! (but cancellation support is [not perfect](https://github.com/Kotlin/kotlinx.coroutines/issues/830)).

This is my final approach for today.
