---
title: SSH – Мои заметки
date: 2013-06-22
categories:
  - Linux
---

Очень частно использую SSH, и у меня скопилось немного информации, взятой с разных мест.
  
Публикую её.

### SSH

#### Команды

##### Ключи

```bash
ssh-keygen # генерация ключа
ssh-keygen -p # изменить пароль на ключ
ssh-copy-id user@server # отправить ключ на сервер
ssh-keygen -R server # удалить ключ сервера
ssh-keygen -R 127.0.0.1 # удалить ключ по IP
```

##### Копирование

```bash
scp path/myfile user@8.8.8.8:/full/path/to/new/location/
scp user@8.8.8.8:/full/path/to/file /path/to/put/here
mycommand | scp user@8.8.8.8:/path/remote_file # скопировать результат в удаленный файл
```

##### Удалённое исполнение кода

```bash
ssh user@server ls /etc/ # выполнить команду и закрыть соединение
ssh user@server -t remove_command # с управляющим терминалом
ssh user@8.8.8.8 command > my_file # сохранение stdout в локальный файл
```

##### Алиасы

Файл: `~/.ssh/config`

Пример:

```
Host *
    User root
    Compression yes
Host test
    Hostname test.com
    User root
    ForwardX11 yes
    Compression yes
Host home
    Hostname ibragimov.by
    User root
    PasswordAuthentication no
```

Подробнее:

```bash
man ssh_config
```

##### Проброс X-сервера

Локально вводим:

```bash
ssh -XYC user@SERVER
```

##### Socks-proxy

`ssh -D 8080 user@server`
  
-C – сжимать трафик

`/etc/ssh/sshd_config`:

```
(фрагмент)
Port 22
Port 443
```

А вот кусок `~/.ssh/config` с ноутбука, который описывает vpn

```
Host vpn
    Hostname test.com
    User root
    Compression yes
    DynamicForward 127.0.0.1:8080 
    Port 443
```

##### Файлы и директории

* `~/.ssh/id_rsa.pub` – открытый ключ
* `~/.ssh/id_rsa` – закрытый ключ
* `~/.ssh/known_hosts` – чужие ключи
* `~/.ssh/authorized_keys` – файл (644) на сервере, куда кладут открытый ключ
* `/etc/ssh/ssh/host/rsa_key` – ключ (на сервере)
* `/etc/ssh/ssh/host/rsa_key.pub` – ключ (на сервере)

##### Программы

`sshfs`
