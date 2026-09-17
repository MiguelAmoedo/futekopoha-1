import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarIcon,
  LayoutGridIcon,
  ShieldIcon,
  TrophyIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/pebol/brand-logo";
import { PageShell, PitchCard } from "@/components/pebol/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  BRAND_ASSETS,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [{ url: BRAND_ASSETS.og, width: 1200, height: 630, alt: APP_NAME }],
  },
};

const steps = [
  { icon: CalendarIcon, text: "Cria a agenda no admin e manda o link no grupo" },
  { icon: UsersIcon, text: "Galera confirma VOU / NÃO VOU / TALVEZ" },
  { icon: TrophyIcon, text: "Lista online com PIX e status de pagamento" },
];

export default function HomePage() {
  return (
    <PageShell className="gap-0 px-0 py-0">
      <section className="pitch-hero flex flex-col items-center gap-6 px-4 pb-10 pt-12 text-center">
        <Badge
          variant="secondary"
          className="rounded-full border border-green-900/15 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm"
        >
          Futebol de quinta
        </Badge>

        <BrandLogo variant="hero" />

        <p className="max-w-sm text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {APP_DESCRIPTION}
        </p>

        <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
          <Button
            nativeButton={false}
            render={<Link href="/admin" />}
            size="lg"
            className="min-h-12 w-full cursor-pointer border-0 text-base font-semibold shadow-lg shadow-black/20"
          >
            <ShieldIcon data-icon="inline-start" />
            Painel admin
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/jogador/criar" />}
            variant="secondary"
            size="lg"
            className="min-h-12 w-full cursor-pointer border border-green-900/20 bg-white/70 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-white/85"
          >
            <UserPlusIcon data-icon="inline-start" />
            Criar cartão de jogador
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/camp/torneio" />}
            variant="secondary"
            size="lg"
            className="min-h-12 w-full cursor-pointer border border-green-900/20 bg-white/70 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-white/85"
          >
            <LayoutGridIcon data-icon="inline-start" />
            Copa Resenha (camp)
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-4 px-4 pb-8">
        <PitchCard className="flex flex-col gap-4">
          <h2 className="font-heading text-xl tracking-wide text-card-foreground">
            COMO FUNCIONA
          </h2>
          <ol className="flex flex-col gap-4">
            {steps.map(({ icon: Icon, text }, index) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Passo {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              </li>
            ))}
          </ol>
        </PitchCard>
      </div>
    </PageShell>
  );
}
