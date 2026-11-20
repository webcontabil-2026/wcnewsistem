/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    ArrowRight,
    BarChart3,
    Cloud,
    FileCheck2,
    MessageSquareText,
    Shield,
    X,
    Zap,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

interface LandingPageProps {
    onOpenAuth: (mode: "LOGIN" | "REGISTER") => void;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
    /*
     * Recupera o tema salvo no navegador.
     * Caso o armazenamento não esteja disponível, utiliza o tema claro.
     */
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        try {
            return (
                (localStorage.getItem("wc-theme") as "light" | "dark") ||
                "light"
            );
        } catch {
            return "light";
        }
    });

    /*
     * Controla a abertura do menu público em celulares.
     */
    const [isPublicMenuOpen, setIsPublicMenuOpen] = useState(false);
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    /*
     * Mantém o tema global sincronizado quando o usuário alterna sua escolha.
     */
    useEffect(() => {
        try {
            const applyTheme = (
                window as typeof window & {
                    wcApplyTheme?: (selectedTheme: "light" | "dark") => string;
                }
            ).wcApplyTheme;

            applyTheme?.(theme);
        } catch {
            // O tema claro permanece como alternativa segura.
        }
    }, [theme]);

    /*
     * Permite fechar o menu responsivo com a tecla Esc.
     */
    useEffect(() => {
        const closeMenuWithEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsPublicMenuOpen(false);
                setIsDemoOpen(false);
            }
        };

        window.addEventListener("keydown", closeMenuWithEscape);

        return () => {
            window.removeEventListener("keydown", closeMenuWithEscape);
        };
    }, []);

    /*
     * Alterna entre os temas claro e escuro.
     */
    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark",
        );
    };

    return (
        <div className="flex min-h-screen flex-col theme-text-high">
            <header className="theme-header sticky top-0 z-10 border-b backdrop-blur-md">
                {/*
                 * Mantém a marca, a navegação e as ações organizadas
                 * dentro das margens responsivas do projeto.
                 */}
                <div
                    className="layout-container-wide relative flex min-h-20
                   flex-wrap items-center justify-between gap-4 py-3"
                >
                    <a
                        href="/"
                        className="wc-interactive flex items-center gap-3 rounded-xl"
                        aria-label="Ir para a página inicial da WebContabil"
                    >
                        <BrandLogo size="header" />

                        <span className="text-xl font-bold tracking-tight theme-text-high">
                            WebContabil
                        </span>
                    </a>

                    {/*
                     * Abre ou fecha a navegação em celulares.
                     */}
                    <button
                        type="button"
                        className="wc-public-menu-toggle"
                        aria-label={
                            isPublicMenuOpen
                                ? "Fechar menu de navegação"
                                : "Abrir menu de navegação"
                        }
                        aria-expanded={isPublicMenuOpen}
                        aria-controls="landing-public-menu"
                        onClick={() =>
                            setIsPublicMenuOpen((currentState) => !currentState)
                        }
                    >
                        <span aria-hidden="true">
                            {isPublicMenuOpen ? "×" : "☰"}
                        </span>
                    </button>

                    {/*
                     * A navegação utiliza o mesmo espaçamento e os mesmos
                     * estados visuais das páginas internas.
                     */}
                    <nav
                        id="landing-public-menu"
                        className="wc-public-menu wc-public-navigation
                       text-xs font-bold uppercase tracking-widest"
                        aria-label="Navegação principal"
                        data-open={isPublicMenuOpen ? "true" : "false"}
                        onClick={(event) => {
                            /*
                             * Fecha o painel depois que um link é acionado.
                             */
                            if ((event.target as HTMLElement).closest("a")) {
                                setIsPublicMenuOpen(false);
                            }
                        }}
                    >
                        <a
                            href="/"
                            className="wc-interactive wc-public-link"
                            aria-current="page"
                        >
                            Início
                        </a>

                        <a
                            href="/sobre"
                            className="wc-interactive wc-public-link"
                        >
                            Sobre Nós
                        </a>

                        <a
                            href="/servicos"
                            className="wc-interactive wc-public-link"
                        >
                            Serviços
                        </a>

                        <a
                            href="/planos"
                            className="wc-interactive wc-public-link"
                        >
                            Planos
                        </a>

                        <a
                            href="/contato"
                            className="wc-interactive wc-public-link"
                        >
                            Contato
                        </a>
                    </nav>

                    {/*
                     * As ações podem ocupar uma segunda linha quando o espaço
                     * disponível for reduzido.
                     */}
                    <div
                        className="flex max-sm:w-full flex-wrap items-center
                       justify-end gap-2 sm:gap-4"
                    >
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                theme === "dark"
                                    ? "Ativar modo claro"
                                    : "Ativar modo escuro"
                            }
                            className="wc-interactive wc-button-secondary
                           rounded-lg px-4 py-2.5 text-sm font-semibold"
                        >
                            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                        </button>

                        <div
                            className="flex flex-1 items-center justify-end
                           gap-3 sm:flex-none sm:gap-5"
                        >
                            <button
                                type="button"
                                onClick={() => onOpenAuth("LOGIN")}
                                className="wc-interactive wc-action-text
                               min-h-11 px-3 text-xs font-bold
                               uppercase tracking-widest"
                            >
                                Entrar
                            </button>

                            <button
                                type="button"
                                onClick={() => onOpenAuth("REGISTER")}
                                className="wc-interactive wc-button-primary
                               whitespace-nowrap rounded-full
                               px-4 py-2.5 text-xs font-bold
                               uppercase tracking-widest sm:px-6"
                            >
                                Criar Conta
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/*
                 * Apresenta a proposta principal dentro do contêiner
                 * responsivo compartilhado pelo projeto.
                 */}
                <section className="layout-section relative">
                    <div className="layout-container space-y-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                            }}
                        >
                            <h1
                                className="text-4xl font-extrabold leading-[1.05]
                                           tracking-tighter theme-text-high
                                           sm:text-6xl md:text-8xl"
                            >
                                A ponte{" "}
                                <span className="text-brand">inteligente</span>{" "}
                                para sua contabilidade.
                            </h1>

                            <p
                                className="mx-auto mt-8 max-w-2xl text-base
                                           font-medium leading-relaxed
                                           theme-text-low sm:text-xl"
                            >
                                Sincronização perfeita entre contador e cliente.
                                Dados salvos em nuvem, organizados e sempre
                                acessíveis.
                            </p>

                            <div
                                className="mt-12 flex flex-col justify-center
                                           gap-6 sm:flex-row"
                            >
                                <button
                                    type="button"
                                    onClick={() => onOpenAuth("REGISTER")}
                                    className="wc-interactive wc-button-primary
                                               group flex w-full items-center
                                               justify-center gap-3 rounded-2xl
                                               px-7 py-4 text-base font-bold
                                               sm:w-auto sm:px-10 sm:py-5
                                               sm:text-lg"
                                >
                                    Começar Agora
                                    <ArrowRight
                                        className="h-6 w-6 transition-transform
                                                   group-hover:translate-x-1"
                                        aria-hidden="true"
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsDemoOpen(true)}
                                    className="wc-interactive wc-button-secondary
                                               w-full rounded-2xl px-7 py-4
                                               text-base font-bold sm:w-auto
                                               sm:px-10 sm:py-5 sm:text-lg"
                                >
                                    Ver Demonstração
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/*
                 * Os cards são informativos neste momento.
                 * Por isso, recebem animação visual sem cursor de botão.
                 */}
                <section className="layout-section relative">
                    <div className="layout-container">
                        <div className="layout-grid grid-cols-1 md:grid-cols-3">
                            <FeatureCard
                                icon={<Cloud className="h-8 w-8" />}
                                title="Sincronia Total"
                                description="Seus documentos e informações salvos com segurança extrema e acessíveis de qualquer lugar."
                            />

                            <FeatureCard
                                icon={<Shield className="h-8 w-8" />}
                                title="Criptografia Real"
                                description="Segurança de nível bancário para garantir que os dados sensíveis da sua empresa estejam protegidos."
                            />

                            <FeatureCard
                                icon={<Zap className="h-8 w-8" />}
                                title="Fluxo Hiper-Ágil"
                                description="Simplificamos a comunicação. Envie e receba relatórios, notas e guias em segundos."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t py-16 theme-border">
                <div
                    className="layout-container-wide flex flex-col items-center
                               justify-between gap-10 md:flex-row"
                >
                    <div className="flex items-center gap-2">
                        <BrandLogo size="footer" />

                        <span className="text-xl font-bold theme-text-high">
                            WebContabil
                        </span>
                    </div>

                    <p
                        className="text-center text-xs font-bold uppercase
                                   tracking-widest theme-text-low"
                    >
                        © 2026 WebContabil Ecosystem. Todos os direitos
                        reservados.
                    </p>

                    <nav
                        className="flex flex-wrap items-center justify-center gap-6"
                        aria-label="Informações legais"
                    >
                        <a
                            href="/politica-de-privacidade"
                            className="wc-interactive wc-public-link text-xs
                                       font-bold uppercase tracking-widest"
                        >
                            Privacidade
                        </a>

                        <a
                            href="/termos-de-uso"
                            className="wc-interactive wc-public-link text-xs
                                       font-bold uppercase tracking-widest"
                        >
                            Termos
                        </a>

                        <a
                            href="/admin/login"
                            className="wc-interactive wc-public-link text-xs font-bold uppercase tracking-widest"
                        >
                            Acesso interno
                        </a>
                    </nav>
                </div>
            </footer>

            {isDemoOpen && (
                <DemoModal
                    onClose={() => setIsDemoOpen(false)}
                    onCreateAccount={() => onOpenAuth("REGISTER")}
                />
            )}
        </div>
    );
}

function DemoModal({
    onClose,
    onCreateAccount,
}: {
    onClose: () => void;
    onCreateAccount: () => void;
}) {
    const [step, setStep] = useState(0);
    const steps = [
        {
            icon: <BarChart3 className="h-7 w-7" />,
            title: "Visão financeira real",
            description:
                "Receitas, despesas, saldo e gráfico são atualizados pelos lançamentos cadastrados pelo cliente.",
        },
        {
            icon: <FileCheck2 className="h-7 w-7" />,
            title: "Solicitação e orçamento",
            description:
                "O cliente escolhe um serviço; o contador analisa, envia o orçamento e acompanha o processamento.",
        },
        {
            icon: <MessageSquareText className="h-7 w-7" />,
            title: "Conversa por atendimento",
            description:
                "Depois que o contador assume a solicitação, a conversa fica disponível aos dois perfis com histórico salvo.",
        },
    ];
    const current = steps[step];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-labelledby="demo-title">
            <div className="theme-surface relative w-full max-w-2xl rounded-[32px] border p-6 theme-border sm:p-9">
                <button type="button" onClick={onClose} className="wc-interactive !absolute right-4 top-4 rounded-xl p-2 theme-text-low" aria-label="Fechar demonstração">
                    <X className="h-5 w-5" />
                </button>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Demonstração guiada</p>
                <h2 id="demo-title" className="mt-2 pr-10 text-3xl font-extrabold theme-text-high">Como a WebContabil funciona</h2>

                <div className="mt-7 rounded-3xl border p-6 theme-border theme-surface-raised sm:p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">{current.icon}</div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-widest text-brand">Etapa {step + 1} de {steps.length}</p>
                    <h3 className="mt-2 text-2xl font-extrabold theme-text-high">{current.title}</h3>
                    <p className="mt-3 leading-relaxed theme-text-low">{current.description}</p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex justify-center gap-2" aria-label="Progresso da demonstração">
                        {steps.map((item, index) => (
                            <button key={item.title} type="button" onClick={() => setStep(index)} className={`h-2.5 rounded-full transition-all ${index === step ? "w-8 bg-brand" : "w-2.5 theme-surface-muted"}`} aria-label={`Ir para etapa ${index + 1}`} />
                        ))}
                    </div>
                    {step < steps.length - 1 ? (
                        <button type="button" onClick={() => setStep((currentStep) => currentStep + 1)} className="wc-button-primary rounded-xl px-6 py-3 font-bold">Próxima etapa</button>
                    ) : (
                        <button type="button" onClick={onCreateAccount} className="wc-button-primary rounded-xl px-6 py-3 font-bold">Criar minha conta</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/*
 * Representa um recurso informativo da tela de apresentação.
 * O card não executa navegação enquanto não possuir um destino funcional.
 */
function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <article
            className="wc-information-card rounded-[32px] border p-7
                       backdrop-blur-xl theme-border theme-surface sm:p-10"
        >
            <div
                className="wc-information-card-icon mb-6 w-fit rounded-2xl
                           bg-brand/10 p-4 text-brand"
                aria-hidden="true"
            >
                {icon}
            </div>

            <h2 className="mb-4 text-2xl font-bold tracking-tight theme-text-high">
                {title}
            </h2>

            <p className="font-medium leading-relaxed theme-text-low">
                {description}
            </p>
        </article>
    );
}
