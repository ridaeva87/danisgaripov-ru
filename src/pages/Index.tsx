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

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute right-[10%] top-24 hidden h-60 w-60 rounded-full bg-primary/10 blur-3xl lg:block lg:animate-pulse-glow" />
        <div className="container relative grid gap-10 py-12 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-soft px-4 py-2 text-sm text-muted-foreground">
              <BriefcaseBusiness className="size-4 text-primary" />
              Сервис финансовых решений
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-3xl font-bold uppercase leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Финансовая экосистема, где каждый получает своё
              </h1>
              <p className="max-w-2xl text-lg font-medium leading-snug text-foreground/90 sm:text-xl">
                Помогаем найти финансовое решение под вашу ситуацию.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <a href="#lead-form">Оставить заявку</a>
              </Button>
              <Button asChild variant="soft" size="xl">
                <a href="#analysis">Получить финансовый разбор</a>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "сервис для людей, которым нужен результат.",
                "быстрый разбор финансовой ситуации",
                "понятное движение по шагам",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-border/70 bg-surface-elevated/80 p-4 text-sm leading-6 text-muted-foreground shadow-soft backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
            <div className="absolute -inset-4 rounded-[28px] border border-primary/15 bg-primary/5 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-lg border border-border/70 bg-surface-elevated shadow-panel">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <img
                src={danisHero}
                alt="Данис Гарипов — финансовый сервис и финансовые решения"
                className="h-full min-h-[520px] w-full object-cover object-center"
                loading="eager"
              />
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
