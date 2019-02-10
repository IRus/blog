---
title: "Изучаем Bash. Как не отправить все в /dev/null"
date: 2015-03-24
categories:
  - Linux
---

[В скрипте инициализации RHEL допущена ошибка, приводящая к удалению всех файлов](http://www.opennet.ru/opennews/art.shtml?num=41897)

Не делать assert'ов в критических точках приложения – отличный способ выстрелить в ногу с рикошетом в голову.

Пример из новости выше:

```bash
stop
rm -rf $SQUID_PIDFILE_DIR/*
start
```

Без контекста заметить проблему трудно, но точно известно если переменная SQUID_PIDFILE_DIR не будет определена мы выполним:

```bash
rm -rf /*
```

Веселого в этом мало, a для того чтобы избежать таких ситуаций (которые могут легко возникнуть в большом BASH скрипте) нужно было использовать следующую проверку:

```bash
stop
[ -z "$SQUID_PIDFILE_DIR" ] || exit 42
rm -rf $SQUID_PIDFILE_DIR/*
start
```

При таком подходе мы бы никогда не вызвали команду rm на корне файловой системы.

Про контрактное программирование на Java можно почитать [здесь](http://habrahabr.ru/company/golovachcourses/blog/222679/).

### Bonus: ShellCheck

[ShellCheck](https://www.shellcheck.net/) – замечательная тулза, обязательна для использования как начинающими, так и продолжающмим скрипто писателями.

Чтобы показать полезность, прогоним кусок показанный выше, через ShellCheck:

```bash
$ cat myscript.sh
rm -rf $SQUID_PIDFILE_DIR/*
$ shellcheck myscript.sh

Line 1:
rm -rf $SQUID_PIDFILE_DIR/*
^-- SC2148: Tips depend on target shell and yours is unknown. Add a shebang.
       ^-- SC2115: Use "${var:?}" to ensure this never expands to /* .
       ^-- SC2086: Double quote to prevent globbing and word splitting.

$ 
```

Как видите, ShellCheck указала на целых две проблемы в простейшем коде. Также можно почитать подробнее про каждый варнинг:

  * [SC2148](https://github.com/koalaman/shellcheck/wiki/SC2148)
  * [SC2115](https://github.com/koalaman/shellcheck/wiki/SC2115)
  * [SC2086](https://github.com/koalaman/shellcheck/wiki/SC2086)

### Выводы:

1. Bash коварен
2. Не пишите на Bash
3. Если все же пишите, используйте ShellCheck
