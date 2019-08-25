---
title: "Install PostgreSQL on Ubuntu"
date: 2014-02-02
categories:
  - Archive
---

**Upd**. Use The [Docker](https://hub.docker.com/_/postgres/) Luke

### Вступление

Задача – установить postgres на свою машину, кроме самой базы нужна административная консоль для базы.

Подробный мануал по установке можно найти на странице [PostgreSQL](https://help.ubuntu.com/community/PostgreSQL) на сайте Ubuntu Help.

### Установка

Установим пакеты:

```bash
sudo apt install postgresql pgadmin3
```

База и административная консоль установлены.

### Настройка

Начнем с установки пароля пользователя:

```bash
sudo -u postgres psql postgres

# подробнее об этой команде:
sudo -u postgres command_name # запускаем команду от имени пользователя postgres
psql postgres # запускаем терминал и коннектимся к базе postgres

\password postgres # задаем пароль пользователю postgres в базе postgres
```

Этим же и закончим. Создавать/редактировать базы теперь можно из pgAdmin.

### Накатываем дамп базы

```bash
chown username dump.sql
sudo -u username psql dbname
/i dump.sql
```

### Домашнее задание

Прочитать данные мануалы:

```bash
man psql
man postgres
```

<http://postgresql.ru.net/>

### Вместо послесловия

А чтобы не парится о паролях к базе, стоит поменять метод аутентификации для локальных соединений:

```bash
cd /etc/postgresql/9.1/main/
sudo cp pg_hba.conf pg_hba.conf.orig
sudo nano pg_hba.conf
sudo diff pg_hba.conf pg_hba.conf.orig
```

```diff
92c92
< host    all             all             127.0.0.1/32            trust
---
> host    all             all             127.0.0.1/32            md5
94c94
< host    all             all             ::1/128                 trust
---
> host    all             all             ::1/128                 md5
```

```bash
sudo service postgresql restart
```
