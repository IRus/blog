---
title: "sendmail send mail too slow"
date: 2014-09-19
categories:
  - Linux
---

After setup sendmail in my instances running in Digital Ocean cloud, I tried to send few mails using simple php function `mail()`.

And unfortunately, mails sends too slow. About 60 seconds needed to send one email.

i go to logs (`/var/log/mail.err`), to see whats happens:

```
Sep 17 11:40:01 ibragimovby sm-msp-queue[6689]: My unqualified host name (ibragimovby) unknown; sleeping for retry
Sep 17 11:41:01 ibragimovby sm-msp-queue[6689]: unable to qualify my own domain name (ibragimovby) -- using short name
```

So, after i add following line in `/etc/hosts`:

```
127.0.0.1       localhost localhost.localdomain ibragimovby
```

and emails started sending immediately.
