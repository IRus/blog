---
title: "Gradle and JDK version"
date: 2014-09-16
categories:
  - JVM
---

Yesterday at home I had a problem with a project that worked fine at work.

When I build(gradle build from Idea) the project, I get the following error:

```bash
:natrus-api:natrus-common-api:compileJava FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':natrus-api:natrus-common-api:compileJava'.
> invalid source release: 1.8

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.

BUILD FAILED
```

Hmm, check SDK in Idea – 1.8. Project setting fine, gradle settings too.

What wrong?

Ah, ok, I run Idea using jdk 1.7. When I run Idea using jdk 1.8 build succeeds.
