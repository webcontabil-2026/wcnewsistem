import {
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    FolderOpen,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    WalletCards,
    X,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils";
import BrandLogo from "../BrandLogo";

interface ClientSidebarProps {
    activeTab: string;
    menuMobileAberto: boolean;
    onSelecionarAba: (aba: string) => void;
    onAbrirConfiguracoes: () => void;
    onFecharMenuMobile: () => void;
    onLogout: () => void;
}

/**
 * Menu lateral do painel do cliente.
 *
 * Controla internamente:
 * - modo compacto/expandido no desktop;
 * - rolagem das opções;
 * - setas de navegação do menu.
 *
 * A abertura do menu móvel continua controlada pelo
 * componente pai porque o botão fica no cabeçalho.
 */
export default function ClientSidebar({
    activeTab,
    menuMobileAberto,
    onSelecionarAba,
    onAbrirConfiguracoes,
    onFecharMenuMobile,
    onLogout,
}: ClientSidebarProps) {
    const [menuRecolhido, setMenuRecolhido] = useState(false);

    const menuRef = useRef<HTMLElement | null>(null);

    const [podeRolarParaCima, setPodeRolarParaCima] = useState(false);

    const [podeRolarParaBaixo, setPodeRolarParaBaixo] = useState(false);

    /**
     * Atualiza a visibilidade das setas conforme
     * a posição atual da rolagem.
     */
    const atualizarRolagem = () => {
        const menu = menuRef.current;

        if (!menu) {
            return;
        }

        setPodeRolarParaCima(menu.scrollTop > 1);

        setPodeRolarParaBaixo(
            menu.scrollTop + menu.clientHeight < menu.scrollHeight - 1,
        );
    };

    /**
     * Move o menu suavemente para cima ou para baixo.
     */
    const rolarMenu = (direcao: "up" | "down") => {
        menuRef.current?.scrollBy({
            top: direcao === "down" ? 180 : -180,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        atualizarRolagem();

        window.addEventListener("resize", atualizarRolagem);

        return () => {
            window.removeEventListener("resize", atualizarRolagem);
        };
    }, []);

    /**
     * Seleciona uma aba e fecha automaticamente
     * o menu quando utilizado em dispositivos móveis.
     */
    const selecionarAbaMobile = (aba: string) => {
        onSelecionarAba(aba);
        onFecharMenuMobile();
    };

    return (
        <>
            <aside
                className={cn(
                    "hidden lg:flex shrink-0 flex-col bg-white/5 backdrop-blur-2xl",
                    "border-r border-white/10 transition-[width] duration-300",
                    menuRecolhido ? "w-24" : "w-72",
                )}
            >
                <div
                    className={cn(
                        "min-h-24 px-5 flex items-center border-b border-white/5",
                        menuRecolhido
                            ? "justify-center"
                            : "justify-between gap-3",
                    )}
                >
                    <div
                        className={cn(
                            "flex items-center min-w-0",
                            menuRecolhido ? "justify-center" : "gap-3",
                        )}
                    >
                        <BrandLogo
                            size="client"
                            className="shadow-lg shadow-brand/40"
                        />

                        {!menuRecolhido && (
                            <span className="font-bold text-xl tracking-tighter text-white whitespace-nowrap">
                                WebContabil
                            </span>
                        )}
                    </div>

                    {!menuRecolhido && (
                        <button
                            type="button"
                            onClick={() => setMenuRecolhido(true)}
                            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white/40 hover:text-brand hover:bg-white/5 transition-colors"
                            aria-label="Recolher menu lateral"
                            title="Recolher menu"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {menuRecolhido && (
                    <button
                        type="button"
                        onClick={() => setMenuRecolhido(false)}
                        className="mx-auto mt-4 w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-brand hover:bg-white/5 transition-colors"
                        aria-label="Expandir menu lateral"
                        title="Expandir menu"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </button>
                )}

                <div className="relative flex-grow min-h-0 py-8">
                    <nav
                        ref={menuRef}
                        onScroll={atualizarRolagem}
                        className={cn(
                            "wc-sidebar-scroll h-full overflow-y-auto",
                            "space-y-2 py-6",
                            menuRecolhido ? "px-3" : "px-6",
                        )}
                    >
                        <SidebarItem
                            active={activeTab === "inicio"}
                            onClick={() => onSelecionarAba("inicio")}
                            icon={<LayoutDashboard className="w-5 h-5" />}
                            label="Início"
                            collapsed={menuRecolhido}
                        />

                        <SidebarItem
                            active={activeTab === "servicos"}
                            onClick={() => onSelecionarAba("servicos")}
                            icon={<FileText className="w-5 h-5" />}
                            label="Serviços"
                            collapsed={menuRecolhido}
                        />

                        <SidebarItem
                            active={activeTab === "documentos"}
                            onClick={() => onSelecionarAba("documentos")}
                            icon={<FolderOpen className="w-5 h-5" />}
                            label="Documentos"
                            collapsed={menuRecolhido}
                        />

                        <SidebarItem
                            active={activeTab === "conversas"}
                            onClick={() => onSelecionarAba("conversas")}
                            icon={<MessageSquare className="w-5 h-5" />}
                            label="Conversas"
                            collapsed={menuRecolhido}
                        />

                        <SidebarItem
                            active={activeTab === "agenda"}
                            onClick={() => onSelecionarAba("agenda")}
                            icon={<Calendar className="w-5 h-5" />}
                            label="Agenda Fiscal"
                            collapsed={menuRecolhido}
                        />

                        <SidebarItem
                            active={activeTab === "financeiro"}
                            onClick={() => onSelecionarAba("financeiro")}
                            icon={<WalletCards className="w-5 h-5" />}
                            label="Financeiro"
                            collapsed={menuRecolhido}
                        />

                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={activeTab === "configuracoes"}
                                onClick={onAbrirConfiguracoes}
                                icon={<Settings className="w-5 h-5" />}
                                label="Configurações"
                                collapsed={menuRecolhido}
                            />

                            <SidebarItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Sair do sistema"
                                collapsed={menuRecolhido}
                                danger
                            />
                        </div>
                    </nav>

                    {podeRolarParaCima && (
                        <button
                            type="button"
                            onClick={() => rolarMenu("up")}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-slate-950/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-slate-950/70 transition-all"
                            aria-label="Exibir funções anteriores"
                            title="Subir no menu"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}

                    {podeRolarParaBaixo && (
                        <button
                            type="button"
                            onClick={() => rolarMenu("down")}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-slate-950/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-slate-950/70 transition-all"
                            aria-label="Exibir mais funções"
                            title="Descer no menu"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </aside>

            {menuMobileAberto && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={onFecharMenuMobile}
                        aria-label="Fechar menu lateral"
                    />

                    <aside
                        className="relative z-10 h-full w-[min(20rem,88vw)] flex flex-col border-r border-white/10 bg-slate-900 shadow-2xl"
                        aria-label="Menu do painel do cliente"
                    >
                        <div className="min-h-24 px-5 flex items-center justify-between gap-3 border-b border-white/10">
                            <div className="flex items-center gap-3 min-w-0">
                                <BrandLogo
                                    size="client"
                                    className="shadow-lg shadow-brand/40"
                                />

                                <span className="font-bold text-xl tracking-tighter text-white whitespace-nowrap">
                                    WebContabil
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onFecharMenuMobile}
                                className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white/50 transition-colors hover:bg-white/5 hover:text-brand"
                                aria-label="Fechar menu lateral"
                                title="Fechar menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-grow overflow-y-auto px-5 py-6 space-y-2">
                            <SidebarItem
                                active={activeTab === "inicio"}
                                onClick={() => selecionarAbaMobile("inicio")}
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="Início"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "servicos"}
                                onClick={() => selecionarAbaMobile("servicos")}
                                icon={<FileText className="w-5 h-5" />}
                                label="Serviços"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "documentos"}
                                onClick={() =>
                                    selecionarAbaMobile("documentos")
                                }
                                icon={<FolderOpen className="w-5 h-5" />}
                                label="Documentos"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "conversas"}
                                onClick={() => selecionarAbaMobile("conversas")}
                                icon={<MessageSquare className="w-5 h-5" />}
                                label="Conversas"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "agenda"}
                                onClick={() => selecionarAbaMobile("agenda")}
                                icon={<Calendar className="w-5 h-5" />}
                                label="Agenda Fiscal"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "financeiro"}
                                onClick={() =>
                                    selecionarAbaMobile("financeiro")
                                }
                                icon={<WalletCards className="w-5 h-5" />}
                                label="Financeiro"
                                collapsed={false}
                            />
                        </nav>

                        <div className="p-5 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={activeTab === "configuracoes"}
                                onClick={() => {
                                    onAbrirConfiguracoes();
                                    onFecharMenuMobile();
                                }}
                                icon={<Settings className="w-5 h-5" />}
                                label="Configurações"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={false}
                                onClick={() => {
                                    onFecharMenuMobile();
                                    onLogout();
                                }}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Encerrar Sessão"
                                collapsed={false}
                                danger
                            />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}

interface SidebarItemProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    danger?: boolean;
}

/**
 * Item reutilizável do menu lateral.
 */
function SidebarItem({
    active,
    onClick,
    icon,
    label,
    collapsed,
    danger = false,
}: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
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
            <div className="wc-sidebar-item-icon w-10 h-10 shrink-0 rounded-3xl bg-white/5 flex items-center justify-center transition-colors">
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
