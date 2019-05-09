---
title: Отключаем гостевого пользователя в Unity
date: 2013-10-16
categories:
  - Linux
---

Открываем на редактирование:

```bash
sudo nano /etc/lightdm/lightdm.conf
```

Добавляем строчку:

```bash
allow-guest=false
```
