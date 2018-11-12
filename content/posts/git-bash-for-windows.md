---
title: "Git Bash for Windows"
date: 2015-01-13
categories:
  - News
---

В целом командная строка под оффтопик это страх и ужас. `sh.exe` конечно же спасает, но отсутствие тесной интеграции с системой (в linux можно делать все из консоли) создает неудобства. В общем пользователям git bash for win посвящается: запускаем несколько окон с гитом в нужных проектах из bat файла:

```bash
rem git-win.bat
cd C:\dev\projects\project1
start "" "%SYSTEMDRIVE%\Program Files (x86)\Git\bin\sh.exe" --login -i

cd C:\dev\projects\project2
start "" "%SYSTEMDRIVE%\Program Files (x86)\Git\bin\sh.exe" --login -i
```

Если у вас 32-битная система(интересно, остались еще такие?) то этот файл

```bash
rem git-win-x86.bat
cd C:\dev\projects\project1
start "" "%ProgramFiles%\Git\bin\sh.exe" --login -i

cd C:\dev\projects\project2
start "" "%ProgramFiles%\Git\bin\sh.exe" --login -i
```
