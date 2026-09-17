import type { CampPlayer } from "./types";

export type StandingTier = "gold" | "silver" | "bronze" | "neutral";

export type PlayerHighlightTier = "gold" | "silver";

/** Posição na tabela → tier visual estilo EA FC UT (1–4). */
export function getStandingTier(position: number): StandingTier {
  if (position === 1) return "gold";
  if (position === 2) return "silver";
  if (position === 3) return "bronze";
  if (position === 4) return "neutral";
  return "neutral";
}

export function getPlayerHighlightTier(
  player: CampPlayer,
  topScorerId: string,
  topAssisterId: string,
): PlayerHighlightTier | null {
  if (player.id === topScorerId) return "gold";
  if (player.id === topAssisterId) return "silver";
  return null;
}

export const TIER_BAR_CLASS: Record<PlayerHighlightTier, string> = {
  gold: "camp-fut-tier-bar camp-fut-tier-bar--gold",
  silver: "camp-fut-tier-bar camp-fut-tier-bar--silver",
};

export const TIER_RING_CLASS: Record<PlayerHighlightTier, string> = {
  gold: "ring-2 ring-[var(--camp-tier-gold)] ring-offset-2 ring-offset-[oklch(0.18_0.035_260)]",
  silver: "ring-2 ring-[var(--camp-tier-silver)] ring-offset-2 ring-offset-[oklch(0.18_0.035_260)]",
};

export const TIER_TILE_CLASS: Record<PlayerHighlightTier, string> = {
  gold: "camp-spotlight-tile--gold",
  silver: "camp-spotlight-tile--silver",
};

export const TIER_FUT_CARD_CLASS: Record<PlayerHighlightTier, string> = {
  gold: "camp-fut-card camp-fut-card--gold",
  silver: "camp-fut-card camp-fut-card--silver",
};

export const STANDING_ROW_CLASS: Record<StandingTier, string> = {
  gold: "camp-standing-row--gold",
  silver: "camp-standing-row--silver",
  bronze: "camp-standing-row--bronze",
  neutral: "camp-standing-row--neutral",
};

export const TIER_BADGE_CLASS: Record<StandingTier, string> = {
  gold: "camp-tier-badge--gold",
  silver: "camp-tier-badge--silver",
  bronze: "camp-tier-badge--bronze",
  neutral: "camp-tier-badge--neutral",
};
