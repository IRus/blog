---
draft: true
title: "How Optimistic Locking Works in Apache Cayenne"
date: 1970-01-01
categories:
  - Kotlin
---

Короче рассказываю что все-таки сделал с корутинами (через какое-то время расскажу как с этим жить).

У меня сервер принимает запрос, и я с IO треда перекидываю его на serverContext(processors - 1), в какой-то момент обработка из "контроллера" проваливается в сервисы, и я создаю класс моей ORM - ObjectCon
