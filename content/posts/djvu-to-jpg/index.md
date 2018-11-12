---
title: "Djvu to Jpg"
date: 2018-10-21
categories:
  - Linux
---

Скрипт из закромов, с помощью него можно сконвертировать djvu файл в набор изображений:

```bash
#!/bin/bash

#
# Install
# sudo apt install djvulibre-bin
#
# Usage
# ./djvu2jpg.sh ~/file.djvu 42
#
# Where "42" is number of pages in "file.djvu" file.
#

file=$1
pages=$2

iter=1
echo "Number of pages: $pages"
let "pages++"
while [ $iter -ne $pages ]; do
  ddjvu -page=$iter -format=pnm $file $iter.pnm
  pnmtojpeg $iter.pnm > $iter.jpg
  rm -f $iter.pnm
  echo "page $iter done"
  let "iter++"
done
```
