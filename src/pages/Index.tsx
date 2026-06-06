import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  HandHelping,
  HeartHandshake,
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

const CHARITY_GOAL = 1_114_000;


const agentReasons = ["для тех, кто умеет выстраивать доверие", "для тех, кто хочет вести людей к сильному сервису", "для тех, кому важен взрослый формат работы"];

const charityPoints = ["поддержка людей в сложной жизненной ситуации", "участие в полезных адресных инициативах", "взрослая позиция сервиса — не только решать, но и помогать"];

const formatRub = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";


const Index = () => {
  const [charityRaised, setCharityRaised] = useState(0);

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
            <a href="#analysis" className="transition-colors hover:text-foreground">Мини-разбор на таро</a>
            <a href="#agent" className="transition-colors hover:text-foreground">Стать агентом</a>
            <a href="#charity" className="transition-colors hover:text-foreground">Благотворительность</a>
            <a href="#contacts" className="transition-colors hover:text-foreground">Контакты</a>
          </nav>
          <Button asChild variant="hero" className="hidden lg:inline-flex">
            <a href="#lead-form">Оставить заявку</a>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/60 bg-[#0E0E0E] text-[#FDFDFD]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,14,0.55)_55%,#0E0E0E_100%)]" aria-hidden="true" />
        {/* Olive top spotlight */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[80%] w-[75%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(151,150,91,0.32) 0%, rgba(151,150,91,0.08) 40%, transparent 75%)",
          }}
          aria-hidden="true"
        />
        {/* Decorative side diamonds */}
        <div className="pointer-events-none absolute left-6 top-1/3 hidden h-2 w-2 rotate-45 bg-[#97965B]/40 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-6 top-1/3 hidden h-2 w-2 rotate-45 bg-[#97965B]/40 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute left-10 bottom-24 hidden h-1.5 w-1.5 rotate-45 bg-[#97965B]/30 lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-10 bottom-24 hidden h-1.5 w-1.5 rotate-45 bg-[#97965B]/30 lg:block" aria-hidden="true" />

        <div className="container relative pt-8 pb-12 lg:pt-12 lg:pb-20">
          {/* Tagline above name */}
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.45em] text-[#97965B] sm:text-xs">
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
              <span className="block bg-gradient-to-b from-[#FDFDFD] via-[#FDFDFD]/85 to-[#FDFDFD]/30 bg-clip-text text-[18vw] text-transparent drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-[15vw] lg:text-[11.5vw]">
                ДАНИС
              </span>
              <span className="mt-[-0.12em] block bg-gradient-to-b from-[#FDFDFD] via-[#FDFDFD]/80 to-[#FDFDFD]/25 bg-clip-text text-[16vw] text-transparent drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-[13vw] lg:text-[10.5vw]">
                ГАРИПОВ
              </span>
            </h1>

            {/* Figure in front — overlaps lower portion of the name */}
            <div className="pointer-events-none absolute inset-x-0 top-[16%] z-10 flex justify-center">
              <img
                src={danisHero}
                alt="Данис Гарипов — финансовый брокер"
                className="h-[420px] w-auto object-contain object-top drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] sm:h-[560px] lg:h-[720px]"
                loading="eager"
              />
            </div>

            {/* Reserve vertical space for figure */}
            <div aria-hidden="true" className="h-[400px] sm:h-[520px] lg:h-[660px]" />

            {/* Side info panels — flank the figure on lg, stack on mobile */}
            <div className="relative z-20 mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:absolute lg:inset-x-0 lg:top-[58%] lg:mt-0 lg:grid-cols-[minmax(180px,220px)_1fr_minmax(180px,220px)] lg:gap-6 lg:px-4">
              <div className="rounded-md border border-[#97965B]/35 bg-[#0E0E0E]/75 p-4 text-left backdrop-blur-md sm:p-5 lg:col-start-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#97965B]">О сервисе</p>
                <p className="mt-2 text-[13px] leading-5 text-[#FDFDFD]/90">
                  Финансовый брокер с многолетним опытом структурирования сделок и работы со сложными ситуациями.
                </p>
              </div>
              <div className="hidden lg:block lg:col-start-2" aria-hidden="true" />
              <div className="rounded-md border border-[#97965B]/35 bg-[#0E0E0E]/75 p-4 text-left backdrop-blur-md sm:p-5 lg:col-start-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#97965B]">Подход</p>
                <p className="mt-2 text-[13px] leading-5 text-[#FDFDFD]/90">
                  Решения под конкретную задачу, сумму и срок.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs — sit just under the figure, like reference */}
          <div className="relative z-30 mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-10">
            <Button asChild size="xl" className="min-w-[230px] border border-[#FDFDFD]/15 bg-[#2A2A2A] text-[#FDFDFD] hover:bg-[#1F1F1F]">
              <a href="#services">Мои услуги</a>
            </Button>
          </div>

          <p className="relative z-30 mx-auto mt-6 max-w-2xl text-center text-[11px] uppercase tracking-[0.32em] text-[#97965B] sm:text-xs">
            Финансовая экосистема, где каждый получает своё
          </p>
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
                  <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                    <span>{service.title}</span>
                    {service.comingSoon && (
                      <span className="rounded-md bg-[#C8102E] px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-white">СКОРО</span>
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
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Финансовый мини-разбор на картах таро</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Первый бережный шаг, чтобы шире посмотреть на свою финансовую ситуацию.</h2>
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
          <h3 className="text-xl font-semibold sm:text-2xl">Что вы получите в мини-разборе</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "символический взгляд на текущую финансовую ситуацию",
              "возможные внутренние ограничения и страхи",
              "подсказку, на что обратить внимание прямо сейчас",
              "первый бережный шаг к решению",
              "если нужна практическая помощь — рекомендацию, с каким финансовым направлением лучше обратиться к Данису",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 rounded-md border border-border/60 bg-surface-soft/60 p-4 text-sm leading-6 text-muted-foreground sm:text-base">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>


        <div id="quiz" className="scroll-mt-24">
          <div className="mb-5 space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Мини-опрос перед разбором на таро</p>
            <h3 className="text-2xl font-semibold text-balance sm:text-3xl">
              Ответьте на 7 коротких вопросов — подготовим финансовый мини-разбор на картах таро
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              С помощью карт таро мы посмотрим, что сейчас влияет на вашу финансовую ситуацию, где могут быть внутренние ограничения и какой первый шаг стоит сделать бережно и осознанно.
            </p>
          </div>
          <CustdevQuiz scrollTargetId="lead-form" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-surface-soft p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Форматы</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Первый мини-разбор доступен бесплатно за подписку на канал. Более глубокий персональный разбор можно будет заказать отдельно после первичной диагностики.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-soft p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Дисклеймер</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Финансовый мини-разбор на картах таро не является финансовой, юридической или инвестиционной рекомендацией. Это символический формат, который помогает посмотреть на ситуацию шире и сформулировать следующий шаг. Практические финансовые решения Данис оказывает как финансовый брокер — отдельно от мини-разбора.
              </p>
            </div>
          </div>
        </div>

      </section>

      <section className="border-y border-border/60 bg-surface-elevated/40">
        <div className="container py-14 lg:py-20">
          <div className="mb-8 max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Почему мне доверяют</p>
            <h2 className="text-2xl font-semibold leading-snug text-balance sm:text-3xl">
              Данис Гарипов — финансовый брокер с многолетним опытом, который структурирует сделки, соединяет нужных людей и выстраивает финансовое решение под конкретную задачу, сумму и срок.
            </h2>
          </div>
        </div>
      </section>


      {/* Editorial portrait block — inspired by the reference bottom block */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[#0E0E0E] py-14 text-[#FDFDFD] lg:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,14,0.7)_60%,#0E0E0E_100%)]" aria-hidden="true" />

        <div className="container relative">
          <div className="mx-auto max-w-6xl rounded-2xl border border-[#FDFDFD]/10 bg-[#F4F1EA] p-6 text-[#1E1E1E] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] sm:p-8 lg:p-10">
            <div>
              <h2 className="font-extrabold uppercase leading-[0.85] tracking-tight text-[#1E1E1E]" style={{ letterSpacing: "-0.03em" }}>
                <span className="block text-[14vw] sm:text-[10vw] lg:text-[6.5vw]">ГАРИПОВ</span>
                <span className="block text-[12vw] text-[#97965B] sm:text-[8.5vw] lg:text-[5.5vw]">финансы</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#1E1E1E]/75 sm:text-base">
                Финансовый брокер с многолетним опытом структурирования сделок и работы со сложными ситуациями.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { v: "7+", l: ["лет в финансах"] },
                  { v: "500+", l: ["проведённых", "сделок"] },
                  { v: "24/7", l: ["сопровождение"] },
                  { v: "100%", l: ["по вашему запросу"] },
                  { v: "5+", l: ["направлений", "сервиса"] },
                  { v: "1×1", l: ["разбор ситуации"] },
                ].map((s) => (
                  <div key={s.l.join(" ")} className="rounded-lg border border-[#1E1E1E]/10 bg-white px-1 py-2 text-center shadow-sm sm:p-4">
                    <p className="text-base font-bold leading-none text-[#1E1E1E] sm:text-2xl">{s.v}</p>
                    <p className="mt-1 text-[8px] uppercase leading-tight tracking-tight text-[#1E1E1E]/60 break-words hyphens-auto sm:text-[11px] sm:tracking-wider">
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
                <button
                  type="button"
                  className="inline-flex flex-col items-center justify-center rounded-md bg-[#C8102E] px-8 py-3 text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#A50D26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]/60"
                >
                  <span className="text-lg font-bold uppercase tracking-wider leading-none">Участвовать</span>
                  <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/85">внести вклад</span>
                </button>
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
                    className="rounded-lg border border-border/70 bg-background/70 p-4 backdrop-blur-sm transition-colors hover:border-primary/60"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className="rounded-lg border border-border/70 bg-background/70 p-4 backdrop-blur-sm">
                    {content}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
      <section className="border-t border-border/60 bg-surface-elevated/30">
        <div className="container py-10 lg:py-14">
          <p className="text-sm uppercase tracking-[0.16em] text-primary">Документы</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Правовая информация</h2>
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
    </main>
  );
};

export default Index;
