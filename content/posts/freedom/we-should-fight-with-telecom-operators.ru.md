---
title: "Операторы сотовой связи хотят денег"
date: 2014-04-26
categories:
  - Freedom
---

> Дэниэл Покок (Daniel Pocock), мэйнтейнер некоторых пакетов в Debian и Fedora, [опубликовал](http://danielpocock.com/android-betrays-tethering-data) интересный разбор организации работы tethering-режима в новых выпусках платформы Android. Tethering позволяет использовать телефон в качестве точки доступа для организации выхода в Сеть внешних устройств через установленное на смартфоне интернет-соединение. При установке очередного обновления прошивки Android, Дэниэл столкнулся с проблемами при работе устройств через tethering-соединение, при том, что при открытии тех же ресурсов со смартфона проблем со скоростью и доступом не наблюдалось.
>
> Казалось бы, что не должно быть разницы при работе со смартфона или с внешнего устройства через этот же смартфон, так как интернет-соединение одно и для оператора трафик локального запроса и запроса через режим tethering неотличим. На самом деле, оказалось, что операторам предоставлена возможность различать трафик со смартфона и через режим tethering, в чём Дэниэл усматривает существенное ущемление приватности и ограничение прав пользователя. Некоторые операторы явно понижают качество сервиса для tethering-трафика, предполагая, что 3G-соединение смартфона недопустимо использовать для раздачи интернета на другие устройства. Компания Vodafone Italy, клиентом которой является Дэниэл, вообще заблокировала возможность использования tethering. Проблема также проявляется в прошивках CyanogenMod.
>
> Технически разделение локального и tethering-трафика осуществляется через создание для tethering-соединения другого сетевого интерфейса с отдельным IP-адресом. При этом такое поведение [рассматривается](http://code.google.com/p/android/issues/detail?id=38563#c105) разработчиками как штатная функциональность, а не ошибка. Дэниэл не согласен с такой трактовкой и считает, что операторы связи заинтересованы в утечке данных о типе соединения и добились внесения данной возможности для получения своей экономической выгоды путем навязывания продаж USB-модемов как отдельного сервиса.

[[original]](http://danielpocock.com/android-betrays-tethering-data), [[in russian]](http://www.opennet.ru/opennews/art.shtml?num=39643) 

_> Некоторые операторы явно **понижают качество сервиса** для tethering-трафика, **предполагая**, что 3G-соединение смартфона недопустимо использовать для раздачи интернета на другие устройства._

Вся суть опсосов в одном предложении
