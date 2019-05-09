---
title: JOOQ
date: 2014-11-26
categories:
  - JVM
---

**Upd.** Шел 2018 год, и сейчас JOOQ нравится мне куда больше чем различные ORM фреймворки.

![JOOQ Logo](jooq-logo-white.png)

[JOOQ](http://www.jooq.org/doc/3.5/manual-single-page/#preface) – еще один способ сходить в базу из Java. Может сгенерировать код по вашей БД и имеет Fluent API для построения и выполнения запросов.

Рассмотри основные утверждения от создателей почему мы должны использовать JOOQ:

* Database First – Выдвигается утверждение что JOOQ легко натягивается на существующую базу в отличие от этих ваших непонятных ORM. В противовес хочу сказать что мы также легко можем сгенерировать JPA-annotated POJO из существующей базы.
  
* Typesafe SQL – Понятно, мы сгенерировали из базы POJO и теперь пишем запросы на своем DSL. Тот же эффект можно получить используя Metamodel Generation.
  
* Code Generation – Устали переименовывать названия колонок и таблиц в Java коде? Используйте JOOQ и его код генерацию. Ну или JPA Metamodel.
  
* Active Records – ORM?!
  
* Multi-Tenancy – Опять же непонятно о чем они говорят, в описании идет речь о нескольких окружениях. В любом случае multi-tenancy в наших ужасных ORM есть.
  
* Standardisation – JPA тоже умеет диалекты.
  
* Query Lifecycle – не можете разобраться в ORM? тогда используйте JOOQ – примерно так описывается этот пункт на официальном сайте.
  
* Procedures – Да, тут JOOQ крут как никогда, посмотрите на это:

    ```sql
    -- Check whether there is an author in AUTHOR by that name and get his ID
    CREATE OR REPLACE PROCEDURE author_exists (author_name VARCHAR2, result OUT NUMBER, id OUT NUMBER);
    ```
    
    ```java
    // Make an explicit call to the generated procedure object:
    AuthorExists procedure = new AuthorExists();
    
    // All IN and IN OUT parameters generate setters
    procedure.setAuthorName("Paulo");
    procedure.execute(configuration);
    
    // All OUT and IN OUT parameters generate getters
    assertEquals(new BigDecimal("1"), procedure.getResult());
    assertEquals(new BigDecimal("2"), procedure.getId();
    ```

    Но если подумать – много ли у вас хранимых процедур? Нужно ли добавлять в проект еще один кодо-генератор? Действительно ли JOOQ решает реальные проблемы?

Да, JOOQ весьма интересен, но лично после прочтения документации (по диагонали) мой энтузиазм поугас и я не стану даже делать hello world с использованием JOOQ. Ведь сейчас есть Jpa Repository, и заниматься низкоуровневыми вещами как JOOQ нету никакого желания.

Если есть другое мнение относительно данного проекта – буду рад услышать ваше мнение в комментариях.

