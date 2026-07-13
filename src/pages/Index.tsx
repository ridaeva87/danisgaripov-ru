import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  HandHelping,
  MessageCircle,
  Send,
} from "lucide-react";


import danisHero from "@/assets/danis-garipov-hero.png";

import heroBackground from "@/assets/hero-background.jpg";
import { LeadForm } from "@/components/LeadForm";
import { CustdevQuiz } from "@/components/CustdevQuiz";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

const workflow = [
  "Вы оставляете заявку",
  "Мы изучаем ваше обращение",
  "Уточняем детали",
  "Предлагаем вариант решения",
  "Запускаем работу по вашему направлению",
];

const audience = [
  "если есть сложности с кредитованием в банке",
  "если нужно улучшить кредитную историю",
  "если хотите вернуть страховку",
  "если нужны быстрые финансы",
  "если нужно срочно продать авто 24/7",
  "если вам нужно автоматизировать бизнес и масштабироваться",
];

const analysisPoints = [
  "что мешает увеличить доход",
  "с чего начать, чтобы улучшить ситуацию с финансами",
  "как стабилизировать деньги",
  "что можно монетизировать",
  "какие привычки и подходы мешают зарабатывать больше",
  "что можно оптимизировать, чтобы доходы росли",
  "как сократить лишние траты",
  "в каком направлении сейчас лучше двигаться по деньгам",
];

const financialReviewTariffs = [
  {
    id: "mini",
    title: "Мини-разбор",
    price: "5 000 ₽",
    note: "Бесплатно за подписку на Telegram-канал",
    buttonLabel: "Получить бесплатно",
    href: "#quiz",
    description: "Формат для первого знакомства с финансовой ситуацией.",
    integrationPayload: {
      service: "financial_review",
      tariff: "mini",
      source: "site_analysis_block",
    },
  },
  {
    id: "comfort",
    title: "Комфорт",
    price: "10 000 ₽",
    buttonLabel: "Оплатить 10 000 ₽",
    href: "https://auth.robokassa.ru/merchant/Invoice/0mq2XM8pv0uWCuoFeeEl4g",
    description: "Расширенный персональный разбор финансовой ситуации с более подробными рекомендациями по следующему шагу.",
    integrationPayload: {
      service: "financial_review",
      tariff: "comfort",
      source: "site_analysis_block",
    },
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "50 000 ₽",
    buttonLabel: "Оплатить 50 000 ₽",
    href: "https://auth.robokassa.ru/merchant/Invoice/m5OY9uzI3EuTxEKBTBqE0g",
    description: "Глубокий персональный разбор с детальной стратегией действий и рекомендациями по дальнейшему финансовому направлению.",
    integrationPayload: {
      service: "financial_review",
      tariff: "ultimate",
      source: "site_analysis_block",
    },
  },
];

const agentReasons = ["для тех, кто умеет выстраивать доверие", "для тех, кто хочет вести людей к сильному сервису", "для тех, кому важен взрослый формат работы"];

const Index = () => {
  useEffect(() => {
    document.title = "Данис Гарипов — финансовые решения";
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Данис Гарипов</p>
            <p className="text-sm text-muted-foreground">Финансовые решения</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <a href="#services" className="transition-colors hover:text-foreground">Услуги</a>
            <a href="#analysis" className="transition-colors hover:text-foreground">Мини-разбор</a>
            <a href="#agent" className="transition-colors hover:text-foreground">Стать агентом</a>
            <a href="#contacts" className="transition-colors hover:text-foreground">Контакты</a>
          </nav>
          <Button asChild variant="hero" className="hidden lg:inline-flex">
            <a href="#lead-form">Оставить заявку</a>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/60 bg-background text-foreground">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.56)_55%,hsl(var(--background))_100%)]" aria-hidden="true" />
        {/* Olive top spotlight */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[82%] w-[78%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at top, hsl(var(--brand) / 0.42) 0%, hsl(var(--brand) / 0.12) 42%, transparent 76%)",
          }}
          aria-hidden="true"
        />
        {/* Decorative side diamonds */}
        <div className="pointer-events-none absolute left-6 top-1/3 hidden h-2 w-2 rotate-45 bg-primary/45 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-6 top-1/3 hidden h-2 w-2 rotate-45 bg-primary/45 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute left-10 bottom-24 hidden h-1.5 w-1.5 rotate-45 bg-primary/35 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-10 bottom-24 hidden h-1.5 w-1.5 rotate-45 bg-primary/35 lg:block" aria-hidden="true" />

        <div className="container relative pt-10 pb-16 lg:pt-14 lg:pb-24">
          {/* Tagline above name */}
          <p className="text-center text-xs font-medium uppercase tracking-[0.42em] text-primary sm:text-sm">
            Финансовый брокер · Эксперт · Стратег · Наставник
          </p>

          {/* Composition stage */}
          <div className="relative mt-5 lg:mt-7">
            {/* Huge name behind the figure */}
            <h1
              aria-label="Данис Гарипов"
              className="pointer-events-none relative z-0 select-none text-center font-extrabold uppercase leading-[0.85] tracking-tight"
              style={{ letterSpacing: "-0.04em" }}
            >
              <span className="block bg-gradient-to-b from-foreground via-foreground/85 to-foreground/30 bg-clip-text text-[19vw] text-transparent drop-shadow-[0_4px_18px_hsl(0_0%_0%/0.45)] sm:text-[15.5vw] lg:text-[12vw]">
                ДАНИС
              </span>
              <span className="mt-[-0.12em] block bg-gradient-to-b from-foreground via-foreground/80 to-foreground/25 bg-clip-text text-[17vw] text-transparent drop-shadow-[0_4px_18px_hsl(0_0%_0%/0.45)] sm:text-[13.5vw] lg:text-[11vw]">
                ГАРИПОВ
              </span>
            </h1>

            {/* Figure in front — overlaps lower portion of the name */}
            <div className="pointer-events-none absolute inset-x-0 top-[16%] z-10 flex justify-center">
              <img
                src={danisHero}
                alt="Данис Гарипов — финансовый брокер"
                className="h-[360px] w-auto object-contain object-top drop-shadow-[0_34px_68px_hsl(0_0%_0%/0.84)] sm:h-[580px] lg:h-[740px]"
                loading="eager"
              />
            </div>

            {/* Reserve vertical space for figure */}
            <div aria-hidden="true" className="h-[350px] sm:h-[540px] lg:h-[680px]" />

            {/* Side info panels — flank the figure on lg, stack on mobile */}
            <div className="relative z-20 mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:absolute lg:inset-x-0 lg:top-[58%] lg:mt-0 lg:grid-cols-[minmax(180px,220px)_1fr_minmax(180px,220px)] lg:gap-6 lg:px-4">
              <div className="rounded-md border border-primary/45 bg-background/80 p-3 text-left shadow-soft backdrop-blur-md sm:p-5 lg:col-start-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">О сервисе</p>
                <p className="mt-2 text-xs leading-5 text-foreground/90 sm:text-sm sm:leading-6">
                  Финансовый брокер с многолетним опытом структурирования сделок и работы со сложными ситуациями.
                </p>
              </div>
              <div className="hidden lg:block lg:col-start-2" aria-hidden="true" />
              <div className="rounded-md border border-primary/45 bg-background/80 p-3 text-left shadow-soft backdrop-blur-md sm:p-5 lg:col-start-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">Подход</p>
                <p className="mt-2 text-xs leading-5 text-foreground/90 sm:text-sm sm:leading-6">
                  Решения под конкретную задачу, сумму и срок.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs — sit just under the figure, like reference */}
          <div className="relative z-30 mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-10">
            <Button asChild variant="hero" size="xl" className="min-w-[250px]">
              <a href="#services">Мои услуги</a>
            </Button>
          </div>

          <p className="relative z-30 mx-auto mt-7 max-w-2xl text-center text-xs uppercase tracking-[0.32em] text-primary sm:text-sm">
            Финансовая экосистема, где каждый получает своё
          </p>
        </div>
      </section>


      <section id="services" className="section-dark section-spacious">
        <div className="container">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="section-kicker">Основные направления</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.slug} className="group flex flex-col rounded-lg border border-border/70 bg-surface-soft/55 p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:border-primary/50 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-primary/35 bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="flex flex-wrap items-center gap-2 text-2xl font-semibold">
                    <span>{service.title}</span>
                    {service.comingSoon && (
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-secondary-foreground">СКОРО</span>
                    )}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{service.shortDescription}</p>
                {service.bullets && (
                  <ul className="mt-4 space-y-2">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-base leading-7 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="soft" className="flex-1 justify-between">
                    <Link to={`/services/${service.slug}`}>
                      Подробнее
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 justify-between">
                    {service.primaryCtaHref ? (
                      <Link to={`/services/${service.slug}#service-form`}>
                        Оставить заявку
                        <ArrowRight />
                      </Link>
                    ) : (
                      <a href="#lead-form">
                      Оставить заявку
                      <ArrowRight />
                      </a>
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        </div>
      </section>

      <section className="section-graphite">
        <div className="container py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="space-y-3">
              <p className="section-kicker">Как мы работаем</p>
              <h2 className="text-4xl font-semibold text-balance sm:text-5xl">Прямой и понятный путь от обращения до решения.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step} className="rounded-lg border border-border/70 bg-background/65 p-5 backdrop-blur-sm">
                  <p className="text-base text-primary">0{index + 1}</p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="analysis" className="section-dark section-spacious">
        <div className="container">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-3">
            <p className="section-kicker">Финансовые разборы</p>
            <h2 className="text-4xl font-semibold text-balance sm:text-5xl">Выберите формат разбора под глубину вашей финансовой задачи.</h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              От первого знакомства с ситуацией до глубокой персональной стратегии: каждый формат помогает шире посмотреть на деньги и выбрать следующий шаг.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {analysisPoints.slice(0, 3).map((point) => (
              <div key={point} className="rounded-lg border border-border/70 bg-surface-soft/70 p-5 text-base leading-7 text-muted-foreground">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          {financialReviewTariffs.map((tariff) => (
            <article
              key={tariff.id}
              data-service={tariff.integrationPayload.service}
              data-tariff={tariff.integrationPayload.tariff}
              data-source={tariff.integrationPayload.source}
              className="flex h-full flex-col rounded-lg border border-border/70 bg-surface-elevated/65 p-6 shadow-soft sm:p-7"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold sm:text-3xl">{tariff.title}</h3>
                  <p className="rounded-md border border-primary/35 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {tariff.price}
                  </p>
                </div>
                {tariff.note && (
                  <p className="inline-flex rounded-md border border-border/70 bg-background/45 px-3 py-2 text-sm leading-5 text-muted-foreground">
                    {tariff.note}
                  </p>
                )}
                <p className="text-base italic leading-7 text-muted-foreground">
                  {tariff.description}
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Button asChild variant={tariff.id === "mini" ? "hero" : "soft"} size="xl" className="h-auto min-h-12 w-full whitespace-normal text-center">
                  <a
                    href={tariff.href}
                    target={tariff.href.startsWith("http") ? "_blank" : undefined}
                    rel={tariff.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {tariff.buttonLabel}
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-8 rounded-lg border border-border/70 bg-surface-soft/70 p-5 text-base leading-7 text-muted-foreground">
          <p>
            Финансовые разборы не являются финансовой, инвестиционной или юридической рекомендацией и не заменяют индивидуальную консультацию профильного специалиста. Практические решения по кредитованию, займам, возвратам и другим направлениям обсуждаются отдельно после анализа вашей ситуации.
          </p>
          <p className="mt-3 text-sm leading-6">
            Архитектурно блок подготовлен к дальнейшей интеграции нового Telegram-бота через связку service/tariff/source, но на этом этапе новый бот не разрабатывается. Существующий @finance_razbor_bot продолжает использоваться только для проверки подписки и выдачи кода доступа к бесплатному формату.
          </p>
        </div>


        <div id="quiz" className="scroll-mt-24">
          <div className="mb-5 space-y-3">
            <p className="section-kicker">Мини-опрос перед разбором</p>
            <h3 className="text-3xl font-semibold text-balance sm:text-4xl">
              Ответьте на 7 коротких вопросов — подготовим финансовый мини-разбор
            </h3>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Посмотрим, что сейчас влияет на вашу финансовую ситуацию, где могут быть внутренние ограничения и какой первый шаг стоит сделать бережно и осознанно.
            </p>
          </div>
          <CustdevQuiz scrollTargetId="lead-form" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-surface-soft/70 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Форматы</p>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Первый мини-разбор доступен бесплатно за подписку на канал. Более глубокий персональный разбор можно будет заказать отдельно после первичной диагностики.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Сноска: мини-разбор проводится в нумерологическом формате и помогает шире посмотреть на финансовую ситуацию.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-soft/70 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Обратите внимание</p>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Финансовый мини-разбор не является финансовой или юридической рекомендацией. Это символический формат, который помогает посмотреть на ситуацию шире и сформулировать следующий шаг. Практические финансовые решения Данис оказывает как финансовый брокер — отдельно от мини-разбора.
              </p>
            </div>
          </div>
        </div>

        </div>
      </section>

      <section className="section-graphite">
        <div className="container py-14 lg:py-20">
          <div className="mb-8 max-w-3xl space-y-3">
            <p className="section-kicker">Почему мне доверяют</p>
            <h2 className="text-3xl font-semibold leading-snug text-balance sm:text-4xl">
              Данис Гарипов — финансовый брокер с многолетним опытом, который структурирует сделки, соединяет нужных людей и выстраивает финансовое решение под конкретную задачу, сумму и срок.
            </h2>
          </div>
        </div>
      </section>


      {/* Editorial portrait block — inspired by the reference bottom block */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background py-16 text-foreground lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.72)_60%,hsl(var(--background))_100%)]" aria-hidden="true" />

        <div className="container relative">
          <div className="mx-auto max-w-6xl rounded-lg border border-primary/25 bg-surface-elevated/88 p-6 text-foreground shadow-panel sm:p-8 lg:p-10">
            <div>
              <h2 className="font-extrabold uppercase leading-[0.85] tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>
                <span className="block text-[14vw] sm:text-[10vw] lg:text-[6.5vw]">ГАРИПОВ</span>
                <span className="block text-[12vw] text-primary sm:text-[8.5vw] lg:text-[5.5vw]">финансы</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Финансовый брокер с многолетним опытом структурирования сделок и работы со сложными ситуациями.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { v: "10+", l: ["лет в финансах"] },
                  { v: "500+", l: ["проведённых", "сделок"] },
                  { v: "Оперативная", l: ["обратная", "связь"] },
                  { v: "100%", l: ["по вашему запросу"] },
                  { v: "5+", l: ["направлений", "сервиса"] },
                  { v: "1×1", l: ["разбор ситуации"] },
                ].map((s) => (
                  <div key={s.l.join(" ")} className="rounded-lg border border-border/70 bg-background/70 px-1 py-3 text-center shadow-soft sm:p-4">
                    <p className="text-lg font-bold leading-none text-foreground sm:text-3xl">{s.v}</p>
                    <p className="mt-1 text-[10px] uppercase leading-tight tracking-tight text-muted-foreground break-words hyphens-auto sm:text-xs sm:tracking-wider">
                      {s.l.map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button asChild variant="hero" size="xl">
                  <a href="#lead-form">Записаться сейчас</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </section>



      <section className="section-dark section-spacious">
        <div className="container">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            <p className="section-kicker">Кому подходит</p>
            <h2 className="text-4xl font-semibold text-balance sm:text-5xl">Для людей, которым нужно улучшить финансовую ситуацию .</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audience.map((item) => (
              <div key={item} className="rounded-lg border border-border/70 bg-surface-soft/65 p-5 text-base leading-7 text-muted-foreground sm:text-lg">
                {item}
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section id="agent" className="section-graphite">
        <div className="container py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="section-kicker">Стать агентом</p>
              <h2 className="text-4xl font-semibold text-balance sm:text-5xl">Формат для тех, кто хочет зарабатывать в команде сильных экспертов финансового сервиса и работать на доверие.</h2>
              <p className="text-lg leading-8 text-muted-foreground">Это подходит тем, кто умеет выстраивать коммуникацию, ценит порядок в работе и хочет быть частью финансовой экосистемы.</p>
              <Button asChild variant="hero" size="xl">
                <a href="#lead-form">Оставить заявку</a>
              </Button>
            </div>
            <div className="grid gap-4">
              {agentReasons.map((item) => (
                <div key={item} className="rounded-lg border border-border/70 bg-background/70 p-5 text-base leading-7 text-muted-foreground backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="lead-form" className="section-graphite py-12 lg:py-16">
        <div className="container">
        <LeadForm
          title="Оставить заявку"
          description="Если у вас есть финансовая ситуация, которую нужно разобрать — оставьте контакт и запрос. Мы вернёмся с понятной логикой дальнейших действий."
        />
        </div>
      </section>

      <section id="contacts" className="section-dark">
        <div className="container grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div className="space-y-4">
            <p className="section-kicker">Контакты и форма</p>
            
            <div className="grid gap-3">
              {[
                {
                  icon: Send,
                  label: "Telegram-канал Даниса Гарипова",
                  value: "@garipovdanis",
                  href: "https://t.me/garipovdanis",
                },
                {
                  icon: MessageCircle,
                  label: "Канал в MAX",
                  value: "Если Telegram недоступен",
                  href: "https://max.ru/join/AyR7Opid1dNqTW_j70Y5fxCN4mEp_x8BvtziiucoDZ4",
                },
                {
                  icon: HandHelping,
                  label: "Связаться с менеджером",
                  value: "@Albina_assistent",
                  href: "https://t.me/Albina_assistent",
                },
              ].map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-border/70 bg-surface-soft p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-base text-foreground">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border/70 bg-surface-soft/60 p-4 backdrop-blur-sm transition-colors hover:border-primary/60"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className="rounded-lg border border-border/70 bg-surface-soft/60 p-4 backdrop-blur-sm">
                    {content}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
      <section className="section-graphite">
        <div className="container py-12 lg:py-16">
          <p className="section-kicker">Документы</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Правовая информация</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Политика обработки персональных данных", href: "/docs/politika-personalnyh-dannyh.docx" },
              { label: "Согласие на обработку персональных данных", href: "/docs/soglasie-personalnyh-dannyh.docx" },
              { label: "Согласие на получение рекламы", href: "/docs/soglasie-na-reklamu.docx" },
            ].map((doc) => (
              <Button key={doc.href} asChild variant="soft" className="h-auto justify-between whitespace-normal py-4 text-left">
                <a href={doc.href} target="_blank" rel="noreferrer">
                  <span className="text-sm leading-5">{doc.label}</span>
                  <ArrowRight className="shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-border/60 bg-background">
        <div className="container flex flex-col gap-3 py-6 text-sm leading-6 text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-medium text-foreground">ИП Гарипов Данис Дамирович</p>
            <p>ОГРНИП 323169000194615</p>
            <p>ИНН 166017353038</p>
          </div>
          <p className="max-w-md sm:text-right">
            © 2026 Финансовая экосистема. Данис Гарипов. Все права защищены.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
