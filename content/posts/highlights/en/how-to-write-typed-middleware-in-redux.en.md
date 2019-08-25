---
title: "How to write typed Middleware in Redux"
date: 2019-03-29
categories:
  - TypeScript
  - Highlights
---

Just a small snippet which uses TypeScript to define types in middleware declaration.
So implementation of middleware becomes possible even without documentation: you just use types to understand what functions do!

```typescript
import {Action, Dispatch, Middleware, Store} from "redux";
import {AppState} from "./store/AppState";

export function createMiddleware(): Middleware {
  return function (store: Store<AppState>) {
    return function (next: Dispatch) {
      return function (action: Action): Action {
        return next(action)
      }
    }
  }
}
```

Where `AppState` is simple interface which represents object stored in redux store.

Redux comes with types, so no need to install any additional typings.
