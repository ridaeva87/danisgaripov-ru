export const SERVICES = {
  credit_history: {
    title: "Диагностика кредитной истории",
    adminTitle: "Диагностика кредитной истории",
    prompt:
      "Опишите, пожалуйста, задачу: были ли отказы банков, просрочки, планируете ли кредит/ипотеку. Затем загрузите PDF-файл или скриншоты кредитной истории.",
    nextSteps: [
      "Получите кредитную историю через Госуслуги или БКИ.",
      "Загрузите PDF-файл или скриншоты в этот чат.",
      "Ответьте на уточняющие вопросы команды.",
      "Дождитесь уведомления о готовности результата.",
    ],
  },
  financial_light: {
    title: "Финансовый разбор Light",
    adminTitle: "Финансовый разбор / Light",
    prompt: "Опишите текущую финансовую ситуацию и главный вопрос, с которого хотите начать.",
  },
  financial_comfort: {
    title: "Финансовый разбор Comfort",
    adminTitle: "Финансовый разбор / Comfort",
    prompt: "Опишите финансовую ситуацию, цели и что уже пробовали менять.",
  },
  financial_ultimate: {
    title: "Финансовый разбор Ultimate",
    adminTitle: "Финансовый разбор / Ultimate",
    prompt: "Опишите цели масштабирования, текущий доход, бизнес/занятость и желаемый результат.",
  },
  business_psychologist: {
    title: "Бизнес-психолог",
    adminTitle: "Бизнес-психолог",
    prompt: "Опишите бизнес-запрос: что мешает росту, какие решения нужно принять, где чувствуете напряжение.",
  },
  kreditovanie: {
    title: "Кредитование",
    adminTitle: "Кредитование",
    prompt: "Укажите желаемую сумму, цель кредита, город, источник дохода и были ли отказы.",
  },
  chastnye_zaymy: {
    title: "Частные займы",
    adminTitle: "Частные займы",
    prompt: "Укажите сумму, срок, цель займа и есть ли залог.",
  },
  vozvrat_strahovok: {
    title: "Возврат страховок",
    adminTitle: "Возврат страховок",
    prompt: "Укажите банк, дату оформления кредита и какие страховки/услуги были подключены.",
  },
  srochnyy_vykup_avto: {
    title: "Срочный выкуп авто",
    adminTitle: "Срочный выкуп авто",
    prompt: "Укажите марку, модель, год, город, состояние авто и насколько срочно нужна сделка.",
  },
  it_razrabotka: {
    title: "IT-разработка для бизнеса",
    adminTitle: "IT-разработка для бизнеса",
    prompt: "Опишите бизнес-задачу, текущий процесс и какой результат хотите получить от автоматизации.",
  },
};

export const STATUS_LABELS = {
  new: "Новая",
  collecting: "Сбор данных",
  in_progress: "В работе",
  waiting_client: "Ждём клиента",
  ready: "Результат готов",
  closed: "Закрыта",
};

export const normalizePayload = (payload = "") => {
  const value = payload.trim().toLowerCase().replace(/-/g, "_");
  return SERVICES[value] ? value : "";
};

export const buildServiceKeyboard = () => ({
  keyboard: [
    [{ text: SERVICES.credit_history.title }],
    [{ text: SERVICES.financial_light.title }, { text: SERVICES.financial_comfort.title }],
    [{ text: SERVICES.financial_ultimate.title }],
    [{ text: SERVICES.business_psychologist.title }],
    [{ text: SERVICES.kreditovanie.title }, { text: SERVICES.chastnye_zaymy.title }],
    [{ text: SERVICES.vozvrat_strahovok.title }, { text: SERVICES.srochnyy_vykup_avto.title }],
    [{ text: SERVICES.it_razrabotka.title }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

export const serviceKeyFromText = (text = "") => {
  const normalized = text.trim().toLowerCase();
  return Object.entries(SERVICES).find(([, service]) => service.title.toLowerCase() === normalized)?.[0] || "";
};

export const formatRequestSummary = (request) => {
  const service = SERVICES[request.serviceKey];
  const status = STATUS_LABELS[request.status] || request.status;
  const attachments = request.attachments.length ? `${request.attachments.length}` : "нет";
  const messages = request.messages.length ? `${request.messages.length}` : "нет";

  return [
    `Заявка ${request.id}`,
    `Услуга: ${service?.adminTitle || request.serviceKey}`,
    `Статус: ${status}`,
    `Клиент: ${request.client.name || "без имени"} (@${request.client.username || "нет username"})`,
    `Telegram ID: ${request.client.chatId}`,
    `Сообщений: ${messages}`,
    `Файлов/скриншотов: ${attachments}`,
    `Создана: ${request.createdAt}`,
    `Обновлена: ${request.updatedAt}`,
  ].join("\n");
};

export const formatClientStartMessage = (serviceKey, publicSiteUrl) => {
  const service = SERVICES[serviceKey];
  const steps = service.nextSteps?.length
    ? `\n\nДальше:\n${service.nextSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`
    : "";

  return [
    `Вы выбрали: ${service.title}`,
    service.prompt,
    steps,
    `\nСайт: ${publicSiteUrl}`,
  ].join("\n\n");
};
