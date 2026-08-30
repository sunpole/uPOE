# uPOE

Собственный loot-фильтр для **Path of Exile 1** с постепенной заменой NeverSink своими правилами.

## Быстро начать играть

Источник истины — `uPOE.filter` в GitHub.

После того как локальная папка проекта уже получена из GitHub, на Windows достаточно запускать двойным кликом:

```text
INSTALL_uPOE_FILTER.bat
```

BAT теперь выполняет полный цикл одной кнопкой:

1. проверяет Git и локальный репозиторий;
2. убеждается, что активна ветка `main`;
3. останавливается, если есть локальные несохранённые изменения;
4. выполняет `git pull --ff-only origin main`;
5. после успешной синхронизации берёт уже обновлённый `uPOE.filter`;
6. скачивает и проверяет актуальный **NeverSink PoE1 0-SOFT**;
7. сохраняет foundation как `vendor/NeverSink-0-SOFT.filter`;
8. делает `.bak` предыдущих установленных фильтров;
9. копирует `uPOE.filter` и `NeverSink-0-SOFT.filter` в `Documents\My Games\Path of Exile\`;
10. проверяет размеры скопированных файлов.

Если GitHub-синхронизация не удалась, установка останавливается — старый локальный `uPOE.filter` не копируется в игру как будто он новый.

В Path of Exile выбирай именно **uPOE**, не `NeverSink-0-SOFT`.

## Live laboratory

**https://sunpole.github.io/uPOE/**

Сайт — это живая витрина проекта:

- случайный дроп разных классов предметов;
- Currency v0.6 с T1 low / T1+ / T2 / T3 / T4;
- `1400` Links: 4L / 5L / 6L;
- `3000` Gems: grey / white / ice-blue;
- полный номерной каталог `0100–5400`;
- статусы `CUSTOM / PARTIAL / UPSTREAM / SYSTEM`;
- Sound Lab 1–16 + локальные пользовательские аудиофайлы;
- MinimapIcon Lab;
- PlayEffect Lab;
- просмотр и скачивание актуального `uPOE.filter`.

Игровой файл остаётся источником истины; браузерная лаборатория нужна для визуального контроля и проектирования.

## Архитектура

```text
uPOE CUSTOM RULES
↓
[[1400]] Links
[[3000]] Gems
[[4000]] Currency
[[4104]] Allflame
[[4400]] Dynamic Currency fallback
↓
Import "NeverSink-0-SOFT.filter" Optional
↓
[[9999]] FINAL SAFETY Show
```

Пока категория не переделана нами, её обслуживает NeverSink 0-SOFT. Когда мы берём следующий номер, собственные правила uPOE ставятся **выше Import** и получают приоритет.

Полная карта проекта: `docs/CATALOG.md`.

## Уже CUSTOM

### [[1400]] Links

- `1401` — 6-link: hot pink, Font 45, Sound 2, Pink beam;
- `1402` — 5-link: medium pink, Font 37;
- `1403` — 4-link: dark pink, Font 32.

Сейчас правила применяются к Normal / Magic / Rare. Unique остаются foundation до отдельной переработки `4800`.

### [[3000]] Gems

- `3001` — ice-blue: Exceptional, Transfigured, Awakened, Empower/Enhance/Enlighten, GemLevel 21+, Quality 23+, 20/20;
- `3002` — white: Vaal, GemLevel 18+, любое Quality;
- `3003` — grey: остальные Skill / Support Gems.

### [[4000]] Currency v0.6

Основные экономические границы:

| Слой | Цена / смысл | Сигнал |
|---|---:|---|
| T1 LOW | `<≈0.9c` | без звука / иконки |
| T1+ | `≈0.9c … <10c` | Sound 14 + Green Triangle size 0 |
| T2 | `10c … <1 Divine` | Sound 14 + Green Triangle size 0 |
| T3 | `>=1 Divine` | Sound 1 + Green beam |
| T4 | league / unclassified | Sound 16 + Green Moon size 1 |

T1+ — **не новый экономический тир**, а attention-layer внутри T1.

Для T3:

```text
TOP 1–5  -> MinimapIcon 0 Green Cross
TOP 6–10 -> MinimapIcon 0 Green Circle
остальная T3 -> без MinimapIcon, но Sound 1 + Green beam
```

Любая новая Stackable Currency, которой ещё нет в наших списках, автоматически попадает в `4400` T4 и остаётся заметной.

## Номерной каталог

uPOE заимствует удобную номерную архитектуру NeverSink. Примеры:

```text
1400 Links
3000 Gems
3200 Special Maps
3300 Maps
3600 Fragments / Scarabs
4000 Currency
4300 Divination Cards
4800 Uniques
5300 Leveling
5400 Normal / Magic + unknown safety
```

Статусы:

- `CUSTOM` — уже наша система;
- `PARTIAL` — частично переработано;
- `UPSTREAM` — пока обслуживает NeverSink;
- `SYSTEM` — служебный слой uPOE.

## Рабочий цикл

```text
берём один номер каталога
↓
изучаем NeverSink / GGG syntax
↓
делаем uPOE-версию выше Import
↓
обновляем docs/CATALOG.md и лабораторию
↓
двойной клик INSTALL_uPOE_FILTER.bat
↓
BAT сам синхронизирует GitHub
↓
BAT обновляет NeverSink и переносит оба фильтра в PoE
↓
Reload uPOE в игре
```

## Основные файлы

```text
uPOE.filter
INSTALL_uPOE_FILTER.bat
index.html
styles.css
currency-v06.js
app.js
showcase-v07.js
economy-tiers.js
local-sounds.js
sound-default.js
docs/CATALOG.md
docs/NEVERSINK-FOUNDATION.md
```

`vendor/NeverSink-0-SOFT.filter` скачивается BAT-файлом локально и в Git не хранится.

## Источники

- GGG Item Filter documentation — https://www.pathofexile.com/item-filter/about
- FilterBlade — https://www.filterblade.xyz/?game=Poe1
- NeverSink Filter — https://github.com/NeverSinkDev/NeverSink-Filter

NeverSink-Filter опубликован под MIT License. uPOE использует его как внешний foundation и не выдаёт upstream-правила за собственные.

## Текущий статус

**Playable:** uPOE Currency v0.6 + Links + Gems + полный NeverSink 0-SOFT foundation. Локальная установка теперь обновляется одной кнопкой через GitHub sync → NeverSink update → Path of Exile install.
