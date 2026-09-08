const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(
  value: number | string | { toString(): string } | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "—";
  return brl.format(num);
}

export function formatDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function presencaLabel(status: string): string {
  switch (status) {
    case "VAI":
      return "Vou";
    case "NAO_VAI":
      return "Não vou";
    case "TALVEZ":
      return "Talvez";
    default:
      return status;
  }
}

export function presencaBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "VAI":
      return "default";
    case "NAO_VAI":
      return "destructive";
    case "TALVEZ":
      return "secondary";
    default:
      return "outline";
  }
}
