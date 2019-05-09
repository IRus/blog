---
title: "NPM and Ubuntu 12.04/14.04. Upstream Node.js and NPM."
date: 2014-11-06
categories:
  - Linux
---

### Ubuntu 14.04

На более свежей убунте все решилось еще проще:

```bash
sudo apt install nodejs nodejs-legacy npm
```

Возможно также можно в 12.04.

Node.js сам по себе очень даже ничего, только вот тот факт что парни пакеты не научились собирать удручает.

### Ubuntu 12.04

Ок, может я что-то делал не так, но в Ubuntu 12.04.3 

```bash
npm install
```

не работает.

Ставился npm и node из репозиториев:

```bash
sudo apt install node
sudo apt install npm
```

Видимо версия слишком старая. [Поставим Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager "Installing Node.js via package manager") посвежее:

```bash
sudo apt update
sudo apt install -y python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt update
sudo apt install nodejs
```

А теперь всё стало на свои места.

