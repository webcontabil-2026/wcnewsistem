import {
    Building2,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    FileText,
    RefreshCw,
    UserRound,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "../../../lib/utils";
import {
    DecisaoOrcamento,
    SolicitacaoCliente,
    StatusSolicitacao,
} from "./tipos";

interface SolicitacoesClienteProps {
    solicitacoes: SolicitacaoCliente[];
    carregando: boolean;
    respondendoId: number | null;
    erro: string;
    mensagem: string;
    onRecarregar: () => void | Promise<void>;
    onResponder: (
        solicitacaoId: number,
        decisao: DecisaoOrcamento,
    ) => void | Promise<void>;
}

type FiltroSolicitacao = "todas" | StatusSolicitacao;

const configuracoesStatus: Record<
    StatusSolicitacao,
    {
        texto: string;
        classe: string;
    }
> = {
    pendente: {
        texto: "Aguardando contador",
        classe: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    },
    aguardando_cliente: {
        texto: "Aguardando sua resposta",
        classe: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    },
    em_andamento: {
        texto: "Em andamento",
        classe: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    },
    concluida: {
        texto: "Concluída",
        classe: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    },
    cancelada: {
        texto: "Cancelada",
        classe: "border-red-400/30 bg-red-400/10 text-red-300",
    },
};

const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);

const formatarData = (data: string | null) => {
    if (!data) {
        return "Data não informada";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data não informada";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(dataConvertida);
};

/**
 * Página completa de acompanhamento das solicitações do cliente.
 */
export default function SolicitacoesCliente({
    solicitacoes,
    carregando,
    respondendoId,
    erro,
    mensagem,
    onRecarregar,
    onResponder,
}: SolicitacoesClienteProps) {
    const [filtro, setFiltro] = useState<FiltroSolicitacao>("todas");

    const solicitacoesFiltradas = useMemo(
        () =>
            filtro === "todas"
                ? solicitacoes
                : solicitacoes.filter(
                      (solicitacao) => solicitacao.status === filtro,
                  ),
        [filtro, solicitacoes],
    );

    const totalAguardandoCliente = solicitacoes.filter(
        (solicitacao) => solicitacao.status === "aguardando_cliente",
    ).length;

    /**
     * Confirma a ação antes de atualizar o orçamento.
     */
    const confirmarResposta = (
        solicitacao: SolicitacaoCliente,
        decisao: DecisaoOrcamento,
    ) => {
        const acao = decisao === "aceitar" ? "aceitar" : "recusar";

        const confirmado = window.confirm(
            `Deseja realmente ${acao} o orçamento de ${
                solicitacao.valorOrcamento !== null
                    ? formatarMoeda(solicitacao.valorOrcamento)
                    : "valor não informado"
            }?`,
        );

        if (confirmado) {
            void onResponder(solicitacao.id, decisao);
        }
    };

    return (
        <section className="p-4 sm:p-6 xl:p-10 space-y-8">
            <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                        Atendimento contábil
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Minhas solicitações
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm font-medium text-white/45">
                        Acompanhe os serviços solicitados e responda aos
                        orçamentos enviados pelo contador.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void onRecarregar()}
                    disabled={carregando}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                >
                    <RefreshCw
                        className={cn("h-4 w-4", carregando && "animate-spin")}
                    />
                    Atualizar
                </button>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
                        Total de solicitações
                    </p>

                    <p className="mt-3 text-3xl font-black text-white">
                        {solicitacoes.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300/70">
                        Aguardando sua resposta
                    </p>

                    <p className="mt-3 text-3xl font-black text-amber-300">
                        {totalAguardandoCliente}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                    htmlFor="filtro-solicitacoes"
                    className="text-xs font-black uppercase tracking-[0.16em] text-white/40"
                >
                    Filtrar por status
                </label>

                <select
                    id="filtro-solicitacoes"
                    value={filtro}
                    onChange={(event) =>
                        setFiltro(event.target.value as FiltroSolicitacao)
                    }
                    className="min-h-11 rounded-xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none transition-colors focus:border-brand"
                >
                    <option value="todas">Todas</option>
                    <option value="pendente">Aguardando contador</option>
                    <option value="aguardando_cliente">
                        Aguardando sua resposta
                    </option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluídas</option>
                    <option value="cancelada">Canceladas</option>
                </select>
            </div>

            {mensagem && (
                <div
                    className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm font-bold text-emerald-300"
                    role="status"
                >
                    {mensagem}
                </div>
            )}

            {erro && (
                <div
                    className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-bold text-red-300"
                    role="alert"
                >
                    {erro}
                </div>
            )}

            {carregando ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-brand" />

                    <p className="mt-4 text-sm font-bold text-white/50">
                        Carregando solicitações...
                    </p>
                </div>
            ) : solicitacoesFiltradas.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
                    <FileText className="mx-auto h-8 w-8 text-white/25" />

                    <p className="mt-4 font-bold text-white">
                        Nenhuma solicitação encontrada
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                        Não existem solicitações correspondentes ao filtro
                        selecionado.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                    {solicitacoesFiltradas.map((solicitacao) => {
                        const status = configuracoesStatus[solicitacao.status];

                        const respondendo = respondendoId === solicitacao.id;

                        return (
                            <article
                                key={solicitacao.id}
                                className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.07]"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                                                status.classe,
                                            )}
                                        >
                                            {status.texto}
                                        </span>

                                        <h2 className="mt-4 text-xl font-black text-white">
                                            {solicitacao.servico.nome ??
                                                "Serviço"}
                                        </h2>

                                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/30">
                                            Solicitação #{solicitacao.id}
                                        </p>
                                    </div>

                                    <p className="flex items-center gap-2 text-xs font-bold text-white/35">
                                        <Clock3 className="h-4 w-4" />

                                        {formatarData(
                                            solicitacao.dataSolicitacao,
                                        )}
                                    </p>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {solicitacao.empresa && (
                                        <p className="flex items-center gap-3 text-sm text-white/60">
                                            <Building2 className="h-4 w-4 shrink-0 text-brand" />

                                            {solicitacao.empresa.nomeFantasia ??
                                                solicitacao.empresa.razaoSocial}
                                        </p>
                                    )}

                                    <p className="flex items-center gap-3 text-sm text-white/60">
                                        <UserRound className="h-4 w-4 shrink-0 text-brand" />

                                        {solicitacao.contador?.nome ??
                                            "Contador ainda não definido"}
                                    </p>

                                    {solicitacao.descricao && (
                                        <p className="rounded-2xl border border-white/5 bg-black/10 p-4 text-sm leading-relaxed text-white/55">
                                            {solicitacao.descricao}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                                            Orçamento
                                        </p>

                                        <p className="mt-1 text-lg font-black text-white">
                                            {solicitacao.valorOrcamento !== null
                                                ? formatarMoeda(
                                                      solicitacao.valorOrcamento,
                                                  )
                                                : "Aguardando"}
                                        </p>
                                    </div>

                                    <CircleDollarSign className="h-7 w-7 text-brand" />
                                </div>

                                {solicitacao.status ===
                                    "aguardando_cliente" && (
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirmarResposta(
                                                    solicitacao,
                                                    "aceitar",
                                                )
                                            }
                                            disabled={respondendo}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-black text-white transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />

                                            {respondendo
                                                ? "Processando..."
                                                : "Aceitar"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirmarResposta(
                                                    solicitacao,
                                                    "recusar",
                                                )
                                            }
                                            disabled={respondendo}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 text-sm font-black text-red-300 transition-colors hover:bg-red-400/20 disabled:cursor-wait disabled:opacity-60"
                                        >
                                            <XCircle className="h-5 w-5" />

                                            {respondendo
                                                ? "Processando..."
                                                : "Recusar"}
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
