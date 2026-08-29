# uPOE

Собственный loot-фильтр для **Path of Exile 1**.

## Быстро начать играть

Актуальный игровой файл: **`uPOE.filter`** в корне репозитория.

1. Скачай `uPOE.filter` из GitHub.
2. Положи его в папку:

```text
C:\Users\<ТВОЁ_ИМЯ>\Documents\My Games\Path of Exile\
```

3. В Path of Exile открой настройки Item Filter и выбери `uPOE`.
4. После каждого нового коммита достаточно скачать свежий `uPOE.filter` и заменить старый файл.

Пока API и автоматическая синхронизация не используются: **GitHub-файл является источником истины**.

## Live preview

**Интерактивный предпросмотр дропа:** https://sunpole.github.io/uPOE/

Сайт показывает визуальную систему фильтра прямо в браузере: SIMPLE / MEDIUM / HIGH / Current League, пример расположения предметов на земле, размеры, цвета, контраст, звук/луч и MinimapIcon.

> Браузерный preview предназначен для проверки визуальной иерархии. Финальный размер текста, звук и игровые эффекты обязательно проверяются внутри Path of Exile, потому что игра использует собственный рендеринг и встроенные звуки.

Текущая цель проекта: как можно раньше иметь **играбельный фильтр**, а затем улучшать его по одному классу предметов, не ломая уже готовые правила.

## Currency v0.4 — рабочая ценовая система

Основная единица стоимости — **Chaos Orb**.

| Tier | Цена | Оформление |
|---|---:|---|
| SIMPLE | `< 10c` | тёмное салатовое, Font 32 |
| MEDIUM | `>= 10c` и `< 1 Divine` | салатовое, Font 37 |
| HIGH | `>= 1 Divine` | ярко-салатовое, Font 45, Sound 1, Green beam |

Обязательное правило:

```text
max(SIMPLE) < min(MEDIUM) < min(HIGH)
```

Новая или пока не проверенная Stackable Currency временно получает **MEDIUM**, а не SIMPLE. Это сделано специально, чтобы неизвестный дорогой предмет не выглядел слишком незаметно.

### HIGH

Для всей HIGH currency:

```text
PlayAlertSound 1 300
PlayEffect Green
```

Для наиболее дорогой валюты:

```text
TOP 1–5  -> MinimapIcon 0 Green Cross
TOP 6–10 -> MinimapIcon 0 Green Circle
```

Остальная HIGH currency не получает MinimapIcon.

### Current League / Allflame

Лиговая валюта пока сохраняет отдельный согласованный стиль: примерно как MEDIUM, но крупнее и с более тёмным фоном. Её детальное ценовое разделение будет уточняться после стабилизации основной Currency-группы.

## Основные принципы

- фильтр остаётся читаемым вручную;
- цена важнее старых фиксированных tier-листов;
- экономику сверяем по текущему рынку лиги;
- визуальный стиль — собственный;
- изменения вносятся небольшими проверяемыми шагами;
- основной рабочий файл: `uPOE.filter`;
- всё, что ещё не разработано, пока остаётся видимым через DEVELOPMENT FALLBACK.

## Структура

```text
index.html
uPOE.filter
README.md
CHANGELOG.md
app.js
styles.css
local-sounds.js
docs/
  SOURCES.md
  FILTER-RULES.md
  COLOR-SYSTEM.md
  CURRENT-STATE.md
  ECONOMY-TIERS.md
references/
  currency-tiers.md
```

## Источники

- Path of Exile Item Filter information — https://www.pathofexile.com/item-filter/about
- FilterBlade — https://www.filterblade.xyz/?game=Poe1
- NeverSink Filter — https://github.com/NeverSinkDev/NeverSink-Filter
- текущая экономика Allflame — данные Currency Exchange через публичные economy-источники

## Статус

Проект находится в активной разработке. **Currency v0.4 уже можно использовать в игре.** Остальные классы предметов пока не скрываются: они показываются через общий fallback и будут оформляться дальше по одному классу.
