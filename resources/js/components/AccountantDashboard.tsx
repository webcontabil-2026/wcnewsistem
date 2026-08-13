/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from "react";

import {
    Users,
    Inbox,
    Send,
    FileCheck,
    Search,
    Bell,
    LogOut,
    Settings,
    Filter,
    MoreHorizontal,
    UserCheck,
    Clock,
    AlertCircle,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
} from "lucide-react";
import { User } from "../types";
import { cn } from "../lib/utils";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";

interface AccountantDashboardProps {
    user: User;
    onLogout: () => void;
}

const mockRequests = [
    {
        id: "1",
        client: "Alpha Tech Ltda",
        type: "Folha de Pagamento",
        date: "Há 10 min",
        status: "URGENTE",
    },
    {
        id: "2",
        client: "Bazar do Sol",
        type: "Conciliação Bancária",
        date: "Há 1 hora",
        status: "NORMAL",
    },
    {
        id: "3",
        client: "Construtora Forte",
        type: "DRE Trimestral",
        date: "Há 5 horas",
        status: "AGUARDANDO",
    },
];

export default function AccountantDashboard({
    user,
    onLogout,
}: AccountantDashboardProps) {
    const [activeTab, setActiveTab] = useState("recebidos");
    /*
     * Controla a exibição compacta da navegação lateral do contador.
     * Quando ativo, apenas os símbolos das funcionalidades permanecem visíveis.
     */
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    /*
     * Controla a abertura do menu lateral em celulares e tablets.
     * O menu permanente continua sendo usado em telas maiores.
     */
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    /*
     * Controla a abertura do painel retrátil de solicitações.
     * O painel inicia fechado para liberar mais espaço ao ambiente de trabalho.
     */
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);
    /*
     * Controla o filtro das solicitações exibidas.
     * O valor "TODOS" mantém todos os protocolos visíveis.
     */
    const [requestFilter, setRequestFilter] = useState<
        "TODOS" | "URGENTE" | "NORMAL" | "AGUARDANDO"
    >("TODOS");

    /*
     * Retorna somente as solicitações correspondentes ao filtro selecionado.
     */
    const filteredRequests =
        requestFilter === "TODOS"
            ? mockRequests
            : mockRequests.filter(
                  (request) => request.status === requestFilter,
              );
    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <aside
                className={cn(
                    /*
                     * A navegação pode ser exibida com a marca completa
                     * ou recolhida para mostrar somente os símbolos.
                     */
                    "hidden lg:flex shrink-0 flex-col bg-white/5 backdrop-blur-2xl",
                    "border-r border-white/10 transition-[width] duration-300",
                    isSidebarCollapsed ? "w-24" : "w-80",
                )}
            >
                <div
                    className={cn(
                        "min-h-24 px-4 flex items-center border-b border-white/10",
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
                            size="accountant"
                            className="shadow-xl shadow-brand/40"
                        />

                        {!isSidebarCollapsed && (
                            <span
                                className="min-w-0 font-bold text-lg xl:text-xl
               tracking-tighter text-white whitespace-nowrap"
                            >
                                WebContabil Worker
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
                {/*
                 * As funcionalidades apresentam ícone e texto no menu expandido.
                 * No modo compacto, os textos são ocultados e permanecem acessíveis
                 * pelo título exibido ao posicionar o mouse sobre cada botão.
                 */}
                <nav
                    className={cn(
                        "flex-grow space-y-2 py-6",
                        isSidebarCollapsed ? "px-3" : "px-6",
                    )}
                    aria-label="Navegação do contador"
                >
                    <SideNavItem
                        active={isRequestsOpen}
                        onClick={() => {
                            /*
                             * Mantém a funcionalidade selecionada e abre
                             * a caixa com as solicitações recebidas.
                             */
                            setActiveTab("recebidos");
                            setIsRequestsOpen(true);
                        }}
                        icon={<Users className="w-6 h-6" />}
                        label="Solicitações"
                        collapsed={isSidebarCollapsed}
                    />

                    <SideNavItem
                        active={activeTab === "processamentos"}
                        onClick={() => setActiveTab("processamentos")}
                        icon={<FileCheck className="w-6 h-6" />}
                        label="Processamentos"
                        collapsed={isSidebarCollapsed}
                    />

                    <SideNavItem
                        active={activeTab === "configuracoes"}
                        onClick={() => setActiveTab("configuracoes")}
                        icon={<Settings className="w-6 h-6" />}
                        label="Configurações"
                        collapsed={isSidebarCollapsed}
                    />
                </nav>

                <div
                    className={cn(
                        "border-t border-white/10",
                        isSidebarCollapsed ? "p-3" : "p-6",
                    )}
                >
                    <SideNavItem
                        active={false}
                        onClick={onLogout}
                        icon={<LogOut className="w-6 h-6" />}
                        label="Encerrar Sessão"
                        collapsed={isSidebarCollapsed}
                    />
                </div>
            </aside>

            {/*
             * Menu móvel do contador.
             * O painel preserva as mesmas funcionalidades disponíveis no desktop.
             */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/*
                     * A camada escurecida fecha o menu quando o usuário toca
                     * fora do painel lateral.
                     */}
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70
                       backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Fechar menu lateral"
                    />

                    <aside
                        className="relative z-10 h-full
                       w-[min(21rem,90vw)]
                       flex flex-col bg-slate-900
                       border-r border-white/10 shadow-2xl"
                        aria-label="Menu móvel do contador"
                    >
                        <div
                            className="min-h-24 px-5 flex items-center
                           justify-between gap-3
                           border-b border-white/10"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <BrandLogo
                                    size="accountant"
                                    className="shadow-xl shadow-brand/40"
                                />

                                <span
                                    className="font-bold text-lg tracking-tighter
                                   text-white whitespace-nowrap"
                                >
                                    WebContabil Worker
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-11 h-11 shrink-0 rounded-xl
                               flex items-center justify-center
                               text-white/50 transition-all duration-200
                               hover:text-red-400 hover:bg-red-500/10
                               hover:rotate-90 hover:scale-105
                               active:scale-90
                               focus-visible:outline-none
                               focus-visible:ring-2
                               focus-visible:ring-red-400"
                                aria-label="Fechar menu lateral"
                                title="Fechar menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav
                            className="flex-grow overflow-y-auto
                           px-5 py-6 space-y-2"
                            aria-label="Navegação móvel do contador"
                        >
                            <SideNavItem
                                active={isRequestsOpen}
                                onClick={() => {
                                    /*
                                     * Fecha a navegação móvel antes de abrir
                                     * o painel de solicitações.
                                     */
                                    setActiveTab("recebidos");
                                    setIsMobileMenuOpen(false);
                                    setIsRequestsOpen(true);
                                }}
                                icon={<Users className="w-6 h-6" />}
                                label="Solicitações"
                                collapsed={false}
                            />

                            <SideNavItem
                                active={activeTab === "processamentos"}
                                onClick={() => {
                                    setActiveTab("processamentos");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<FileCheck className="w-6 h-6" />}
                                label="Processamentos"
                                collapsed={false}
                            />

                            <SideNavItem
                                active={activeTab === "configuracoes"}
                                onClick={() => {
                                    setActiveTab("configuracoes");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<Settings className="w-6 h-6" />}
                                label="Configurações"
                                collapsed={false}
                            />
                        </nav>

                        <div className="p-5 border-t border-white/10">
                            <SideNavItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-6 h-6" />}
                                label="Encerrar Sessão"
                                collapsed={false}
                            />
                        </div>
                    </aside>
                </div>
            )}
            <main className="flex-grow flex flex-col overflow-hidden">
                {/*
                 * O cabeçalho segue o mesmo padrão responsivo do painel do cliente.
                 * A identidade principal permanece no menu lateral para evitar repetição.
                 */}
                <header
                    className="min-h-24 bg-white/5 backdrop-blur-md
               border-b border-white/10 flex flex-wrap
               items-center justify-between gap-4
               px-4 sm:px-6 xl:px-10 py-3
               sticky top-0 z-30"
                >
                    <div className="flex items-center gap-3">
                        <span
                            className="text-[10px] bg-brand text-white
                   px-3 py-2 rounded-full font-black uppercase
                   tracking-[0.2em] shadow-lg shadow-brand/40"
                            title="Registro profissional do contador"
                        >
                            CRC: {user.crc || "Não informado"}
                        </span>
                    </div>

                    <div
                        className="flex flex-wrap items-center justify-end
               gap-3 sm:gap-4 xl:gap-6
               w-full sm:w-auto"
                    >
                        {/*
                         * Abre a navegação do contador em celulares e tablets.
                         */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-11 h-11 shrink-0 rounded-xl
               border border-white/10 bg-white/5
               flex items-center justify-center
               text-white transition-all duration-200
               hover:text-brand hover:bg-white/10 hover:scale-105
               active:scale-95
               focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-brand"
                            aria-label="Abrir menu lateral"
                            title="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <ThemeToggle />
                        <div
                            className="order-first sm:order-none flex items-center gap-3
               px-4 py-3 bg-white/5 rounded-xl
               border border-white/5 backdrop-blur-md
               w-full sm:w-auto sm:min-w-56"
                        >
                            <Search className="w-4 h-4 text-white/20" />
                            <input
                                placeholder="Buscar cliente..."
                                className="bg-transparent border-none outline-none
           text-sm w-full sm:w-40 text-white
           placeholder:text-white/20"
                            />
                        </div>
                        <button className="p-3 text-white/20 hover:text-brand transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border border-slate-900"></span>
                        </button>
                        <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-white font-black shadow-xl">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex overflow-hidden">
                    {/*
                     * O painel de solicitações fica sobre o conteúdo principal.
                     * Ele só é renderizado quando o usuário solicita sua abertura.
                     */}
                    {isRequestsOpen && (
                        <div className="fixed inset-0 z-50">
                            <button
                                type="button"
                                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                                onClick={() => setIsRequestsOpen(false)}
                                aria-label="Fechar painel de solicitações"
                            />

                            <aside
                                className="relative z-10 h-full
                       w-[min(26rem,92vw)]
                       bg-slate-900 border-r border-white/10
                       flex flex-col shadow-2xl"
                                aria-label="Solicitações recebidas"
                            >
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div>
                                        <h3 className="font-bold text-white tracking-tight">
                                            Solicitações Recebidas
                                        </h3>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                                            Status de Protocolos
                                        </p>
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                /*
                                                 * Alterna sequencialmente entre os filtros disponíveis.
                                                 * Cada clique apresenta imediatamente o próximo grupo.
                                                 */
                                                const filters = [
                                                    "TODOS",
                                                    "URGENTE",
                                                    "NORMAL",
                                                    "AGUARDANDO",
                                                ] as const;

                                                const currentIndex =
                                                    filters.indexOf(
                                                        requestFilter,
                                                    );
                                                const nextIndex =
                                                    (currentIndex + 1) %
                                                    filters.length;

                                                setRequestFilter(
                                                    filters[nextIndex],
                                                );
                                            }}
                                            className={cn(
                                                "relative p-3 rounded-xl transition-all duration-200",
                                                "hover:-translate-y-0.5 hover:scale-105",
                                                "active:translate-y-0 active:scale-95",
                                                "focus-visible:outline-none focus-visible:ring-2",
                                                "focus-visible:ring-brand",
                                                requestFilter === "TODOS"
                                                    ? "bg-white/5 text-white/40 hover:text-brand hover:bg-white/10"
                                                    : "bg-brand text-white shadow-lg shadow-brand/30",
                                            )}
                                            aria-label={`Filtro atual: ${requestFilter}`}
                                            title={`Filtro: ${requestFilter}. Clique para alterar.`}
                                        >
                                            <Filter className="w-4 h-4" />

                                            {requestFilter !== "TODOS" && (
                                                <span
                                                    className="absolute -top-1 -right-1
                           w-2.5 h-2.5 rounded-full
                           bg-success border-2 border-slate-900"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsRequestsOpen(false)
                                            }
                                            className="p-3 bg-white/5 rounded-xl text-white/40
                   transition-all duration-200
                   hover:text-red-400 hover:bg-red-500/10
                   hover:rotate-90 hover:scale-105
                   active:rotate-90 active:scale-90
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-red-400"
                                            aria-label="Fechar solicitações"
                                            title="Fechar solicitações"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                                    {filteredRequests.map((req) => (
                                        <div
                                            key={req.id}
                                            className="p-6 bg-white/5 rounded-[24px] border border-white/5 hover:border-brand/30 hover:bg-white/10 cursor-pointer transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span
                                                    className={cn(
                                                        "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                                                        req.status === "URGENTE"
                                                            ? "bg-danger/20 text-danger"
                                                            : "bg-brand/20 text-brand",
                                                    )}
                                                >
                                                    {req.status}
                                                </span>
                                                <span className="text-[10px] font-black text-white/20 tracking-tighter uppercase">
                                                    {req.date}
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-white mb-2 leading-none tracking-tight">
                                                {req.client}
                                            </p>
                                            <p className="text-xs text-white/40 font-medium flex items-center gap-2">
                                                <FileCheck className="w-4 h-4 text-brand/60" />
                                                {req.type}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    )}

                    <div
                        className="relative flex-grow overflow-y-auto
               p-4 sm:p-8 xl:p-12
               flex items-center justify-center"
                    >
                        {/*
                         * A aba permanece disponível no ambiente de trabalho
                         * para abrir rapidamente as solicitações e novidades.
                         */}
                        <button
                            type="button"
                            onClick={() => setIsRequestsOpen(true)}
                            className="absolute top-4 left-4 sm:top-6 sm:left-6
                   flex items-center gap-3 rounded-2xl
                   border border-white/10 bg-white/5
                   px-4 py-3 text-white
                   hover:border-brand/40 hover:bg-white/10
                   transition-colors shadow-xl"
                            aria-label={`Abrir ${mockRequests.length} solicitações recebidas`}
                        >
                            <Inbox className="w-5 h-5 text-brand" />

                            <span className="text-sm font-bold">
                                Solicitações
                            </span>

                            <span
                                className="min-w-6 h-6 px-2 rounded-full bg-brand
                       text-white text-xs font-black
                       flex items-center justify-center"
                            >
                                {mockRequests.length}
                            </span>
                        </button>
                        <div
                            className="max-w-2xl w-full text-center
               space-y-7 sm:space-y-10
               pt-16 sm:pt-12 xl:pt-6"
                        >
                            {/*
                             * O símbolo decorativo fica oculto no celular para não disputar
                             * espaço com o conteúdo principal.
                             */}
                            <div
                                className="hidden sm:flex w-24 h-24 xl:w-32 xl:h-32
               bg-white/5 backdrop-blur-2xl
               rounded-[32px] xl:rounded-[40px]
               border border-white/10
               items-center justify-center mx-auto
               text-brand shadow-2xl"
                            >
                                <Inbox className="w-10 h-10 xl:w-12 xl:h-12" />
                            </div>
                            <div className="space-y-3">
                                <h2
                                    className="text-2xl sm:text-3xl xl:text-4xl
               font-extrabold text-white tracking-tighter"
                                >
                                    Seu Workspace Contábil.
                                </h2>
                                <p
                                    className="text-white/40 text-sm sm:text-base xl:text-lg
               font-medium max-w-md mx-auto leading-relaxed"
                                >
                                    Selecione uma solicitação para processar os
                                    dados e enviar os relatórios com
                                    criptografia total.
                                </p>
                            </div>
                            {/*
                             * Em celulares muito estreitos os cards são empilhados.
                             * A partir de 400 px, passam a ocupar duas colunas.
                             */}
                            <div
                                className="grid grid-cols-1 min-[400px]:grid-cols-2
               gap-4 sm:gap-6 pt-4 sm:pt-6"
                            >
                                <WorkspaceCard
                                    icon={<UserCheck className="w-6 h-6" />}
                                    label="Clientes Gerenciados"
                                    count="12 ativos"
                                />
                                <WorkspaceCard
                                    icon={<Send className="w-6 h-6" />}
                                    label="Processamentos"
                                    count="05 pautas"
                                />
                                <WorkspaceCard
                                    icon={<AlertCircle className="w-6 h-6" />}
                                    label="Prazos Fiscais"
                                    count="02 alertas"
                                />
                                <WorkspaceCard
                                    icon={<Clock className="w-6 h-6" />}
                                    label="Tempo de Resposta"
                                    count="~14 min"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SideNavItem({
    active,
    onClick,
    icon,
    label,
    collapsed,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            /*
             * Quando o menu está compacto, o título identifica
             * a funcionalidade ao posicionar o mouse sobre o símbolo.
             */
            title={collapsed ? label : undefined}
            aria-label={label}
            className={cn(
                "flex items-center rounded-3xl transition-all w-full",
                collapsed ? "justify-center p-2" : "gap-3 p-4 text-left",
                active
                    ? "bg-brand text-white border border-brand/50 shadow-2xl shadow-brand/40"
                    : "text-white/40 hover:text-white hover:bg-white/5",
            )}
        >
            <div
                className="w-10 h-10 shrink-0 rounded-3xl
                           bg-white/5 flex items-center justify-center"
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
function WorkspaceCard({
    icon,
    label,
    count,
}: {
    icon: ReactNode;
    label: string;
    count: string;
}) {
    return (
        <div className="p-5 sm:p-6 xl:p-8 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 text-left group hover:bg-white/10 hover:border-brand/30 transition-all cursor-pointer">
            <div className="text-brand mb-6 group-hover:scale-110 transition-transform w-fit p-3 bg-brand/10 rounded-2xl">
                {icon}
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                {label}
            </p>
            <p className="text-lg font-bold text-white tracking-tight">
                {count}
            </p>
        </div>
    );
}
