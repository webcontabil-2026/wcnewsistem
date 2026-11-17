/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode } from "react";
import {
    AlertCircle,
    Bell,
    Clock,
    FileCheck,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Send,
    Settings,
    UserCheck,
    Users,
    X,
} from "lucide-react";

import type { User } from "../types";
import { cn } from "../lib/utils";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import ModalSolicitacoes from "./contador/ModalSolicitacoes";
import PaginaSolicitacoes from "./contador/PaginaSolicitacoes";
import { solicitacoesSimuladas } from "./contador/dados";

interface PropriedadesContadorDashboard {
    usuario: User;
    aoSair: () => void;
}

type AbaContador =
    | "inicio"
    | "solicitacoes"
    | "processamentos"
    | "configuracoes";

export default function ContadorDashboard({
    usuario,
    aoSair,
}: PropriedadesContadorDashboard) {
    const [abaAtiva, definirAbaAtiva] = useState<AbaContador>("inicio");

    /*
     * Controla a exibição compacta da barra lateral.
     * Quando recolhida, somente os ícones permanecem visíveis.
     */
    const [barraLateralRecolhida, definirBarraLateralRecolhida] =
        useState(false);

    /*
     * Controla a navegação móvel do contador.
     */
    const [menuMovelAberto, definirMenuMovelAberto] = useState(false);

    /*
     * O modal é utilizado apenas pelo atalho disponível
     * na página inicial do dashboard.
     */
    const [modalSolicitacoesAberto, definirModalSolicitacoesAberto] =
        useState(false);

    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <aside
                className={cn(
                    "hidden shrink-0 flex-col bg-white/5",
                    "border-r border-white/10 backdrop-blur-2xl",
                    "transition-[width] duration-300 lg:flex",
                    barraLateralRecolhida ? "w-24" : "w-80",
                )}
            >
                <div
                    className={cn(
                        "flex min-h-24 items-center border-b",
                        "border-white/10 px-4",
                        barraLateralRecolhida
                            ? "justify-center"
                            : "justify-between gap-3",
                    )}
                >
                    <div
                        className={cn(
                            "flex min-w-0 items-center",
                            barraLateralRecolhida ? "justify-center" : "gap-3",
                        )}
                    >
                        <BrandLogo
                            size="accountant"
                            className="shadow-xl shadow-brand/40"
                        />

                        {!barraLateralRecolhida && (
                            <span
                                className="min-w-0 whitespace-nowrap
                                    text-lg font-bold tracking-tighter
                                    text-white xl:text-xl"
                            >
                                WebContabil Worker
                            </span>
                        )}
                    </div>

                    {!barraLateralRecolhida && (
                        <button
                            type="button"
                            onClick={() => definirBarraLateralRecolhida(true)}
                            className="flex h-10 w-10 shrink-0
                                items-center justify-center rounded-xl
                                text-white/40 transition-colors
                                hover:bg-white/5 hover:text-brand"
                            aria-label="Recolher menu lateral"
                            title="Recolher menu"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {barraLateralRecolhida && (
                    <button
                        type="button"
                        onClick={() => definirBarraLateralRecolhida(false)}
                        className="mx-auto mt-4 flex h-11 w-11
                            items-center justify-center rounded-xl
                            text-white/40 transition-colors
                            hover:bg-white/5 hover:text-brand"
                        aria-label="Expandir menu lateral"
                        title="Expandir menu"
                    >
                        <PanelLeftOpen className="h-5 w-5" />
                    </button>
                )}

                <nav
                    className={cn(
                        "flex-grow space-y-2 py-6",
                        barraLateralRecolhida ? "px-3" : "px-6",
                    )}
                    aria-label="Navegação do contador"
                >
                    <ItemNavegacao
                        ativo={abaAtiva === "inicio"}
                        aoClicar={() => definirAbaAtiva("inicio")}
                        icone={<LayoutDashboard className="h-6 w-6" />}
                        rotulo="Início"
                        recolhido={barraLateralRecolhida}
                    />

                    <ItemNavegacao
                        ativo={abaAtiva === "solicitacoes"}
                        aoClicar={() => definirAbaAtiva("solicitacoes")}
                        icone={<Users className="h-6 w-6" />}
                        rotulo="Solicitações"
                        recolhido={barraLateralRecolhida}
                    />

                    <ItemNavegacao
                        ativo={abaAtiva === "processamentos"}
                        aoClicar={() => definirAbaAtiva("processamentos")}
                        icone={<FileCheck className="h-6 w-6" />}
                        rotulo="Processamentos"
                        recolhido={barraLateralRecolhida}
                    />

                    <ItemNavegacao
                        ativo={abaAtiva === "configuracoes"}
                        aoClicar={() => definirAbaAtiva("configuracoes")}
                        icone={<Settings className="h-6 w-6" />}
                        rotulo="Configurações"
                        recolhido={barraLateralRecolhida}
                    />
                </nav>

                <div
                    className={cn(
                        "border-t border-white/10",
                        barraLateralRecolhida ? "p-3" : "p-6",
                    )}
                >
                    <ItemNavegacao
                        ativo={false}
                        aoClicar={aoSair}
                        icone={<LogOut className="h-6 w-6" />}
                        rotulo="Encerrar sessão"
                        recolhido={barraLateralRecolhida}
                    />
                </div>
            </aside>

            {menuMovelAberto && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70
                            backdrop-blur-sm"
                        onClick={() => definirMenuMovelAberto(false)}
                        aria-label="Fechar menu lateral"
                    />

                    <aside
                        className="relative z-10 flex h-full
                            w-[min(21rem,90vw)] flex-col
                            border-r border-white/10 bg-slate-900
                            shadow-2xl"
                        aria-label="Menu móvel do contador"
                    >
                        <div
                            className="flex min-h-24 items-center
                                justify-between gap-3 border-b
                                border-white/10 px-5"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <BrandLogo
                                    size="accountant"
                                    className="shadow-xl shadow-brand/40"
                                />

                                <span
                                    className="whitespace-nowrap text-lg
                                        font-bold tracking-tighter
                                        text-white"
                                >
                                    WebContabil Worker
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => definirMenuMovelAberto(false)}
                                className="flex h-11 w-11 shrink-0
                                    items-center justify-center rounded-xl
                                    text-white/50 transition-all
                                    duration-200 hover:rotate-90
                                    hover:scale-105 hover:bg-red-500/10
                                    hover:text-red-400 active:scale-90
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-red-400"
                                aria-label="Fechar menu lateral"
                                title="Fechar menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <nav
                            className="flex-grow space-y-2
                                overflow-y-auto px-5 py-6"
                            aria-label="Navegação móvel do contador"
                        >
                            <ItemNavegacao
                                ativo={abaAtiva === "inicio"}
                                aoClicar={() => {
                                    definirAbaAtiva("inicio");
                                    definirMenuMovelAberto(false);
                                }}
                                icone={<LayoutDashboard className="h-6 w-6" />}
                                rotulo="Início"
                                recolhido={false}
                            />

                            <ItemNavegacao
                                ativo={abaAtiva === "solicitacoes"}
                                aoClicar={() => {
                                    definirAbaAtiva("solicitacoes");
                                    definirMenuMovelAberto(false);
                                }}
                                icone={<Users className="h-6 w-6" />}
                                rotulo="Solicitações"
                                recolhido={false}
                            />

                            <ItemNavegacao
                                ativo={abaAtiva === "processamentos"}
                                aoClicar={() => {
                                    definirAbaAtiva("processamentos");
                                    definirMenuMovelAberto(false);
                                }}
                                icone={<FileCheck className="h-6 w-6" />}
                                rotulo="Processamentos"
                                recolhido={false}
                            />

                            <ItemNavegacao
                                ativo={abaAtiva === "configuracoes"}
                                aoClicar={() => {
                                    definirAbaAtiva("configuracoes");
                                    definirMenuMovelAberto(false);
                                }}
                                icone={<Settings className="h-6 w-6" />}
                                rotulo="Configurações"
                                recolhido={false}
                            />
                        </nav>

                        <div className="border-t border-white/10 p-5">
                            <ItemNavegacao
                                ativo={false}
                                aoClicar={aoSair}
                                icone={<LogOut className="h-6 w-6" />}
                                rotulo="Encerrar sessão"
                                recolhido={false}
                            />
                        </div>
                    </aside>
                </div>
            )}

            <main
                className="flex min-w-0 flex-grow
                    flex-col overflow-hidden"
            >
                <header
                    className="sticky top-0 z-30 flex min-h-24
                        flex-wrap items-center justify-between gap-4
                        border-b border-white/10 bg-white/5
                        px-4 py-3 backdrop-blur-md
                        sm:px-6 xl:px-10"
                >
                    <div className="flex items-center gap-3">
                        <span
                            className="rounded-full bg-brand px-3 py-2
                                text-[10px] font-black uppercase
                                tracking-[0.2em] text-white
                                shadow-lg shadow-brand/40"
                            title="Registro profissional do contador"
                        >
                            CRC: {usuario.crc || "Não informado"}
                        </span>
                    </div>

                    <div
                        className="flex w-full flex-wrap items-center
                            justify-end gap-3 sm:w-auto
                            sm:gap-4 xl:gap-6"
                    >
                        <button
                            type="button"
                            onClick={() => definirMenuMovelAberto(true)}
                            className="flex h-11 w-11 shrink-0
                                items-center justify-center rounded-xl
                                border border-white/10 bg-white/5
                                text-white transition-all duration-200
                                hover:scale-105 hover:bg-white/10
                                hover:text-brand active:scale-95
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-brand lg:hidden"
                            aria-label="Abrir menu lateral"
                            title="Abrir menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <ThemeToggle />

                        <div
                            className="order-first flex w-full
                                items-center gap-3 rounded-xl border
                                border-white/5 bg-white/5 px-4 py-3
                                backdrop-blur-md sm:order-none
                                sm:w-auto sm:min-w-56"
                        >
                            <Search className="h-4 w-4 text-white/20" />

                            <input
                                type="search"
                                placeholder="Buscar cliente..."
                                aria-label="Buscar cliente"
                                className="w-full bg-transparent
                                    text-sm text-white outline-none
                                    placeholder:text-white/20
                                    sm:w-40"
                            />
                        </div>

                        <button
                            type="button"
                            className="relative p-3 text-white/20
                                transition-colors hover:text-brand"
                            aria-label="Abrir notificações"
                            title="Notificações"
                        >
                            <Bell className="h-5 w-5" />

                            <span
                                className="absolute right-2 top-2
                                    h-2 w-2 rounded-full border
                                    border-slate-900 bg-brand"
                                aria-hidden="true"
                            />
                        </button>

                        <div
                            className="flex h-11 w-11 items-center
                                justify-center rounded-2xl border
                                border-white/10 bg-white/10
                                font-black text-white shadow-xl"
                            title={usuario.name}
                        >
                            {usuario.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    <ModalSolicitacoes
                        estaAberto={modalSolicitacoesAberto}
                        solicitacoes={solicitacoesSimuladas}
                        aoFechar={() => definirModalSolicitacoesAberto(false)}
                    />

                    {abaAtiva === "solicitacoes" ? (
                        <PaginaSolicitacoes
                            solicitacoes={solicitacoesSimuladas}
                        />
                    ) : (
                        <div
                            className="relative flex flex-grow
                                items-center justify-center
                                overflow-y-auto p-4
                                sm:p-8 xl:p-12"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    definirModalSolicitacoesAberto(true)
                                }
                                className="absolute left-4 top-4
                                    flex items-center gap-3 rounded-2xl
                                    border border-white/10 bg-white/5
                                    px-4 py-3 text-white shadow-xl
                                    transition-colors
                                    hover:border-brand/40
                                    hover:bg-white/10
                                    sm:left-6 sm:top-6"
                                aria-label={`Abrir ${solicitacoesSimuladas.length} solicitações recebidas`}
                            >
                                <Inbox className="h-5 w-5 text-brand" />

                                <span className="text-sm font-bold">
                                    Solicitações
                                </span>

                                <span
                                    className="flex h-6 min-w-6
                                        items-center justify-center
                                        rounded-full bg-brand px-2
                                        text-xs font-black text-white"
                                >
                                    {solicitacoesSimuladas.length}
                                </span>
                            </button>

                            <div
                                className="w-full max-w-2xl
                                    space-y-7 pt-16 text-center
                                    sm:space-y-10 sm:pt-12 xl:pt-6"
                            >
                                <div
                                    className="mx-auto hidden h-24 w-24
                                        items-center justify-center
                                        rounded-[32px] border
                                        border-white/10 bg-white/5
                                        text-brand shadow-2xl
                                        backdrop-blur-2xl sm:flex
                                        xl:h-32 xl:w-32
                                        xl:rounded-[40px]"
                                >
                                    <Inbox className="h-10 w-10 xl:h-12 xl:w-12" />
                                </div>

                                <div className="space-y-3">
                                    <h2
                                        className="text-2xl font-extrabold
                                            tracking-tighter text-white
                                            sm:text-3xl xl:text-4xl"
                                    >
                                        Seu ambiente contábil.
                                    </h2>

                                    <p
                                        className="mx-auto max-w-md
                                            text-sm font-medium
                                            leading-relaxed text-white/40
                                            sm:text-base xl:text-lg"
                                    >
                                        Selecione uma solicitação para processar
                                        os dados e enviar os relatórios com
                                        criptografia total.
                                    </p>
                                </div>

                                <div
                                    className="grid grid-cols-1 gap-4
                                        pt-4 min-[400px]:grid-cols-2
                                        sm:gap-6 sm:pt-6"
                                >
                                    <CartaoAreaTrabalho
                                        icone={
                                            <UserCheck className="h-6 w-6" />
                                        }
                                        rotulo="Clientes gerenciados"
                                        valor="12 ativos"
                                    />

                                    <CartaoAreaTrabalho
                                        icone={<Send className="h-6 w-6" />}
                                        rotulo="Processamentos"
                                        valor="05 pautas"
                                    />

                                    <CartaoAreaTrabalho
                                        icone={
                                            <AlertCircle className="h-6 w-6" />
                                        }
                                        rotulo="Prazos fiscais"
                                        valor="02 alertas"
                                    />

                                    <CartaoAreaTrabalho
                                        icone={<Clock className="h-6 w-6" />}
                                        rotulo="Tempo de resposta"
                                        valor="~14 min"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

interface PropriedadesItemNavegacao {
    ativo: boolean;
    aoClicar: () => void;
    icone: ReactNode;
    rotulo: string;
    recolhido: boolean;
}

function ItemNavegacao({
    ativo,
    aoClicar,
    icone,
    rotulo,
    recolhido,
}: PropriedadesItemNavegacao) {
    return (
        <button
            type="button"
            onClick={aoClicar}
            title={recolhido ? rotulo : undefined}
            aria-label={rotulo}
            className={cn(
                "flex w-full items-center rounded-3xl",
                "transition-all",
                recolhido ? "justify-center p-2" : "gap-3 p-4 text-left",
                ativo
                    ? "border border-brand/50 bg-brand text-white shadow-2xl shadow-brand/40"
                    : "text-white/40 hover:bg-white/5 hover:text-white",
            )}
        >
            <div
                className="flex h-10 w-10 shrink-0
                    items-center justify-center rounded-3xl
                    bg-white/5"
            >
                {icone}
            </div>

            {!recolhido && (
                <span className="whitespace-nowrap text-sm font-bold">
                    {rotulo}
                </span>
            )}
        </button>
    );
}

interface PropriedadesCartaoAreaTrabalho {
    icone: ReactNode;
    rotulo: string;
    valor: string;
}

function CartaoAreaTrabalho({
    icone,
    rotulo,
    valor,
}: PropriedadesCartaoAreaTrabalho) {
    return (
        <div
            className="group rounded-[32px] border border-white/10
                bg-white/5 p-5 text-left backdrop-blur-xl
                transition-all hover:border-brand/30
                hover:bg-white/10 sm:p-6 xl:p-8"
        >
            <div
                className="mb-6 w-fit rounded-2xl bg-brand/10
                    p-3 text-brand transition-transform
                    group-hover:scale-110"
            >
                {icone}
            </div>

            <p
                className="mb-1 text-[10px] font-black uppercase
                    tracking-[0.2em] text-white/20"
            >
                {rotulo}
            </p>

            <p className="text-lg font-bold tracking-tight text-white">
                {valor}
            </p>
        </div>
    );
}
