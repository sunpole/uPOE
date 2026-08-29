# NeverSink foundation for uPOE

## Решение

uPOE использует **NeverSink PoE1 0-SOFT** как полный базовый слой для всех категорий, которые мы ещё не настроили вручную.

Порядок обработки:

1. собственные правила uPOE;
2. наша Currency T1 / T2 / T3 / T4;
3. будущие кастомные категории uPOE;
4. `Import "NeverSink-0-SOFT.filter" Optional`;
5. финальный `Show` как последняя страховка.

Так как фильтры Path of Exile обрабатываются сверху вниз, категория, которую мы уже описали в uPOE, не доходит до NeverSink. Поэтому можно заменять базу постепенно — по одному классу предметов.

## Что даёт NeverSink foundation

Пока категория не переделана нами, NeverSink 0-SOFT предоставляет готовую логику для, среди прочего:

- Gold;
- influenced и eldritch items;
- identified mod filtering;
- exotic и crafting bases;
- rare gear;
- flasks и tinctures;
- jewels и cluster jewels;
- Heist gear;
- gems;
- maps;
- fragments и scarabs;
- divination cards;
- uniques;
- quest-like items;
- leveling gear;
- safety rules для неизвестных предметов.

## Currency

Currency уже является собственной системой uPOE и располагается выше Import. Поэтому Stackable Currency перехватывается нашими T1–T4 и не использует NeverSink Currency tiering.

Другие типы предметов, которые NeverSink считает экономическими, но которые технически относятся к отдельным классам PoE (например Maps, Map Fragments, Divination Cards и т.п.), пока остаются под NeverSink и будут переделываться отдельно.

## Обновление

`INSTALL_uPOE_FILTER.bat` при каждом запуске:

1. скачивает актуальный `NeverSink's filter - 0-SOFT.filter` из официального GitHub `NeverSinkDev/NeverSink-Filter`;
2. проверяет заголовок и тип `0-SOFT`;
3. сохраняет локальный кэш в `vendor/NeverSink-0-SOFT.filter`;
4. копирует `uPOE.filter` и `NeverSink-0-SOFT.filter` в папку фильтров Path of Exile;
5. сохраняет предыдущие версии как `.bak`.

Если imported-файл отсутствует, `Optional` не ломает загрузку uPOE, а финальный `Show` оставляет неопознанные предметы видимыми.

## Лицензия и источник

NeverSink-Filter: https://github.com/NeverSinkDev/NeverSink-Filter

Автор upstream: NeverSink / NeverSinkDev.

Репозиторий NeverSink-Filter опубликован под лицензией MIT. uPOE не выдаёт upstream-фильтр за собственную работу; источник и авторство сохраняются в документации и в самом скачиваемом upstream-файле.
