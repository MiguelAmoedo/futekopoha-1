import type { Metadata } from "next";
import { APP_NAME } from "@/lib/brand";
import type { Agenda, Jogador } from "@/lib/db";
import { absoluteUrl } from "@/lib/url";

function appBaseUrl(): string {
  return absoluteUrl("/").replace(/\/$/, "");
}

function formatAgendaDate(dataHora: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(dataHora);
}

export function generateAgendaMetadata(agenda: Agenda): Metadata {
  const baseUrl = appBaseUrl();
  const when = formatAgendaDate(agenda.dataHora);
  const local = agenda.local ? ` · ${agenda.local}` : "";

  return {
    title: `${agenda.titulo} | ${APP_NAME}`,
    description: `${when}${local}`,
    openGraph: {
      title: agenda.titulo,
      description: `${when}${local}`,
      siteName: APP_NAME,
      type: "website",
      locale: "pt_BR",
      images: [
        {
          url: `${baseUrl}/api/og/lista?agendaId=${agenda.id}`,
          width: 1200,
          height: 630,
          alt: `Lista de presença — ${agenda.titulo}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: agenda.titulo,
      description: `${when}${local}`,
      images: [`${baseUrl}/api/og/lista?agendaId=${agenda.id}`],
    },
  };
}

export function generateJogadorMetadata(
  jogador: Jogador & {
    estatistica?: {
      gols: number;
      pebols: number;
      premiosCount: number;
    } | null;
  },
): Metadata {
  const baseUrl = appBaseUrl();
  const stats = jogador.estatistica;
  const description = stats
    ? `${stats.gols} gols · ${stats.pebols} pebols · ${stats.premiosCount} prêmios`
    : `Perfil de ${jogador.nome}`;

  const ogUrl = `${baseUrl}/api/og/jogador/${jogador.slug}`;

  return {
    title: `${jogador.nome} | ${APP_NAME}`,
    description,
    openGraph: {
      title: jogador.nome,
      description,
      siteName: APP_NAME,
      type: "profile",
      locale: "pt_BR",
      images: [
        {
          url: ogUrl,
          width: 600,
          height: 900,
          alt: `Cartão do jogador ${jogador.nome}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: jogador.nome,
      description,
      images: [ogUrl],
    },
  };
}
