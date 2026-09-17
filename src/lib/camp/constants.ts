export const CAMP_NAV_ITEMS = [
  { href: "/", label: "Camp", match: "exact" as const },
  { href: "/camp/times", label: "Times", match: "prefix" as const },
] as const;



/** Dados confirmados do evento (UI + seed subtitle). */

export const CAMP_EVENT = {

  location: "Olímpico Clube",

  dateLabel: "19/09 (sábado)",

  timeWindow: "19:00–20:00",

  kickoff: "Campeonato começa 19:05",

} as const;



export function formatCampEventSubtitle(baseFormat: string): string {

  return `${CAMP_EVENT.dateLabel} · ${CAMP_EVENT.location} · ${CAMP_EVENT.kickoff} · ${baseFormat}`;

}



export const CAMP_EVENT_SUMMARY = `${CAMP_EVENT.location} · ${CAMP_EVENT.dateLabel} · ${CAMP_EVENT.timeWindow} (${CAMP_EVENT.kickoff})`;

