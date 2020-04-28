---
title: "GRUB2: Or how to spent 2 hours fixing grub after \"Grub Customizer\""
date: 2020-04-27
categories:
  - Linux
---

My main laptop runs on Fedora 30, but since the SSD is 1TB, I made a Dual Boot with Windows 10 (to periodically play with Windows and applications that run on it). There is also a second laptop at home, which my father uses periodically. And I, to optimize the space on the desktop, decided to remove the second old and slow laptop and replace it with my own. To do this, it was decided to make Windows 10 the standard menu entry in GRUB2. I put "Grub Customizer", made the necessary changes there, and rebooted the laptop. Entry with Windows 10 has disappeared altogether.

First of all, I tried to use different responses from StackOverflow, but unfortunately they did not help restore the lost boot entry, on the other hand they did not completely break the boot - and thank you for that.

So, after that, I tried to figure out what configuration files are in grub and found the folder `/etc/grub.d/backup` which grub customizer has carefully created for me:

```
# ls -alFR /etc/grub.d/backup
/etc/grub.d/backup:
total 24
drwxr-xr-x. 4 root root 4096 Mar  2 11:12 ./
drwx------. 3 root root 4096 Mar  2 12:33 ../
drwx------. 4 root root 4096 Mar  2 11:12 boot_grub/
-rw-rw-r--. 1 root root  242 Mar  2 11:12 default_grub
drwx------. 2 root root 4096 Mar  2 11:12 etc_grub_d/
-rw-rw-r--. 1 root root  529 Mar  2 11:12 RESTORE_INSTRUCTIONS

/etc/grub.d/backup/boot_grub:
total 13140
drwx------. 4 root root    4096 Mar  2 11:12 ./
drwxr-xr-x. 4 root root    4096 Mar  2 11:12 ../
-rw-rw-r--. 1 root root     112 Mar  2 11:12 BOOTIA32.CSV
-rw-rw-r--. 1 root root     110 Mar  2 11:12 BOOTX64.CSV
drwx------. 2 root root    4096 Mar  2 11:12 fonts/
drwx------. 2 root root    4096 Mar  2 11:12 fw/
-rw-rw-r--. 1 root root   61833 Mar  2 11:12 fwupdx64.efi
-rw-rw-r--. 1 root root 1094984 Mar  2 11:12 gcdia32.efi
-rw-rw-r--. 1 root root 1739080 Mar  2 11:12 gcdx64.efi
-rw-rw-r--. 1 root root    5939 Mar  2 11:12 grub.cfg
-rw-rw-r--. 1 root root    1024 Mar  2 11:12 grubenv
-rw-rw-r--. 1 root root       0 Mar  2 11:12 grubenv.bak
-rw-rw-r--. 1 root root 1094984 Mar  2 11:12 grubia32.efi
-rw-rw-r--. 1 root root 1739080 Mar  2 11:12 grubx64.efi
-rw-rw-r--. 1 root root  927824 Mar  2 11:12 mmia32.efi
-rw-rw-r--. 1 root root 1159560 Mar  2 11:12 mmx64.efi
-rw-rw-r--. 1 root root 1210776 Mar  2 11:12 shim.efi
-rw-rw-r--. 1 root root  975536 Mar  2 11:12 shimia32.efi
-rw-rw-r--. 1 root root  969264 Mar  2 11:12 shimia32-fedora.efi
-rw-rw-r--. 1 root root 1210776 Mar  2 11:12 shimx64.efi
-rw-rw-r--. 1 root root 1204496 Mar  2 11:12 shimx64-fedora.efi

/etc/grub.d/backup/boot_grub/fonts:
total 2512
drwx------. 2 root root    4096 Mar  2 11:12 ./
drwx------. 4 root root    4096 Mar  2 11:12 ../
-rw-rw-r--. 1 root root 2560080 Mar  2 11:12 unicode.pf2

/etc/grub.d/backup/boot_grub/fw:
total 10076
drwx------. 2 root root     4096 Mar  2 11:12 ./
drwx------. 4 root root     4096 Mar  2 11:12 ../
-rw-rw-r--. 1 root root 10239609 Mar  2 11:12 fwupd-124c207d-5db8-4d95-bd31-34fd971b34f9.cap
-rw-rw-r--. 1 root root    68098 Mar  2 11:12 fwupd-3b8c8162-188c-46a4-aec9-be43f1d65697.cap

/etc/grub.d/backup/etc_grub_d:
total 96
drwx------. 2 root root  4096 Mar  2 11:12 ./
drwxr-xr-x. 4 root root  4096 Mar  2 11:12 ../
-rw-rw-r--. 1 root root  8961 Mar  2 11:12 00_header
-rw-rw-r--. 1 root root   236 Mar  2 11:12 01_users
-rw-rw-r--. 1 root root   835 Mar  2 11:12 08_fallback_counting
-rw-rw-r--. 1 root root 14232 Mar  2 11:12 10_linux
-rw-rw-r--. 1 root root   833 Mar  2 11:12 10_reset_boot_success
-rw-rw-r--. 1 root root   892 Mar  2 11:12 12_menu_auto_hide
-rw-rw-r--. 1 root root 11699 Mar  2 11:12 20_linux_xen
-rw-rw-r--. 1 root root  2562 Mar  2 11:12 20_ppc_terminfo
-rw-rw-r--. 1 root root 10673 Mar  2 11:12 30_os-prober
-rw-rw-r--. 1 root root  1415 Mar  2 11:12 30_uefi-firmware
-rw-rw-r--. 1 root root   218 Mar  2 11:12 40_custom
-rw-rw-r--. 1 root root   220 Mar  2 11:12 41_custom
-rw-rw-r--. 1 root root   483 Mar  2 11:12 README
```

In this folder I found an instruction that allowed me to restore the state of the loader before the grub customizer intervention:

```bash
# cat /etc/grub.d/backup/RESTORE_INSTRUCTIONS
How to restore this backup
--------------------------
 * make sure you have root permissions (`gksu nautilus` or `sudo -s` on command line) otherwise you won't be able to copy the files
 * to fix an unbootable configuration, just copy:
     * '/etc/grub.d/backup/boot_grub' to '/boot/efi/EFI/fedora'
 * to reset the whole configuration (if it cannot be fixed by using grub customizer), also copy these files:
     * '/etc/grub.d/backup/etc_grub_d' to '/etc/grub.d'
     * '/etc/grub.d/backup/default_grub' to '/etc/default/grub'
```

When I put the files back in place, I checked that the boot entry was back in place. Then I decided to go back to the original problem - how to change the default boot entry. And yes, I did it, like this:

0. **DISCLAIMER - USE AT YOUR OWN RISK**
1. Searching for the desired entry:
    ```
    # grep menuentry /boot/grub2/grub.cfg
    if [ x"${feature_menuentry_id}" = xy ]; then
      menuentry_id_option="--id"
      menuentry_id_option=""
    export menuentry_id_option
    menuentry 'Windows Boot Manager (on /dev/nvme0n1p2)' --class windows --class os $menuentry_id_option 'osprober-efi-0A66-E8F4' {
    menuentry 'System setup' $menuentry_id_option 'uefi-firmware' {
    ```
2. Editing grub configuration (`GRUB_DEFAULT`):
    ```
    # cat /etc/default/grub
    GRUB_TIMEOUT=5
    GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
    GRUB_DEFAULT="Windows Boot Manager (on /dev/nvme0n1p2)"
    GRUB_DISABLE_SUBMENU=true
    GRUB_TERMINAL_OUTPUT="console"
    GRUB_CMDLINE_LINUX="rhgb quiet"
    GRUB_DISABLE_RECOVERY="true"
    GRUB_ENABLE_BLSCFG=true
    ```
3. Applying this configuration:
    ```
    # For UEFI systems
    sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg

    # For BIOS systems
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```
4. Done!
