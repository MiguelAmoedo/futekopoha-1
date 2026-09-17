import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campeonato",
  description: "Módulo de campeonato — Copa Resenha Kopoha",
};

export default function CampLayout({ children }: LayoutProps<"/camp">) {
  return children;
}
