import { ReactNode } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    PlusCircle,
    TrendingUp,
    Video,
} from "lucide-react";

import { ReportData, Task, User } from "../../types";
import { cn } from "../../lib/utils";
import { formatCurrencyValue } from "./financeiro/formatadores";

interface DashboardInicioProps {
    user: User;
    receitas: number;
    despesas: number;
    saldo: number;
    totalLancamentos: number;
    exportandoPdf: boolean;
    onExportarPdf: () => void | Promise<void>;
    onNovoLancamento: () => void;
}

const dadosGraficoMensal: ReportData[] = [
    { month: "Jan", value: 4000 },
    { month: "Fev", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Abr", value: 4500 },
    { month: "Mai", value: 6000 },
];

const dadosAtividadeSemanal = [
    { day: "Seg", value: 12 },
    { day: "Ter", value: 19 },
    { day: "Qua", value: 3 },
    { day: "Qui", value: 5 },
    { day: "Sex", value: 2 },
];

const tarefas: Task[] = [
    {
        id: "1",
        title: "Enviar NF de Serviços",
        dueDate: "2026-05-16",
        status: "PENDING",
    },
    {
        id: "2",
        title: "Reunião Trimestral",
        dueDate: "2026-05-18",
        status: "IN_PROGRESS",
    },
    {
        id: "3",
        title: "Assinar Balancete",
        dueDate: "2026-05-15",
        status: "COMPLETED",
    },
];

/**
 * Conteúdo principal da aba inicial do cliente.
 *
 * Exibe:
 * - resumo financeiro;
 * - gráficos;
 * - ações rápidas;
 * - calendário;
 * - atalhos do financeiro.
 */
export default function DashboardInicio({
    user,
    receitas,
    despesas,
    saldo,
    totalLancamentos,
    exportandoPdf,
    onExportarPdf,
    onNovoLancamento,
}: DashboardInicioProps) {
    return (
        <div className="p-4 sm:p-6 xl:p-10 space-y-8 xl:space-y-10">
            <div
                className="flex flex-col md:flex-row
               md:justify-between md:items-end gap-6"
            >
                <div>
                    <p className="text-brand font-bold text-xs uppercase tracking-[0.2em] mb-1">
                        Visão Geral
                    </p>

                    <h1 className="text-4xl font-extrabold text-white tracking-tighter">
                        Olá, {user.name.split(" ")[0]}.
                    </h1>

                    <p className="text-white/40 font-medium mt-1">
                        Estatísticas e fluxos de caixa em tempo real.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => void onExportarPdf()}
                        disabled={exportandoPdf}
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors disabled:cursor-wait disabled:opacity-60"
                    >
                        {exportandoPdf ? "Exportando..." : "Exportar PDF"}
                    </button>

                    <button
                        type="button"
                        onClick={onNovoLancamento}
                        className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/40"
                    >
                        Novo Lançamento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Receitas"
                    value={formatCurrencyValue(receitas)}
                    trend="Entradas"
                    trendUp={true}
                />

                <StatCard
                    title="Despesas"
                    value={formatCurrencyValue(despesas)}
                    trend="Saídas"
                    trendUp={false}
                />

                <StatCard
                    title="Saldo"
                    value={formatCurrencyValue(saldo)}
                    trend={saldo >= 0 ? "Positivo" : "Negativo"}
                    trendUp={saldo >= 0}
                />

                <StatCard
                    title="Lançamentos"
                    value={String(totalLancamentos)}
                    trend="Total"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-white tracking-tight">
                                Controle Mensal
                            </h3>

                            <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">
                                Faturamento vs Despesas
                            </p>
                        </div>

                        <TrendingUp className="w-6 h-6 text-brand" />
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                            initialDimension={{
                                width: 1,
                                height: 288,
                            }}
                        >
                            <BarChart data={dadosGraficoMensal}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(255,255,255,0.05)"
                                />

                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "rgba(255,255,255,0.3)",
                                        fontWeight: "bold",
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "rgba(255,255,255,0.3)",
                                        fontWeight: "bold",
                                    }}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(255,255,255,0.05)",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow:
                                            "0 25px 50px -12px rgb(0 0 0 / 0.5)",
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    fill="#0C447C"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-white tracking-tight">
                                Atividade
                            </h3>

                            <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">
                                Frequência Semanal
                            </p>
                        </div>

                        <Clock className="w-6 h-6 text-brand" />
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                            initialDimension={{
                                width: 1,
                                height: 288,
                            }}
                        >
                            <LineChart data={dadosAtividadeSemanal}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(255,255,255,0.05)"
                                />

                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "rgba(255,255,255,0.3)",
                                        fontWeight: "bold",
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "rgba(255,255,255,0.3)",
                                        fontWeight: "bold",
                                    }}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#185FA5"
                                    strokeWidth={4}
                                    dot={{
                                        r: 6,
                                        fill: "#185FA5",
                                        strokeWidth: 2,
                                        stroke: "#0f172a",
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10">
                    <h3 className="font-bold text-xl text-white mb-8 flex items-center gap-3">
                        <PlusCircle className="w-6 h-6 text-brand" />
                        Serviços Rápidos
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <QuickAction
                            icon={<Video className="w-8 h-8" />}
                            label="Agendar Reunião"
                        />

                        <QuickAction
                            icon={<FileText className="w-8 h-8" />}
                            label="Solictar Guia"
                        />

                        <QuickAction
                            icon={<CheckCircle2 className="w-8 h-8" />}
                            label="Validar NF-e"
                        />
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 flex flex-col">
                    <h3 className="font-bold text-xl text-white mb-8 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-brand" />
                        Calendário
                    </h3>

                    <div className="space-y-6 flex-grow">
                        {tarefas.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-5 p-4 rounded-[20px] hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
                            >
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                        task.status === "COMPLETED"
                                            ? "bg-success text-white"
                                            : "bg-white/5 text-white/40",
                                    )}
                                >
                                    {task.status === "COMPLETED" ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <Clock className="w-6 h-6" />
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <p className="text-sm font-bold text-white mb-1">
                                        {task.title}
                                    </p>

                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">
                                        {task.dueDate}
                                    </p>
                                </div>

                                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand transition-colors" />
                            </div>
                        ))}
                    </div>

                    <button className="mt-8 w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand hover:bg-brand/10 border border-brand/20 rounded-2xl transition-all">
                        Painel Geral
                    </button>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
}

/**
 * Card utilizado no resumo financeiro da tela inicial.
 */
function StatCard({ title, value, trend, trendUp }: StatCardProps) {
    return (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-black mb-4">
                {title}
            </p>

            <h2 className="whitespace-nowrap text-xl 2xl:text-2xl font-black text-white tracking-tight tabular-nums">
                {value}
            </h2>

            <p
                className={cn(
                    "mt-4 text-sm font-bold uppercase tracking-[0.2em]",
                    trendUp ? "text-success" : "text-white/50",
                )}
            >
                {trend}
            </p>
        </div>
    );
}

interface QuickActionProps {
    icon: ReactNode;
    label: string;
}

/**
 * Atalho visual para funções rápidas do painel.
 */
function QuickAction({ icon, label }: QuickActionProps) {
    return (
        <button className="rounded-3xl border border-white/10 p-5 text-left bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-brand">{icon}</span>

                <ChevronRight className="w-5 h-5 text-white/30" />
            </div>

            <p className="text-sm font-bold text-white">{label}</p>
        </button>
    );
}
