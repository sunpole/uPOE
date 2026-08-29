# uPOE

Собственный loot-фильтр для **Path of Exile 1**.

## Быстро начать играть

Источник истины — `uPOE.filter` в GitHub.

На Windows после `git pull` запускай:

```text
INSTALL_uPOE_FILTER.bat
```

BAT автоматически:

1. берёт наш `uPOE.filter`;
2. скачивает актуальный официальный **NeverSink PoE1 0-SOFT**;
3. проверяет, что это действительно 0-SOFT;
4. сохраняет его локально как `vendor/NeverSink-0-SOFT.filter`;
5. копирует оба файла в `Documents\My Games\Path of Exile\`;
6. сохраняет предыдущие версии как `.bak`.

После этого в Path of Exile выбирай item filter **uPOE**. Если игра уже запущена — перезагрузи фильтр в Options.

## Архитектура: uPOE поверх NeverSink

uPOE теперь использует **NeverSink 0-SOFT как полный fallback foundation** для всех категорий, которые мы ещё не переделали.

Порядок правил:

```text
uPOE custom rules
↓
Currency T1 / T2 / T3 / T4
↓
будущие кастомные категории uPOE
↓
Import "NeverSink-0-SOFT.filter" Optional
↓
финальный safety Show
```

Это значит: мы не переписываем весь PoE-фильтр с нуля. Пока категория не настроена нами, её обрабатывает полный NeverSink 0-SOFT. Когда мы переделываем, например, Divination Cards или Maps, новые правила uPOE ставятся **выше Import** и автоматически получают приоритет.

NeverSink foundation пока покрывает, среди прочего:

- Gold;
- influenced / eldritch items;
- хорошие identified mods;
- rare gear;
- crafting bases;
- flasks и tinctures;
- jewels и cluster jewels;
- Heist gear;
- gems;
- maps;
- fragments и scarabs;
- divination cards;
- uniques;
- leveling gear;
- safety rules для неизвестных предметов.

Подробно: `docs/NEVERSINK-FOUNDATION.md`.

## Currency v0.5 — наша система

Основная единица стоимости — **Chaos Orb**.

| Tier | Цена / смысл | Оформление |
|---|---:|---|
| T1 SIMPLE | `< 10c` | холодный зелёно-морской, Font 32 |
| T2 MEDIUM | `>= 10c` и `< 1 Divine` | базовый салатовый, Font 37 |
| T3 HIGH | `>= 1 Divine` | тёплый жёлто-салатовый, Font 45, Sound 1, Green beam |
| T4 DYNAMIC | league + неизвестная Stackable Currency | T3 text, морская рамка, Font 37, Sound 16, Green Moon size 1 |

Для HIGH:

```text
PlayAlertSound 1 300
PlayEffect Green
```

Для наиболее дорогой валюты:

```text
TOP 1–5  -> MinimapIcon 0 Green Cross
TOP 6–10 -> MinimapIcon 0 Green Circle
```

Любая новая Stackable Currency, которой ещё нет в наших списках, автоматически попадает в T4 и остаётся заметной.

## Live preview

Интерактивный предпросмотр:

https://sunpole.github.io/uPOE/

Preview нужен для визуальной проверки. Реальный размер текста, встроенный звук и эффекты окончательно проверяем внутри Path of Exile.

## Рабочий цикл

```text
меняем одну категорию
↓
commit в GitHub
↓
git pull
↓
INSTALL_uPOE_FILTER.bat
↓
reload uPOE в игре
↓
тестируем
```

Наш план — идти по одному блоку и постепенно заменять NeverSink собственным стилем и логикой uPOE, не теряя полноту рабочего фильтра между этапами.

## Основные принципы

- Currency уже принадлежит uPOE и не отдаётся NeverSink;
- одна категория за один этап;
- не скрывать неизвестное без страховки;
- NeverSink используется как проверенная полная база, а не как финальный дизайн;
- визуальный стиль и ценовая иерархия uPOE остаются собственными;
- GitHub — источник истины проекта.

## Структура

```text
uPOE.filter
INSTALL_uPOE_FILTER.bat
README.md
index.html
app.js
styles.css
local-sounds.js
vendor/
  README.md
  NeverSink-0-SOFT.filter   <- скачивается локально, в Git не хранится
docs/
  NEVERSINK-FOUNDATION.md
  ECONOMY-TIERS.md
  SOURCES.md
  FILTER-RULES.md
  COLOR-SYSTEM.md
  CURRENT-STATE.md
references/
  currency-tiers.md
```

## Источники и лицензии

- GGG Item Filter documentation — https://www.pathofexile.com/item-filter/about
- FilterBlade — https://www.filterblade.xyz/?game=Poe1
- NeverSink Filter — https://github.com/NeverSinkDev/NeverSink-Filter

NeverSink-Filter опубликован под MIT License. Upstream-файл сохраняет оригинальный заголовок, автора и ссылки. uPOE не выдаёт NeverSink foundation за собственную работу.

## Статус

**uPOE Currency v0.5 + полный NeverSink 0-SOFT foundation** — текущая игровая архитектура. Теперь можно играть с полноценной базой и постепенно переделывать категории по одной.
