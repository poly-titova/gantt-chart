### Загрузка плагина

1. В файле [upload.sh](./upload.sh) установить зависимости:
  - `PLATRUM_API_KEY` - апи ключ проекта
  - `PUBLIC_KEY` - публичный ключ проекта
2. Пропишите апи ключ проекта в файле [frontend/pages/mainPage/index.vue](./frontend/pages/mainPage/index.vue):
  - ```apiKey: 'апи ключ проекта'``` (107 строка)
3. Запустите сборку приложения командой из терминала:
  - ```./upload.sh gantt```
