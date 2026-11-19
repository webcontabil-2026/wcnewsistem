import {
    CheckCircle2,
    Clock3,
    LoaderCircle,
    RefreshCw,
    RotateCcw,
    Send,
    UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "../../lib/utils";
import type { SolicitacaoCliente, StatusSolicitacao } from "../client/solicitacoes/tipos";

interface SolicitacoesContadorProps {
    solicitacoes: SolicitacaoCliente[];
    carregando: boolean;
    processandoId: number | null;
    erro: string;
    mensagem: string;
    modo?: "todas" | "processamentos";
    onRecarregar: () => void;
    onEnviarOrcamento: (id: number, valor: number) => Promise<void>;
    onAtualizarStatus: (id: number, status: StatusSolicitacao) => Promise<void>;
}

const ROTULOS_STATUS: Record<StatusSolicitacao, string> = {
    pendente: "Nova",
    aguardando_cliente: "Aguardando cliente",
    em_andamento: "Em andamento",
    concluida: "Concluída",
    cancelada: "Cancelada",
};

const formatarData = (valor: string | null) =>
    valor
        ? new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
          }).format(new Date(valor))
        : "Data não informada";

const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);

export default function SolicitacoesContador({
    solicitacoes,
    carregando,
    processandoId,
    erro,
    mensagem,
    modo = "todas",
    onRecarregar,
    onEnviarOrcamento,
    onAtualizarStatus,
}: SolicitacoesContadorProps) {
    const [filtro, setFiltro] = useState<StatusSolicitacao | "todas">("todas");
    const [valores, setValores] = useState<Record<number, string>>({});

    const visiveis = useMemo(() => {
        const base =
            modo === "processamentos"
                ? solicitacoes.filter((item) =>
                      ["em_andamento", "concluida"].includes(item.status),
                  )
                : solicitacoes;

        return filtro === "todas"
            ? base
            : base.filter((item) => item.status === filtro);
    }, [filtro, modo, solicitacoes]);

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                            Atendimento contábil
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            {modo === "processamentos" ? "Processamentos" : "Solicitações"}
                        </h1>
                        <p className="mt-2 font-medium text-white/50">
                            {modo === "processamentos"
                                ? "Acompanhe serviços aceitos e conclua os atendimentos finalizados."
                                : "Analise pedidos reais e envie o orçamento ao cliente."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onRecarregar}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10"
                    >
                        <RefreshCw className="h-4 w-4" /> Atualizar
                    </button>
                </header>

                {erro && <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">{erro}</p>}
                {mensagem && <p role="status" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">{mensagem}</p>}

                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-black uppercase tracking-wider text-white/50" htmlFor="filtro-solicitacoes-contador">Status</label>
                    <select
                        id="filtro-solicitacoes-contador"
                        value={filtro}
                        onChange={(event) => setFiltro(event.target.value as StatusSolicitacao | "todas")}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white"
                    >
                        <option value="todas">Todas</option>
                        {Object.entries(ROTULOS_STATUS).map(([valor, rotulo]) => (
                            <option key={valor} value={valor}>{rotulo}</option>
                        ))}
                    </select>
                    <span className="text-sm text-white/40">{visiveis.length} resultado(s)</span>
                </div>

                {carregando ? (
                    <div className="flex min-h-72 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                        <LoaderCircle className="h-9 w-9 animate-spin text-brand" />
                    </div>
                ) : visiveis.length ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {visiveis.map((solicitacao) => {
                            const processando = processandoId === solicitacao.id;
                            const podeOrcar = ["pendente", "aguardando_cliente"].includes(solicitacao.status);
                            const valor = Number((valores[solicitacao.id] ?? "").replace(",", "."));

                            return (
                                <article key={solicitacao.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider", solicitacao.status === "concluida" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : solicitacao.status === "cancelada" ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-brand/30 bg-brand/10 text-brand")}>
                                            {ROTULOS_STATUS[solicitacao.status]}
                                        </span>
                                        <span className="flex items-center gap-2 text-xs text-white/40"><Clock3 className="h-4 w-4" />{formatarData(solicitacao.dataSolicitacao)}</span>
                                    </div>

                                    <h2 className="mt-5 text-xl font-extrabold text-white">{solicitacao.servico.nome}</h2>
                                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/60"><UserRound className="h-4 w-4 text-brand" />{solicitacao.cliente.nome} · {solicitacao.cliente.email}</p>
                                    <p className="mt-4 min-h-12 whitespace-pre-wrap text-sm leading-relaxed text-white/50">{solicitacao.descricao || "O cliente não incluiu observações."}</p>

                                    {solicitacao.valorOrcamento !== null && (
                                        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">Orçamento atual: <strong className="text-white">{formatarMoeda(solicitacao.valorOrcamento)}</strong></p>
                                    )}

                                    {podeOrcar && (
                                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                            <label className="sr-only" htmlFor={`orcamento-${solicitacao.id}`}>Valor do orçamento</label>
                                            <input
                                                id={`orcamento-${solicitacao.id}`}
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={valores[solicitacao.id] ?? ""}
                                                onChange={(event) => setValores((atuais) => ({ ...atuais, [solicitacao.id]: event.target.value }))}
                                                placeholder="Valor em R$"
                                                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
                                            />
                                            <button
                                                type="button"
                                                disabled={processando || !Number.isFinite(valor) || valor <= 0}
                                                onClick={() => void onEnviarOrcamento(solicitacao.id, valor)}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-bold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                Enviar orçamento
                                            </button>
                                        </div>
                                    )}

                                    {solicitacao.status === "em_andamento" && (
                                        <button type="button" disabled={processando} onClick={() => void onAtualizarStatus(solicitacao.id, "concluida")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                                            <CheckCircle2 className="h-4 w-4" /> Concluir atendimento
                                        </button>
                                    )}

                                    {solicitacao.status === "concluida" && (
                                        <button type="button" disabled={processando} onClick={() => void onAtualizarStatus(solicitacao.id, "em_andamento")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 disabled:opacity-50">
                                            <RotateCcw className="h-4 w-4" /> Retomar atendimento
                                        </button>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center text-white/50">Nenhuma solicitação neste filtro.</div>
                )}
            </div>
        </section>
    );
}
