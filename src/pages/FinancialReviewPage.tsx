import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { CustdevQuiz } from "@/components/CustdevQuiz";
import { Button } from "@/components/ui/button";

const FinancialReviewPage = () => {
  useEffect(() => {
    document.title = "Финансовый разбор — Данис Гарипов";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/70 bg-background">
        <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
          <Button asChild variant="soft">
            <Link to="/#analysis">К тарифам</Link>
          </Button>
        </div>
      </section>

      <section className="section-dark section-spacious">
        <div className="container">
          <div className="mb-6 space-y-3">
            <p className="section-kicker">Опрос перед финансовым разбором</p>
            <h1 className="max-w-5xl text-4xl font-semibold text-balance sm:text-5xl">
              Ответьте на 7 коротких вопросов — подготовим финансовый разбор
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Посмотрим, что сейчас влияет на вашу финансовую ситуацию, где могут быть внутренние ограничения и какой первый шаг стоит сделать бережно и осознанно.
            </p>
          </div>

          <CustdevQuiz scrollTargetId="financial-review-top" completionHref="/" completionButtonLabel="Вернуться на главную" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-surface-soft/70 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Форматы</p>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Первый финансовый разбор доступен бесплатно за подписку на канал. Более глубокий персональный разбор можно заказать отдельно после первичной диагностики.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Сноска: финансовый разбор проводится в нумерологическом формате и помогает шире посмотреть на финансовую ситуацию.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-soft/70 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Обратите внимание</p>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Финансовый разбор не является финансовой или юридической рекомендацией. Это символический формат, который помогает посмотреть на ситуацию шире и сформулировать следующий шаг. Практические финансовые решения Данис оказывает как финансовый брокер — отдельно от финансового разбора.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FinancialReviewPage;
