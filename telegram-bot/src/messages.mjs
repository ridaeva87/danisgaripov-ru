export const SERVICES = {
  general_request: {
    title: "Оставить заявку",
    adminTitle: "Оставить заявку",
    prompt: "Опишите запрос, с которым хотите обратиться к команде Даниса.",
  },
  agent: {
    title: "Стать агентом",
    adminTitle: "Стать агентом",
    prompt: "Оставьте контактные данные для заявки на сотрудничество.",
  },
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
    adminTitle: "Консультация бизнес-психолога",
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
  collecting: "Заявка получена",
  assigned: "Передана специалисту",
  in_progress: "Взята в работу",
  waiting_client: "Ожидаются документы",
  ready: "Работа завершена",
  closed: "Работа завершена",
};

export const DOCUMENT_LINKS = {
  privacy: "/docs/politika-personalnyh-dannyh.docx",
  personalDataConsent: "/docs/soglasie-personalnyh-dannyh.docx",
};

export const WELCOME_TEXT = [
  "Здравствуйте! Я финансовый помощник Даниса Гарипова.",
  "",
  "Здесь вы сможете:",
  "- выбрать нужную услугу;",
  "- продолжить работу после оплаты;",
  "- пройти финансовый разбор;",
  "- отправить данные для диагностики кредитной истории;",
  "- загрузить необходимые документы;",
  "- проверить статус своей заявки;",
  "- связаться с командой Даниса.",
  "",
  "Telegram-канал Даниса: @garipovdanis",
  "",
  "Для продолжения работы необходимо ознакомиться с Политикой обработки персональных данных и дать согласие на обработку персональных данных.",
].join("\n");

export const MAIN_MENU = [
  "Финансовый разбор",
  "Диагностика кредитной истории",
  "Отправить документы",
  "Статус заявки",
  "Связаться с командой",
];

export const getDocumentUrl = (publicSiteUrl, path) => new URL(path, publicSiteUrl).toString();

export const buildWelcomeKeyboard = (publicSiteUrl) => ({
  inline_keyboard: [
    [
      { text: "Политика конфиденциальности", url: getDocumentUrl(publicSiteUrl, DOCUMENT_LINKS.privacy) },
    ],
    [
      { text: "Согласие на обработку данных", url: getDocumentUrl(publicSiteUrl, DOCUMENT_LINKS.personalDataConsent) },
    ],
    [{ text: "Принимаю и продолжаю", callback_data: "consent:accept" }],
  ],
});

export const buildMainMenuKeyboard = () => ({
  keyboard: [
    [{ text: "Финансовый разбор" }],
    [{ text: "Диагностика кредитной истории" }],
    [{ text: "Отправить документы" }, { text: "Статус заявки" }],
    [{ text: "Связаться с командой" }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

export const buildBackMenuKeyboard = () => ({
  keyboard: [[{ text: "Назад в главное меню" }]],
  resize_keyboard: true,
  one_time_keyboard: false,
});

export const FINANCIAL_PACKAGES = [
  {
    key: "financial_light",
    title: "Light",
    description:
      "Если вы не понимаете, почему финансовая ситуация не меняется и с чего начать. Разбор поможет увидеть главную причину и определить первый шаг.",
    button: "Получить Light бесплатно",
    url: "/financial-review",
  },
  {
    key: "financial_comfort",
    title: "Comfort",
    description:
      "Если деньги приходят, но доход не растёт или постоянно возникают финансовые сложности. Вы получите подробный разбор ситуации и конкретные рекомендации, что изменить в первую очередь.",
    button: "Выбрать Comfort - 10 000 ₽",
    url: "/#analysis",
  },
  {
    key: "financial_ultimate",
    title: "Ultimate",
    description:
      "Если вам нужна финансовая стратегия для масштабирования и увеличения дохода. Глубокий разбор поможет увидеть точки роста и составить пошаговый план действий под ваши цели.",
    button: "Выбрать Ultimate - 50 000 ₽",
    url: "/#analysis",
  },
];

export const buildFinancialKeyboard = (publicSiteUrl) => ({
  inline_keyboard: FINANCIAL_PACKAGES.map((item) => [
    { text: item.button, url: getDocumentUrl(publicSiteUrl, item.url) },
  ]),
});

export const buildAdminStatusKeyboard = (requestId) => ({
  inline_keyboard: [
    [
      { text: "Взять в работу", callback_data: `admin:take:${requestId}` },
      { text: "Связались", callback_data: `admin:status:${requestId}:assigned` },
    ],
    [
      { text: "Ожидаются документы", callback_data: `admin:status:${requestId}:waiting_client` },
      { text: "Завершено", callback_data: `admin:status:${requestId}:ready` },
    ],
  ],
});

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
    request.packageName ? `Пакет: ${request.packageName}` : "",
    request.price ? `Стоимость: ${request.price}` : "",
    request.payment?.status ? `Статус оплаты: ${request.payment.status}` : "",
    request.payment?.id ? `ID платежа: ${request.payment.id}` : "",
    `Статус: ${status}`,
    `Клиент: ${request.client.name || "без имени"} (@${request.client.username || "нет username"})`,
    request.client.chatId ? `Telegram ID: ${request.client.chatId}` : "",
    `Сообщений: ${messages}`,
    `Файлов/скриншотов: ${attachments}`,
    request.assignedTo?.name ? `Ответственный: ${request.assignedTo.name}` : "",
    request.source ? `Источник: ${request.source}` : "",
    `Создана: ${request.createdAt}`,
    `Обновлена: ${request.updatedAt}`,
  ].filter(Boolean).join("\n");
};

export const formatSiteRequestMessage = (request) => {
  const answers = request.answers?.length
    ? request.answers.map((item, index) => `${index + 1}. ${item.question} - ${item.answer || "-"}`).join("\n")
    : "Ответы не переданы.";

  return [
    "НОВАЯ ЗАЯВКА",
    `Услуга: ${SERVICES[request.serviceKey]?.adminTitle || request.serviceKey}`,
    request.packageName ? `Пакет: ${request.packageName}` : "",
    request.price ? `Стоимость: ${request.price}` : "",
    request.payment?.status ? `Статус оплаты: ${request.payment.status}` : "",
    request.payment?.id ? `ID платежа: ${request.payment.id}` : "",
    `Имя: ${request.client.name || "-"}`,
    `Телефон: ${request.client.phone || "-"}`,
    `Email: ${request.client.email || "-"}`,
    `Telegram: ${request.client.username || request.client.telegram || "-"}`,
    `Сумма/MAX: ${request.max || "-"}`,
    `Дата: ${request.createdAt}`,
    `Источник: ${request.source || "danisgaripov.ru"}`,
    `Номер заявки: ${request.id}`,
    "",
    "Ответы пользователя:",
    answers,
  ].filter(Boolean).join("\n");
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
