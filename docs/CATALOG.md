# uPOE Numbered Catalog

uPOE использует числовую архитектуру, совместимую с логикой NeverSink: крупная категория получает номер из четырёх цифр, а подкатегории — соседние подномера.

## Статусы

- `CUSTOM` — категория уже переопределена uPOE выше импортируемого foundation.
- `PARTIAL` — часть категории уже наша, остальное ещё требует отдельной проработки.
- `UPSTREAM` — пока полностью обслуживается NeverSink 0-SOFT через `Import`.
- `SYSTEM` — служебный слой uPOE.

## Каталог

| № | Категория uPOE | Статус |
|---:|---|---|
| 0100 | Глобальные приоритетные исключения | UPSTREAM |
| 0200 | Gold | UPSTREAM |
| 0300 | Influenced items | UPSTREAM |
| 0400 | Eldritch items | UPSTREAM |
| 0500 | Exotic / special bases | UPSTREAM |
| 0600 | Identified gear: сложные комбинации модов | UPSTREAM |
| 0700 | Identified gear: пары модов | UPSTREAM |
| 0800 | Identified gear: одиночные ценные моды | UPSTREAM |
| 0900 | Высокоприоритетные свойства экипировки | UPSTREAM |
| 1000 | Corrupted identified items | UPSTREAM |
| 1100 | Особые модификаторы | UPSTREAM |
| 1200 | Особые классы предметов | UPSTREAM |
| 1300 | Особые варианты предметов | UPSTREAM |
| 1400 | Links / recipes — uPOE pink 4L / 5L / 6L | CUSTOM |
| 1401 | 6-link Normal/Magic/Rare — hot pink, Sound 2, Pink beam | CUSTOM |
| 1402 | 5-link Normal/Magic/Rare — medium pink | CUSTOM |
| 1403 | 4-link Normal/Magic/Rare — dark pink | CUSTOM |
| 1500 | High-level crafting bases | UPSTREAM |
| 1600 | Endgame rare gear | UPSTREAM |
| 1700 | Дополнительные правила rare gear | UPSTREAM |
| 1800 | Veiled rare gear | UPSTREAM |
| 1900 | Corrupted rare gear | UPSTREAM |
| 2000 | Условное скрытие endgame gear | UPSTREAM |
| 2100 | Rings / amulets / boots и связанные rare rules | UPSTREAM |
| 2200 | Rare gear по уровню выпадения | UPSTREAM |
| 2300 | Crafting projects / crafting bases | UPSTREAM |
| 2400 | Chancing bases | UPSTREAM |
| 2500 | Flasks / tinctures | UPSTREAM |
| 2600 | Misc gear rules | UPSTREAM |
| 2700 | Hide layer для rare / magic gear | UPSTREAM |
| 2800 | Jewels / abyss / cluster jewels | UPSTREAM |
| 2900 | Heist equipment | UPSTREAM |
| 3000 | Gems | UPSTREAM |
| 3100 | Replica / Foulborn uniques | UPSTREAM |
| 3200 | Special maps | UPSTREAM |
| 3300 | Обычная map progression | UPSTREAM |
| 3400 | Pseudo-map items | UPSTREAM |
| 3500 | Прочие map-related items | UPSTREAM |
| 3600 | Fragments / scarabs | UPSTREAM |
| 3700 | Currency: специальные приоритетные случаи | PARTIAL |
| 3800 | Currency: leveling exceptions | PARTIAL |
| 3900 | Currency: stack-size exceptions | PARTIAL |
| 4000 | Currency: основная ценовая система T1 / T2 / T3 | CUSTOM |
| 4100 | Currency: специальные и лиговые ресурсы | PARTIAL |
| 4104 | Allflame / current league resources | CUSTOM |
| 4200 | Currency: splinters и похожие ресурсы | PARTIAL |
| 4300 | Divination Cards | UPSTREAM |
| 4400 | Currency: dynamic / unclassified T4 fallback | CUSTOM |
| 4500 | Quest-like items, слой 1 | UPSTREAM |
| 4600 | Enshrouded items | UPSTREAM |
| 4700 | Event / Idol items | UPSTREAM |
| 4800 | Uniques | UPSTREAM |
| 4900 | Quest-like items, слой 2 | UPSTREAM |
| 5000 | Устаревшие leveling flasks | UPSTREAM |
| 5100 | Leveling utility flasks / tinctures | UPSTREAM |
| 5200 | Leveling life / mana / hybrid flasks | UPSTREAM |
| 5300 | Leveling gear rules | UPSTREAM |
| 5400 | Полезные normal / magic leveling items + unknown safety | UPSTREAM |
| 9000 | NeverSink 0-SOFT foundation import | SYSTEM |
| 9999 | Последний uPOE safety fallback | SYSTEM |

## Правило миграции

Когда мы берём следующую категорию, например `4300 Divination Cards`, мы создаём собственные правила с номером `4300` выше `Import`. После проверки в игре статус меняется с `UPSTREAM` на `CUSTOM` или `PARTIAL`.

Подномера позволяют менять только один кусок категории. Например, `1401` — 6-link, `1402` — 5-link, `1403` — 4-link. В Currency у нас уже есть `4001` (TOP 1–5), `4002` (TOP 6–10), `4003` (остальной HIGH), `4004` (MEDIUM), `4005` (SIMPLE) и `4104` (Allflame).

Таким образом, каталог остаётся стабильным, а NeverSink постепенно заменяется uPOE по одной категории без риска потерять остальные классы предметов.