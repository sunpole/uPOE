# uPOE

Собственный loot-фильтр для **Path of Exile 1**.

## Live preview

**Интерактивный предпросмотр дропа:** https://sunpole.github.io/uPOE/

Сайт показывает согласованную визуальную систему фильтра прямо в браузере: Simple / Medium / High / Current League, пример расположения предметов на земле, размеры, цвета, контраст и High-tier луч.

> Браузерный preview предназначен для проверки визуальной иерархии. Финальный размер текста и восприятие эффектов обязательно проверяются внутри Path of Exile, потому что игра использует собственный рендеринг интерфейса.

Текущая цель проекта: собрать понятный персональный фильтр для **PoE 1 — 3.29 Curse of the Allflame**, постепенно проходя по классам предметов и фиксируя каждое решение в GitHub.

## Основные принципы

- фильтр пишется вручную и остаётся читаемым;
- актуальные названия предметов и экономические ориентиры сверяются с GGG, FilterBlade и NeverSink;
- визуальный стиль — собственный;
- изменения вносятся небольшими проверяемыми шагами;
- основной рабочий файл: `uPOE.filter`;
- `index.html` — интерактивная визуализация текущего состояния фильтра.

## Уже согласовано

### Currency

Четыре визуальных уровня:

1. **Simple** — тёмное салатовое оформление, обычный размер.
2. **Medium** — салатовое оформление, немного крупнее.
3. **High** — ярко-салатовый текст, почти чёрный контрастный фон, крупный размер, звук выпадения и визуальный эффект.
4. **Current League / Allflame** — стиль Medium, но крупнее и с более тёмным фоном.

## Структура

```text
index.html
uPOE.filter
README.md
CHANGELOG.md
.github/
  workflows/
    pages.yml
docs/
  SOURCES.md
  FILTER-RULES.md
  COLOR-SYSTEM.md
  CURRENT-STATE.md
references/
  currency-tiers.md
```

## Источники

- Path of Exile Item Filter information — https://www.pathofexile.com/item-filter/about
- FilterBlade — https://www.filterblade.xyz/?game=Poe1
- NeverSink Filter — https://github.com/NeverSinkDev/NeverSink-Filter

## Статус

Проект находится в активной разработке. GitHub Pages публикуется автоматически из ветки `main` через GitHub Actions.
