/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Cloud, Shield, Zap, ArrowRight, UserCircle } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface LandingPageProps {
    onOpenAuth: (mode: "LOGIN" | "REGISTER") => void;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
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

    useEffect(() => {
        try {
            const applyTheme = (
                window as typeof window & {
                    wcApplyTheme?: (selectedTheme: "light" | "dark") => string;
                }
            ).wcApplyTheme;
            applyTheme?.(theme);
        } catch (e) {
            // O tema claro permanece como alternativa segura se o armazenamento falhar.
        }
    }, [theme]);

    const toggleTheme = () =>
        setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <div className="flex flex-col min-h-screen theme-text-high">
            <header className="theme-header border-b backdrop-blur-md sticky top-0 z-10">
                {/* Mantém o cabeçalho centralizado com margens responsivas. */}
                {/* Permite que a marca e as ações se reorganizem em telas pequenas. */}
                <div
                    className="layout-container-wide flex flex-wrap
               justify-between items-center min-h-20 py-3 gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center brand-bg-square shadow-lg shadow-brand/40">
                            <span
                                className="header-logo"
                                role="img"
                                aria-label="WebContabil"
                            />
                        </div>
                        <span className="text-xl font-bold theme-text-high tracking-tight">
                            WebContabil
                        </span>
                    </div>
                    <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest theme-text-high">
                        <a href="/sobre" className="theme-link hover:underline">
                            Sobre Nós
                        </a>
                        <a
                            href="/servicos"
                            className="theme-link hover:underline"
                        >
                            Serviços
                        </a>
                        <a
                            href="/planos"
                            className="theme-link hover:underline"
                        >
                            Planos
                        </a>
                        <a
                            href="/contato"
                            className="theme-link hover:underline"
                        >
                            Contato
                        </a>
                    </nav>
                    {/* As ações ocupam uma nova linha quando não houver espaço suficiente. */}
                    <div
                        className="flex flex-wrap items-center justify-end
               gap-2 sm:gap-4 max-sm:w-full"
                    >
                        <button
                            onClick={toggleTheme}
                            aria-label="Alternar tema"
                            className="px-3 py-2 rounded-md border text-sm font-medium theme-text-high border-current"
                        >
                            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                        </button>
                        <div
                            className="flex flex-1 sm:flex-none
               items-center justify-end gap-3 sm:gap-6"
                        >
                            <button
                                onClick={() => onOpenAuth("LOGIN")}
                                className="text-xs font-bold uppercase tracking-widest theme-text-low hover:theme-text-high transition-colors"
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => onOpenAuth("REGISTER")}
                                className="theme-highlight border theme-border
           px-4 sm:px-6 py-2.5 rounded-full text-xs
           font-bold uppercase tracking-widest transition-all
           shadow-xl shadow-black/20 whitespace-nowrap"
                            >
                                Criar Conta
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Utiliza o espaçamento e o contêiner responsivo global. */}
                <section className="layout-section relative">
                    <div className="layout-container text-center space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* O título cresce gradualmente sem ultrapassar telas pequenas. */}
                            <h1
                                className="text-4xl sm:text-6xl md:text-8xl
               font-extrabold theme-text-high
               leading-[1.05] tracking-tighter"
                            >
                                A ponte{" "}
                                <span className="text-brand">inteligente</span>{" "}
                                para sua contabilidade.
                            </h1>
                            <p
                                className="mt-8 text-base sm:text-xl theme-text-low
               max-w-2xl mx-auto leading-relaxed font-medium"
                            >
                                Sincronização perfeita entre contador e cliente.
                                Dados salvos em nuvem, organizados e sempre
                                acessíveis.
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                                <button
                                    onClick={() => onOpenAuth("REGISTER")}
                                    className="w-full sm:w-auto bg-brand text-white
           px-7 sm:px-10 py-4 sm:py-5 rounded-2xl
           text-base sm:text-lg font-bold hover:bg-brand-light
           transition-all flex items-center justify-center gap-3
           shadow-2xl shadow-brand/40 group scale-100
           hover:scale-105 active:scale-95"
                                >
                                    Começar Agora
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    className="w-full sm:w-auto theme-surface theme-text-high
           theme-border border backdrop-blur-lg
           px-7 sm:px-10 py-4 sm:py-5 rounded-2xl
           text-base sm:text-lg font-bold transition-colors"
                                >
                                    Ver Demonstração
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Organiza os blocos em uma coluna no celular e três no desktop. */}
                <section className="layout-section relative">
                    <div className="layout-container">
                        <div className="layout-grid grid-cols-1 md:grid-cols-3">
                            <FeatureCard
                                icon={<Cloud className="w-8 h-8" />}
                                title="Sincronia Total"
                                description="Seus documentos e informações salvos com segurança extrema e acessíveis de qualquer lugar."
                            />
                            <FeatureCard
                                icon={<Shield className="w-8 h-8" />}
                                title="Criptografia Real"
                                description="Segurança de nível bancário para garantir que os dados sensíveis da sua empresa estejam protegidos."
                            />
                            <FeatureCard
                                icon={<Zap className="w-8 h-8" />}
                                title="Fluxo Hiper-Ágil"
                                description="Simplificamos a comunicação. Envie e receba relatórios, notas e guias em segundos."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t theme-border py-16">
                {/* Mantém os elementos do rodapé dentro das margens globais. */}
                <div className="layout-container-wide flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <BrandLogo size="footer" />
                        <span className="text-xl font-bold theme-text-high">
                            WebContabil
                        </span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest theme-text-low">
                        © 2026 WebContabil Ecosystem. Todos os direitos
                        reservados.
                    </div>
                    <div className="flex gap-8">
                        <a
                            href="#"
                            className="theme-text-low hover:theme-text-high transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            Privacidade
                        </a>
                        <a
                            href="#"
                            className="theme-text-low hover:theme-text-high transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            Termos
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

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
        /*
         * O card utiliza uma margem interna menor no celular e preserva
         * o espaçamento amplo nas telas maiores.
         */
        <div
            className="p-7 sm:p-10 theme-surface backdrop-blur-xl
                       rounded-[32px] border theme-border
                       hover:border-brand/30 transition-all
                       group hover:-translate-y-2"
        >
            {/*
             * O ícone herda a cor deste bloco para permanecer legível.
             * No hover, o fundo fica azul e o símbolo muda para a cor de contraste.
             */}
            <div
                className="p-4 w-fit rounded-2xl mb-6
                           bg-brand/10 text-brand
                           group-hover:bg-brand
                           group-hover:text-[var(--theme-on-highlight)]
                           transition-colors duration-200"
            >
                {icon}
            </div>

            <h3 className="text-2xl font-bold theme-text-high mb-4 tracking-tight">
                {title}
            </h3>

            <p className="theme-text-low leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}
