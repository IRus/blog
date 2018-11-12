---
title: "Семантика Enum в Java"
date: 2015-03-24
categories:
  - JVM
  - Highlights
---

Ничего интересного, просто JavaDoc метода name и toString из класса Enum.

```java
/**
 * Returns the name of this enum constant, exactly as declared in its
 * enum declaration.
 *
 * <b>Most programmers should use the {@link #toString} method in
 * preference to this one, as the toString method may return
 * a more user-friendly name.</b>  This method is designed primarily for
 * use in specialized situations where correctness depends on getting the
 * exact name, which will not vary from release to release.
 *
 * @return the name of this enum constant
 */
public final String name() {
    return name;
}
```

`name` – `final` метод, а значит переопределять его мы не можем, а вот `toString` естественно можно:

```java
/**
 * Returns the name of this enum constant, as contained in the
 * declaration.  This method may be overridden, though it typically
 * isn't necessary or desirable.  An enum type should override this
 * method when a more "programmer-friendly" string form exists.
 *
 * @return the name of this enum constant
 */
public String toString() {
    return name;
}
```

Т.е. для получения enum в виде стринги в большинстве случаев используем name, toString может использоваться для красивых логов (если enum содержит какие-либо поля).

![Semantics](semantics.jpg)
