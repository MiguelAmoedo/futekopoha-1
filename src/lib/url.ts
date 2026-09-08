export function absoluteUrl(path: string, origin?: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (origin) return `${origin.replace(/\/$/, "")}${normalized}`;

  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";

  const base = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

export function whatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
