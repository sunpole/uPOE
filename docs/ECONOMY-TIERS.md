# uPOE Economy Tier Rules

## Базовая единица цены

Для классификации известных Currency по стоимости uPOE использует **Chaos Orb (c)** как основную единицу.

Divine Orb используется как крупная дополнительная единица для дорогих предметов.

Контрольная точка на 2026-08-29: **1 Divine Orb ≈ 250–260 Chaos Orb**. Курс плавающий и должен обновляться вместе с экономикой лиги.

## Четыре тира Currency

| Tier | uPOE name | Условие | Роль |
|---|---|---|---|
| 1 | SIMPLE | `< 10c` | дешёвая известная Currency |
| 2 | MEDIUM | `>= 10c` и `< 1 Divine` | средняя стоимость |
| 3 | HIGH | `>= 1 Divine` | дорогая / топовая Currency |
| 4 | LEAGUE / DYNAMIC | current league или не классифицирована в T1–T3 | страховочный тир для новой Currency |

## Непересекаемость T1–T3

Это обязательное правило проекта:

- ровно `10c` уже относится к TIER 2;
- ровно `1 Divine` уже относится к TIER 3;
- TIER 2 не должен содержать предмет дешевле границы TIER 1;
- TIER 3 не должен содержать предмет дешевле границы TIER 2.

Формально:

`max(T1) < min(T2) < min(T3)`

TIER 4 не является продолжением ценовой шкалы вверх. Это отдельный динамический safety-tier.

## Визуальная система v0.5

### TIER 1 / SIMPLE

- `SetFontSize 32`
- `SetTextColor 138 190 85 255`
- `SetBackgroundColor 15 20 14 245`
- `SetBorderColor 72 100 45 255`

Текст примерно на 10% смещён от прежнего салатового в более холодную морскую сторону.

### TIER 2 / MEDIUM

Без изменений:

- `SetFontSize 37`
- `SetTextColor 175 230 75 255`
- `SetBackgroundColor 12 19 10 250`
- `SetBorderColor 125 175 55 255`

### TIER 3 / HIGH

- `SetFontSize 45`
- `SetTextColor 213 255 60 255`
- `SetBackgroundColor 3 7 2 255`
- `SetBorderColor 185 255 45 255`
- `PlayAlertSound 1 300`
- `PlayEffect Green`

Текст примерно на 15% смещён к чистому жёлтому относительно предыдущего HIGH.

MinimapIcon для рыночного TOP-10:

- TOP 1–5 -> `MinimapIcon 0 Green Cross`
- TOP 6–10 -> `MinimapIcon 0 Green Circle`
- остальные TIER 3 -> без MinimapIcon

### TIER 4 / LEAGUE + DYNAMIC

TIER 4 получает:

- размер как TIER 2: `SetFontSize 37`
- текст как TIER 3: `SetTextColor 213 255 60 255`
- тёмный фон: `SetBackgroundColor 5 11 4 255`
- очень холодную морскую рамку: `SetBorderColor 45 175 215 255`
- `PlayAlertSound 16 300`
- `MinimapIcon 1 Green Moon`

В TIER 4 входят:

1. явно перечисленные ресурсы текущей лиги;
2. последующий fallback `Class == "Stackable Currency"` — поэтому новая Stackable Currency, которой ещё нет в T1/T2/T3, автоматически получает TIER 4.

Важно: общий development fallback для оружия, брони и остальных ещё не разработанных классов **не является TIER 4** и не получает Sound 16 / Green Moon.

## Источник цены

Для следующей автоматизации использовать данные Currency Exchange через проверенный источник/адаптер. Для защиты от кратких скачков предпочтительно классифицировать по устойчивой цене, например по медиане за период, а не по одному случайному часу.

Если свежей надёжной цены нет, новый Stackable Currency остаётся в TIER 4 до ручной или автоматической классификации.
