import type { ReactNode } from "react";
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
    CalendarDays,
    ChevronRight,
    FileText,
    MessageSquareText,
    PlusCircle,
    ReceiptText,
    TrendingUp,
} from "lucide-react";

import type { User } from "../../types";
import type { DadosGraficoFinanceiro } from "./financeiro/tipos";
import type { SolicitacaoCliente } from "./solicitacoes/tipos";
import { formatCurrencyValue } from "./financeiro/formatadores";

type AbaCliente =
    | "servicos"
    | "solicitacoes"
    | "documentos"
    | "conversas"
    | "agenda"
    | "financeiro";

interface DashboardInicioProps {
    user: User;
    receitas: number;
    despesas: number;
    saldo: number;
    totalLancamentos: number;
    dadosGrafico: DadosGraficoFinanceiro[];
    solicitacoes: SolicitacaoCliente[];
    exportandoPdf: boolean;
    onExportarPdf: () => void | Promise<void>;
    onNovoLancamento: () => void;
    onNavegar: (aba: AbaCliente) => void;
}

const rotulosStatus = {
    pendente: "Novas",
    aguardando_cliente: "Aguardando",
    em_andamento: "Em andamento",
    concluida: "Concluídas",
    cancelada: "Canceladas",
};

export default function DashboardInicio({
    user,
    receitas,
    despesas,
    saldo,
    totalLancamentos,
    dadosGrafico,
    solicitacoes,
    exportandoPdf,
    onExportarPdf,
    onNovoLancamento,
    onNavegar,
}: DashboardInicioProps) {
    const possuiDadosFinanceiros = dadosGrafico.some(
        (item) => item.receitas > 0 || item.despesas > 0,
    );
    const atividadeSolicitacoes = Object.entries(rotulosStatus).map(
        ([status, label]) => ({
            label,
            total: solicitacoes.filter((item) => item.status === status).length,
        }),
    );
    const possuiSolicitacoes = solicitacoes.length > 0;

    return (
        <div className="space-y-8 p-4 pb-16 sm:p-6 xl:space-y-10 xl:p-10">
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">Visão geral</p>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white">Olá, {user.name.split(" ")[0]}.</h1>
                    <p className="mt-1 font-medium text-white/50">Informações reais da sua conta em um só lugar.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => void onExportarPdf()} disabled={exportandoPdf || totalLancamentos === 0} className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                        {exportandoPdf ? "Exportando..." : "Exportar PDF"}
                    </button>
                    <button type="button" onClick={onNovoLancamento} className="rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-light">Novo lançamento</button>
                </div>
            </header>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Receitas" value={formatCurrencyValue(receitas)} detail="Ver entradas" onClick={() => onNavegar("financeiro")} />
                <StatCard title="Despesas" value={formatCurrencyValue(despesas)} detail="Ver saídas" onClick={() => onNavegar("financeiro")} />
                <StatCard title="Saldo" value={formatCurrencyValue(saldo)} detail={saldo >= 0 ? "Saldo positivo" : "Atenção ao saldo"} onClick={() => onNavegar("financeiro")} />
                <StatCard title="Lançamentos" value={String(totalLancamentos)} detail="Abrir financeiro" onClick={() => onNavegar("financeiro")} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <ChartCard className="xl:col-span-2" title="Fluxo financeiro" subtitle="Receitas e despesas do período atual" icon={<TrendingUp className="h-6 w-6" />}>
                    {possuiDadosFinanceiros ? (
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 288 }}>
                            <BarChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={48} />
                                <Tooltip formatter={(value, name) => [formatCurrencyValue(Number(value)), name === "receitas" ? "Receitas" : "Despesas"]} />
                                <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[5, 5, 0, 0]} />
                                <Bar dataKey="despesas" name="Despesas" fill="#f43f5e" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart title="Sem dados financeiros" description="Cadastre seu primeiro lançamento para preencher este gráfico." action="Novo lançamento" onClick={onNovoLancamento} />
                    )}
                </ChartCard>

                <ChartCard title="Solicitações" subtitle="Distribuição por status" icon={<ReceiptText className="h-6 w-6" />}>
                    {possuiSolicitacoes ? (
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 288 }}>
                            <BarChart data={atividadeSolicitacoes} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="label" width={88} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <Tooltip formatter={(value) => [Number(value), "Solicitações"]} />
                                <Bar dataKey="total" fill="#1677a6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart title="Nenhuma solicitação" description="Escolha um serviço para iniciar um atendimento." action="Ver serviços" onClick={() => onNavegar("servicos")} />
                    )}
                </ChartCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 xl:col-span-2 sm:p-8">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-white"><PlusCircle className="h-6 w-6 text-brand" />Acessos rápidos</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <QuickAction icon={<ReceiptText className="h-7 w-7" />} label="Solicitar serviço" description="Escolha o atendimento" onClick={() => onNavegar("servicos")} />
                        <QuickAction icon={<FileText className="h-7 w-7" />} label="Meus documentos" description="Abra seus comprovantes" onClick={() => onNavegar("documentos")} />
                        <QuickAction icon={<MessageSquareText className="h-7 w-7" />} label="Conversas" description="Fale no atendimento" onClick={() => onNavegar("conversas")} />
                    </div>
                </section>

                <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-white"><CalendarDays className="h-6 w-6 text-brand" />Próximos passos</h2>
                    <div className="mt-5 space-y-3">
                        <LinkAction label="Agenda fiscal" detail="Consulte os próximos prazos" onClick={() => onNavegar("agenda")} />
                        <LinkAction label="Acompanhar pedidos" detail={`${solicitacoes.length} solicitação(ões)`} onClick={() => onNavegar("solicitacoes")} />
                        <LinkAction label="Financeiro" detail={`${totalLancamentos} lançamento(s)`} onClick={() => onNavegar("financeiro")} />
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ title, value, detail, onClick }: { title: string; value: string; detail: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="group rounded-[28px] border border-white/10 bg-white/5 p-6 text-left hover:border-brand/40 hover:bg-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</p>
            <p className="mt-4 whitespace-nowrap text-2xl font-black tabular-nums text-white">{value}</p>
            <span className="mt-4 flex items-center gap-1 text-xs font-bold text-brand">{detail}<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </button>
    );
}

function ChartCard({ title, subtitle, icon, className = "", children }: { title: string; subtitle: string; icon: ReactNode; className?: string; children: ReactNode }) {
    return (
        <section className={`${className} rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-8`}>
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-xl font-bold text-white">{title}</h2><p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/40">{subtitle}</p></div>
                <span className="text-brand">{icon}</span>
            </div>
            <div className="mt-6 h-72">{children}</div>
        </section>
    );
}

function EmptyChart({ title, description, action, onClick }: { title: string; description: string; action: string; onClick: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
            <p className="font-extrabold text-white">{title}</p><p className="mt-2 max-w-sm text-sm text-white/50">{description}</p>
            <button type="button" onClick={onClick} className="mt-5 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-light">{action}</button>
        </div>
    );
}

function QuickAction({ icon, label, description, onClick }: { icon: ReactNode; label: string; description: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left hover:border-brand/40 hover:bg-white/10">
            <span className="text-brand">{icon}</span><p className="mt-4 font-bold text-white">{label}</p><p className="mt-1 text-xs text-white/50">{description}</p>
        </button>
    );
}

function LinkAction({ label, detail, onClick }: { label: string; detail: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10">
            <div className="min-w-0 flex-grow"><p className="font-bold text-white">{label}</p><p className="mt-1 text-xs text-white/50">{detail}</p></div><ChevronRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
        </button>
    );
}
