import { ChevronRight, FileCheck } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "../../lib/utils";
import {
    OPCOES_FILTRO_SOLICITACAO,
    type FiltroSolicitacao,
    type Solicitacao,
    type StatusSolicitacao,
} from "./dados";

interface PropriedadesListaSolicitacoes {
    solicitacoes: readonly Solicitacao[];
}

interface ApresentacaoStatus {
    rotulo: string;
    classes: string;
}

const APRESENTACAO_STATUS: Record<StatusSolicitacao, ApresentacaoStatus> = {
    URGENTE: {
        rotulo: "Urgente",
        classes: "bg-red-500/15 text-red-400",
    },
    NOVA: {
        rotulo: "Nova",
        classes: "bg-sky-500/15 text-sky-400",
    },
    AGUARDANDO_RESPOSTA: {
        rotulo: "Aguardando resposta",
        classes: "bg-amber-500/15 text-amber-400",
    },
    CONCLUIDA: {
        rotulo: "Concluída",
        classes: "bg-emerald-500/15 text-emerald-400",
    },
};

/*
 * Retorna a quantidade de solicitações pertencentes
 * ao filtro informado.
 */
function contarSolicitacoes(
    solicitacoes: readonly Solicitacao[],
    filtro: FiltroSolicitacao,
): number {
    if (filtro === "TODOS") {
        return solicitacoes.length;
    }

    return solicitacoes.filter((solicitacao) => solicitacao.status === filtro)
        .length;
}

export default function ListaSolicitacoes({
    solicitacoes,
}: PropriedadesListaSolicitacoes) {
    const [filtroAtual, definirFiltroAtual] =
        useState<FiltroSolicitacao>("TODOS");

    const [filtrosAbertos, definirFiltrosAbertos] = useState(false);

    const identificadorFiltros = useId();

    const opcaoSelecionada =
        OPCOES_FILTRO_SOLICITACAO.find(
            (opcao) => opcao.valor === filtroAtual,
        ) ?? OPCOES_FILTRO_SOLICITACAO[0];

    /*
     * Mantém o filtro selecionado na primeira posição.
     * Quando o menu é aberto, as demais opções aparecem ao lado.
     */
    const demaisOpcoes = OPCOES_FILTRO_SOLICITACAO.filter(
        (opcao) => opcao.valor !== filtroAtual,
    );

    const opcoesVisiveis = filtrosAbertos
        ? [opcaoSelecionada, ...demaisOpcoes]
        : [opcaoSelecionada];

    const solicitacoesVisiveis =
        filtroAtual === "TODOS"
            ? solicitacoes
            : solicitacoes.filter(
                  (solicitacao) => solicitacao.status === filtroAtual,
              );

    const selecionarFiltro = (filtro: FiltroSolicitacao) => {
        definirFiltroAtual(filtro);
        definirFiltrosAbertos(false);
    };

    return (
        <section className="space-y-5">
            <div className="space-y-3">
                <p
                    className="text-xs font-black uppercase
                        tracking-[0.18em] text-white/40"
                >
                    Filtrar por status
                </p>

                <div
                    id={identificadorFiltros}
                    className="flex flex-wrap items-center gap-2"
                    role="group"
                    aria-label="Filtrar solicitações por status"
                >
                    {opcoesVisiveis.map((opcao) => {
                        const estaSelecionado = filtroAtual === opcao.valor;

                        const quantidade = contarSolicitacoes(
                            solicitacoes,
                            opcao.valor,
                        );

                        return (
                            <button
                                key={opcao.valor}
                                type="button"
                                onClick={() => selecionarFiltro(opcao.valor)}
                                aria-pressed={estaSelecionado}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl",
                                    "border px-3 py-2 text-xs font-bold",
                                    "transition-all duration-200",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-2",
                                    "focus-visible:ring-brand",
                                    estaSelecionado
                                        ? "border-brand bg-brand text-white shadow-lg shadow-brand/20"
                                        : "border-white/10 bg-white/5 text-white/50 hover:border-brand/30 hover:bg-white/10 hover:text-white",
                                )}
                            >
                                <span>{opcao.rotulo}</span>

                                <span
                                    className={cn(
                                        "flex min-w-5 items-center",
                                        "justify-center rounded-full",
                                        "px-1.5 py-0.5 text-[10px]",
                                        estaSelecionado
                                            ? "bg-white/20 text-white"
                                            : "bg-white/5 text-white/40",
                                    )}
                                >
                                    {quantidade}
                                </span>
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() =>
                            definirFiltrosAbertos((estadoAtual) => !estadoAtual)
                        }
                        aria-expanded={filtrosAbertos}
                        aria-controls={identificadorFiltros}
                        aria-label={
                            filtrosAbertos
                                ? "Recolher filtros"
                                : "Mostrar todos os filtros"
                        }
                        title={
                            filtrosAbertos
                                ? "Recolher filtros"
                                : "Mostrar filtros"
                        }
                        className="flex h-9 w-9 items-center
                            justify-center rounded-xl border
                            border-white/10 bg-white/5
                            text-white/50 transition-all duration-300
                            hover:border-brand/30 hover:bg-white/10
                            hover:text-brand
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-brand"
                    >
                        <ChevronRight
                            className={cn(
                                "h-4 w-4 transition-transform",
                                "duration-300",
                                filtrosAbertos && "rotate-180",
                            )}
                        />
                    </button>
                </div>
            </div>

            {solicitacoesVisiveis.length > 0 ? (
                <div className="grid gap-3 xl:grid-cols-2">
                    {solicitacoesVisiveis.map((solicitacao) => {
                        const apresentacao =
                            APRESENTACAO_STATUS[solicitacao.status];

                        return (
                            <article
                                key={solicitacao.id}
                                className="group cursor-pointer
                                    rounded-[24px] border
                                    border-white/5 bg-white/5 p-5
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-brand/30
                                    hover:bg-white/10"
                            >
                                <div
                                    className="mb-4 flex items-start
                                        justify-between gap-3"
                                >
                                    <span
                                        className={cn(
                                            "rounded-lg px-2 py-1",
                                            "text-[9px] font-black",
                                            "uppercase tracking-widest",
                                            apresentacao.classes,
                                        )}
                                    >
                                        {apresentacao.rotulo}
                                    </span>

                                    <span
                                        className="text-[10px]
                                            font-black uppercase
                                            tracking-tighter
                                            text-white/20"
                                    >
                                        {solicitacao.data}
                                    </span>
                                </div>

                                <p
                                    className="mb-2 text-lg font-bold
                                        leading-none tracking-tight
                                        text-white"
                                >
                                    {solicitacao.cliente}
                                </p>

                                <p
                                    className="flex items-center gap-2
                                        text-xs font-medium
                                        text-white/40"
                                >
                                    <FileCheck
                                        className="h-4 w-4
                                            text-brand/60"
                                    />

                                    {solicitacao.tipo}
                                </p>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div
                    className="rounded-3xl border border-dashed
                        border-white/10 bg-white/[0.03]
                        px-6 py-12 text-center"
                >
                    <p className="font-bold text-white/60">
                        Nenhuma solicitação encontrada
                    </p>

                    <p className="mt-1 text-sm text-white/30">
                        Não existem solicitações com este status.
                    </p>
                </div>
            )}
        </section>
    );
}
