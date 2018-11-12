---
title: "Работа с PDF в GNU/Linux"
date: 2014-01-30
categories:
  - Linux
---

Несколько лет назад, когда я использовал OS Windows, для меня была большой проблемой работа с PDF: MS Office не умел сохранять в PDF, не было бесплатных утилит по конвертации в PDF, склейки и работы с PDF.

GNU/Linux содержит огромное количество инструментов для работы с PDF. А теперь, я расскажу о тех, которые я использую: imagemagick, pdftk и pdfnup (пакет pdfjam).

В Ubuntu pdftk и pdfnup можно установить следующей командой:

```bash
sudo apt install pdfjam pdftk imagemagick
```

Теперь, имея нужные инструменты, можно начинать работу:

### Информация о файле

```bash
pdfinfo file.pdf
```

### Склеивание нескольких PDF файлов в 1

```bash
pdftk *.pdf output test.pdf
# склеит все файлы pdf в текущей папке в test.pdf
pdftk 1.pdf 2.pdf output test12.pdf
# склеит файлы 1.pdf и 2.pdf в test12.pdf
```

### Подготовка к печати

```bash
pdfnup --nup '4x2' print.pdf
# создаст новый pdf файл, в котором на одном листе будет 8 страниц.
```

### Конвертирование изображений в PDF

```bash
convert *.png out.pdf
```

Вот эти простые команды экономили мне часы времени.
  
Делитесь своими командами/утилитами для работы с PDF в GNU/Linux!
