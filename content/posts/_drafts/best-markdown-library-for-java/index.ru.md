---
title: "Best markdown library for Java"
date: 2015-01-25
categories:
  - JVM
  - TODO
  - Highlights
---

https://github.com/atlassian/commonmark-java
https://github.com/vsch/flexmark-java
https://github.com/Heapy/remark-kotlin

![Asiidoc](tiled-editor-and-web-preview.png)

Для своего мини проекта потребовалась имплементация markdown to html парсера/конвертора. Я рассматривал процессоры найденные в [mvnrepository](http://mvnrepository.com/open-source/markdown-processors) и хочу сразу сказать – все плохо. 

Итак были _успешно_ протестированы следующие библиотеки:

```
am.ik.marked4j:marked4j:0.9.1
com.github.rjeschke:txtmark:0.11
com.sangupta:nutz:0.5.0
net.redhogs.actuarius:actuarius_2.10:0.2.7
org.markdownj:markdownj-core:0.4
org.pegdown:pegdown:1.4.2
ru.circumflex:circumflex-md:2.0.RC2
```

Я не случайно выделил успешно, в процессе одна из библиотек не завелась т.к. не было scala в classpath (а как зависимость она не додумалась ее включить). Несколько библиотек крашились на файлах сложнее хидеров и листов. 

Из прошедших отличились `org.pegdown:pegdown:1.4.2` и `ru.circumflex:circumflex-md:2.0.RC2`: они тянут приличный объем библиотек. Причем `ru.circumflex:circumflex-md:2.0.RC2` отличился дважды, он притянул с собой log4j как зависимость!

Лучшей из все оказалась имплементация на JS! Да, именно так! `am.ik.marked4j:marked4j:0.9.1` запускает библиотеку marked.js на скриптовом движке джавы и отдает результат полученный от скрипта. Как следствие ожидать сотни обработанных markdown файлов в секунду не стоит.

Что же я выбрал? Я выбрал **AsciiDoc**. 

## Почему AsciiDoc лучше Markdown?

1. У AsciiDoc есть хорошая документация и много фич
2. Он умеет не только AsciiDoc -> Html, но и в HTML5, DocBook 5 или 4.5, EPUB3, PDF и т.д.
3. Разработчики предоставляются возможность из коробки использовать его на JVM (JRuby и все такое)
4. С AsciidocFX можно писать и просматривать документы AsciiDoc на любой платформе.

## Выводы

Если вы упорот, то можете написать очередной парсер с AST для markdown на Java, а потом еще больше упороться и прикрутить туда поддержку пары дополнений к стандартному синтаксису (кстати, какой стандартный? этот http://commonmark.org/? Или тот, который продвигает автор данного языка разметки?). Или взять какую-нибудь JS либу-парсер markdown и запускать ее под nashorn. А что если нужно больше чем просто markdown (который из коробки очень ограничен), например таблицы, подсветка синтаксиса кода, сноски или оглавление? Да это всё есть в некоторых диалектах mardown, например Github Flavored Markdown, но по моему очень скромному мнению стоит использовать AsciiDoc в котором всё это из коробки и хорошо документировано. А еще AsciiDoc нативно поддерживается на GitHub.

Файл с результатами работы библиотек: [markdown-test](markdown-test.zip).

[Basic syntax comparison (Markdown vs AsciiDoc)](https://github.com/awestruct/web-editor/issues/12#issuecomment-19943154)
