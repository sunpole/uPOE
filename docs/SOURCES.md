# Sources

Актуальные данные для uPOE должны сверяться минимум по следующим источникам:

1. GGG / Path of Exile — официальный синтаксис item filter и официальные изменения игры.
   - https://www.pathofexile.com/item-filter/about
   - https://www.pathofexile.com/forum

2. FilterBlade — актуальная настройка и экономические тиры PoE 1.
   - https://www.filterblade.xyz/?game=Poe1

3. NeverSink Filter — публичный исходный фильтр и актуальные BaseType/Class.
   - https://github.com/NeverSinkDev/NeverSink-Filter

## Правило проекта

Перед добавлением нового класса предметов в `uPOE.filter`:

- проверить официальный синтаксис;
- сверить актуальные BaseType/Class;
- проверить текущую лигу;
- сравнить экономическое распределение с NeverSink/FilterBlade;
- только после этого применять собственный визуальный стиль uPOE.
