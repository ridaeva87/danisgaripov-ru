import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Send } from "lucide-react";

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
};

export const LeadForm = ({
  title,
  description,
  compact = false,
  ctaLabel = "Оставить заявку",
  contactPlaceholder = "Телефон или email",
}: LeadFormProps) => {
  const [form, setForm] = useState({ name: "", contact: "", request: "" });
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agree) {
      toast.error("Подтвердите согласие на обработку персональных данных");
      return;
    }

    toast.success("Заявка принята", {
      description: "Мы свяжемся с вами и разберём ситуацию предметно и спокойно.",
    });

    setForm({ name: "", contact: "", request: "" });
    setAgree(false);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <form onSubmit={onSubmit} className="panel relative rounded-lg p-5 sm:p-6">
      <div className="mb-5 space-y-2">
        <h3 className="text-2xl font-semibold text-balance">{title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      </div>

      <div className={`grid gap-4 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        <Input
          required
          placeholder="Ваше имя"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="h-12 border-border/80 bg-surface-soft"
        />
        <Input
          required
          placeholder={contactPlaceholder}
          value={form.contact}
          onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
          className="h-12 border-border/80 bg-surface-soft"
        />
        <Textarea
          required
          placeholder="Коротко опишите вашу финансовую ситуацию"
          value={form.request}
          onChange={(event) => setForm((prev) => ({ ...prev, request: event.target.value }))}
          className={`min-h-32 border-border/80 bg-surface-soft ${compact ? "lg:col-span-3" : "lg:col-span-2"}`}
        />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <Checkbox
          id={`agree-${title}`}
          checked={agree}
          onCheckedChange={(value) => setAgree(value === true)}
          className="mt-1"
        />
        <Label htmlFor={`agree-${title}`} className="text-sm leading-6 text-muted-foreground font-normal cursor-pointer">
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
        <p className="text-sm leading-6 text-muted-foreground">Фокус на вашей ситуации, сроках и реальном варианте решения.</p>
        <Button type="submit" variant="hero" size="xl" disabled={!agree}>
          <Send />
          {ctaLabel}
          <ArrowRight />
        </Button>
      </div>

      {submitted && (
        <div className="mt-5 flex animate-in fade-in slide-in-from-bottom-2 flex-col items-center justify-center rounded-md bg-[#C8102E] px-4 py-3 text-white shadow-soft">
          <span className="text-base font-bold uppercase tracking-wider leading-none">Waitlist</span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/85">вы в очереди</span>
        </div>
      )}
    </form>
  );
};
