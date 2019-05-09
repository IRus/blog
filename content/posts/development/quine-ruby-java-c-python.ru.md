---
title: "Quine Ruby -> Java -> C# -> Python"
date: 2013-04-20
aliases: 
  - "20-04-2013.quine-ruby-java-c-python"
categories:
  - Development
  - Highlights
---

Когда проходил обучение на курсах Itransition, задали интересную задачку:

> На вход подается натуральное число – N.
> 
> На выходе генерится цепной квайн:
>
> Ruby<sub>1</sub> -> Java<sub>1</sub> -> C#<sub>1</sub> -> Python<sub>1</sub> -> Ruby<sub>2</sub> -> Java<sub>2</sub> -> ... -> Python<sub>N</sub> -> Ruby<sub>1</sub>
>
> Причем:
>
> Java(Ruby, C#, Python)<sub>1</sub> != Java(Ruby, C#, Python)<sub>2</sub>
>
> Java(Ruby, C#, Python)<sub>2</sub> != Java(Ruby, C#, Python)<sub>3</sub>
>
> ...
>
> Java(Ruby, C#, Python)<sub>N – 1</sub> != Java(Ruby, C#, Python)<sub>N</sub> 

Ну собственно не буду рассказывать какими титаническими усилиями далось решение этой проблемы. Просто опубликую результат <https://github.com/IRus/Quine>.

На самом деле, можно очень просто реализовать квайн любой длины и из любого количества языков.

[Даже такую штуку](http://mamememo.blogspot.com/2010/09/qlobe.html)
