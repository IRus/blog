---
title: "Pantheon install on Ubuntu 12.04"
date: 2013-08-17
categories:
  - Linux
---

{{<youtube pWoo4xv-qoA>}}

Неделю назад вышла стабильная версия [Elementary OS](http://elementaryos.org/). Это основанный на Ubuntu 12.04 LTS дистрибутив, имеющий с ним полную пакетную совместимость. Скачав и попробовав Live версию, я удивился красоте дизайна и скорости работы этого дистрибутива. А т.к. я сам использую Ubuntu 12.04, было решено ставить не систему, а только DE.

В Elementary OS используется [Pantheon DE](http://elementaryos.org/journal/meet-me-pantheon). Его установкой я и занялся. На launchpad'e был найден [ppa](https://code.launchpad.net/~elementary-os/+archive/stable) и по стандартной схеме пошла установка:

```bash
sudo add-apt-repository ppa:elementary-os/stable
sudo apt update
sudo apt dist-upgrade
sudo apt install elementary-desktop
```

Далее перезагрузка, и я довольный играюсь с новым DE.

Но сегодня, при попытке обновления, было получено следующее сообщение:

```bash
rus@1215n:~$ sudo apt dist-upgrade
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
1 not fully installed or removed.
After this operation, 0 B of additional disk space will be used.
Do you want to continue [Y/n]? y
Setting up elementary-os-beta-transition (0.1-0~8~precise1) ...
/var/lib/dpkg/info/elementary-os-beta-transition.postinst: 45: .: Can't open /etc/upstream-release/lsb-release
dpkg: error processing elementary-os-beta-transition (--configure):
subprocess installed post-installation script returned error exit status 2
No apport report written because MaxReports is reached already
Errors were encountered while processing:
elementary-os-beta-transition
E: Sub-process /usr/bin/dpkg returned an error code (1)
rus@1215n:~$
```    

Ок. Лезем в `/var/lib/dpkg/info/elementary-os-beta-transition.postinst`:

```bash
rus@1215n:/mnt$ cat /var/lib/dpkg/info/elementary-os-beta-transition.postinst -n | grep 45
    45  . /etc/upstream-release/lsb-release || true
rus@1215n:~$ . /etc/upstream-release/lsb-release || true
bash: /etc/upstream-release/lsb-release: No such file or directory
```

Раз у меня нету, может в дистрибутиве Elementary OS будет? Лезу в ISO с дистрибутивом. В нем, в директории `casper` находится файл `filesystem.squashfs`, который содержит в себе около 660 Mb информации. Значит там и будут все системные файлы, в том числе, и тот, который я ищу.

Извлекаю и монтирую файл:

```bash
rus@1215n:~$ cd /mnt/
rus@1215n:/mnt$ sudo mkdir sq
rus@1215n:/mnt$ sudo mount ~/Linux/Distrs/filesystem.squashfs /mnt/sq/ -t squashfs -o loop
mount: warning: /mnt/sq/ seems to be mounted read-only.
```

Ок, squashfs примонтирована и можно посмотреть, что же хранит `/etc/upstream-release/lsb-release`:

```bash
rus@1215n:/mnt$ cat ./sq/etc/upstream-release/lsb-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=12.04
DISTRIB_CODENAME=precise
DISTRIB_DESCRIPTION="Ubuntu 12.04 LTS"
rus@1215n:/mnt$
```
    
Осталось добавить это содержимое, в мой lsb-release:

```bash
rus@1215n:/mnt$ sudo mkdir /etc/upstream-release
rus@1215n:/mnt$ sudo touch /etc/upstream-release/lsb-release
rus@1215n:/mnt$ sudo nano /etc/upstream-release/lsb-release
```    

И, вуаля:

```bash
rus@1215n:/mnt$ sudo apt dist-upgrade
0% [Working]
...
Fetched 79.1 kB in 3s (20.9 kB/s)
Reading package lists... Done
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
1 not fully installed or removed.
After this operation, 0 B of additional disk space will be used.
Setting up elementary-os-beta-transition (0.1-0~8~precise1) ...
rus@1215n:/mnt$
```

![My Patheon](pantheon.png)
