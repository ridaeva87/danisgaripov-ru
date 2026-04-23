import { useEffect } from "react";
import { Link } from "react-router-dom";
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
  "Мы изучаем вашу ситуацию",
  "Уточняем детали",
  "Предлагаем вариант решения",
  "Запускаем работу по вашему направлению",
];

const audience = [
  "если есть сложности с кредитованием",
  "если нужно улучшить кредитную историю",
  "если хотите вернуть страховку",
  "если нужен быстрый финансовый выход",
  "если хотите срочно продать авто",
];

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

const Index = () => {
  useEffect(() => {
    document.title = "Данис Гарипов — финансовые решения";
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
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
                Понятные финансовые решения, когда ситуация требует взрослого и сильного подхода.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Данис Гарипов — лицо сервиса, где человек быстро понимает, с чем сюда можно прийти, как будет выстроена работа и какой следующий шаг сделать прямо сейчас.
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
                "строгий и спокойный сервис",
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
            <h2 className="max-w-3xl text-3xl font-semibold text-balance sm:text-4xl">Финансовые услуги, в которых важны порядок, ясность и правильная подача ситуации.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Каждое направление оформлено как отдельная услуга со своей страницей, понятным сценарием работы и формой обращения.</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.slug} className="panel group rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-border/70 bg-surface-soft p-3 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{service.shortDescription}</p>
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
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Финансовый разбор / прогноз ситуации</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Не просто форма обратной связи, а полезный первый шаг к ясному финансовому сценарию.</h2>
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

        <LeadForm
          title="Получить финансовый разбор"
          description="Оставьте имя, контакт и короткий запрос. Мы разберём вашу ситуацию как финансовую задачу: спокойно, предметно и с фокусом на следующий разумный шаг."
          compact
          ctaLabel="Получить финансовый разбор"
        />
      </section>

      <section className="border-y border-border/60 bg-surface-elevated/40">
        <div className="container py-14 lg:py-20">
          <div className="mb-8 max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.16em] text-primary">Почему мне доверяют</p>
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Данис Гарипов — про порядок в сложной финансовой ситуации, спокойную силу и работу по делу.</h2>
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
            <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Для людей, которым нужен ясный финансовый путь без перегруза и сомнительного тона.</h2>
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
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Формат для тех, кто хочет приводить людей в сильный финансовый сервис и работать на доверии.</h2>
              <p className="text-base leading-7 text-muted-foreground">Это подходит тем, кто умеет выстраивать коммуникацию, ценит порядок в работе и хочет быть частью зрелого финансового сервиса.</p>
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
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">Отдельное направление, в котором важны участие, уважение к людям и реальная польза.</h2>
              <p className="text-base leading-7 text-muted-foreground">Финансовый сервис может быть сильным и при этом человечным. Благотворительное направление подчёркивает взрослую позицию проекта и его внутренний порядок.</p>
              <Button asChild variant="soft" size="xl">
                <a href="#lead-form">Связаться по разделу</a>
              </Button>
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
      </section>

      <section id="lead-form" className="container py-6 lg:py-10">
        <LeadForm
          title="Оставить заявку"
          description="Если у вас есть финансовая ситуация, которую нужно разобрать без лишнего шума — оставьте контакт и запрос. Мы вернёмся с понятной логикой дальнейших действий."
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
