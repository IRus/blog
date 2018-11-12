---
title: "Apt problems in Ubuntu"
date: 2014-03-13
categories:
  - Linux
---

```bash
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

So solution of the problem:

> I had a similar problem and what i found that worked for me was going into `/var/lib/dpkg/info` and deleting everything that had that name and you may also have to go into `/var/cache/apt/archives` and do the same thing. I'm fairly new to linux so if this breaks anything i am sorry. i haven't run into any problems yet that this has caused.
