import type { CampPlayer, TeamId } from "./types";

export type FutPosition = "GOL" | "ZAG" | "MC" | "ATA";

const OVR_FLOOR = 81;
const OVR_CEILING = 99;

/** Rating mock estilo FUT — derivado de gols + assistências (81–99). */
export function futRating(player: CampPlayer): number {
  const bonus = player.goals * 3 + player.assists * 2;
  return Math.min(OVR_CEILING, Math.max(OVR_FLOOR, OVR_FLOOR + bonus));
}

/** Posição no card: goleiro → GOL; linha alterna MC/ATA. */
export function futPosition(player: CampPlayer, indexInLine?: number): FutPosition {
  if (player.role === "goleiro") return "GOL";

  if (indexInLine !== undefined) {
    return indexInLine % 2 === 0 ? "MC" : "ATA";
  }

  if (player.goals > player.assists) return "ATA";
  if (player.assists > player.goals) return "MC";
  return player.number % 2 === 0 ? "MC" : "ATA";
}

export type ChemistryLevel = "green" | "yellow" | "red";

export function chemistryBetween(a: CampPlayer, b: CampPlayer): ChemistryLevel {
  if (a.teamId === b.teamId) return "green";
  return "red";
}

export function squadRating(players: CampPlayer[]): number {
  if (players.length === 0) return 0;
  const total = players.reduce((sum, p) => sum + futRating(p), 0);
  return Math.round(total / players.length);
}

/** Química mock 0–100 baseada em coesão de time na escalação. */
export function squadChemistry(players: CampPlayer[]): number {
  if (players.length <= 1) return 100;
  let links = 0;
  let total = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      total++;
      if (players[i].teamId === players[j].teamId) links++;
    }
  }
  return Math.round((links / total) * 100);
}

export function starCount(rating: number): number {
  if (rating >= 88) return 5;
  if (rating >= 84) return 4;
  if (rating >= 80) return 3;
  if (rating >= 76) return 2;
  return 1;
}

export type FutCardStat = {
  label: string;
  value: number;
};

/** Stats do card: gols e assistências reais do mock. */
export function futCardStats(player: CampPlayer): FutCardStat[] {
  return [
    { label: "GOL", value: player.goals },
    { label: "ASS", value: player.assists },
  ];
}

export type FormationSlot = {
  id: string;
  x: number;
  y: number;
  player?: CampPlayer;
};

/** Formação 5v5: 4 linha + goleiro (diamond). */
export function build5v5Formation(players: CampPlayer[]): FormationSlot[] {
  const gk = players.find((p) => p.role === "goleiro");
  const line = players.filter((p) => p.role === "linha").slice(0, 4);

  const slots: FormationSlot[] = [
    { id: "st", x: 50, y: 12, player: line[0] },
    { id: "cm-l", x: 28, y: 32, player: line[1] },
    { id: "cm-r", x: 72, y: 32, player: line[2] },
    { id: "cb", x: 50, y: 52, player: line[3] },
    { id: "gk", x: 50, y: 78, player: gk },
  ];

  return slots;
}

/** Formação 5v5: 4 na linha (horizontal) + goleiro centralizado abaixo. */
export function build5v5LineFormation(players: CampPlayer[]): FormationSlot[] {
  const gk = players.find((p) => p.role === "goleiro");
  const line = players.filter((p) => p.role === "linha").slice(0, 4);
  const lineXs = [16, 38, 62, 84];

  const slots: FormationSlot[] = line.map((player, index) => ({
    id: `l${index + 1}`,
    x: lineXs[index] ?? 50,
    y: 24,
    player,
  }));

  slots.push({ id: "gk", x: 50, y: 76, player: gk });

  return slots;
}

/** Conexões de química entre slots adjacentes na formação. */
export const FORMATION_LINKS: [string, string][] = [
  ["st", "cm-l"],
  ["st", "cm-r"],
  ["cm-l", "cb"],
  ["cm-r", "cb"],
  ["cb", "gk"],
  ["cm-l", "cm-r"],
];

/** Conexões de química na formação em linha (adjacentes + centro ao goleiro). */
export const LINE_FORMATION_LINKS: [string, string][] = [
  ["l1", "l2"],
  ["l2", "l3"],
  ["l3", "l4"],
  ["l2", "gk"],
  ["l3", "gk"],
];

export function getTeamColor(teamId: TeamId): string {
  const colors: Record<TeamId, string> = {
    A: "oklch(0.55 0.15 240)",
    B: "oklch(0.72 0.16 75)",
    C: "oklch(0.55 0.18 300)",
    D: "oklch(0.58 0.2 15)",
  };
  return colors[teamId];
}
