import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TELEGRAM_BOT_TOKEN = "8633522720:AAESZq9pqUjROVediUOC88ULuUA9wmkyeNM";
const TELEGRAM_CHAT_ID = "658189023";

type Step = {
  question: string;
  options: string[];
};

const STEPS: Step[] = [
  {
    question: "Что сейчас для вас актуально?",
    options: [
      "Нужны деньги на развитие бизнеса",
      "Нужны деньги на личные цели",
      "Хочу закрыть кредиты и снизить нагрузку",
      "Ищу инвестора",
      "Хочу выгодно вложить деньги",
      "Нужна помощь в сложной финансовой ситуации",
      "Другое",
    ],
  },
  {
    question: "Какая сейчас главная финансовая проблема?",
    options: [
      "Не хватает оборотных средств",
      "Высокие платежи по кредитам",
      "Банки отказывают",
      "Не знаю, где найти финансирование",
      "Есть деньги, но не понимаю, куда вложить",
      "Не могу выйти на новый уровень дохода",
      "Другое",
    ],
  },
  {
    question: "Если бы эту проблему удалось решить, что бы изменилось в первую очередь?",
    options: [
      "Увеличил(а) доход",
      "Масштабировал(а) бизнес",
      "Закрыл(а) долги",
      "Купил(а) недвижимость",
      "Купил(а) автомобиль",
      "Начал(а) инвестировать",
      "Стало бы спокойнее жить",
    ],
  },
  {
    question: "Какая сумма сейчас для вас наиболее актуальна?",
    options: [
      "До 500 000 ₽",
      "500 000 – 1 млн ₽",
      "1–5 млн ₽",
      "5–10 млн ₽",
      "Более 10 млн ₽",
    ],
  },
  {
    question: "Есть ли у вас имущество, которое можно использовать в финансовых решениях?",
    options: [
      "Недвижимость",
      "Автомобиль",
      "Коммерческая недвижимость",
      "Бизнес",
      "Нет имущества",
      "Не знаю",
    ],
  },
  {
    question: "Пробовали ли вы уже решить этот вопрос?",
    options: [
      "Да, обращался в банки",
      "Да, искал инвесторов",
      "Да, обращался к брокерам",
      "Пока не пробовал",
      "Свой вариант",
    ],
  },
  {
    question: "Насколько срочно нужно решить вопрос?",
    options: [
      "Сегодня",
      "В течение недели",
      "В течение месяца",
      "Просто изучаю варианты",
    ],
  },
];

const TOTAL_STEPS = 8;

type CustdevQuizProps = {
  scrollTargetId: string;
};

export const CustdevQuiz = ({ scrollTargetId }: CustdevQuizProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(STEPS.length).fill(""));
  const [contact, setContact] = useState({ name: "", phone: "", telegram: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const selectOption = (value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = value;
      return next;
    });
    if (step < STEPS.length) {
      setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), 150);
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));

  const handleSubmit = async () => {
    if (!contact.name.trim() || !contact.phone.trim()) {
      toast.error("Заполните имя и телефон");
      return;
    }
    if (!agree) {
      toast.error("Подтвердите согласие на обработку персональных данных");
      return;
    }

    setLoading(true);
    try {
      const tgText =
        `🧩 Новая заявка из квиза (кастдэв)\n\n` +
        `👤 Имя: ${contact.name || "—"}\n` +
        `📞 Телефон: ${contact.phone || "—"}\n` +
        `💬 Telegram: ${contact.telegram || "—"}\n\n` +
        STEPS.map(
          (s, i) => `${i + 1}. ${s.question}\n→ ${answers[i] || "—"}`,
        ).join("\n\n");

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: tgText,
          }),
        }
      );

      setDone(true);
    } catch (error) {
      console.error("Quiz submit error", error);
      toast.error("Не удалось отправить ответы", {
        description: "Проверьте интернет-соединение и попробуйте снова.",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (done) {
    return (
      <div className="panel rounded-lg p-6 sm:p-10 text-center">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-balance sm:text-3xl">Спасибо</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          На основе ваших ответов мы подготовим предварительный финансовый разбор
          и подскажем возможные варианты решения вашей ситуации.
        </p>
        <div className="mt-6 flex justify-center">
          <Button variant="hero" size="xl" onClick={scrollToForm}>
            👉 Получить финансовый разбор
            <ArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  const isContactStep = step === STEPS.length;
  const currentStep = STEPS[step];

  return (
    <div className="panel rounded-lg p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Шаг {step + 1} из {TOTAL_STEPS}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="mb-7 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isContactStep ? (
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold text-balance sm:text-3xl">
            Куда отправить результаты финансового разбора?
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Оставьте контакты — мы свяжемся с вами и обсудим результаты.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              required
              placeholder="Ваше имя"
              value={contact.name}
              onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
              className="h-12 border-border/80 bg-surface-soft"
            />
            <Input
              required
              type="tel"
              placeholder="Телефон"
              value={contact.phone}
              onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
              className="h-12 border-border/80 bg-surface-soft"
            />
            <Input
              placeholder="Telegram"
              value={contact.telegram}
              onChange={(e) => setContact((p) => ({ ...p, telegram: e.target.value }))}
              className="h-12 border-border/80 bg-surface-soft sm:col-span-2"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="quiz-agree"
              checked={agree}
              onCheckedChange={(v) => setAgree(v === true)}
              className="mt-1"
            />
            <Label
              htmlFor="quiz-agree"
              className="text-sm leading-6 text-muted-foreground font-normal cursor-pointer"
            >
              Я согласен на{" "}
              <a
                href="/docs/politika-personalnyh-dannyh.docx"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                обработку персональных данных
              </a>
            </Label>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="soft" onClick={goBack} disabled={loading}>
              <ArrowLeft />
              Назад
            </Button>
            <Button
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={loading || !agree}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              {loading ? "Отправляем…" : "Отправить"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold text-balance sm:text-[28px] sm:leading-tight">
            {currentStep.question}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentStep.options.map((option) => {
              const selected = answers[step] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`group flex items-center justify-between gap-3 rounded-md border px-4 py-4 text-left text-sm leading-6 transition-all sm:text-base ${
                    selected
                      ? "border-primary bg-primary/10 text-foreground shadow-glow"
                      : "border-border/70 bg-surface-soft text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  <span>{option}</span>
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-background"
                    }`}
                  >
                    {selected && <Check className="size-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="soft" onClick={goBack} disabled={step === 0}>
              <ArrowLeft />
              Назад
            </Button>
            <Button
              variant="hero"
              onClick={goNext}
              disabled={!answers[step]}
            >
              Далее
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
