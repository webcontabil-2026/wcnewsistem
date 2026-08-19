/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef, useState, ReactNode } from "react";
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
    FolderOpen,
    MessageSquare,
    WalletCards,
    Calendar,
    PlusCircle,
    Settings,
    LogOut,
    Bell,
    Search,
    Video,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Clock,
    CheckCircle2,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
} from "lucide-react";
import { User, ReportData, Task } from "../types";
import { cn } from "../lib/utils";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";

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

    /*
     * Controla a rolagem das funções do menu lateral.
     * As setas aparecem somente quando existe conteúdo
     * escondido acima ou abaixo da área visível.
     */
    const sidebarNavRef = useRef<HTMLElement | null>(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const updateSidebarScroll = () => {
        const menu = sidebarNavRef.current;

        if (!menu) {
            return;
        }

        setCanScrollUp(menu.scrollTop > 1);

        setCanScrollDown(
            menu.scrollTop + menu.clientHeight < menu.scrollHeight - 1,
        );
    };

    /*
     * Move o menu suavemente sem impedir a rolagem
     * pelo mouse, touchpad ou toque na tela.
     */
    const scrollSidebar = (direction: "up" | "down") => {
        sidebarNavRef.current?.scrollBy({
            top: direction === "down" ? 180 : -180,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        updateSidebarScroll();

        window.addEventListener("resize", updateSidebarScroll);

        return () => {
            window.removeEventListener("resize", updateSidebarScroll);
        };
    }, []);

    /*
     * Controla a largura do menu lateral.
     * Quando verdadeiro, apenas os ícones das funcionalidades permanecem visíveis.
     */
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    /*
     * Controla a abertura do menu em celulares e tablets.
     * Em telas grandes, o menu lateral permanente continua sendo utilizado.
     */
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <aside
                className={cn(
                    /*
                     * O menu altera somente a própria largura.
                     * O conteúdo principal utiliza flex-grow e ocupa automaticamente
                     * todo o espaço liberado quando o menu é recolhido.
                     */
                    "hidden lg:flex shrink-0 flex-col bg-white/5 backdrop-blur-2xl",
                    "border-r border-white/10 transition-[width] duration-300",
                    isSidebarCollapsed ? "w-24" : "w-72",
                )}
            >
                <div
                    className={cn(
                        "min-h-24 px-5 flex items-center border-b border-white/5",
                        isSidebarCollapsed
                            ? "justify-center"
                            : "justify-between gap-3",
                    )}
                >
                    <div
                        className={cn(
                            "flex items-center min-w-0",
                            isSidebarCollapsed ? "justify-center" : "gap-3",
                        )}
                    >
                        <BrandLogo
                            size="client"
                            className="shadow-lg shadow-brand/40"
                        />

                        {!isSidebarCollapsed && (
                            <span
                                className="font-bold text-xl tracking-tighter
                               text-white whitespace-nowrap"
                            >
                                WebContabil
                            </span>
                        )}
                    </div>

                    {!isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(true)}
                            className="w-10 h-10 shrink-0 rounded-xl
                           flex items-center justify-center
                           text-white/40 hover:text-brand
                           hover:bg-white/5 transition-colors"
                            aria-label="Recolher menu lateral"
                            title="Recolher menu"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isSidebarCollapsed && (
                    <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="mx-auto mt-4 w-11 h-11 rounded-xl
                       flex items-center justify-center
                       text-white/40 hover:text-brand
                       hover:bg-white/5 transition-colors"
                        aria-label="Expandir menu lateral"
                        title="Expandir menu"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </button>
                )}
                <div className="relative flex-grow min-h-0 py-8">
                    <nav
                        ref={sidebarNavRef}
                        onScroll={updateSidebarScroll}
                        className={cn(
                            "wc-sidebar-scroll h-full overflow-y-auto",
                            "space-y-2 py-6",
                            isSidebarCollapsed ? "px-3" : "px-6",
                        )}
                    >
                        {/*
                         * Funções principais disponíveis para o cliente.
                         * O conteúdo de cada aba será implementado separadamente.
                         */}
                        <SidebarItem
                            active={activeTab === "inicio"}
                            onClick={() => setActiveTab("inicio")}
                            icon={<LayoutDashboard className="w-5 h-5" />}
                            label="Início"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "servicos"}
                            onClick={() => setActiveTab("servicos")}
                            icon={<FileText className="w-5 h-5" />}
                            label="Serviços"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "documentos"}
                            onClick={() => setActiveTab("documentos")}
                            icon={<FolderOpen className="w-5 h-5" />}
                            label="Documentos"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "conversas"}
                            onClick={() => setActiveTab("conversas")}
                            icon={<MessageSquare className="w-5 h-5" />}
                            label="Conversas"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "agenda"}
                            onClick={() => setActiveTab("agenda")}
                            icon={<Calendar className="w-5 h-5" />}
                            label="Agenda Fiscal"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "financeiro"}
                            onClick={() => setActiveTab("financeiro")}
                            icon={<WalletCards className="w-5 h-5" />}
                            label="Financeiro"
                            collapsed={isSidebarCollapsed}
                        />

                        {/*
                         * Reduz o espaçamento da área inferior quando o menu
                         * estiver exibindo somente os ícones.
                         */}
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={false}
                                onClick={() => {}}
                                icon={<Settings className="w-6 h-6" />}
                                label="Configurações"
                                collapsed={isSidebarCollapsed}
                            />
                            <SidebarItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Sair do sistema"
                                collapsed={isSidebarCollapsed}
                                danger
                            />
                        </div>
                    </nav>

                    {canScrollUp && (
                        <button
                            type="button"
                            onClick={() => scrollSidebar("up")}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-10
                                       w-8 h-8 rounded-full
                                       flex items-center justify-center
                                       bg-slate-950/40 backdrop-blur-md
                                       text-white/60 hover:text-white
                                       hover:bg-slate-950/70
                                       transition-all"
                            aria-label="Exibir funções anteriores"
                            title="Subir no menu"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}

                    {canScrollDown && (
                        <button
                            type="button"
                            onClick={() => scrollSidebar("down")}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10
                                       w-8 h-8 rounded-full
                                       flex items-center justify-center
                                       bg-slate-950/40 backdrop-blur-md
                                       text-white/60 hover:text-white
                                       hover:bg-slate-950/70
                                       transition-all"
                            aria-label="Exibir mais funções"
                            title="Descer no menu"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </aside>

            {/*
             * Menu móvel do painel do cliente.
             * O fundo escurecido fecha o menu quando o usuário toca fora do painel.
             */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Fechar menu lateral"
                    />

                    <aside
                        className="relative z-10 w-[min(20rem,88vw)] h-full
                       flex flex-col bg-slate-900
                       border-r border-white/10 shadow-2xl"
                        aria-label="Menu do painel do cliente"
                    >
                        <div
                            className="min-h-24 px-5 flex items-center
                           justify-between gap-3
                           border-b border-white/10"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <BrandLogo
                                    size="client"
                                    className="shadow-lg shadow-brand/40"
                                />

                                <span
                                    className="font-bold text-xl tracking-tighter
                                   text-white whitespace-nowrap"
                                >
                                    WebContabil
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-11 h-11 shrink-0 rounded-xl
                               flex items-center justify-center
                               text-white/50 hover:text-brand
                               hover:bg-white/5 transition-colors"
                                aria-label="Fechar menu lateral"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-grow overflow-y-auto px-5 py-6 space-y-2">
                            <SidebarItem
                                active={activeTab === "inicio"}
                                onClick={() => {
                                    setActiveTab("inicio");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="Dashboard"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "servicos"}
                                onClick={() => {
                                    setActiveTab("servicos");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<FileText className="w-5 h-5" />}
                                label="Planos & Serviços"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "agenda"}
                                onClick={() => {
                                    setActiveTab("agenda");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<Calendar className="w-5 h-5" />}
                                label="Agenda Fiscal"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "gestao"}
                                onClick={() => {
                                    setActiveTab("gestao");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                label="Gestão de Tarefas"
                                collapsed={false}
                            />
                        </nav>

                        <div className="p-5 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={false}
                                onClick={() => setIsMobileMenuOpen(false)}
                                icon={<Settings className="w-5 h-5" />}
                                label="Configurações e preferências"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Encerrar Sessão"
                                collapsed={false}
                                danger
                            />
                        </div>
                    </aside>
                </div>
            )}

            <main className="flex-grow flex flex-col overflow-y-auto">
                {/*
                 * O cabeçalho utiliza altura mínima e espaçamento fluido para manter
                 * os elementos confortáveis em notebooks e monitores maiores.
                 */}
                <header
                    className="min-h-24 bg-white/5 backdrop-blur-md
               border-b border-white/10 flex flex-wrap
               items-center justify-between gap-4
               px-4 sm:px-6 xl:px-10 py-3
               sticky top-0 z-10"
                >
                    <div
                        className="flex items-center gap-4 bg-white/5
               px-4 sm:px-5 py-3 rounded-2xl
               border border-white/5 backdrop-blur-sm
               w-full sm:w-auto sm:min-w-72"
                    >
                        <Search className="w-4 h-4 text-white/20" />
                        <input
                            placeholder="Buscar notas, relatórios..."
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                        />
                    </div>

                    <div
                        className="flex items-center justify-end
               gap-3 sm:gap-5 xl:gap-8
               w-full sm:w-auto"
                    >
                        {/*
                         * Em celulares e tablets, abre a versão móvel do menu lateral.
                         */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-11 h-11 shrink-0 rounded-xl
               border border-white/10 bg-white/5
               flex items-center justify-center
               text-white hover:text-brand transition-colors"
                            aria-label="Abrir menu lateral"
                            title="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <ThemeToggle />

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

                {/*
                 * O conteúdo utiliza margens menores em telas estreitas e aumenta
                 * gradualmente o espaçamento conforme a largura disponível.
                 */}
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
    collapsed,
    danger = false,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            /*
             * O título permite identificar a funcionalidade quando
             * o menu está compacto e apresenta somente os ícones.
             */
            title={collapsed ? label : undefined}
            aria-label={label}
            className={cn(
                "group wc-sidebar-item flex items-center rounded-3xl transition-all w-full",
                collapsed ? "justify-center p-2" : "gap-3 px-4 py-2 text-left",
                active
                    ? "bg-brand text-white border border-brand/50 shadow-2xl shadow-brand/40"
                    : danger
                      ? "wc-sidebar-item-danger"
                      : "wc-sidebar-item-default",
            )}
        >
            <div
                className="
        wc-sidebar-item-icon
        w-10 h-10 shrink-0 rounded-3xl
        bg-white/5 flex items-center justify-center
        transition-colors
    "
            >
                {icon}
            </div>

            {!collapsed && (
                <span className="text-sm font-bold whitespace-nowrap">
                    {label}
                </span>
            )}
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
