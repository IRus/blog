---
title: Устанавливаем из исходников правильно
date: 2012-10-04
categories:
  - Linux
  - Highlights
---

Пользователям пакетных дистрибутивов посвящается:

  1. [Installing packages from source code with checkinstall](http://www.debian-administration.org/articles/147)
  2. [Хочется взять и расстрелять, или ликбез о том, почему не стоит использовать make install](http://habrahabr.ru/post/130868/)

### Вкратце:

1. `make install` – в _пакетных_ дистрах плохо
2. при сборке из исходников правильно собирать пакеты
3. для сборки пакетов из исходников используется `checkinstall`
4. при этом софт будет **правильно** установлен в систему
5. Порядок сборки пакета для дебиан такой: 
  * `$ ./configure`
  * `$ make`
  * `$ checkinstall -D make install`

