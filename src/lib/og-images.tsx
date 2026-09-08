import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { StatusPresenca } from "@/generated/prisma/client";

export const ogListaSize = { width: 1200, height: 630 } as const;

export async function buildListaOgImage(agendaId: string) {
  const agenda = await db.agenda.findUnique({
    where: { id: agendaId },
    select: {
      id: true,
      titulo: true,
      dataHora: true,
      local: true,
    },
  });

  if (!agenda) return null;

  const [pagamentos, confirmados] = await Promise.all([
    db.pagamento.findMany({
      where: { agendaId },
      select: { pago: true },
    }),
    db.presenca.count({
      where: { agendaId, status: StatusPresenca.VAI },
    }),
  ]);

  const totalPagamentos = pagamentos.length;
  const pagos = pagamentos.filter((p) => p.pago).length;

  const headline =
    totalPagamentos > 0
      ? `${pagos}/${totalPagamentos} pagos`
      : `${confirmados} confirmados`;

  const when = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(agenda.dataHora);

  const subtitle = agenda.local ? `${when} · ${agenda.local}` : when;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0f172a 0%, #14532d 55%, #22c55e 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ⚽
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.9 }}>
            PEBOL KOPOHA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
            {agenda.titulo}
          </div>
          <div style={{ fontSize: 28, opacity: 0.85 }}>{subtitle}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>Toque para abrir a lista</div>
        </div>
      </div>
    ),
    ogListaSize,
  );
}

export const ogJogadorSize = { width: 600, height: 900 } as const;

export async function buildJogadorOgImage(slug: string) {
  const jogador = await db.jogador.findUnique({
    where: { slug },
    include: {
      estatistica: true,
      premios: { orderBy: { createdAt: "desc" }, take: 4 },
    },
  });

  if (!jogador) return null;

  const stats = jogador.estatistica ?? {
    gols: 0,
    pebols: 0,
    vitorias: 0,
    assistencias: 0,
    premiosCount: 0,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 32px 24px",
            flex: 1,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 900,
              marginBottom: 24,
              border: "4px solid #fcd34d",
            }}
          >
            {jogador.nome.charAt(0).toUpperCase()}
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {jogador.nome}
          </div>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 24,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {[
              { label: "GOLS", value: stats.gols },
              { label: "PEBOLS", value: stats.pebols },
              { label: "VIT", value: stats.vitorias },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "16px 24px",
                  minWidth: 100,
                }}
              >
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fbbf24" }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 14, opacity: 0.7, fontWeight: 700 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {jogador.premios.length > 0 ? (
            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                width: "100%",
              }}
            >
              {jogador.premios.map((premio) => (
                <div
                  key={premio.id}
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #b45309)",
                    color: "#1a1a2e",
                    borderRadius: 999,
                    padding: "8px 16px",
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  🏆 {premio.titulo}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.8 }}>
            PEBOL KOPOHA
          </div>
          <div style={{ fontSize: 16, opacity: 0.6 }}>{stats.premiosCount} prêmios</div>
        </div>
      </div>
    ),
    ogJogadorSize,
  );
}
