export const STATUS_PRESENCA = {
  VAI: "VAI",
  NAO_VAI: "NAO_VAI",
  TALVEZ: "TALVEZ",
} as const;

export type StatusPresencaValue =
  (typeof STATUS_PRESENCA)[keyof typeof STATUS_PRESENCA];

export type PebolAgendaView = {
  id: string;
  titulo: string;
  dataHora: string;
  local?: string | null;
  valor?: string | number | null;
  chavePix?: string | null;
  nomeRecebedor?: string | null;
  cidadePix?: string | null;
  mensagemPix?: string | null;
};

export type PebolPresencaView = {
  id: string;
  nome: string;
  status: string;
  sessionKey?: string | null;
};
