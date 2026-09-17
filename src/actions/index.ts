export {
  createAgenda,
  updateAgenda,
  deleteAgenda,
  getAgenda,
  listAgendas,
  type AgendaInput,
} from "./agenda";

export { setPresenca, getPresencasByAgenda } from "./presenca";

export {
  createJogador,
  getJogadorBySlug,
  listJogadores,
  updateEstatistica,
  type EstatisticaInput,
  type JogadorWithStats,
} from "./jogador";

export { togglePagamento, listPagamentos, setPagamentoStatus } from "./pagamento";

export {
  updateMatchResult,
  setMatchStatus,
  advanceKnockoutBracket,
  updateTeamLineup,
  verifyAdminAccess,
  verifyTeamManagerAccess,
  type UpdateMatchInput,
  type UpdateLineupInput,
} from "./camp";
