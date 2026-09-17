"use client";

import { useState, useTransition } from "react";
import { updateMatchResult, setMatchStatus, advanceKnockoutBracket } from "@/actions/camp";
import type { CampMatch } from "@/lib/camp/types";
import { findTeamById } from "@/lib/camp/teams-config";
import type { CampTeam } from "@/lib/camp/types";
import { TeamBadge } from "@/components/camp/team-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon } from "lucide-react";

type AdminMatchEditorProps = {
  matches: CampMatch[];
  teams: CampTeam[];
  adminToken: string;
  fase1Complete: boolean;
};

export function AdminMatchEditor({
  matches,
  teams,
  adminToken,
  fase1Complete,
}: AdminMatchEditorProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        setMessage("Salvo!");
      } else {
        setError(result.error ?? "Erro");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {fase1Complete ? (
        <div className="camp-surface camp-card flex flex-col gap-3 p-4">
          <p className="text-sm text-muted-foreground">
            Fase 1 encerrada. Atualize a chave do mata-mata com a classificação atual.
          </p>
          <Button
            type="button"
            disabled={pending}
            className="min-h-11 cursor-pointer"
            onClick={() => runAction(() => advanceKnockoutBracket(adminToken))}
          >
            {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Atualizar chave (semis + final)
          </Button>
        </div>
      ) : null}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {matches.map((match) => (
        <AdminMatchRow
          key={match.id}
          match={match}
          teams={teams}
          pending={pending}
          onSave={(input) =>
            runAction(() =>
              updateMatchResult({
                matchId: match.id,
                adminToken,
                ...input,
              }),
            )
          }
          onStatus={(status) =>
            runAction(() => setMatchStatus(match.id, adminToken, status))
          }
        />
      ))}
    </div>
  );
}

function AdminMatchRow({
  match,
  teams,
  pending,
  onSave,
  onStatus,
}: {
  match: CampMatch;
  teams: CampTeam[];
  pending: boolean;
  onSave: (input: {
    homeScore: number;
    awayScore: number;
    decidedByPenalties: boolean;
    status: "finished";
  }) => void;
  onStatus: (status: "scheduled" | "live" | "finished") => void;
}) {
  const home = findTeamById(teams, match.homeTeamId);
  const away = findTeamById(teams, match.awayTeamId);
  const [homeScore, setHomeScore] = useState(String(match.result?.homeScore ?? 0));
  const [awayScore, setAwayScore] = useState(String(match.result?.awayScore ?? 0));
  const [penalties, setPenalties] = useState(match.result?.decidedByPenalties ?? false);

  return (
    <article className="camp-surface camp-card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {match.roundLabel}
        </span>
        <Badge variant="secondary">{match.status === "live" ? "Ao vivo" : match.status === "finished" ? "Encerrado" : "Agendado"}</Badge>
      </div>

      <div className="flex items-center justify-center gap-3">
        <TeamBadge teamId={match.homeTeamId} name={home?.name} />
        <span className="text-muted-foreground">×</span>
        <TeamBadge teamId={match.awayTeamId} name={away?.name} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`home-${match.id}`}>Gols {home?.name ?? match.homeTeamId}</Label>
          <Input
            id={`home-${match.id}`}
            type="number"
            min={0}
            inputMode="numeric"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="min-h-11"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`away-${match.id}`}>Gols {away?.name ?? match.awayTeamId}</Label>
          <Input
            id={`away-${match.id}`}
            type="number"
            min={0}
            inputMode="numeric"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="min-h-11"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={`pen-${match.id}`} className="text-sm">
          Decidido nos pênaltis
        </Label>
        <Switch
          id={`pen-${match.id}`}
          checked={penalties}
          onCheckedChange={setPenalties}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          disabled={pending}
          className="min-h-11 flex-1 cursor-pointer"
          onClick={() =>
            onSave({
              homeScore: Number(homeScore) || 0,
              awayScore: Number(awayScore) || 0,
              decidedByPenalties: penalties,
              status: "finished",
            })
          }
        >
          Salvar placar
        </Button>
        {match.status !== "live" ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="min-h-11 cursor-pointer"
            onClick={() => onStatus("live")}
          >
            Ao vivo
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="min-h-11 cursor-pointer"
            onClick={() => onStatus("scheduled")}
          >
            Parar live
          </Button>
        )}
      </div>
    </article>
  );
}
