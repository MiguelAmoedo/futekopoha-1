export function slugifyNome(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueJogadorSlug(
  nome: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugifyNome(nome) || "jogador";
  if (!(await exists(base))) return base;

  for (let i = 2; i < 100; i++) {
    const candidate = `${base}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }

  return `${base}-${Date.now()}`;
}
