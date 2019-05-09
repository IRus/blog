---
title: "Create Offline Copy of Wiki"
date: 2018-10-22
categories:
  - Linux
---

### Сгенерировать файл `cookies.txt`

Можно например с помощью плагина для [chrome](https://chrome.google.com/webstore/detail/cookiestxt/njabckikapfpffapmjgojcnbfjonfjfg)

```
# HTTP Cookie File for domains related to atlassian.net.
# This content may be downloaded or pasted into a cookies.txt file and used by wget
# Example:  wget -x --load-cookies cookies.txt https://slug.atlassian.net/wiki/display/Space/Space+Home
#
slug.atlassian.net	FALSE	/wiki	TRUE	0	JSESSIONID	38339ECF548266BC67D6412A126D823F
slug.atlassian.net	FALSE	/wiki	FALSE	1460460657	confluence-sidebar.width	285
slug.atlassian.net	FALSE	/	FALSE	0	ondemand.signup.enabled	false
slug.atlassian.net	FALSE	/	TRUE	0	ISESSION	"cf5e3502d7ecf1c5218e0e70d92a8c052cb85b3b-username=ibragimovr"
.slug.atlassian.net	TRUE	/	TRUE	1460460588.728052	__atl_path	172.26.28.13.1428924583771611
.slug.atlassian.net	TRUE	/	TRUE	1431516600.705487	ondemand.autologin	Q0RgRSKpYKSwwUfBfgQ2lQ00
slug.atlassian.net	FALSE	/	TRUE	0	JSESSIONID	C9FAF09B05F03F90440FEDF157F8495C
slug.atlassian.net	FALSE	/	TRUE	0	atlassian.xsrf.token	BDZU-BMD1-5PWR-7IJ2|678e646648e2dd2091b6ad3ebde0b14157257b0c|lin
.slug.atlassian.net	TRUE	/	FALSE	1428925208	__utmt	1
.slug.atlassian.net	TRUE	/	TRUE	0	studio.crowd.tokenkey	Q0RgRSKpYKSwwUfBfgQ2lQ00
.slug.atlassian.net	TRUE	/	FALSE	1491996657	__utma	148330592.2070779251.1428924608.1428924608.1428924608.1
.slug.atlassian.net	TRUE	/	FALSE	1428926457	__utmb	148330592.3.10.1428924608
.slug.atlassian.net	TRUE	/	FALSE	0	__utmc	148330592
.slug.atlassian.net	TRUE	/	FALSE	1444692657	__utmz	148330592.1428924608.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)
slug.atlassian.net	FALSE	/	FALSE	1429529460	mywork.tab.tasks	false
```

### Запустить wget в режиме создания зеркала

```
wget -e robots=off --mirror --convert-links --html-extension --no-parent --wait=5 --load-cookies=cookies.txt https://slug.atlassian.net/wiki/display/Space/Space+Home
```

### Вывод

Таким нехитрым способом я создал копию wiki для команды QA которой не был вовремя выдан доступ в проектную wiki
