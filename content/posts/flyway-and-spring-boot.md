---
title: Flyway and Spring Boot
date: 2015-01-13
categories:
  - JVM
  - Highlights
---

Добавив jar файл с flyway-core в classpath приложения написанного на Spring Boot и не настроив миграции можно получить следующее исключение:

```java
Caused by: org.flywaydb.core.api.FlywayException: Unable to determine URL for classpath location: db/migration (ClassLoader: sun.misc.Launcher$AppClassLoader@58644d46)
```

Добавление проперти `flyway.enabled=false` в `application.properties` решает проблему но! только при запуске приложения. К сожалению тесты не используют application.properties.

```properties
# application.properties
flyway.enabled=false
```

Быстрый поиск приводит нас например сюда: <http://stackoverflow.com/questions/26210786/spring-boot-not-using-application-properties-in-tests>, если вас не удовлетворил данный подход/решение то предлагаю пойти дальше и посмотреть мои конфигурационные файлы.

В данном проекте используется java configuration:

```java
@ContextConfiguration(classes = { TestAppConfig.class })
@RunWith(SpringJUnit4ClassRunner.class)
// ... other annotations
public abstract class BaseSpringTest {
    // ...
}
```

```java
@Configuration
@Import({ AppConfig.class })
public class TestAppConfig {
    // ...
}
```

```java
@Configuration
@EnableAutoConfiguration(exclude = { FlywayAutoConfiguration.class })
@ComponentScan("by.ibragimov.rkeep")
public class AppConfig {
    // ...
}
```

В общем-то логично, там где мы включаем авто-конфигурацию, там мы должны иметь возможность ее выключить. И напоследок пару полезных ссылок по теме.

Ссылки:
  
* [Execute Flyway database migrations on startup](http://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html#howto-execute-flyway-database-migrations-on-startup)
* [Appendix A. Common application properties](http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html#common-application-properties)
* [org.springframework.boot.autoconfigure.flyway.FlywayProperties.java](https://github.com/spring-projects/spring-boot/blob/v1.2.1.RELEASE/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/flyway/FlywayProperties.java)
* [Auto-configuration](http://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-auto-configuration.html#using-boot-auto-configuration)
