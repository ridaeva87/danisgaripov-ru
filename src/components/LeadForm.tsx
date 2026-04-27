import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Заявка принята", {
      description: "Мы свяжемся с вами и разберём ситуацию предметно и спокойно.",
    });

    setForm({ name: "", contact: "", request: "" });
  };

  return (
    <form onSubmit={onSubmit} className="panel rounded-lg p-5 sm:p-6">
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

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">Фокус на вашей ситуации, сроках и реальном варианте решения.</p>
        <Button type="submit" variant="hero" size="xl">
          <Send />
          {ctaLabel}
          <ArrowRight />
        </Button>
      </div>
    </form>
  );
};