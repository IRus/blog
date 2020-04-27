---
title: ls an dir
date: 2020-04-27
categories:
  - Linux
---

Занимаясь чисткой `.bashrc` заметил команду `dir`:

```bash
$ dir
Desktop  dev  Documents  Downloads  Music  Pictures  Public  Snapshots  Templates  Videos
```

Которая очень напоминает `ls`:

```bash
$ ls
Desktop  dev  Documents  Downloads  Music  Pictures  Public  Snapshots  Templates  Videos
```

А еще команда `vdir`:

```bash
$ vdir
total 108
drwxr-xr-x. 5 yoda yoda 53248 Apr 27 02:22 Desktop
drwxr-xr-x. 7 yoda yoda  4096 Apr 12 20:12 dev
drwxr-xr-x. 2 yoda yoda  4096 Apr 25 12:05 Documents
drwxr-xr-x. 3 yoda yoda 20480 Apr 23 20:39 Downloads
drwxr-xr-x. 2 yoda yoda  4096 May 11  2019 Music
drwxr-xr-x. 3 yoda yoda  4096 Apr 26 17:01 Pictures
drwxr-xr-x. 2 yoda yoda  4096 May 11  2019 Public
drwxrwxr-x. 2 yoda yoda  4096 Dec 24 12:01 Snapshots
drwxr-xr-x. 2 yoda yoda  4096 May 12  2019 Templates
drwxr-xr-x. 2 yoda yoda  4096 Apr 19 17:35 Videos
```

На первый взгляд может показаться что это все алиасы к `ls`, но на самом деле это три разные команды:

```bash
$ which vdir
/usr/bin/vdir
$ which dir
/usr/bin/dir
$ which ls
alias ls='ls --color=auto'
	/usr/bin/ls
```

Так в чем же разница, и зачем дистрибутив поставляется со всеми тремя?

_Все сложно_

Ответ, как обычно, можно найти на [StackOverflow](https://askubuntu.com/a/615946), но даже перечитав его пару раз я не понял смысла. Речь шла про устройства вывода, но какие устройства вывода могут быть у простой команды? Оказывается команды могут различать вывод в терминал, и вывод в пайп! И как раз `ls` ведет себя по разному:

```bash
$ ls
'Sample File.txt'
$ ls | cat
Sample File.txt
$ dir
Sample\ File.txt
$ dir | cat
Sample\ File.txt
```

В этом и заключается принципиальное отличие `ls` и `dir`: `dir` не меняет вывод в зависимости от устройства как и `vdir`. А `vdir` это **V**erbose `dir`.

На практике `dir` удобный вариант `ls` для скриптов, хотя и с `ls` можно добиться того же поведения, но потребуются дополнительные флаги, так:

* Pipe
    * `ls -C` or `dir`
    * `ls -C -l` or `vdir`
* Stdout
    * `ls -b` or `vdir`
    * `ls -l -b` or `vdir`
