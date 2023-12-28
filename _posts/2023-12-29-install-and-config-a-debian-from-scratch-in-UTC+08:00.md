---
title: Install and Configure a Debian From Scratch in UTC+08:00
date: 2023-12-29 00:11:00 +0800
catogories: [Configuration, Linux]
tags: [Linux, Debian]
---

This blog is mostly for those people behind the wall and is likely to become deprecated.

## Installation

Version: Debian trixie (bookworm testing)

Reference: [Debian GNU/Linux Installation Guide](https://d-i.debian.org/manual/en.amd64/index.html)

If your current platform is Windows, you can simply follow the steps below:
1. Reserve one continuous unallocated disk region for installation of Debian. You can easily get this done using tools like [DiskGenius](https://www.diskgenius.com/).
2. Download the *.iso image file and verify its signature.
3. Create a bootable USB drive containing the image above. I personally recommand using [Rufus](https://rufus.ie). You execute it, select the downloaded image, and then you start and get things done. There is no special configuration needed except choosing "DD" writing mode after you click "Start".
4. Reboot, enter the BIOS, and choose to boot from your USB drive.
5. Follow the intructions of Debian installer. Just follow.
6. Congratulations.

## Configuration

These configurations apply to me but not everyone.

### v2rayA

Follow the instructions on [Get started quickly - v2rayA](https://v2raya.org/en/docs/prologue/quick-start/).

v2rayA works both in GUI and text mode but the latter needs more configuration.

### zsh

Follow the instructions below in order:
1. [Installing ZSH](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH).
2. [Installing oh-my-zsh](https://ohmyz.sh/#install).

About zsh you should at least know about its [start-up files](https://zsh.sourceforge.io/Intro/intro_3.html?ref=zerotohero.dev).

### Github

#### SSH

Follow the instructions on [Connecting to GitHub with SSH - Github Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

Notice that you may encounter `Connection closed by "ip_address":"port_number"` error when you try to ssh to `git@github.com`. If that is the case, refer to [Using SSH over the HTTPS port - Github Docs](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port) for help. This [thread](https://github.com/orgs/community/discussions/55269) tracks this issue.

#### GPG

Follow the instructions on [Managing commit signature verification - Github Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification).

### External Monitors

#### Brightness

If you choose KDE Plasma as your desktop environment, you can simply follow the instructions on [davidhi7/ddcci-plasmoid: KDE Plasma Widget for external monitor brightness adjustment](https://github.com/davidhi7/ddcci-plasmoid#readme).

### Nvidia Drivers

FIXME: The externel monitor can no longer be detected once I installed the driver following the official guide now(12/29/2023).

### Telegram

Install `telegram-desktop` either from apt or source.

If you are using Firefox you may find it unable to jump to `telegram-desktop` from a `t.me/*` page. This is because the `tg` protocol not registered yet. You should follow the following instructions in order to fix this issue:
1. [Register protocol](http://kb.mozillazine.org/Register_protocol#Linux).
2. [Set up xdg-open scheme handler](https://wiki.archlinux.org/title/Telegram#xdg-open_scheme_handler).

### Emacs

TODO

### TODO
