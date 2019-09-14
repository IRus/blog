---
title: "Fixing: error: ../../grub-core/commands/loadenv.h:51:invalid environment block."
date: 2019-09-14
categories:
  - Linux
---

At another day I mentioned this error at startup:

![](./error.jpg)

Doesn't looks like it affects somehow system stability, but I've tried to fix it:

```shell script
sudo grub2-editenv list
/usr/bin/grub2-editenv: error: invalid environment block.
```

So env file was broken, and standard tools can't repair him.

But, fortunately I found [instructions](https://ask.fedoraproject.org/t/grub-not-rebuilding-after-kernel-update/2777/28) how to fix env file in this situation:

```shell script
sudo cp -f /boot/grub2/grubenv{,.bak}
sudo cp -f /boot/efi/EFI/fedora/grubenv{,.bak}
sudo grub2-editenv create
```

And after this error disappears.

Broken grubenv file was empty:

```
sudo ls -l /boot/efi/EFI/fedora/grubenv.bak
-rwx------. 1 root root 0 Sep 13 01:20 /boot/efi/EFI/fedora/grubenv.bak
```

Fixed not:

```
sudo ls -l /boot/efi/EFI/fedora/grubenv
-rwx------. 1 root root 1024 Sep 14 00:43 /boot/efi/EFI/fedora/grubenv

sudo cat /boot/efi/EFI/fedora/grubenv
# GRUB Environment Block
boot_success=1
boot_indeterminate=2
saved_entry=c89b60e571c9494cad44f7ffc0a63a59-5.2.13-200.fc30.x86_64
###############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
```

