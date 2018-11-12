---
draft: true
title: "Java is Backward Compatible (TM)"
date: 1970-01-01
categories:
  - JVM
---

Как известно обратная совсемистимость - священная корова в Java. Все конечно так, да не так.
Пожалуй расскажу вам коллекцию граблей которую я насобирал при переводе приложений которые отлично работали на Java 8 на Java 9.

## java.lang.NoClassDefFoundError: javax/xml/bind/JAXBException

https://stackoverflow.com/questions/43574426/how-to-resolve-java-lang-noclassdeffounderror-javax-xml-bind-jaxbexception-in-j#43574427

<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.2.8</version>
</dependency>

## java.lang.NoClassDefFoundError: javax/activation/DataSource

<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>

## java.lang.NoClassDefFoundError: Could not initialize class org.mockito.Mockito
