---
title: "Ubuntu -> Fedora 30"
date: 2019-05-11
categories:
  - Linux
---

After many years with Ubuntu (also I have to use Linux Mint and Arch Linux for some time), I actually migrated on Fedora 30. And here some of my observations:

1. **yum** replaced with [**dnf**](https://fedoraproject.org/wiki/DNF)
1. Gnome on Fedora works much faster, without some Ubuntu-specific issues, like this [annoying issue with layout change](https://bugs.launchpad.net/ubuntu/+source/gnome-shell/+bug/1754702), meh
1. Firefox can't play videos on youtube, fixed by installing **GStreamer Multimedia Codecs - H.264**
1. Ubuntu uses **snap** by default, Fedora - **flatpack**, [in-depth comparison](https://github.com/AppImage/AppImageKit/wiki/Similar-projects) 
1. Wayland session by default (what about nvidia proprietary driver, should/can I use it?)

## Installation

### Developer Software

➡️ [SdkMan](https://sdkman.io/)

```bash
chmod u+x ~/.sdkman/bin/sdkman-init.sh
sdk install java
sdk install gradle
sdk install kotlin
sdk install maven
sdk install visualvm
```

➡️ [JetBrains Toolbox](https://www.jetbrains.com/toolbox/app/)

Setup [Inotify Watches Limit](https://confluence.jetbrains.com/display/IDEADEV/Inotify+Watches+Limit)

➡️ [Node.js](https://nodejs.org/en/download/package-manager/)

Or just:

```bash
sudo dnf install nodejs nodejs-yarn
```

➡️ [Docker](https://docs.docker.com/install/linux/docker-ce/fedora/)

➡️ [Docker Compose](https://docs.docker.com/compose/install/)

### GUI Applications

1. **Firefox Nightly** is not available as package, install as [tarball](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly)
1. **Telegram** - [tarball](https://desktop.telegram.org/)
1. **vlc** - flatpack
1. **gimp** - flatpack
1. **darktable** - flatpack, raw editor
1. **handbrake** - flatpack, video converter
1. **audacity** - flatpack, audio editor
1. **picard** - flatpack, cleanup music library 
1. `gnome-tweak-tool` - Assign *Caps Lock* as for chnaging layout
1. `keepassx` - Password manager 
1. `hugin` - Panorama maker
1. `easytag` - manual cleanup music library
1. `mediainfo-gui` - media info

### Cli Tools

1. `git git-lfs`
1. `bat mc htop tree xclip tmux rclone curl cloc pwgen fswebcam hugo youtube-dl`
1. `libwebp-tools jhead exif ImageMagick`

### Optional

1. **gparted** - default **Disks** application works well
1. **virtualbox** - default **Boxed** application works well
1. **chromium** - default **Firefox** application works well

### Missing

1. **pdftk** - replace with **poppler-utils**: 
1. **kazam**
1. **hashdeep**
1. **p7zip-full**
1. **unrar** - rpmfusion nonfree [link](https://download1.rpmfusion.org/nonfree/fedora/releases/30/Everything/x86_64/os/repoview/letter_r.group.html)
1. **wrk**
1. `exfat-fuse exfat-utils` - rpmfusion free [link](https://download1.rpmfusion.org/free/fedora/releases/30/Everything/x86_64/os/repoview/letter_f.group.html)

### Cron

```bash
1,11,21,31,41,51 * * * * /home/yoda/.yoda/opt/checkvist-focus/run.sh
```

### Hosts

```hosts
# ObjectStyle
127.0.0.1 auth.dev.objectstyle.com
127.0.0.1 recruiting.dev.objectstyle.com
127.0.0.1 editor.dev.objectstyle.com
127.0.0.1 dev.objectstyle.com
# / ObjectStyle
```

### Backup Before Reinstall

```bash
# cron
# cat /var/spool/cron/crontable/username
# # or
# crontab -l

# hosts
# cat /etc/hosts
```

### Check

```bash
# Mail
# less /var/mail/username
```
