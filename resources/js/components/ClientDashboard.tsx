/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    PlusCircle,
    Settings,
    LogOut,
    Bell,
    Search,
    Video,
    ChevronRight,
    TrendingUp,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { User, ReportData, Task } from "../types";
import { cn } from "../lib/utils";

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}

const mockChartData: ReportData[] = [
    { month: "Jan", value: 4000 },
    { month: "Fev", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Abr", value: 4500 },
    { month: "Mai", value: 6000 },
];

const mockWeeklyData = [
    { day: "Seg", value: 12 },
    { day: "Ter", value: 19 },
    { day: "Qua", value: 3 },
    { day: "Qui", value: 5 },
    { day: "Sex", value: 2 },
];

const mockTasks: Task[] = [
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

export default function ClientDashboard({
    user,
    onLogout,
}: ClientDashboardProps) {
    const [activeTab, setActiveTab] = useState("inicio");

    return (
        <div className="flex h-screen overflow-hidden text-slate-200">
            <aside className="w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col hidden lg:flex">
                <div className="p-8 flex items-center gap-3">
                    <div className="p-2 bg-brand rounded-xl shadow-lg shadow-brand/40">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-white">
                        WebContabil
                    </span>
                </div>

                <nav className="flex-grow px-6 space-y-2 py-6">
                    <SidebarItem
                        active={activeTab === "inicio"}
                        onClick={() => setActiveTab("inicio")}
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Dashboard"
                    />
                    <SidebarItem
                        active={activeTab === "servicos"}
                        onClick={() => setActiveTab("servicos")}
                        icon={<FileText className="w-5 h-5" />}
                        label="Planos & Serviços"
                    />
                    <SidebarItem
                        active={activeTab === "agenda"}
                        onClick={() => setActiveTab("agenda")}
                        icon={<Calendar className="w-5 h-5" />}
                        label="Agenda Fiscal"
                    />
                    <SidebarItem
                        active={activeTab === "gestao"}
                        onClick={() => setActiveTab("gestao")}
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        label="Gestão de Tarefas"
                    />
                </nav>

                <div className="p-6 border-t border-white/5 space-y-2">
                    <SidebarItem
                        active={false}
                        onClick={() => {}}
                        icon={<Settings className="w-6 h-6" />}
                        label="Configurações"
                    />
                    <SidebarItem
                        active={false}
                        onClick={onLogout}
                        icon={<LogOut className="w-6 h-6" />}
                        label="Encerrar Sessão"
                    />
                </div>
            </aside>

            <main className="flex-grow flex flex-col overflow-y-auto">
                <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <Search className="w-4 h-4 text-white/20" />
                        <input
                            placeholder="Buscar notas, relatórios..."
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <button className="relative p-2 text-white/40 hover:text-brand transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-slate-900 shadow-lg shadow-brand/20"></span>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white tracking-tight">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase mt-0.5">
                                    {user.razaoSocial}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-brand font-black text-lg shadow-xl">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 space-y-10">
                    <div className="flex justify-between items-end">
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
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                                Exportar PDF
                            </button>
                            <button className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/40">
                                Novo Lançamento
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            title="Fluxo de Caixa"
                            value="R$ 12.450,00"
                            trend="+12%"
                            trendUp={true}
                        />
                        <StatCard
                            title="Pendências"
                            value="03"
                            trend="Urgente"
                            trendUp={false}
                        />
                        <StatCard
                            title="Impostos"
                            value="R$ 1.230,00"
                            trend="Amanhã"
                            trendUp={false}
                        />
                        <StatCard
                            title="Economia"
                            value="R$ 2.400,00"
                            trend="Trimestre"
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
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockChartData}>
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
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockWeeklyData}>
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
                                {mockTasks.map((task) => (
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
            </main>
        </div>
    );
}

function StatCard({
    title,
    value,
    trend,
    trendUp,
}: {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
}) {
    return (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-black mb-4">
                {title}
            </p>
            <h2 className="text-3xl font-black text-white tracking-tight">
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

function SidebarItem({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-4 rounded-3xl transition-all w-full text-left",
                active
                    ? "bg-brand text-white border border-brand/50 shadow-2xl shadow-brand/40"
                    : "text-white/40 hover:text-white hover:bg-white/5",
            )}
        >
            <div className="w-10 h-10 rounded-3xl bg-white/5 flex items-center justify-center">
                {icon}
            </div>
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
}

function QuickAction({ icon, label }: { icon: ReactNode; label: string }) {
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
