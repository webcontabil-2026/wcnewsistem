import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    ExternalLink,
    FileText,
    Trash2,
    TrendingUp,
    WalletCards,
} from "lucide-react";

import { cn } from "../../lib/utils";
import {
    formatCurrencyValue,
    formatFinancialDate,
    getFinancialValueTextSize,
} from "./financeiro/formatadores";
import type {
    AnexoFinanceiro,
    DadosGraficoFinanceiro,
    LancamentoFinanceiro,
    PeriodoGraficoFinanceiro,
    TipoLancamentoFinanceiro,
} from "./financeiro/tipos";

interface FinancialBarShapeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fillColor: string;
}

/**
 * Desenha as barras do gráfico utilizando cores fixas
 * para receitas e despesas.
 */
function FinancialBarShape({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fillColor,
}: FinancialBarShapeProps) {
    if (width <= 0 || height <= 0) {
        return null;
    }

    const radius = Math.min(8, width / 2, height / 2);

    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={radius}
            ry={radius}
            fill={fillColor}
        />
    );
}

const rotulosTipo: Record<TipoLancamentoFinanceiro, string> = {
    receita: "Receita",
    despesa: "Despesa",
    transferencia: "Transferência",
    ajuste: "Ajuste financeiro",
};

const rotulosCategoria: Record<string, string> = {
    servicos: "Serviços",
    honorarios: "Honorários",
    impostos: "Impostos",
    folha: "Folha de pagamento",
    fornecedores: "Fornecedores",
    equipamentos: "Equipamentos",
    reembolso: "Reembolso",
    outros: "Outros",
};

interface FinanceiroClienteProps {
    lancamentos: LancamentoFinanceiro[];
    resumo: {
        revenue: number;
        expenses: number;
    };
    saldo: number;

    dadosGrafico: DadosGraficoFinanceiro[];
    periodoGrafico: PeriodoGraficoFinanceiro;

    carregando: boolean;
    exportandoPdf: boolean;

    mensagem: string;
    erroDados: string;
    erroExportacao: string;

    onNovoLancamento: () => void;
    onExportarPdf: () => void | Promise<void>;
    onAlterarPeriodo: (periodo: PeriodoGraficoFinanceiro) => void;

    onAbrirAnexo: (anexo: AnexoFinanceiro) => void;

    onExcluirLancamento: (
        lancamento: LancamentoFinanceiro,
    ) => void | Promise<void>;
}

/**
 * Tela financeira do painel do cliente.
 *
 * Exibe resumo, gráfico de fluxo financeiro e
 * movimentações cadastradas no banco.
 */
export default function FinanceiroCliente({
    lancamentos,
    resumo,
    saldo,
    dadosGrafico,
    periodoGrafico,
    carregando,
    exportandoPdf,
    mensagem,
    erroDados,
    erroExportacao,
    onNovoLancamento,
    onExportarPdf,
    onAlterarPeriodo,
    onAbrirAnexo,
    onExcluirLancamento,
}: FinanceiroClienteProps) {
    return (
        <section className="space-y-8 p-4 sm:p-6 xl:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                        Gestão financeira
                    </p>

                    <h1 className="text-4xl font-extrabold tracking-tighter text-white">
                        Controle Financeiro
                    </h1>

                    <p className="mt-1 font-medium text-white/40">
                        Acompanhe lançamentos, receitas, despesas e resultados.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => void onExportarPdf()}
                        disabled={exportandoPdf}
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                    >
                        {exportandoPdf ? "Exportando..." : "Exportar PDF"}
                    </button>

                    <button
                        type="button"
                        onClick={onNovoLancamento}
                        className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand/40 transition-colors hover:bg-brand-light"
                    >
                        Novo Lançamento
                    </button>
                </div>
            </div>

            {mensagem && (
                <div
                    role="status"
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400"
                >
                    {mensagem}
                </div>
            )}

            {erroDados && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                >
                    {erroDados}
                </div>
            )}

            {carregando && (
                <div
                    role="status"
                    className="rounded-2xl border border-brand/20 bg-brand/10 p-4 text-sm font-medium text-brand-light"
                >
                    Carregando lançamentos financeiros...
                </div>
            )}

            {erroExportacao && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                >
                    {erroExportacao}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Resumo financeiro
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                        Valores calculados a partir dos lançamentos cadastrados.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
                                Receitas
                            </p>

                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                        </div>

                        <p
                            className={cn(
                                "whitespace-nowrap font-extrabold tracking-tight text-emerald-400 tabular-nums",
                                getFinancialValueTextSize(resumo.revenue),
                            )}
                        >
                            {formatCurrencyValue(resumo.revenue)}
                        </p>
                    </article>

                    <article className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-400">
                                Despesas
                            </p>

                            <WalletCards className="h-5 w-5 text-red-400" />
                        </div>

                        <p
                            className={cn(
                                "whitespace-nowrap font-extrabold tracking-tight text-red-400 tabular-nums",
                                getFinancialValueTextSize(resumo.expenses),
                            )}
                        >
                            {formatCurrencyValue(resumo.expenses)}
                        </p>
                    </article>

                    <article className="rounded-[28px] border border-brand/30 bg-brand/10 p-6 backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand">
                                Saldo
                            </p>

                            <WalletCards className="h-5 w-5 text-brand" />
                        </div>

                        <p
                            className={cn(
                                "whitespace-nowrap font-extrabold tracking-tight tabular-nums",
                                getFinancialValueTextSize(saldo),
                                saldo >= 0
                                    ? "text-emerald-400"
                                    : "text-red-400",
                            )}
                        >
                            {formatCurrencyValue(saldo)}
                        </p>
                    </article>

                    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                                Lançamentos
                            </p>

                            <FileText className="h-5 w-5 text-brand" />
                        </div>

                        <p className="text-2xl font-extrabold text-white">
                            {lancamentos.length}
                        </p>
                    </article>
                </div>

                <p className="text-xs text-white/30">
                    Transferências e ajustes financeiros não alteram o saldo
                    nesta etapa.
                </p>
            </div>

            <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Fluxo financeiro
                        </h2>

                        <p className="mt-1 text-sm text-white/40">
                            Comparação entre receitas e despesas no período
                            selecionado.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <select
                            value={periodoGrafico}
                            onChange={(event) =>
                                onAlterarPeriodo(
                                    Number(
                                        event.target.value,
                                    ) as PeriodoGraficoFinanceiro,
                                )
                            }
                            aria-label="Selecionar período do gráfico"
                            className="cursor-pointer rounded-xl border border-white/10 bg-[#1e2c42] px-4 py-2.5 text-sm font-bold text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                            <option className="bg-[#0f1f35]" value={1}>
                                1 dia
                            </option>

                            <option className="bg-[#0f1f35]" value={7}>
                                1 semana
                            </option>

                            <option className="bg-[#0f1f35]" value={15}>
                                15 dias
                            </option>

                            <option className="bg-[#0f1f35]" value={30}>
                                1 mês
                            </option>

                            <option className="bg-[#0f1f35]" value={90}>
                                3 meses
                            </option>

                            <option className="bg-[#0f1f35]" value={180}>
                                6 meses
                            </option>

                            <option className="bg-[#0f1f35]" value={365}>
                                12 meses
                            </option>
                        </select>

                        <div className="flex flex-wrap gap-4 text-xs font-bold">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                Receitas
                            </div>

                            <div className="flex items-center gap-2 text-red-400">
                                <span className="h-3 w-3 rounded-full bg-red-400" />
                                Despesas
                            </div>
                        </div>
                    </div>
                </div>

                {dadosGrafico.length === 0 ? (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
                        <BarChart className="h-9 w-9 text-white/20" />

                        <p className="mt-3 text-sm font-medium text-white/40">
                            Cadastre receitas ou despesas para visualizar o
                            gráfico.
                        </p>
                    </div>
                ) : (
                    <div className="h-80 w-full min-w-0 overflow-hidden">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                            initialDimension={{
                                width: 1,
                                height: 320,
                            }}
                        >
                            <BarChart
                                data={dadosGrafico}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="rgba(148, 163, 184, 0.15)"
                                />

                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={70}
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat("pt-BR", {
                                            notation: "compact",
                                            maximumFractionDigits: 1,
                                        }).format(Number(value))
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(148, 163, 184, 0.08)",
                                    }}
                                    formatter={(value) =>
                                        formatCurrencyValue(Number(value))
                                    }
                                    labelFormatter={(label) => `Data: ${label}`}
                                    contentStyle={{
                                        backgroundColor: "#0f1f35",
                                        border: "1px solid rgba(148, 163, 184, 0.25)",
                                        borderRadius: "16px",
                                        color: "#ffffff",
                                        boxShadow:
                                            "0 20px 40px rgba(0, 0, 0, 0.35)",
                                    }}
                                    labelStyle={{
                                        color: "#ffffff",
                                        fontWeight: 700,
                                    }}
                                    itemStyle={{
                                        color: "#f8fafc",
                                        fontWeight: 600,
                                    }}
                                />

                                <Bar
                                    dataKey="receitas"
                                    name="Receitas"
                                    fill="#10b981"
                                    maxBarSize={48}
                                    shape={
                                        <FinancialBarShape fillColor="#10b981" />
                                    }
                                />

                                <Bar
                                    dataKey="despesas"
                                    name="Despesas"
                                    fill="#f43f5e"
                                    maxBarSize={48}
                                    shape={
                                        <FinancialBarShape fillColor="#f43f5e" />
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">
                        Movimentações recentes
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                        Consulte os lançamentos cadastrados e seus documentos.
                    </p>
                </div>

                {lancamentos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                        <FileText className="mx-auto h-8 w-8 text-white/20" />

                        <p className="mt-3 text-sm font-medium text-white/40">
                            Nenhuma movimentação cadastrada.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lancamentos.map((lancamento) => {
                            const ehReceita = lancamento.type === "receita";

                            const ehDespesa = lancamento.type === "despesa";

                            return (
                                <article
                                    key={lancamento.id}
                                    className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10 lg:flex-row lg:items-center"
                                >
                                    <div
                                        className={cn(
                                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                                            ehReceita
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : ehDespesa
                                                  ? "bg-red-500/10 text-red-400"
                                                  : "bg-brand/10 text-brand",
                                        )}
                                    >
                                        <WalletCards className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-white">
                                                {lancamento.description}
                                            </h3>

                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                    ehReceita
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : ehDespesa
                                                          ? "bg-red-500/10 text-red-400"
                                                          : "bg-brand/10 text-brand",
                                                )}
                                            >
                                                {rotulosTipo[lancamento.type]}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                                            <span>
                                                {rotulosCategoria[
                                                    lancamento.category
                                                ] ?? lancamento.category}
                                            </span>

                                            <span>
                                                {formatFinancialDate(
                                                    lancamento.date,
                                                )}
                                            </span>

                                            {lancamento.attachment && (
                                                <span className="max-w-52 truncate text-brand">
                                                    {lancamento.attachment.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p
                                        className={cn(
                                            "shrink-0 text-lg font-extrabold",
                                            ehReceita
                                                ? "text-emerald-400"
                                                : ehDespesa
                                                  ? "text-red-400"
                                                  : "text-brand",
                                        )}
                                    >
                                        {ehReceita ? "+" : ehDespesa ? "-" : ""}
                                        {formatCurrencyValue(lancamento.amount)}
                                    </p>

                                    <div className="flex shrink-0 gap-2">
                                        {lancamento.attachment && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onAbrirAnexo(
                                                        lancamento.attachment!,
                                                    )
                                                }
                                                title="Abrir anexo"
                                                aria-label={`Abrir anexo de ${lancamento.description}`}
                                                className="rounded-xl border border-brand/20 bg-brand/10 p-2.5 text-brand transition-colors hover:bg-brand/20"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void onExcluirLancamento(
                                                    lancamento,
                                                )
                                            }
                                            title="Excluir lançamento"
                                            aria-label={`Excluir ${lancamento.description}`}
                                            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition-colors hover:bg-red-500/20"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>
    );
}
