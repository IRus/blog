---
title: "Clean .bash_history"
date: 2021-05-29
categories:
  - Linux
---

How to keep *.bash_history* clean, but at the same time be able to check any commands was executed ever?

1. Create file `.bash_history_clean` with list of useful commands that you usually use.
2. In `~.bashrc` add following lines:
    ```bash
    mv .bash_history ".bash_history_$(date +"%s")"
    cp .bash_history_clean .bash_history
    ```


