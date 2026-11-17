export type StatusSolicitacao =
    | "pendente"
    | "aguardando_cliente"
    | "em_andamento"
    | "concluida"
    | "cancelada";

export type DecisaoOrcamento = "aceitar" | "recusar";

export interface ClienteResumo {
    id: number;
    nome: string | null;
    email: string | null;
}

export interface ContadorResumo {
    id: number;
    nome: string | null;
}

export interface EmpresaResumo {
    id: number;
    razaoSocial: string;
    nomeFantasia: string | null;
}

export interface ServicoResumo {
    id: number;
    nome: string | null;
    tipoCliente: string | null;
}

export interface SolicitacaoCliente {
    id: number;
    cliente: ClienteResumo;
    contador: ContadorResumo | null;
    empresa: EmpresaResumo | null;
    servico: ServicoResumo;
    descricao: string | null;
    valorOrcamento: number | null;
    status: StatusSolicitacao;
    dataSolicitacao: string | null;
    dataResposta: string | null;
}
