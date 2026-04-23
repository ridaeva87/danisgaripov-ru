import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheckBig } from "lucide-react";

import danisHero from "@/assets/danis-garipov-hero.png";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { services, servicesMap } from "@/data/services";

const ServicePage = () => {
  const { slug } = useParams();
  const service = slug ? servicesMap[slug] : undefined;

  useEffect(() => {
    if (service) {
      document.title = `${service.title} — Данис Гарипов`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [service]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const otherServices = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/70">
        <div className="container py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
        </div>
      </section>

      <section className="container grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-soft px-4 py-2 text-sm text-muted-foreground">
            <Icon className="size-4 text-primary" />
            Финансовое решение по направлению
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">{service.title}</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{service.heroDescription}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <a href="#service-form">Оставить заявку</a>
            </Button>
            <Button asChild variant="soft" size="xl">
              <a href="#service-form">Получить финансовый разбор</a>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-border/70 bg-surface-elevated shadow-panel">
          <div className="absolute inset-0 bg-gradient-accent opacity-10" />
          <img src={danisHero} alt="Данис Гарипов — финансовый сервис" className="h-full w-full object-cover object-center" loading="eager" />
        </div>
      </section>

      <section className="container grid gap-6 py-6 lg:grid-cols-3 lg:py-10">
        <div className="panel rounded-lg p-6 lg:col-span-1">
          <h2 className="text-2xl font-semibold">Кому подходит</h2>
          <ul className="mt-5 space-y-4">
            {service.suitableFor.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground sm:text-base">
                <CircleCheckBig className="mt-1 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel rounded-lg p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold">Как это работает</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {service.steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-border/70 bg-surface-soft p-5">
                <p className="text-sm text-primary">Шаг {index + 1}</p>
                <p className="mt-2 text-base leading-7 text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-6 lg:py-10">
        <div className="panel rounded-lg p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Короткий блок доверия</h2>
              <p className="text-base leading-7 text-muted-foreground">Данис Гарипов — это спокойный, взрослый подход к финансовым ситуациям, где важны ясность, порядок и понятное движение по шагам.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {service.trustPoints.map((point) => (
                <div key={point} className="rounded-lg border border-border/70 bg-surface-soft p-5 text-sm leading-6 text-muted-foreground">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="service-form" className="container py-6 lg:py-10">
        <LeadForm
          title={`Заявка по направлению «${service.title}»`}
          description="Оставьте контакт и коротко опишите ситуацию. В ответ вы получите предметный разбор и понятный следующий шаг без лишнего давления."
          ctaLabel="Отправить запрос"
        />
      </section>

      <section className="container py-6 lg:py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Другие направления</h2>
          <Button asChild variant="ghost">
            <Link to="/">Все услуги</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {otherServices.map((item) => {
            const ItemIcon = item.icon;
            return (
              <article key={item.slug} className="panel rounded-lg p-5">
                <div className="flex items-center gap-3 text-primary">
                  <ItemIcon className="size-5" />
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.shortDescription}</p>
                <Button asChild variant="soft" className="mt-5 w-full justify-between">
                  <Link to={`/services/${item.slug}`}>
                    Подробнее
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ServicePage;