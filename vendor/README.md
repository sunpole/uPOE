# vendor

Эта папка используется локально для внешней основы uPOE.

`INSTALL_uPOE_FILTER.bat` автоматически скачивает актуальный официальный **NeverSink 0-SOFT** из репозитория `NeverSinkDev/NeverSink-Filter` и сохраняет его здесь как:

`NeverSink-0-SOFT.filter`

Сам скачанный файл не хранится в репозитории uPOE и указан в `.gitignore`.

Причина: NeverSink остаётся независимым upstream-проектом, а uPOE подключает его через:

`Import "NeverSink-0-SOFT.filter" Optional`

Это позволяет постепенно заменять отдельные категории собственными правилами uPOE, не копируя и не редактируя тысячи строк upstream-фильтра вручную.
