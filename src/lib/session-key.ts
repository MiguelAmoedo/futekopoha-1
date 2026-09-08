/** Normaliza sessionKey para o unique composto (agendaId, nome, sessionKey). */
export function normalizeSessionKey(sessionKey?: string | null): string {
  return sessionKey?.trim() || "";
}
