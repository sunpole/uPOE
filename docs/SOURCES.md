# Sources

Актуальные данные для uPOE сверяются по источникам в таком порядке.

## 1. GGG / Path of Exile — источник истины по синтаксису

- https://www.pathofexile.com/item-filter/about
- https://www.pathofexile.com/forum

Официальная документация определяет допустимые условия, действия и значения, включая:

- `Show`, `Hide`, `Continue`, `Import`;
- `PlayAlertSound` и `PlayAlertSoundPositional`: встроенные ID 1–16, громкость 0–300;
- `CustomAlertSound` / `CustomAlertSoundOptional`;
- `DisableDropSound`, `EnableDropSound`, `DisableDropSoundIfAlertSound`, `EnableDropSoundIfAlertSound`;
- `MinimapIcon`: size 0–2, 11 цветов, 12 форм;
- `PlayEffect`: 11 цветов, постоянный или `Temp`;
- `SetTextColor`, `SetBackgroundColor`, `SetBorderColor`, `SetFontSize`.

## 2. FilterBlade

- https://www.filterblade.xyz/?game=Poe1

Используется для сверки актуального состояния PoE1-фильтров и экономического tiering.

## 3. NeverSink Filter

- https://github.com/NeverSinkDev/NeverSink-Filter

Используется как актуальный практический источник `BaseType`, `Class`, tier-листов и реального порядка правил.

## 4. FilterBlade Public Assets — MIT

- https://github.com/NeverSinkDev/FilterBlade-Public-Assets

MIT-лицензия. Репозиторий прямо разрешает использовать его данные в других PoE-проектах с указанием источника. Полезен для item metadata, tags и дополнительных описаний.

## 5. Scalpel — AGPL-3.0

- https://github.com/scalpelpoe/scalpel

Современный PoE-инструмент с filter editor, economy audit, FilterBlade sync и checkpoint-подходом. Для uPOE используем UX/архитектурные идеи; код напрямую не копируем из-за AGPL-зависимости.

## 6. Filtration — GPL-2.0

- https://github.com/ben-wallis/filtration

Исторический редактор PoE1-фильтров с parser/object model, theme editor и visual preview. Полезен как архитектурный референс; код напрямую не переносим.

## 7. wraeblast — MIT

- https://github.com/darvid/wraeblast

Библиотека/генератор фильтров с economy data и генерацией TTS alert sounds. Интересна для будущей автоматизации uPOE: авто-tiering, генерация и проверка фильтра, кастомные звуки.

## 8. Sound-manager проекты

В GitHub существуют менеджеры пользовательских `CustomAlertSound`, например PoE-Filter-Sound-Manager. Они полезны для управления собственными звуковыми файлами, но не являются официальной свободной библиотекой 16 встроенных игровых звуков GGG.

## Звуковая политика uPOE

Официально PoE предоставляет встроенные `PlayAlertSound` ID 1–16, но оригинальные игровые аудиофайлы не включаются в репозиторий uPOE без отдельного подтверждения права на распространение.

Сайт uPOE поэтому:

- показывает все ID 1–16;
- использует собственные синтезированные web-demo для сравнения интерфейса;
- в реальном `.filter` сохраняет настоящий `PlayAlertSound <ID> <volume>`, который игра воспроизводит своим встроенным звуком;
- в будущем может поддерживать пользовательские `CustomAlertSound` с файлами, на которые у пользователя есть права.

## Правило проекта

Перед добавлением нового класса предметов в `uPOE.filter`:

- проверить официальный синтаксис GGG;
- сверить актуальные `BaseType` / `Class`;
- проверить текущую лигу и patch notes;
- сравнить экономическое распределение с NeverSink / FilterBlade;
- использовать MIT-данные только с указанием источника;
- не копировать GPL/AGPL-код в проект без осознанного изменения лицензирования;
- только после этого применять собственный визуальный стиль uPOE.
