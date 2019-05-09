---
draft: true
title: "Выбор лицензии для вашего Open Source проекта"
date: 1970-01-01
categories:
  - Freedom
---

Решил заняться осознанным выбором лицензции для моих опенсорсов.

Что для меня важно:

  * Разрешить использовать мои библиотеки в коммерческих проектах;
  * Copyleft – идеологически верный подход, все изменения которые вносятся в форки, должны быть предложены в основную ветку;
  * Совместимость с другими лицензиями – мои библиотеки должны иметь возможность использовать готовый код под лицензиями MIT, Apache 2;

## Интересные наблюдения:

OpenJDK – GNU GPLv2*. Никогда такого не было и вот опять! Оказывается что все эти энтерпрайзы должны открыть свои сорцы и делиться исходным кодом с миром! Но конечно же на самом деле все не так, в лицензии OpenJDK есть одно [исключение][1] **"CLASSPATH" EXCEPTION TO THE GPL**:

> As a special exception, the copyright holders of this library give you permission to link this library with independent modules to produce an executable, regardless of the license terms of these independent modules, and to copy and distribute the resulting executable under terms of your choice, provided that you also meet, for each linked independent module, the terms and conditions of the license of that module. An independent module is a module which is not derived from or based on this library. If you modify this library, you may extend this exception to your version of the library, but you are not obligated to do so. If you do not wish to do so, delete this exception statement from your version. 

Которое позволяет запускать разную проприетарщину поверх OpenJDK.

## Популярные библиотеки

Apache 2.0: Kotlin, Bootique, IntelliJ IDEA Community Edition, Spring Boot, Guava, Guice, OkHttp, Cayenne, Elasticsearch, RxJava, TestNg, Gradle, Maven, Jackson, Undertow
  
MIT: SLF4J, Mockito
  
LGPL-2.1: MariaDB Connector/J, Logback (also EPL v1.0)
  
EPL v1.0: jUnit, Logback (also LGPL-2.1)

Как видим самая популярная лицензия – Apache, доля других лицензий не велика.

http://softwareengineering.stackexchange.com/questions/47032/can-i-use-gpl-software-in-a-commercial-application
  
https://en.wikipedia.org/wiki/Affero_General_Public_License

## Полезные ссылки:

[Licenses][2]
  
[Which open source license is appropriate for my project?][3]

 [1]: http://hg.openjdk.java.net/jdk9/jdk9/hotspot/file/11713ac0d70d/LICENSE#l326
 [2]: https://choosealicense.com/licenses/
 [3]: https://opensource.guide/legal/#which-open-source-license-is-appropriate-for-my-project
