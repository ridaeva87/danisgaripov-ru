# Бот доступа к бесплатному финансовому разбору

Отдельный минимальный проект для старого Telegram-бота `@finance_razbor_bot`.

Бот не принимает заявки и не заменяет новый клиентский бот. Его задача одна: проверить подписку на канал Даниса и выдать код доступа к опросу на сайте.

## Что делает

- Отвечает на `/start`.
- Показывает кнопку подписки на канал `@garipovdanis`.
- Показывает кнопку `Проверить подписку`.
- После подтверждённой подписки выдаёт код `ФИНРАЗБОР`.
- Если подписка не найдена, просит подписаться и повторить проверку.

## Важно

Чтобы проверка подписки работала стабильно, `@finance_razbor_bot` должен быть добавлен администратором в канал `@garipovdanis` или иметь возможность проверять участников канала через Telegram Bot API.

BotHelp для этого бота нужно отключить, иначе Telegram webhook BotHelp может конфликтовать с long polling на Timeweb.

## Переменные окружения

- `FINANCE_ACCESS_BOT_TOKEN` — токен старого `@finance_razbor_bot`.
- `FINANCE_ACCESS_CHANNEL_USERNAME` — канал для проверки подписки.
- `FINANCE_ACCESS_CODE` — код, который вводится на странице опроса.
- `POLL_TIMEOUT_SECONDS` — timeout long polling.
- `POLL_RETRY_DELAY_MS` — пауза после ошибки Telegram API.

Токен хранится только в `.env` на сервере. Файл `.env` не добавлять в GitHub.

## Запуск на Timeweb через PM2

```bash
cd /var/www/danisgaripov.ru/source/finance-access-bot
pm2 start src/bot.mjs --name finance-razbor-access-bot --cwd /var/www/danisgaripov.ru/source/finance-access-bot --interpreter node --time
pm2 save
```
