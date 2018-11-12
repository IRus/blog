---
title: "90+ ответов на собеседование по Java Collection API"
date: 2018-11-12
draft: true
---
# 90+ ответов на собеседование по Java Collection API (ссылки)

Общая иерархия

— Расположите в виде иерархии следующий интерфейсы: List, Set, Map, SortedSet, SortedMap, Collection, Iterable, Iterator, NavigableSet, NavigableMap.
— Почему Map — это не Collection, в то время как List и Set являются Collection?
— как одной строчкой преобразовать HashSet в ArrayList?
— как одной строчкой преобразовать ArrayList в HashSet?
— Как перебрать все ключи Map учитывая, что Map — это не Iterable?
— Как перебрать все значения Map учитывая, что Map — это не Iterable?
— Как перебрать все пары ключ-значение в Map учитывая, что Map — это не Iterable?
— В чем проявляется «сортированность» SortedMap, кроме того, что toString() выводит все по порядку?
— Как одним вызовом копировать элементы из любой Collection в массив?
— Реализуйте симметрическую разность двух коллекций используя методы Collection (addAll(), removeAll(), retainAll())

Iterator, Iterable

— Сравните Enumeration и Iterator.
— Как между собой связаны Iterable и Iterator?
— Как между собой связаны Iterable, Iterator и «for-each» введенный в Java 5?
— Сравните Iterator и ListIterator.
— Что произойдет, если я вызову Iterator.next() не «спросив» Iterator.hasNext()?
— Что произойдет, если я вызову Iterator.next() перед этим 10 раз вызвав Iterator.hasNext()? Я пропущу 9 элементов?
— Если у меня есть коллекция и порожденный итератор, изменится ли коллекция, если я вызову iterator.remove()?
— Если у меня есть коллекция и порожденный итератор, изменится ли итератор, если я вызову collection.remove(..)?

List: ArrayList, LinkedList

— Зачем добавили ArrayList если уже был Vector?
— В реализации класса ArrayList следующие поля: Object[] elementData, int size. Объясните, зачем хранить отдельно size, если всегда можно взять elementData.length?
— LinkedList — это односвязный, двусвязный или четырехсвязный список?
— Какое худшее время работы метода contain() для элемента, который есть в LinkedList (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Какое худшее время работы метода contain() для элемента, который есть в ArrayList (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Какое худшее время работы метода add() для LinkedList (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Какое худшее время работы метода add() для ArrayList (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Сколько выделяется элементов в памяти при вызове ArrayList.add()?
— Сколько выделяется элементов в памяти при вызове LinkedList.add()?
— Оцените количество памяти на хранение одного примитива типа byte в LinkedList?
— Оцените количество памяти на хранение одного примитива типа byte в ArrayList?
— Я добавляю элемент в середину List-а: list.add(list.size()/2, newElem). Для кого эта операция медленнее — для ArrayList или для LinkedList?
— Как перебрать элементы LinkedList в обратном порядке не используя медленный get(index)?
— Как одним вызовом из List получить List со всеми элементами, кроме первых и последних 3-х?

Object.equals() + Object.hashCode()

— Могут ли у разных объектов в памяти (ref0 != ref1) быть ref0.hashCode() == ref1.hashCode()?
— Могут ли у разных объектов в памяти (ref0 != ref1) быть ref0.equals(ref1) == true?
— Могут ли у разных ссылок на один объектов в памяти (ref0 == ref1) быть ref0.equals(ref1) == false?
— Есть класса Point{int x, y;}. Почему хэш-код в виде 31 * x + y предпочтительнее чем x + y?
— Если у класса Point{int x, y;} «правильно» реализовать метод equals (return ref0.x == ref1.x && ref0.y == ref1.y), но сделать хэш-код в виде int hashCode() {return x;}, то будут ли корректно такие точки помещаться и извлекаться из HashSet?
— equals() порождает отношение эквивалентности. Какими из свойств обладает такое отношение: коммутативность, симметричность, рефлексивность, дистрибутивность, ассоциативность, транзитивность?
— можно ли так реализовать equals(Object that) {return this.hashCode() == that.hashCode()}?
— В equals требуется проверять, что аргумент (equals(Object that)) такого же типа как и сам объект. В чем разница между this.getClass() == that.getClass() и that instanceof MyClass?
— Можно ли реализовать метод equals класса MyClass вот так
class MyClass {public boolean equals(MyClass that) {return this == that;}}?
— Будет ли работать HashMap если все ключи будут возвращать
public int hashCode() {return 42;}?

Hash: HashMap, HashSet

— Зачем добавили HahsMap если уже был Hashtable?
— Согласно Кнуту и Кормену существует две основных реализации хэш-таблицы: на основе открытой адресацией и на основе метода цепочек. Как реализована HashMap? Почему так сделали (по вашему мнению)? В чем минусы и плюсы Каждого подхода?
— Сколько переходов по ссылкам происходит, когда вы делаете HashMap.get(key) по ключу, который есть в таблице?
— Сколько создается новых объектов, когда вы добавляете новые элемент в HashMap?
— Как работает HashMap при попытке сохранить в нее два элемента по ключам с одинаковым hashCode но для которых equals == false?
— HashMap может выродиться в список даже для ключей с разным hashCode. Как это возможно?
— Какое худшее время работы метода get(key) для ключа, которого нет в таблице (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Какое худшее время работы метода get(key) для ключа, который есть в таблице (O(1), O(log(N)), O(N), O(N*log(N)), O(N*N))?
— Объясните смысл параметров в конструкторе HashMap(int initialCapacity, float loadFactor).
— В чем разница между HashMap и IdentityHashMap? Для чего нужна IdentityHashMap? Как может быть полезна для реализации сериализации или клонирования?
— В чем разница между HashMap и WeakHashMap? Для чего нужна WeakHashMap?
— В WeakHashMap используются WeakReferences. А почему бы не создать SoftHashMap на SoftReferences?
— В WeakHashMap используются WeakReferences. А почему бы не создать PhantomHashMap на PhantomReferences?
— Сделайте HashSet из HashMap (используйте только множество ключей, но не множество значений).
— Сделайте HashMap из HashSet (HashSet<Map.Entry<K, V>>).

Tree: TreeMap/TreeSet, Comparator/Comparable

— Зачем два схожих интерфейса Comparator и Comparable?
— Класс String реализует Comparable и предоставляет «лексикографический порядок». Приведите точное определение этого порядка.
— Класс String реализует Comparable и предоставляет «лексикографический порядок», а я хочу отсортировать строки в порядке длины. Что мне делать?
— Объясните такую сигнатуру метода: Collections.sort(List list, Comparator<? super T> c).
— Объясните такую сигнатуру метода: Collections.binarySearch(List<? extends Comparable<? super T>> list, T key).
— Объясните такую сигнатуру метода: Collections.min(Collection<? extends T> coll, Comparator<? super T> comp).
— Почему у интерфейса Comparator метод compare получает два аргумента, а у интерфейса Comparable метод compareTo получает один аргумент?
— Почему Comparator.compare и Comparable.compareTo возвращают int, а не boolean? Ведь арифметические операторы >, <, >=, <= возвращают boolean.
— Интерфейсы Comparator/Comparable должны определять полный порядок или частичный порядок?
— Какими свойствами должно обладать бинарное отношения порядка, порождаемое реализацией Comparator/Comparable: коммутативность, ассоциативность, дистрибутивность, рефлексивность, транзитивность?
— Как между собой соотносятся интерфейсы SortedMap и NavigableMap?
— Как между собой соотносятся интерфейсы SortedSet и NavigableSet?
— TreeMap — реализовано как бинарное сбалансированное дерево поиска. Что означает «бинарное»? Как связанно с B-деревьями? Это синонимы?
— TreeMap — реализовано как бинарное сбалансированное дерево поиска. Что означает «сбалансированное»? Какой алгоритм балансировки? В какой момент происходит «балансировка»? Нарисуйте два бинарных дерева поиска из одних и тех же элементов, но одно сбалансированное, а другое — нет.
— TreeMap — реализовано как бинарное сбалансированное дерево поиска. Что означает «поиска»? Нарисуйте бинарное сбалансированное дерево, но не «поиска».

More:

— Сравните интерфейсы java.util.Queue и java.util.Deque.
— Кто кого расширяет Queue расширяет Deque или Deque расширяет Queue?
— Почему LinkedList реализует и List и Deque?
— В чем разница между классами java.util.Arrays и java.lang.reflect.Array?
— В чем разница между классами java.util.Collection и java.util.Collections?
— Напишите НЕмногопоточную программу, которая заставляет коллекцию выбросить ConcurrentModificationException.
— Что такое «fail-fast поведение»?
— Для множеств еnum-ов есть специальный класс — java.util.EnumSet? Зачем? Чем авторов не устраивал HashSet или TreeSet?
— java.util.Stack — считается «устаревшим». Чем его рекомендуют заменять? Почему?
— Какая коллекция реализует дисциплину обслуживания FIFO?
— Какая коллекция реализует дисциплину обслуживания FILO?
— Приведите пример, когда какая-либо коллекция выбрасывает UnsupportedOperationException.
— Почему нельзя написать «ArrayList<List> numbers = new ArrayList<ArrayList>();» но можно «List<ArrayList> numbers = new ArrayList<ArrayList>();»?
— LinkedHashMap — что это еще за «зверь»? Что в нем от LinkedList, а что от HashMap?
— LinkedHashSet — что это еще за «зверь»? Что в нем от LinkedList, а что от HashSet?
— Говорят, на LinkedHashMap легко сделать простенький кэш c «invalidation policy», знаете как?
— Что позволяет сделать PriorityQueue?

Concurrent Collections

— В чем разница между Queue и BlockingQueue?
— Есть конструкторы ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel) и HashMap(int initialCapacity, float loadFactor). Как ConcurrentHashMap учитывает в своей структуре concurrencyLevel?
— Почему у HashMap многопоточный вариант — ConcurrentHashMap, а у TreeMap — ConcurrentSkipListMap (сменилось внутреннее устройство с дерева на SkipList)?
