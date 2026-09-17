"use client";

import { useMemo, useState, useTransition } from "react";
import { updateTeamLineup } from "@/actions/camp";
import type { CampPlayer, TeamId } from "@/lib/camp/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamLineupEditorProps = {
  teamKey: TeamId;
  players: CampPlayer[];
  lineupIds: string[];
  managerToken: string;
};

export function TeamLineupEditor({
  teamKey,
  players,
  lineupIds,
  managerToken,
}: TeamLineupEditorProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(lineupIds));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedList = useMemo(() => [...selected], [selected]);
  const goalkeepers = players.filter((p) => p.role === "goleiro");
  const linha = players.filter((p) => p.role === "linha");

  const selectedGoalkeepers = selectedList.filter((id) =>
    goalkeepers.some((p) => p.id === id),
  ).length;
  const selectedLinha = selectedList.filter((id) =>
    linha.some((p) => p.id === id),
  ).length;

  function togglePlayer(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  }

  function handleSave() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateTeamLineup({
        teamKey,
        managerToken,
        playerIds: selectedList,
      });
      if (result.success) {
        setMessage("Escalação salva!");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="camp-surface camp-card p-4 text-sm text-muted-foreground">
        Selecione <strong className="text-foreground">5 jogadores</strong>: 4 de linha + 1 goleiro.
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">{selectedList.length}/5</Badge>
          <Badge variant="outline">Linha {selectedLinha}/4</Badge>
          <Badge variant="outline">Goleiro {selectedGoalkeepers}/1</Badge>
        </div>
      </div>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Goleiros
        </h3>
        {goalkeepers.map((player) => (
          <PlayerToggle
            key={player.id}
            player={player}
            checked={selected.has(player.id)}
            disabled={!selected.has(player.id) && selected.size >= 5}
            onToggle={() => togglePlayer(player.id)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Linha
        </h3>
        {linha.map((player) => (
          <PlayerToggle
            key={player.id}
            player={player}
            checked={selected.has(player.id)}
            disabled={!selected.has(player.id) && selected.size >= 5}
            onToggle={() => togglePlayer(player.id)}
          />
        ))}
      </section>

      <Button
        type="button"
        disabled={pending || selectedList.length !== 5}
        className="min-h-11 cursor-pointer"
        onClick={handleSave}
      >
        {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Salvar escalação
      </Button>
    </div>
  );
}

function PlayerToggle({
  player,
  checked,
  disabled,
  onToggle,
}: {
  player: CampPlayer;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "camp-surface flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
        checked
          ? "border-[var(--camp-gold)] bg-[color-mix(in_oklch,var(--camp-gold)_12%,oklch(0.2_0.035_260))]"
          : "border-[var(--camp-surface-border)]",
        disabled && !checked && "cursor-not-allowed opacity-50",
      )}
    >
      <span className="flex items-center gap-2">
        <span className="font-heading text-sm tabular-nums">{player.number}</span>
        <span className="text-sm font-semibold">{player.name}</span>
      </span>
      <Badge variant={checked ? "default" : "secondary"}>
        {player.role === "goleiro" ? "GK" : "LIN"}
      </Badge>
    </button>
  );
}
