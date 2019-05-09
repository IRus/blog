---
title: Используем RSS в популярных сервисах. YouTube
date: 2013-07-04
categories:
  - Freedom
---

На YouTube есть определенный набор каналов, на которые я подписан. Соответственно они мне интересны и время от времени хотелось бы смотреть, что там нового. YouTube предлагает несколько вариантов: заходить на сайт или получать письма по почте. Ни то, ни другое меня не устраивает.

![List of youtube subscriptions](YouTube-Subscription.png)

Остается самый правильный вариант – подписаться по RSS. Беглый осмотр сайта показывает, что RSS ленты там нет, но более тщательный анализ показывает что есть! 

### Так как же получить RSS Feed для своих подписок?

1. Зайдите на <http://www.youtube.com/account_privacy> и уберите галочку с опции "_Keep all my subscriptions private_".
    ![Keep all my subscriptions private](keep-all-my-subscriptions-private.png)
2. Теперь нужно узнать ваше имя на YouTube. Вы можете его увидеть на страничке <https://www.youtube.com/account_advanced> 
    ![](YouTube-Username.png)
3. А теперь получаем RSS вашего канала: `http://gdata.youtube.com/feeds/base/users/USERNAME/newsubscriptionvideos` (не забудьте заменить USERNAME, на то имя, которое вы нашли на втором шаге).

### Итого

Вместо постоянного хождения на еще один сайт, я получаю все обновления не выходя из своей RSS читалки.

![](YouTube-Feed.png)

**VS.**

![](YouTube-RSS.png)
