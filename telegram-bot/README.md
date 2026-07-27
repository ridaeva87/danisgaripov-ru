# Новый Telegram-бот для заявок сайта

Отдельный Node.js-проект для единого клиентского Telegram-бота сайта `danisgaripov.ru`.

Этот проект не изменяет и не заменяет существующего бота `@finance_razbor_bot`. Старый бот остаётся только для проверки подписки и выдачи кода доступа к бесплатному финансовому разбору.

## Что реализовано

- Приём пользователей после перехода с сайта через `/start` и deep-link payload.
- Выбор направления: финансовые разборы, диагностика кредитной истории, бизнес-психолог, кредитование, частные займы, возврат страховок, срочный выкуп авто, IT-разработка.
- Создание заявки с уникальным номером.
- Приём текстовых анкет, ответов, PDF-файлов, документов и скриншотов/фото.
- Передача каждой новой заявки и новых материалов в закрытую Telegram-группу администраторов.
- Администрирование прямо из закрытой группы без отдельной панели:
  - `/info REQ_ID` — посмотреть заявку;
  - `/status REQ_ID статус` — изменить статус и уведомить клиента;
  - `/reply REQ_ID текст` — отправить сообщение клиенту;
  - `/result REQ_ID текст` — отправить результат клиенту;
  - `/close REQ_ID` — закрыть заявку.
- Файловое JSON-хранилище заявок для первого production-запуска без базы данных.
- Расширяемая структура сценариев в `src/messages.mjs`.

## Архитектура

```text
telegram-bot/
├── src/
│   ├── bot.mjs           # long polling, маршрутизация сообщений и админ-команды
│   ├── config.mjs        # переменные окружения
│   ├── messages.mjs      # сценарии услуг, статусы и тексты
│   ├── store.mjs         # файловое хранилище заявок
│   └── telegram-api.mjs  # тонкая обёртка над Telegram Bot API
├── test/
│   └── messages.test.mjs
├── .env.example
├── package.json
└── README.md
```

## Запуск

1. Создать нового бота через `@BotFather`.
2. Добавить нового бота в закрытую группу команды Даниса.
3. Узнать `ADMIN_CHAT_ID` закрытой группы.
4. Создать `.env` на основе `.env.example`.
5. Запустить:

```bash
cd telegram-bot
npm test
npm start
```

## Переменные окружения

- `CLIENT_BOT_TOKEN` — токен нового Telegram-бота. Не использовать токен `@finance_razbor_bot`.
- `ADMIN_CHAT_ID` — id закрытой группы команды.
- `PUBLIC_SITE_URL` — адрес сайта.
- `DATA_DIR` — папка для JSON-хранилища заявок.
- `POLL_TIMEOUT_SECONDS` — timeout long polling.
- `POLL_RETRY_DELAY_MS` — пауза перед повтором при ошибке Telegram API.

## Deep-link payload для будущей интеграции сайта

Сайт сможет отправлять пользователя в нового бота ссылками вида:

```text
https://t.me/<new_bot_username>?start=credit_history
https://t.me/<new_bot_username>?start=financial_comfort
https://t.me/<new_bot_username>?start=financial_ultimate
https://t.me/<new_bot_username>?start=business_psychologist
```

Поддерживаемые payload:

- `credit_history`
- `financial_light`
- `financial_comfort`
- `financial_ultimate`
- `business_psychologist`
- `kreditovanie`
- `chastnye_zaymy`
- `vozvrat_strahovok`
- `srochnyy_vykup_avto`
- `it_razrabotka`

## Важные ограничения этапа 6

- В проект не добавляется проверка платежей Robokassa.
- Новый бот готов к интеграции с сайтом, но сайт будет подключаться к нему на отдельном этапе.
- Хранилище файловое, без CRM/БД. При росте нагрузки `store.mjs` можно заменить адаптером базы данных без изменения команд и сценариев.
