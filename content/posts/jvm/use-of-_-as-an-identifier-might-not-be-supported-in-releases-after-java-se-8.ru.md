---
title: Use of '_' as an identifier might not be supported in releases after Java SE 8
date: 2015-04-12
categories:
  - JVM
  - Highlights
---

Внезапно. Хотелось использовать gettext для локализации шаблонов в разрабатываемом мною статическом генераторе kpress(скоро опубликую на гитхаб), но javac 8-ой версии ругнулся на метод `public String _(final String string) {` тем что не нужно так его именовать, т.к. в следующих релизах джавы он может не поддерживаться(нарушат обратную совместимость?!). 

Гугление вывело меня на [JEP 213](http://openjdk.java.net/jeps/213) в котором есть факт что "_" будет удалено, но не сказано почему.

Однако самое интересное было найдено в списках рассылки:

> Your suspicion is mostly right, except that we are certainly NOT going to
> do Scala's "wunderbar". However, things it might be used for include
> things like "I don't want to give this variable a name" (such as catch
> parameters that are never used.)
  
– [Brian Goetz](http://mail.openjdk.java.net/pipermail/lambda-dev/2013-July/010670.html)

Что делать? Использовать два нижних подчеркивания! 😀
