---
title: "Изучаем Bash на примере одной задачки. Часть 1."
date: 2013-12-15
categories:
  - Linux
---

### Постановка задачи

Имеется набор букв, из которых нужно сформировать слово заданной длины.
  
Каждая буква из набора, может быть использована один раз. При этом допускается наличие повторов букв.

Пример:

`уаижпжуялитб`

Применение задачи:

![Пример применения решения задачи.](4pics-1word.jpg)

### Обзор задачи

Решать эту задачу мы будем следующим образом:

1. Сгенерируем все возможные слова из данных символов.
2. Проверим наличие сгенерированных слов в словаре.
3. Выведем найденные слова.

В общем все просто, приступим к решению.

### Разработка

Разрабатывать мы будем итерациями. В каждой итерации будет выполняться небольшой кусок работы. Со временем, из хардкодного скрипта, будет получен более гибкий и производительный скрипт. 

### Итерация 1. База.

Итак, мы создали файл, в первой строке указали, какой [интерпретатор](https://en.wikipedia.org/wiki/Interpreter_directive) будет выполнять написанный скрипт.

```bash
#!/bin/bash
```

Далее нам нужно рассказать скрипту о наших данных. Для этого мы создадим переменную и запишем туда наш набор символов.

```bash
#!/bin/bash

symbols="уаижпжуялитб";
```

### Итерация 2. Цикл for.

Чтобы создавать слова – нам нужно итерироваться по списку.
  
В Bash есть два вида циклов:

```bash
for (( i = 0; i < 10; i++ )); do
    #statements
done
# и
for i in words; do
    #statements
done
```

Первый стандартен и понятен. Второй более сложный, для новичка в программировании на Bash.

Приведу наглядный пример использования второго метода итерации:

```bash
rus@1215n:~$ cat test.sh
#!/bin/bash
words="word1 word2 word3 word4";
for i in $words; do
  echo $i;
done
rus@1215n:~$ ./test.sh
word1
word2
word3
word4
```

Что тут произошло? Мы проитерировались по списку!
  
Разделителем элементов списка является в данном случае пробел.
  
А что если заменить проблем между словами табом - работает, а заменить переводом строки? - работает!

Как команда for определяет границы отдельных элементов? С помощью переменной IFS!

### Internal  Field  Separator

> IFS -- The **Internal Field Separator** that is used for word splitting after expansion and to split lines into words with the read builtin command. The default value is "space, tab, newline".

Теперь магия перестала быть магией. Команда for, использует в качестве разделителя и пробел, и таб и новую строку.

Несложно придумать задачи, для которых нужно итерироваться по строкам. А что если строка будет содержать пробелы или табы?

Для решения подобной задачи следует переопределить IFS, как это представленно ниже:

```bash
#!/bin/bash

text="Строка ноль.
Строка 1.
Строка два. "

TEMP_IFS=$IFS; # сохраняем текущий IFS.
IFS="/n"; # новый разделитель - перевод строки.

for line in $text; do
  echo $line;
done

IFS=$TEMP_IFS; # возвращаем первоначальное значение.
echo "IFS set to default value."

for line in $text; do
  echo $line;
done
```

Результат выполнения:

```bash
rus@1215n:~/.desktop$ ./test.sh 
Строка ноль.
Строка 1.
Строка два. 
IFS set to default value.
Строка
ноль.
Строка
1.
Строка
два.
rus@1215n:~/.desktop$
```

Итак. Мы сохранили текущий контекст - в данном случае это переменная IFS, выставили IFS как новую строку, проитерировались по строкам, и восстановили старое значение. Еще раз проитерировались по строкам, чтобы показать разницу и получили новый результат.

### Итерация 3. Создаем слова

Мы умеем итерироваться, давайте создадим все возможные вариации для слова длинной 6 символов.

Решение в лоб:

```bash
#!/bin/bash

symbols="уаижпжуялитб";
lenght=${#symbols};
for (( ia = 0; ia < $lenght; ia++ )); do
 for (( ib = 0; ib < $lenght; ib++ )); do
  for (( ic = 0; ic < $lenght; ic++ )); do
   for (( id = 0; id < $lenght; id++ )); do
    for (( ie = 0; ie < $lenght; ie++ )); do
     for (( if = 0; if < $lenght; if++ )); do
      word="${symbols:$ia:1}${symbols:$ib:1}${symbols:$ic:1}${symbols:$id:1}${symbols:$ie:1}${symbols:$if:1}"
      echo $word;
     done
    done
   done
  done
 done
done
```

_Это решение даже не соответствует условию! Выполняется слишком медленно. И заставляет вручную просматривать сгенерированный список слов._

Давайте разберем новые конструкции:

```bash
${#symbols} # Получение длины строки
${symbols:$ia:1} # Получение подстроки, синтаксис: ${string:position:length}
var="$foo$bar" # Простейший способ конкатенации
# 
```

И сразу несколько примеров:

```bash
rus@1215n:~$ string=1234
rus@1215n:~$ echo ${#string}
4
rus@1215n:~$ string=1234dff
rus@1215n:~$ echo ${#string}
7
rus@1215n:~$ string=
rus@1215n:~$ echo ${#string}
0
rus@1215n:~$
```

```bash
rus@1215n:~$ string=0123456789
rus@1215n:~$ echo ${string:1}
123456789
rus@1215n:~$ echo ${string:1:1}
1
rus@1215n:~$ echo ${string:0:1}
0
rus@1215n:~$ echo ${string:0:2}
01
rus@1215n:~$ echo ${string:9:2}
9
rus@1215n:~$
```

```bash
rus@1215n:~$ foo=FOO
rus@1215n:~$ bar=BAR
rus@1215n:~$ echo $foo$bar
FOOBAR
rus@1215n:~$ str=$foo$bar
rus@1215n:~$ echo $str
FOOBAR
rus@1215n:~$ str="$foo$bar"
rus@1215n:~$ echo $str
FOOBAR
rus@1215n:~$ str='$foo$bar' # заметьте различие, между " и ' кавычками
rus@1215n:~$ echo $str
$foo$bar
rus@1215n:~$
```

### Итерация 4. Имплементация требований.

Вернемся к постановке задачи:

> Каждая буква из набора, может быть использована один раз. При этом допускается наличие повторов букв.

Т.е. если один из циклов, использует определенную букву, все вложенные циклы не должны её использовать.

Т.к. мы пользуемся классическим циклом for, то проще всего будет заимплементить это требование как-то так:

```bash
#!/bin/bash

symbols="уаижпжуялитб";
lenght=${#symbols};
for (( ia = 0; ia < $lenght; ia++ )); do
 for (( ib = 0; ib < $lenght; ib++ )); do
  if [[ $ib = $ia ]]; then continue; fi
  for (( ic = 0; ic < $lenght; ic++ )); do
   if [[ $ic = $ia ]]; then continue; fi
   if [[ $ic = $ib ]]; then continue; fi
   for (( id = 0; id < $lenght; id++ )); do
    if [[ $id = $ia ]]; then continue; fi
    if [[ $id = $ib ]]; then continue; fi
    if [[ $id = $ic ]]; then continue; fi
    for (( ie = 0; ie < $lenght; ie++ )); do
     if [[ $ie = $ia ]]; then continue; fi
     if [[ $ie = $ib ]]; then continue; fi
     if [[ $ie = $ic ]]; then continue; fi
     if [[ $ie = $id ]]; then continue; fi
     for (( if = 0; if < $lenght; if++ )); do
      if [[ $if = $ia ]]; then continue; fi
      if [[ $if = $ib ]]; then continue; fi
      if [[ $if = $ic ]]; then continue; fi
      if [[ $if = $id ]]; then continue; fi
      if [[ $if = $ie ]]; then continue; fi
      word="${symbols:$ia:1}${symbols:$ib:1}${symbols:$ic:1}${symbols:$id:1}${symbols:$ie:1}${symbols:$if:1}"
      echo $word;
     done
    done
   done
  done
 done
done
```

Что интересно в этом (и предыдущем куске кода), так это то, что в баше нету зарезервированных слов. Как вы видите, мы использовали `if` и как переменную и как оператор. Невероятно гибко!

### Итерация 5. Поиск слов в словаре.

  Я нашел неплохой [словарь](http://www.winedt.org/dict.html). Перегнал его в UTF-8 и буду использовать его, как эталонный словарь.(Словарь в UTF-8, зеркало [wordlist.txt](wordlist.txt.zip)).

Как найти строку в файле? В GNU/Linux очень просто! Каждый дистрибутив, как правило, поставляется с набором различный утилит. Для нашей задачи отличной подойдет grep.
  
grep создан для:

> grep searches the named input FILEs (or standard input if no files are named, or if a single hyphen-minus (-) is given as file name) for lines containing a match to the given PATTERN.  By default, grep prints the matching lines.
> 
> _- man grep_

Всё там же (в man странице) мы можем узнать как пользоваться этой утилитой:


```
grep [OPTIONS] PATTERN [FILE...]
```

Опции. Полезными для нас опциями будут `-i, --ignore-case` и `-w, --word-regexp`.

Первая опция включает проверку по паттерну, без учета регистра. Что может быть полезно когда словарь содержит слова, начинающиеся с заглавной буквы (словарь стран, имен и т.д.). Если же заранее известно, что слова в словаре будут совпадать по регистру со словом, которое мы будем искать - можно не использовать эту опцию, для улучшения производительности(значительно!!!). Хотя это спорно, и возможно, стоит её оставить по умолчанию, для большей универсальности скрипта.

 Вторая опция избавляет нас от просматривания слов, которые не удовлетворяют нашему простому паттерну(например наш паттерн может быть частью определенного слова). Но, к сожалению, эта опция работает только с английскими словами. Так что нам придется самим, ограничивать вывод.
 
Паттерн(aka RegExp). Если вы не знакомы с регулярными выражениями, самое время открыть новую вкладку и изучить их. В качестве практики я предлагаю [http://regexone.com/](http://regexone.com/). А теория хорошо изложена в Джеффри Фридл - Регулярные выражения.

Файл. Это собственно один или несколько файлов, в которых будет происходить поиск нашего паттерна. Чем больше будет база слов, тем больше вероятность, что мы найдем искомое слово.

Итак, добавляем поиск слова.

```bash
#!/bin/bash

symbols="уаижпжуялитб";
lenght=${#symbols};
for (( ia = 0; ia < $lenght; ia++ )); do
 echo $ia;
 for (( ib = 0; ib < $lenght; ib++ )); do
  if [[ $ib = $ia ]]; then continue; fi
  for (( ic = 0; ic < $lenght; ic++ )); do
   if [[ $ic = $ia ]]; then continue; fi
   if [[ $ic = $ib ]]; then continue; fi
   for (( id = 0; id < $lenght; id++ )); do
    if [[ $id = $ia ]]; then continue; fi
    if [[ $id = $ib ]]; then continue; fi
    if [[ $id = $ic ]]; then continue; fi
    for (( ie = 0; ie < $lenght; ie++ )); do
     if [[ $ie = $ia ]]; then continue; fi
     if [[ $ie = $ib ]]; then continue; fi
     if [[ $ie = $ic ]]; then continue; fi
     if [[ $ie = $id ]]; then continue; fi
     for (( if = 0; if < $lenght; if++ )); do
      if [[ $if = $ia ]]; then continue; fi
      if [[ $if = $ib ]]; then continue; fi
      if [[ $if = $ic ]]; then continue; fi
      if [[ $if = $id ]]; then continue; fi
      if [[ $if = $ie ]]; then continue; fi
      word="${symbols:$ia:1}${symbols:$ib:1}${symbols:$ic:1}${symbols:$id:1}${symbols:$ie:1}${symbols:$if:1}"
      grep ^$word wordlist.txt;
     done
    done
   done
  done
 done
done
```


### Итерация 6. Изменяемая длина слова.

На данный момент скрипт рассчитан на фиксированную длину генерируемого слова. В данной итерации мы это исправим.

Как видно, для пяти букв у нас есть пять циклов, и проверка на использование букв, которые уже используются в предыдущих циклах.

Какие есть варианты решения?

* Рекурсивный вызов функции
* Рекурсивный запуск самого же себя(скрипта)
* Генерирование скрипта, и его запуск
* Замена рекурсии циклом

Второе решение в целом будет аналогично первому(особенность функций в bash). Третье решение, как мне кажется, может получиться несколько запутанным и тяжелым, а четвертное решение будет не таким интересным как первое(рекурсия это весело, особенно на контроллерах, где размер стека - 8).

Итак.. Функции!


```bash
# Создаем функции

function test_v1 {
  echo $1;
}

test_v2 () {
  echo $1;
}

function works { echo "Woooohooo!"; }

function error_need_semicolon { echo "Woooohooo!" }

function also_works {
  echo "Woooohooo!";
}

# Используем функции

test_v1 # Выводит пустую строку
test_v1 тратата # Выводит "тратата"
test_v1 тратата уруру # Выводит "тратата"
test_v1 "тратата уруру" # Выводит "тратата уруру"
# ```

Видимость функций:

```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

function test_v1 {
  test_v2 "Call from v1";
}

test_v1

test_v2 () {
  echo $1;
}

test_v1
rus@1215n:~$ ./test.sh 
./test.sh: line 4: test_v2: command not found # в четвертой строке мы еще ничего не знаем про функцию test_v2
Call from v1
rus@1215n:~$
```

Переопределяем команды:

```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

grep

grep () {
  echo "Override grep tool.";
}

grep
rus@1215n:~$ ./test.sh 
Usage: grep [OPTION]... PATTERN [FILE]...
Try 'grep --help' for more information.
Override grep tool.
rus@1215n:~$
```

Передача и вызов функции:

```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

func () {
  echo "Call func.";
}

test1 () {
  echo $1;
}

test2 () {
  "$1" # вызывает аргумент как команду
}

test1 func
test2 func
rus@1215n:~$ ./test.sh 
func
Call func.
rus@1215n:~$
```

Область видимости переменных:

```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

echo "Point -1: $foo"

foo=1

echo "Point 0: $foo"

test () {
  echo "Point 1: $foo"
  local foo=2
  echo "Point 2: $foo"
}

echo "Point 3: $foo"

test

echo "Point 4: $foo"
rus@1215n:~$ ./test.sh 
Point -1: 
Point 0: 1
Point 3: 1
Point 1: 1
Point 2: 2
Point 4: 1
rus@1215n:~$
```

Именем функции могут быть некоторые специальные знаки:


```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

^ () { echo "Call function: $FUNCNAME"; }

^
rus@1215n:~$ ./test.sh 
Call function: ^
rus@1215n:~$
```

А теперь, рекурсия!

```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

test_func () {
  echo $FUNCNAME;
  test_func;
};

test_func
rus@1215n:~$ ./test.sh
test_func
test_func
test_func
test_func
test_func^C

rus@1215n:~$
```

Как дебажить?


```bash
bash -x ./test.sh # вывод подробной информации о работе скрипта
```


```bash
rus@1215n:~$ cat test.sh 
#!/bin/bash

symbols="уаижпжуялитб";
lenght=${#symbols};
for (( ia = 0; ia < $lenght; ia++ )); do
  echo $ia;
done
rus@1215n:~$ ./test.sh 
0
1
2
3
4
5
6
7
8
9
10
11
rus@1215n:~$ bash -x ./test.sh 
+ symbols=$'\321\203\320\260\320\270\320\266\320\277\320\266\321\203\321\217\320\273\320\270\321\202\320\261'
+ lenght=12
+ (( ia = 0 ))
+ (( ia < 12 ))
+ echo 0
0
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 1
1
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 2
2
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 3
3
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 4
4
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 5
5
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 6
6
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 7
7
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 8
8
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 9
9
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 10
10
+ (( ia++  ))
+ (( ia < 12 ))
+ echo 11
11
+ (( ia++  ))
+ (( ia < 12 ))
rus@1215n:~$
```

А теперь имплементим:

```bash
#!/bin/bash

loop () {
  local symbols=$1;
  local word=$2;
  if [[ $3 > ${#word} ]]; then
    for (( i = 0; i < ${#symbols}; i++ )); do
      if [[ ${#word} > 1 ]]; then
        `loop "${symbols:0:$i}${symbols:(($i + 1))}" "$word${symbols:$i:1}" $3`
      else
        loop "${symbols:0:$i}${symbols:(($i + 1))}" "$word${symbols:$i:1}" $3 &
      fi
    done
  else
    grep ^${word}.$ wordlist.txt >> result.txt &
  fi
}

> result.txt
loop "ябхаинэписъу" "" 3 &
```

Подробнее о том, как это работает в следующей статье.

### Немного юмора напоследок.

* Q: Как написать браузер на bash?
* A: 
  ```
  #!/bin/sh
  firefox
  ```
   _— mentalmenza (linux.org.ru)_
