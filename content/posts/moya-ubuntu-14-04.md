---
title: "Моя Ubuntu 14.04"
date: 2014-11-11
categories:
  - Linux
---

В данной статье хочу поделиться своими настройками системы и действиями которые я выполняю после установки.

При установке Ubuntu 14.04 на свой ASUS я разметил следующим образом имеющиеся диски:

```bash
 25GB SSD / 
500GB HDD /home
```

В качестве языка выбрал English, местоположение – New York (Если бы я выбрал Минск, то день недели и месяцы были бы на белорусском, что меня сильно раздражает) и наконец добавил русскую раскладку.

После установки системы первым делом я подключился к сети и обновил систему:

```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
```

### Настройка

`All Settings` -> `Appearance`

* Выбрал нескучную тему Radiance и нескучные обои
* Включил рабочие столы
* Выбрал опцию, при которой меню показывается в title bar окна
* Добавил в лаунчер иконку "Show Desktop"

`All Settings` -> `File & Application/Search`

* Отключил все это, потому что не вижу пользы в данных фичах

`All Settings` -> `Text Entry`

* Переключение раскладки по нажатию Caps Lock
* Для каждого окна назначается своя раскладка
* Дефолтовый язык английский

`All Settings` -> `Printers`

* Настраиваю принтер

Можно задать пароль от рута:

```bash
sudo passwd root
```

### Пакеты

Удаляю всякий предустановленный трэш:

```bash
sudo apt remove xul-ext-ubufox \
                xul-ext-unity \ 
                xul-ext-websites-integration \
                xul-ext-webaccounts \
                unity-lens-files \
                unity-lens-friends \
                unity-lens-music \
                unity-lens-photos \
                unity-lens-video \
                zeitgeist \
                zeitgeist-datahub \
                zeitgeist-core \
                totem \
                rhythmbox
```

Устанавливаю всякий трэш из моих любимых PPA:

* `ppa:ubuntu-mozilla-daily/ppa` -> firefox-trunk, thunderbird-trunk
* `ppa:git-core/ppa` -> git
* `ppa:webupd8team/popcorntime` -> popcorn-time
* `ppa:webupd8team/sublime-text-3` -> sublime-text-installer
* `ppa:webupd8team/java` -> oracle-java8-installer

```bash
sudo apt install firefox-trunk \
                 thunderbird-trunk \
                 popcorn-time \
                 sublime-text-installer \
                 oracle-java8-installer
```


И удаляю стабильные версии:

```bash
sudo apt remove firefox thunderbird
```

Удобные утилиты:

```bash
sudo apt install mc nautilus-open-terminal htop
```

### .bashrc

Увеличиваю лимиты:

```bash
HISTSIZE=10000
HISTFILESIZE=20000
```

Добавляю удобное обновление истории:

```bash
# save and update history in every window instantly
PROMPT_COMMAND='history -a; history -n'
```

Включаю цветной вывод:

```bash
force_color_prompt=yes
```

Включаю свои дополнения (разные удобные алисы и прочее) которые находятся в `~/.bash/bash_include`

```bash
# Using separate file, instead of commit changes in current file.
if [ -f ~/.bash/bash_include ]; then
    . ~/.bash/bash_include
fi
```

### Cофт

Бывает полезно запустить новый линукс или старый виндовс. В студенческие годы под ним работала большая виртуалка на слабом ASUS 1215N с маткадами/матлабами и прочими прелестями нашего спираченного образования

```bash
sudo apt install virtualbox
```

Большой список всего-всего:

```bash
sudo apt install \
    cheese \                  # Webcam
    git \                     # Stupid content tracker
    keepassx \                # Passwords manager
    meld \                    # UI Diff tool
    soundconverter \          # Covert music formats
    p7zip \                   # Compress data
    rar \                     # Compress data
    unrar \                   # Compress data
    pdftk pdfjam \            # Work with PDF
    darktable \               # Work with RAW
    ufraw \                   # Work with RAW
    gramps \                  # Create family tree
    easytag \                 # Tag your music files
    fbreader \                # fb2, epub, txt Reader
    powertop \                # Examine power consumers
    youtube-dl \              # Download video/audio from youtube
    xsel \                    # Access X clipboard and buffers
    curl \                    # Transfer data to/from machine
    screen \                  # Bash session manager
    gnome-system-tools \      # For users and groups managment
    gummi \                   # LaTeX Editor
    gimp \                    # GIMP
    gimp-ufraw \
    gimp-plugin-registry \
    gimp-gmic \
    gparted \                 # Work with partions
    sqlitebrowser \           # View SQLite dbs
    cmus \                    # Listen music from terminal
    inotify-tools \           # What FS
    fswebcam \                # Work with webcam from terminal
    testdisk \                # Restore deleted files
    network-manager-openvpn \ # OpenVpv fro Network Manager
    xclip                     # Access to X selections
```

### Video

Установим [prime-indicator](http://www.webupd8.org/2014/01/prime-indicator-lets-you-quickly-switch.html)


```bash
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update
sudo apt install nvidia-364 nvidia-settings nvidia-prime
```

Всякий трэш не из реп:

* `dropbox` -> в идеале заменить на owncloud
* `truecrypt`

Дистрибутив ЛаТеХа:

* texlive-lang-cyrillic
* texlive-latex-recommended
* texlive-fonts-extra
* texlive-latex-extra
* texlive-latex-base
* texlive-science
* PSCyr (`wget ftp://ftp.vsu.ru/pub/tex/font-packs/pscyr/0.4d-beta/PSCyr-0.4-beta9-tex.tar.gz`)

На этом все. Интересно что по сравнению с 12.04 итоговый срипт не изменился, но тут стало больше софта из репозиториев, чем из PPA.
