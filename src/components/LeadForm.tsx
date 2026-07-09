import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type LeadFormProps = {
  title: string;
  description: string;
  compact?: boolean;
  ctaLabel?: string;
  contactPlaceholder?: string;
  service?: string;
  telegramOnly?: boolean;
};

const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxb-6Z9chGABoxiOuwwopHJgl1FIpYoZ0ANhWaOLaSjCh8kBduWkYtPaipY47ttliWF/exec";


export const LeadForm = ({
  title,
  description,
  compact = false,
  ctaLabel = "Оставить заявку",
  contactPlaceholder = "Телефон",
  service,
  telegramOnly = false,
}: LeadFormProps) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    max: "",
    comment: "",
  });
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agree) {
      toast.error("Подтвердите согласие на обработку персональных данных");
      return;
    }

    setLoading(true);
    try {
      const serviceName = service ?? title;
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        telegram: form.telegram,
        max: form.max,
        service: serviceName,
        comment: form.comment,
      };

      if (telegramOnly) {
        const tgText =
          `🔔 Новая заявка — ${serviceName}\n\n` +
          `👤 Имя: ${form.name || "—"}\n` +
          `📞 Телефон: ${form.phone || "—"}\n` +
          `✉️ Email: ${form.email || "—"}\n` +
          `💬 Telegram: ${form.telegram || "—"}\n` +
          `💰 MAX: ${form.max || "—"}\n` +
          `📝 Комментарий: ${form.comment || "—"}`;

        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: tgText }),
        });
      } else {
        await fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      }

      toast.success("Заявка отправлена", {
        description:
          "Мы свяжемся с вами и разберём ситуацию предметно и спокойно.",
      });

      setForm({
        name: "",
        phone: "",
        email: "",
        telegram: "",
        max: "",
        comment: "",
      });
      setAgree(false);
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error("Lead submit error", error);
      toast.error("Не удалось отправить заявку", {
        description:
          "Проверьте интернет-соединение или напишите нам в мессенджер.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={onSubmit} className="relative rounded-lg border border-border/70 bg-surface-elevated/70 p-5 shadow-panel sm:p-7">
      <div className="mb-5 space-y-2">
        <h3 className="text-3xl font-semibold text-balance sm:text-4xl">{title}</h3>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      </div>

      <div className={`grid gap-4 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        <Input
          required
          placeholder="Ваше имя"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="h-14 border-border/80 bg-background/45 text-base"
        />
        <Input
          required
          type="tel"
          placeholder={contactPlaceholder}
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          className="h-14 border-border/80 bg-background/45 text-base"
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="h-14 border-border/80 bg-background/45 text-base"
        />
        <Input
          placeholder="Telegram"
          value={form.telegram}
          onChange={(event) => setForm((prev) => ({ ...prev, telegram: event.target.value }))}
          className="h-14 border-border/80 bg-background/45 text-base"
        />
        <Input
          placeholder="Желаемая сумма"
          value={form.max}
          onChange={(event) => setForm((prev) => ({ ...prev, max: event.target.value }))}
          className={`h-14 border-border/80 bg-background/45 text-base ${compact ? "" : "lg:col-span-2"}`}
        />
        <Textarea
          required
          placeholder="Коротко опишите вашу финансовую ситуацию"
          value={form.comment}
          onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
          className={`min-h-36 border-border/80 bg-background/45 text-base ${compact ? "lg:col-span-3" : "lg:col-span-2"}`}
        />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <Checkbox
          id={`agree-${title}`}
          checked={agree}
          onCheckedChange={(value) => setAgree(value === true)}
          className="mt-1"
        />
        <Label htmlFor={`agree-${title}`} className="text-base leading-7 text-muted-foreground font-normal cursor-pointer">
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

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-7 text-muted-foreground">Фокус на вашей ситуации, сроках и реальном варианте решения.</p>
        <Button type="submit" variant="hero" size="xl" disabled={!agree || loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
          {loading ? "Отправляем…" : ctaLabel}
          {!loading && <ArrowRight />}
        </Button>
      </div>

      {submitted && (
        <div className="mt-5 flex animate-in fade-in slide-in-from-bottom-2 flex-col items-center justify-center rounded-md bg-primary px-4 py-3 text-primary-foreground shadow-glow">
          <span className="text-base font-bold uppercase tracking-wider leading-none">Заявка принята</span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-primary-foreground/85">мы скоро свяжемся</span>
        </div>
      )}
    </form>
  );
};
