import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  HandHelping,
  HeartHandshake,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  Shield,
} from "lucide-react";

import danisHero from "@/assets/danis-garipov-hero.png";
import heroBackground from "@/assets/hero-background.jpg";
import { LeadForm } from "@/components/LeadForm";
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

const CHARITY_GOAL = 1_114_000;

const trustSignals = [
  {
    title: "Финансовые решения по сути",
    description: "Сложные ситуации собираются в понятную систему действий без лишнего шума.",
    icon: Scale,
  },
  {
    title: "Спокойная сильная подача",
    description: "Коммуникация строится ровно, предметно и с уважением к реальной ситуации человека.",
    icon: Shield,
  },
  {
    title: "Порядок на каждом этапе",
    description: "От первого обращения до запуска решения клиент понимает, что происходит и зачем.",
    icon: BadgeCheck,
  },
];

const agentReasons = ["для тех, кто умеет выстраивать доверие", "для тех, кто хочет вести людей к сильному сервису", "для тех, кому важен взрослый формат работы"];

const charityPoints = ["поддержка людей в сложной жизненной ситуации", "участие в полезных адресных инициативах", "взрослая позиция сервиса — не только решать, но и помогать"];

const formatRub = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";

const WaitlistButton = () => (
  <button
    type="button"
    onClick={() =>
      toast.success("Вы в листе ожидания", {
        description: "Сообщим, как только направление откроется.",
      })
    }
    className="group flex w-full flex-col items-center justify-center rounded-md bg-[#C8102E] px-4 py-2 text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#A50D26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]/60"
  >
    <span className="text-base font-bold uppercase tracking-wider leading-none">Waitlist</span>
    <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/85">вы в очереди</span>
  </button>
);

const Index = () => {
  const [charityRaised, setCharityRaised] = useState(0);

  useEffect(() => {
    document.title = "Данис Гарипов — финансовые решения";
  }, []);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCharityRaised(Math.round(CHARITY_GOAL * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
            <a href="#analysis" className="transition-colors hover:text-foreground">Финансовый разбор</a>
            <a href="#agent" className="transition-colors hover:text-foreground">Стать агентом</a>
            <a href="#charity" className="transition-colors hover:text-foreground">Благотворительность</a>
            <a href="#contacts" className="transition-colors hover:text-foreground">Контакты</a>
          </nav>
          <Button asChild variant="hero" className="hidden lg:inline-flex">
            <a href="#lead-form">Оставить заявку</a>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/60 bg-[#1E1E1E] text-[#FDFDFD]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E1E]/70 via-[#1E1E1E]/30 to-[#1E1E1E]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" aria-hidden="true" />

        <div className="container relative pt-10 pb-0 lg:pt-14">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-[#97965B] sm:text-xs">
            Финансовый брокер · Эксперт · Стратег
          </p>

          {/* Stage: big name behind, full-body photo in front, side panels on desktop */}
          <div className="relative mt-6 flex items-end justify-center min-h-[560px] sm:min-h-[640px] lg:min-h-[760px]">
            {/* Big name behind the photo */}
            <h1
              aria-label="Данис Гарипов"
              className="pointer-events-none absolute inset-x-0 top-[6%] select-none text-center font-bold uppercase leading-[0.85] tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="block text-[15vw] text-[#FDFDFD]/[0.08] sm:text-[13vw] lg:text-[11vw]">
                ДАНИС
              </span>
              <span className="mt-[-0.15em] block text-[12vw] text-[#97965B]/25 sm:text-[10vw] lg:text-[9vw]">
                ГАРИПОВ
              </span>
            </h1>

            {/* Soft ground shadow under feet */}
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-10 w-[55%] max-w-[520px] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
              aria-hidden="true"
            />

            {/* Photo in front — full body, bottom aligned */}
            <div className="relative z-10 flex w-full justify-center">
              <img
                src={danisHero}
                alt="Данис Гарипов — финансовый брокер"
                className="h-[520px] w-auto object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] sm:h-[600px] lg:h-[720px]"
                loading="eager"
              />
            </div>

            {/* Side info panels — desktop only */}
            <div className="pointer-events-none absolute left-0 top-[22%] hidden w-[24%] lg:block">
              <div className="pointer-events-auto rounded-md border border-[#97965B]/30 bg-[#1E1E1E]/80 p-5 backdrop-blur-md shadow-panel">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#97965B]">О сервисе</p>
                <p className="mt-2 text-sm leading-6 text-[#FDFDFD]/90">
                  Финансовый брокер с многолетним опытом структурирования сделок.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute right-0 top-[22%] hidden w-[24%] lg:block">
              <div className="pointer-events-auto rounded-md border border-[#97965B]/30 bg-[#1E1E1E]/80 p-5 backdrop-blur-md shadow-panel">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#97965B]">Подход</p>
                <p className="mt-2 text-sm leading-6 text-[#FDFDFD]/90">
                  Решения под конкретную задачу, сумму и срок.
                </p>
              </div>
            </div>
          </div>

          {/* Tablet/mobile side panels stacked below */}
          <div className="mt-8 lg:hidden">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[#97965B]/30 bg-[#1E1E1E]/80 p-4 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#97965B]">О сервисе</p>
                <p className="mt-2 text-sm leading-6 text-[#FDFDFD]/90">
                  Финансовый брокер с многолетним опытом структурирования сделок.
                </p>
              </div>
              <div className="rounded-md border border-[#97965B]/30 bg-[#1E1E1E]/80 p-4 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#97965B]">Подход</p>
                <p className="mt-2 text-sm leading-6 text-[#FDFDFD]/90">
                  Решения под конкретную задачу, сумму и срок.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-10 pb-14 text-center lg:pb-20">
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#FDFDFD]/85 sm:text-lg">
              <span className="block text-xs uppercase tracking-[0.3em] text-[#97965B] sm:text-sm">
                Финансовая экосистема, где каждый получает своё
              </span>
              <span className="mt-3 block">
                Помогаем найти финансовое решение под вашу ситуацию.
              </span>
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <a href="#lead-form">Оставить заявку</a>
              </Button>
              <Button asChild size="xl" className="border border-[#FDFDFD]/20 bg-[#2E2430] text-[#FDFDFD] hover:bg-[#2E2430]/80">
                <a href="#services">Мои услуги</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container py-14 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Основные направления</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.slug} className="panel group flex flex-col rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-border/70 bg-surface-soft p-3 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {service.title}
                    {service.comingSoon && (
                      <span className="ml-2 align-middle text-xs font-medium uppercase tracking-wider text-primary">скоро</span>
                    )}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{service.shortDescription}</p>
                {service.bullets && (
                  <ul className="mt-4 space-y-2">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
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
                    <a href="#lead-form">
                      Оставить заявку
                      <ArrowRight />
                    </a>
                  </Button>
                </div>
                <div className="mt-3">
                  <WaitlistButton />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface-elevated/50">
        <div className="container py-14 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.16em] text-primary">Как мы работаем</p>
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Прямой и понятный путь от обращения до решения.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step} className="rounded-lg border border-border/70 bg-background/70 p-5 backdrop-blur-sm">
                  <p className="text-sm text-primary">0{index + 1}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="analysis" className="container py-14 lg:py-20">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Финансовый разбор / прогноз ситуации</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Первый шаг, чтобы навести ясность в своей финансовой ситуации.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "где вы находитесь сейчас",
              "какие варианты решения реально доступны",
              "с какого шага лучше начинать",
            ].map((point) => (
              <div key={point} className="rounded-lg border border-border/70 bg-surface-soft p-5 text-sm leading-6 text-muted-foreground">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 panel rounded-lg p-6 sm:p-8">
          <h3 className="text-xl font-semibold sm:text-2xl">На финансовом разборе можно посмотреть:</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {analysisPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 rounded-md border border-border/60 bg-surface-soft/60 p-4 text-sm leading-6 text-muted-foreground sm:text-base">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8 panel flex flex-col items-start gap-4 rounded-lg border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Бесплатный финансовый разбор</p>
            <p className="text-lg font-semibold text-foreground sm:text-xl">
              Чтобы получить бесплатный финансовый разбор — подпишись на соцсети
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero">
              <a href="#" target="_blank" rel="noreferrer">Telegram</a>
            </Button>
            <Button asChild variant="soft">
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
            </Button>
            <Button asChild variant="soft">
              <a href="#" target="_blank" rel="noreferrer">YouTube</a>
            </Button>
          </div>
        </div>

        <LeadForm
          title="Получить финансовый разбор"
          description="Оставьте имя, контакт и короткий запрос. После финансового разбора вы поймёте, что сейчас происходит с вашей финансовой ситуацией, где у вас слабое место и какой следующий шаг поможет увеличить доход и навести порядок в деньгах."
          compact
          ctaLabel="Получить финансовый разбор"
          contactPlaceholder="Ссылка на ваш Тг личный или на Max"
        />
      </section>

      <section className="border-y border-border/60 bg-surface-elevated/40">
        <div className="container py-14 lg:py-20">
          <div className="mb-8 max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Почему мне доверяют</p>
            <h2 className="text-2xl font-semibold leading-snug text-balance sm:text-3xl">
              Данис Гарипов — финансовый брокер с многолетним опытом, который структурирует сделки, соединяет нужных людей и выстраивает финансовое решение под конкретную задачу, сумму и срок.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {trustSignals.map(({ title, description, icon: Icon }) => (
              <article key={title} className="panel rounded-lg p-6">
                <div className="inline-flex rounded-md border border-border/70 bg-surface-soft p-3 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Кому подходит</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Для людей, которым нужно улучшить финансовую ситуацию .</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audience.map((item) => (
              <div key={item} className="rounded-lg border border-border/70 bg-surface-soft p-5 text-sm leading-6 text-muted-foreground sm:text-base">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agent" className="border-y border-border/60 bg-surface-elevated/40">
        <div className="container py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.16em] text-primary">Стать агентом</p>
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Формат для тех, кто хочет зарабатывать в команде сильных экспертов финансового сервиса и работать на доверие.</h2>
              <p className="text-base leading-7 text-muted-foreground">Это подходит тем, кто умеет выстраивать коммуникацию, ценит порядок в работе и хочет быть частью финансовой экосистемы.</p>
              <Button asChild variant="hero" size="xl">
                <a href="#lead-form">Оставить заявку</a>
              </Button>
            </div>
            <div className="grid gap-4">
              {agentReasons.map((item) => (
                <div key={item} className="rounded-lg border border-border/70 bg-background/70 p-5 text-sm leading-6 text-muted-foreground backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="charity" className="container py-14 lg:py-20">
        <div className="panel rounded-lg p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-soft px-4 py-2 text-sm text-muted-foreground">
                <HeartHandshake className="size-4 text-primary" />
                Благотворительность
              </div>
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Отдельное направление, в котором важны участие, внимание и реальная польза.</h2>
              <p className="text-base leading-7 text-muted-foreground">
                Финансовый сервис может быть сильным и при этом человечным. Благотворительное направление показывает ценности проекта и то, что за ним стоят не только деньги и задачи, но и внутренняя основа.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#lead-form"
                  className="inline-flex flex-col items-center justify-center rounded-md bg-[#C8102E] px-8 py-3 text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#A50D26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]/60"
                >
                  <span className="text-lg font-bold uppercase tracking-wider leading-none">Участвовать</span>
                  <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/85">внести вклад</span>
                </a>
                <Button asChild variant="soft" size="xl">
                  <a href="#lead-form">Связаться по разделу</a>
                </Button>
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-primary">Уже собрано на благотворительность</p>
                <p className="mt-3 text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
                  {formatRub(charityRaised)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Счётчик отражает суммарные взносы, направленные через сервис.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {charityPoints.map((item) => (
                  <div key={item} className="rounded-lg border border-border/70 bg-surface-soft p-5 text-sm leading-6 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lead-form" className="container py-6 lg:py-10">
        <LeadForm
          title="Оставить заявку"
          description="Если у вас есть финансовая ситуация, которую нужно разобрать — оставьте контакт и запрос. Мы вернёмся с понятной логикой дальнейших действий."
        />
      </section>

      <section id="contacts" className="border-t border-border/60 bg-surface-elevated/45">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:py-18">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Контакты и форма</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Связь без лишних кругов — через заявку, удобный контакт и понятный запрос.</h2>
            <div className="grid gap-3">
              {[
                { icon: Phone, label: "Телефон", value: "Связь по заявке" },
                { icon: Mail, label: "Email", value: "Ответ на указанный контакт" },
                { icon: MessageCircle, label: "Мессенджеры", value: "Telegram / WhatsApp по обращению" },
                { icon: HandHelping, label: "Режим работы", value: "Предметный разбор по вашему запросу" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg border border-border/70 bg-background/70 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-border/70 bg-surface-soft p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-base text-foreground">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LeadForm
            title="Форма связи"
            description="Оставьте ваш способ связи и коротко обозначьте задачу. Мы вернёмся к вам с ясным и спокойным предложением следующего шага."
            ctaLabel="Отправить заявку"
          />
        </div>
      </section>
    </main>
  );
};

export default Index;
