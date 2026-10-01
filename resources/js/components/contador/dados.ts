export const OPCOES_FILTRO_SOLICITACAO = [
    {
        valor: "TODOS",
        rotulo: "Todas",
    },
    {
        valor: "URGENTE",
        rotulo: "Urgentes",
    },
    {
        valor: "NOVA",
        rotulo: "Novas",
    },
    {
        valor: "AGUARDANDO_RESPOSTA",
        rotulo: "Aguardando resposta",
    },
    {
        valor: "CONCLUIDA",
        rotulo: "Concluídas",
    },
] as const;

export type FiltroSolicitacao =
    (typeof OPCOES_FILTRO_SOLICITACAO)[number]["valor"];

export type StatusSolicitacao = Exclude<FiltroSolicitacao, "TODOS">;

export interface Solicitacao {
    readonly id: string;
    readonly cliente: string;
    readonly tipo: string;
    readonly data: string;
    readonly status: StatusSolicitacao;
}

/*
 * Dados temporários utilizados até que as solicitações
 * sejam carregadas pelo Laravel.
 */
export const solicitacoesSimuladas = [
    {
        id: "1",
        cliente: "Alpha Tech Ltda",
        tipo: "Folha de Pagamento",
        data: "Há 10 min",
        status: "URGENTE",
    },
    {
        id: "2",
        cliente: "Bazar do Sol",
        tipo: "Conciliação Bancária",
        data: "Há 1 hora",
        status: "NOVA",
    },
    {
        id: "3",
        cliente: "Construtora Forte",
        tipo: "DRE Trimestral",
        data: "Há 5 horas",
        status: "AGUARDANDO_RESPOSTA",
    },
    {
        id: "4",
        cliente: "Mercado Central",
        tipo: "Apuração de impostos",
        data: "Ontem",
        status: "CONCLUIDA",
    },
    {
        id: "5",
        cliente: "Clínica Horizonte",
        tipo: "Admissão de colaborador",
        data: "Ontem",
        status: "NOVA",
    },
] as const satisfies readonly Solicitacao[];
