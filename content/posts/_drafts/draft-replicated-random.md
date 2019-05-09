---
title: "ReplicatedRandom – как это работает"
date: 1970-01-01
draft: true
categories:
  - JVM
---

<!-- http://franklinta.com/2014/08/31/predicting-the-next-math-random-in-java/ -->

> [Взлом генератора случайных чисел Java](https://xakep.ru/2015/07/20/java-random-hack/)
>
> ![https://xkcd.com/221/](http://imgs.xkcd.com/comics/random_number.png)

### Внезапно:

> [Исследователи безопасности][2] обратили внимание на проблемы [линейных генераторов псевдослучайных чисел][3], позволяющих легко предсказать последовательность значений, зная одну из сгенерированных последовательностей или подобрав начальный seed.

И написали класс [ReplicatedRandom][4] который генерирует такие-же числа, как и созданный инстанс Random.

Не знаю где здесь проблема, и почему люди не читают документацию (хотя почему не читают я знаю):

```\n    /**
     * If two instances of Random are created with the same seed, 
     * and the same sequence of method calls is made for each, 
     * they will generate and return identical sequences of numbers.
     */</code></pre>

Но как видно это вполне ожидаемое поведение.

### Так как же получить копию инстанса Random?

 [1]: http://xkcd.com/221/
 [2]: http://franklinta.com/2014/08/31/predicting-the-next-math-random-in-java/
 [3]: https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D0%BD%D0%B5%D0%B9%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BD%D0%B3%D1%80%D1%83%D1%8D%D0%BD%D1%82%D0%BD%D1%8B%D0%B9_%D0%BC%D0%B5%D1%82%D0%BE%D0%B4
 [4]: https://github.com/fta2012/ReplicatedRandom/blob/master/ReplicatedRandom.java
