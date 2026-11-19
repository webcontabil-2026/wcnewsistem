import { useMemo, useState, type ReactNode } from "react";
import {
    CheckCircle2,
    ClipboardList,
    Clock3,
    FileCheck,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    RefreshCw,
    Settings,
    X,
} from "lucide-react";

import type { User } from "../types";
import { cn } from "../lib/utils";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import SolicitacoesContador from "./contador/SolicitacoesContador";
import useSolicitacoesContador from "./contador/useSolicitacoesContador";
import ConversasSolicitacao from "./solicitacoes/ConversasSolicitacao";

interface PropriedadesContadorDashboard {
    usuario: User;
    aoSair: () => void;
}

type AbaContador =
    | "inicio"
    | "solicitacoes"
    | "processamentos"
    | "conversas"
    | "configuracoes";

const itensNavegacao: Array<{
    aba: AbaContador;
    rotulo: string;
    icone: ReactNode;
}> = [
    {
        aba: "inicio",
        rotulo: "Início",
        icone: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        aba: "solicitacoes",
        rotulo: "Solicitações",
        icone: <ClipboardList className="h-5 w-5" />,
    },
    {
        aba: "processamentos",
        rotulo: "Processamentos",
        icone: <FileCheck className="h-5 w-5" />,
    },
    {
        aba: "conversas",
        rotulo: "Conversas",
        icone: <MessageSquare className="h-5 w-5" />,
    },
    {
        aba: "configuracoes",
        rotulo: "Configurações",
        icone: <Settings className="h-5 w-5" />,
    },
];

export default function ContadorDashboard({
    usuario,
    aoSair,
}: PropriedadesContadorDashboard) {
    const [abaAtiva, setAbaAtiva] = useState<AbaContador>("inicio");
    const [recolhida, setRecolhida] = useState(false);
    const [menuMovel, setMenuMovel] = useState(false);

    const {
        solicitacoes,
        carregando,
        processandoId,
        erro,
        mensagem,
        carregar,
        enviarOrcamento,
        atualizarStatus,
    } = useSolicitacoesContador();

    const resumo = useMemo(
        () => ({
            novas: solicitacoes.filter((item) => item.status === "pendente")
                .length,
            aguardando: solicitacoes.filter(
                (item) => item.status === "aguardando_cliente",
            ).length,
            andamento: solicitacoes.filter(
                (item) => item.status === "em_andamento",
            ).length,
            concluidas: solicitacoes.filter(
                (item) => item.status === "concluida",
            ).length,
        }),
        [solicitacoes],
    );

    const selecionarAba = (aba: AbaContador) => {
        setAbaAtiva(aba);
        setMenuMovel(false);
    };

    const navegacao = (mobile = false) => (
        <nav
            className="flex-grow space-y-2 overflow-y-auto px-4 py-6"
            aria-label="Navegação do contador"
        >
            {itensNavegacao.map((item) => (
                <ItemNavegacao
                    key={item.aba}
                    ativo={abaAtiva === item.aba}
                    recolhido={!mobile && recolhida}
                    rotulo={item.rotulo}
                    icone={item.icone}
                    onClick={() => selecionarAba(item.aba)}
                />
            ))}
        </nav>
    );

    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <aside
                className={cn(
                    "hidden shrink-0 flex-col border-r border-white/10 bg-white/5 transition-[width] duration-300 lg:flex",
                    recolhida ? "w-24" : "w-72",
                )}
            >
                <div
                    className={cn(
                        "flex min-h-24 items-center border-b border-white/10 px-5",
                        recolhida
                            ? "justify-center"
                            : "justify-between gap-3",
                    )}
                >
                    <div
                        className={cn(
                            "flex min-w-0 items-center",
                            recolhida ? "justify-center" : "gap-3",
                        )}
                    >
                        <BrandLogo size="accountant" />
                        {!recolhida && (
                            <span className="whitespace-nowrap text-lg font-extrabold tracking-tight text-white">
                                WebContabil Worker
                            </span>
                        )}
                    </div>
                    {!recolhida && (
                        <button
                            type="button"
                            onClick={() => setRecolhida(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white"
                            aria-label="Recolher menu"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {recolhida && (
                    <button
                        type="button"
                        onClick={() => setRecolhida(false)}
                        className="mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white"
                        aria-label="Expandir menu"
                    >
                        <PanelLeftOpen className="h-5 w-5" />
                    </button>
                )}

                {navegacao()}

                <div className="border-t border-white/10 p-4">
                    <ItemNavegacao
                        ativo={false}
                        recolhido={recolhida}
                        rotulo="Encerrar sessão"
                        icone={<LogOut className="h-5 w-5" />}
                        onClick={aoSair}
                        perigo
                    />
                </div>
            </aside>

            {menuMovel && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70"
                        onClick={() => setMenuMovel(false)}
                        aria-label="Fechar menu"
                    />
                    <aside className="relative z-10 flex h-full w-[min(21rem,90vw)] flex-col border-r border-white/10 bg-slate-900">
                        <div className="flex min-h-24 items-center justify-between gap-3 border-b border-white/10 px-5">
                            <div className="flex items-center gap-3">
                                <BrandLogo size="accountant" />
                                <span className="font-extrabold text-white">
                                    WebContabil Worker
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMenuMovel(false)}
                                className="rounded-xl p-2 text-white/60 hover:bg-white/5 hover:text-white"
                                aria-label="Fechar menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {navegacao(true)}
                        <div className="border-t border-white/10 p-4">
                            <ItemNavegacao
                                ativo={false}
                                recolhido={false}
                                rotulo="Encerrar sessão"
                                icone={<LogOut className="h-5 w-5" />}
                                onClick={aoSair}
                                perigo
                            />
                        </div>
                    </aside>
                </div>
            )}

            <main className="flex min-w-0 flex-grow flex-col overflow-hidden">
                <header className="sticky top-0 z-30 flex min-h-24 items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3 sm:px-6 xl:px-10">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMenuMovel(true)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand">
                            CRC: {usuario.crc || "Não informado"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <ThemeToggle />
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-extrabold text-white">
                                {usuario.name}
                            </p>
                            <p className="text-xs text-white/40">Contador</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 font-black text-white">
                            {usuario.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {abaAtiva === "inicio" && (
                    <PaginaInicialContador
                        nome={usuario.name}
                        resumo={resumo}
                        carregando={carregando}
                        onAtualizar={() => void carregar()}
                        onAbrirSolicitacoes={() =>
                            setAbaAtiva("solicitacoes")
                        }
                    />
                )}

                {abaAtiva === "solicitacoes" && (
                    <SolicitacoesContador
                        solicitacoes={solicitacoes}
                        carregando={carregando}
                        processandoId={processandoId}
                        erro={erro}
                        mensagem={mensagem}
                        onRecarregar={() => void carregar()}
                        onEnviarOrcamento={enviarOrcamento}
                        onAtualizarStatus={atualizarStatus}
                    />
                )}

                {abaAtiva === "processamentos" && (
                    <SolicitacoesContador
                        solicitacoes={solicitacoes}
                        carregando={carregando}
                        processandoId={processandoId}
                        erro={erro}
                        mensagem={mensagem}
                        modo="processamentos"
                        onRecarregar={() => void carregar()}
                        onEnviarOrcamento={enviarOrcamento}
                        onAtualizarStatus={atualizarStatus}
                    />
                )}

                {abaAtiva === "conversas" && (
                    <ConversasSolicitacao
                        solicitacoes={solicitacoes}
                        titulo="Conversas com clientes"
                        subtitulo="Troque informações dentro de cada atendimento assumido."
                    />
                )}

                {abaAtiva === "configuracoes" && (
                    <ConfiguracoesContador usuario={usuario} />
                )}
            </main>
        </div>
    );
}

function PaginaInicialContador({
    nome,
    resumo,
    carregando,
    onAtualizar,
    onAbrirSolicitacoes,
}: {
    nome: string;
    resumo: {
        novas: number;
        aguardando: number;
        andamento: number;
        concluidas: number;
    };
    carregando: boolean;
    onAtualizar: () => void;
    onAbrirSolicitacoes: () => void;
}) {
    const cards = [
        {
            rotulo: "Novas solicitações",
            valor: resumo.novas,
            icone: <Inbox className="h-6 w-6" />,
        },
        {
            rotulo: "Aguardando cliente",
            valor: resumo.aguardando,
            icone: <Clock3 className="h-6 w-6" />,
        },
        {
            rotulo: "Em andamento",
            valor: resumo.andamento,
            icone: <RefreshCw className="h-6 w-6" />,
        },
        {
            rotulo: "Concluídas",
            valor: resumo.concluidas,
            icone: <CheckCircle2 className="h-6 w-6" />,
        },
    ];

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-7xl space-y-9">
                <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                            Visão de atendimento
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Olá, {nome.split(" ")[0]}.
                        </h1>
                        <p className="mt-2 font-medium text-white/50">
                            Dados reais das solicitações disponíveis para sua conta.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onAtualizar}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10"
                    >
                        <RefreshCw
                            className={cn(
                                "h-4 w-4",
                                carregando && "animate-spin",
                            )}
                        />
                        Atualizar
                    </button>
                </header>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <article
                            key={card.rotulo}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                {card.icone}
                            </div>
                            <p className="mt-6 text-[10px] font-black uppercase tracking-wider text-white/40">
                                {card.rotulo}
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-white">
                                {carregando ? "—" : card.valor}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                    <h2 className="text-2xl font-extrabold text-white">
                        Fila de trabalho
                    </h2>
                    <p className="mt-2 max-w-2xl text-white/50">
                        Abra as solicitações para analisar a descrição do cliente,
                        enviar um orçamento e acompanhar a resposta.
                    </p>
                    <button
                        type="button"
                        onClick={onAbrirSolicitacoes}
                        className="mt-6 rounded-xl bg-brand px-5 py-3 font-bold text-white hover:bg-brand/90"
                    >
                        Ver solicitações
                    </button>
                </div>
            </div>
        </section>
    );
}

function ConfiguracoesContador({ usuario }: { usuario: User }) {
    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-4xl space-y-8">
                <header>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                        Conta profissional
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
                        Configurações
                    </h1>
                    <p className="mt-2 text-white/50">
                        Consulte seus dados e escolha o tema mais confortável.
                    </p>
                </header>
                <div className="grid gap-5 md:grid-cols-2">
                    <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-extrabold text-white">
                            Perfil
                        </h2>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="font-bold text-white/40">Nome</dt>
                                <dd className="mt-1 text-white">{usuario.name}</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-white/40">E-mail</dt>
                                <dd className="mt-1 break-all text-white">
                                    {usuario.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-bold text-white/40">CRC</dt>
                                <dd className="mt-1 text-white">
                                    {usuario.crc || "Não informado"}
                                </dd>
                            </div>
                        </dl>
                    </article>
                    <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-extrabold text-white">
                            Aparência
                        </h2>
                        <p className="mt-2 text-sm text-white/50">
                            Alterne entre o tema claro e escuro. A preferência é
                            mantida na sua conta.
                        </p>
                        <div className="mt-6">
                            <ThemeToggle />
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

function ItemNavegacao({
    ativo,
    recolhido,
    rotulo,
    icone,
    onClick,
    perigo = false,
}: {
    ativo: boolean;
    recolhido: boolean;
    rotulo: string;
    icone: ReactNode;
    onClick: () => void;
    perigo?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={recolhido ? rotulo : undefined}
            className={cn(
                "flex w-full items-center rounded-2xl border border-transparent p-3 font-bold transition-colors",
                recolhido ? "justify-center" : "gap-3",
                ativo
                    ? "border-brand/40 bg-brand text-white"
                    : perigo
                      ? "text-white/50 hover:bg-red-500/10 hover:text-red-400"
                      : "text-white/50 hover:bg-white/5 hover:text-white",
            )}
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                {icone}
            </span>
            {!recolhido && <span className="text-sm">{rotulo}</span>}
        </button>
    );
}
