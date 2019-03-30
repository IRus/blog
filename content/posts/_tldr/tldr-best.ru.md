---
title: "TLDR: Лучшее"
date: 2019-03-29
categories:
  - TLDR
---

<!-- * [](https://www.youtube.com/watch?v=) -->

## Lock-Free Algorithms for Kotlin Coroutines

* [Roman Elizarov — Lock-Free Algorithms for Kotlin Coroutines (Part 1)](https://www.youtube.com/watch?v=W2dOOBN1OQI)
* [Roman Elizarov — Lock-Free Algorithms for Kotlin Coroutines (Part 2)](https://www.youtube.com/watch?v=iQsN_IDUTSc)

Первая часть:

* описывает алгоритм Lock-Free DoubleLinkedList: интерсный концепт "помощи", и "линериализации" алгоритма.

Вторая часть:

* применяет этот лист для создания канала в Kotlin корутинах
* описывает алгоритм Double Compare Single-Swap необходимый для реализации `select` на каналах
* описывает алгоритм Compare-And-Swap-N-words

ps. Бедные студенты, у них нету возможности пересмотреть эти видео два-три раза прямо на лекции. Конечно можно посмотреть лекцию, прийти домой, дождаться когда видео опубликуют и пересмотреть. Но лучше когда есть возможность отматать назад, все-таки сложно. Даже **Никита Коваль — Как устроены каналы в корутинах в Kotlin** кажется был не таким сложным.

## KotlinConf 2018

[Youtube Playlist](https://www.youtube.com/playlist?list=PLQ176FUIyIUbVvFMqDc2jhxS-t562uytr)

* [KotlinConf 2018 - Conference Opening Keynote by Andrey Breslav](https://www.youtube.com/watch?v=PsaFVLr8t4E) - Конечно стоит смотреть, Андрей рассказывает о настоящем и будущем Kotlin;

## Joker 2018

[Youtube Playlist](https://www.youtube.com/playlist?list=PLVe-2wcL84b_DvLWtURPD0Dz2NZil55XI)

* [Никита Коваль — Как устроены каналы в корутинах в Kotlin](https://www.youtube.com/watch?v=eZshP8zPSFo) - Никита сравнил каналы в Go Lang и новую реализацию в Kotlin. Много деталей реализации: send, receive, select, про select я не понял с первого раза, буду пересматривать;
* [Павел Финкельштейн — Котлин — 2 года в продакшне и ни единого разрыва](https://www.youtube.com/watch?v=nCDWb7O1ZW4) - доклад который рассказывает про опыт Kotlin, проблемы при использовании Kotlin с различными Java библиотеками, если вы уже разрабатывали на Kotlin реальные приложения - можете смело пропускать доклад;
* [Евгений Мандриков — Java 4..11, Kotlin, Code Coverage и их лучший друг — байткод](https://www.youtube.com/watch?v=89dSBMxaX_k) - как выглядит байткод разного кода на Java (и чуть-чуть на Kotlin), и как JaCoCo с этим живет;
* [Олег Шелаев — Компилируем Java ahead of time с GraalVM](https://www.youtube.com/watch?v=tPezgDSD1Bk) - очень интересный доклад который рассказывает про GraalVM с примерами кода, и кое-какими бенчмарками. Рассказывает об ограничениях платформы в том числе, обязательно стоит посмотреть если вам интересно создать бинарник для Java приложения;

## Без Слайдов

[Youtube Channel](https://www.youtube.com/channel/UCsZx0q0zsObxo9Xvsf-CklQ)

* [Максим Шафиров, JetBrains](https://www.youtube.com/watch?v=YJd0-NLb9DA) - Интервью с CEO JetBrains. Про то, как Idea чуть не закрыли. История языка Котлин (~30:00). Если вам интерсестен JetBrains можно послушать.
