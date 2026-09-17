export const CAMP_NAV_ITEMS = [
  { href: "/camp", label: "Início", match: "exact" as const },
  { href: "/camp/torneio", label: "Camp", match: "prefix" as const },
  { href: "/camp/jogadores", label: "Jogadores", match: "prefix" as const },
  { href: "/camp/times", label: "Times", match: "prefix" as const },
] as const;
