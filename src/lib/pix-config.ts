const DEFAULT_PIX_KEY = "92992087325";
const DEFAULT_MERCHANT_NAME = "miguel";
const DEFAULT_MERCHANT_CITY = "SAO PAULO";

export function getDefaultPixKey(): string {
  return process.env.PIX_KEY?.trim() || DEFAULT_PIX_KEY;
}

export function getDefaultMerchantName(): string {
  return process.env.PIX_MERCHANT_NAME?.trim() || DEFAULT_MERCHANT_NAME;
}

export function getDefaultMerchantCity(): string {
  return process.env.PIX_MERCHANT_CITY?.trim() || DEFAULT_MERCHANT_CITY;
}

/**
 * Normaliza chave PIX telefone para formato EMV (+55DDDNUMERO).
 * E-mail, CPF/CNPJ e chaves aleatórias são retornadas sem alteração.
 */
export function normalizePixKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return trimmed;

  if (trimmed.includes("@")) return trimmed;

  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 32) return trimmed;

  if (trimmed.startsWith("+")) return trimmed;

  if (digits.length === 11) return `+55${digits}`;

  if (digits.length === 13 && digits.startsWith("55")) return `+${digits}`;

  return trimmed;
}

export function resolvePixKey(agendaChavePix?: string | null): string {
  const key = agendaChavePix?.trim() || getDefaultPixKey();
  return normalizePixKey(key);
}

export function resolveMerchantName(agendaNome?: string | null): string {
  return agendaNome?.trim() || getDefaultMerchantName();
}

export function resolveMerchantCity(agendaCidade?: string | null): string {
  return agendaCidade?.trim() || getDefaultMerchantCity();
}
