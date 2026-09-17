import type { CampMatch, CampPlayer, CampStanding, TeamId } from "./types";

export function getLineupPlayers(
  players: CampPlayer[],
  lineupIds: Set<string>,
): CampPlayer[] {
  const selected = players.filter((player) => lineupIds.has(player.id));
  if (selected.length === 0) return getDefaultLineup(players);

  const goalkeeper = selected.find((player) => player.role === "goleiro");
  const line = selected
    .filter((player) => player.role === "linha")
    .sort((a, b) => a.number - b.number)
    .slice(0, 4);
  return goalkeeper ? [...line, goalkeeper] : line;
}

export function getDefaultLineup(players: CampPlayer[]): CampPlayer[] {
  const goalkeeper = players.find((player) => player.role === "goleiro");
  const line = players
    .filter((player) => player.role === "linha")
    .sort((a, b) => a.number - b.number)
    .slice(0, 4);
  return goalkeeper ? [...line, goalkeeper] : line;
}

export type BracketTeamSlot = {
  label: string;
  teamId: TeamId | null;
};

export function buildBracketSlots(
  standings: CampStanding[],
  matches: CampMatch[],
): {
  semi1: BracketTeamSlot[];
  semi2: BracketTeamSlot[];
  final: BracketTeamSlot[];
} {
  const semi1Match = matches.find((m) => m.phase === "semifinal" && m.roundLabel.includes("1º"));
  const semi2Match = matches.find((m) => m.phase === "semifinal" && m.roundLabel.includes("2º"));
  const finalMatch = matches.find((m) => m.phase === "final");

  const first = standings.find((row) => row.position === 1)?.teamId ?? null;
  const second = standings.find((row) => row.position === 2)?.teamId ?? null;
  const third = standings.find((row) => row.position === 3)?.teamId ?? null;
  const fourth = standings.find((row) => row.position === 4)?.teamId ?? null;

  const semi1Winner =
    semi1Match?.status === "finished" && semi1Match.result
      ? semi1Match.result.homeScore > semi1Match.result.awayScore
        ? semi1Match.homeTeamId
        : semi1Match.result.awayScore > semi1Match.result.homeScore
          ? semi1Match.awayTeamId
          : semi1Match.homeTeamId
      : null;

  const semi2Winner =
    semi2Match?.status === "finished" && semi2Match.result
      ? semi2Match.result.homeScore > semi2Match.result.awayScore
        ? semi2Match.homeTeamId
        : semi2Match.result.awayScore > semi2Match.result.homeScore
          ? semi2Match.awayTeamId
          : semi2Match.homeTeamId
      : null;

  return {
    semi1: [
      { label: "1º", teamId: semi1Match?.homeTeamId ?? first },
      { label: "4º", teamId: semi1Match?.awayTeamId ?? fourth },
    ],
    semi2: [
      { label: "2º", teamId: semi2Match?.homeTeamId ?? second },
      { label: "3º", teamId: semi2Match?.awayTeamId ?? third },
    ],
    final: [
      { label: "SF1", teamId: finalMatch?.homeTeamId ?? semi1Winner },
      { label: "SF2", teamId: finalMatch?.awayTeamId ?? semi2Winner },
    ],
  };
}
