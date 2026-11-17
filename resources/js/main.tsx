import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import AdminDashboard from "./components/AdminDashboard";
import AuthModal from "./components/AuthModal";
import ClientDashboard from "./components/ClientDashboard";
import ContadorDashboard from "./components/ContadorDashboard";
import LandingPage from "./components/LandingPage";
import { ApiError, apiRequest } from "./lib/api";
import type { User } from "./types";

/**
 * Controla o dashboard usando exclusivamente a sessão
 * autenticada pelo Laravel.
 */
function DashboardAutenticado() {
    const [usuario, definirUsuario] = useState<User | null>(null);
    const [verificandoSessao, definirVerificandoSessao] = useState(true);
    const [erroSessao, definirErroSessao] = useState("");

    /*
     * Consulta o usuário autenticado ao carregar o dashboard.
     */
    useEffect(() => {
        let componenteAtivo = true;

        const carregarSessao = async () => {
            try {
                const resposta = await apiRequest<{
                    user: User;
                }>("/auth/current");

                if (componenteAtivo) {
                    definirUsuario(resposta.user);
                }
            } catch (erro) {
                /*
                 * Usuários sem sessão são encaminhados
                 * para a página de login.
                 */
                if (erro instanceof ApiError && erro.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                if (componenteAtivo) {
                    definirErroSessao(
                        erro instanceof ApiError
                            ? erro.message
                            : "Não foi possível verificar sua sessão.",
                    );
                }
            } finally {
                if (componenteAtivo) {
                    definirVerificandoSessao(false);
                }
            }
        };

        void carregarSessao();

        return () => {
            componenteAtivo = false;
        };
    }, []);

    /*
     * Encerra a sessão no servidor e retorna
     * para a página inicial.
     */
    const encerrarSessao = async () => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST",
            });
        } catch (erro) {
            console.error("Erro ao encerrar a sessão:", erro);
        } finally {
            window.location.replace("/");
        }
    };

    if (verificandoSessao) {
        return (
            <div
                className="flex min-h-screen items-center
                    justify-center bg-slate-950 text-slate-200"
            >
                <p className="text-sm font-semibold text-white/60">
                    Verificando sessão...
                </p>
            </div>
        );
    }

    if (erroSessao) {
        return (
            <div
                className="flex min-h-screen flex-col items-center
                    justify-center gap-4 bg-slate-950 px-6
                    text-center text-slate-200"
            >
                <p className="text-sm font-semibold text-red-400">
                    {erroSessao}
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-sky-500 px-5 py-3
                        text-sm font-bold text-white transition
                        hover:bg-sky-400"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (!usuario) {
        return null;
    }

    if (usuario.role === "CLIENT") {
        return <ClientDashboard user={usuario} onLogout={encerrarSessao} />;
    }

    if (usuario.role === "ACCOUNTANT") {
        return <ContadorDashboard usuario={usuario} aoSair={encerrarSessao} />;
    }

    if (usuario.role === "ADMIN") {
        return <AdminDashboard user={usuario} onLogout={encerrarSessao} />;
    }

    return (
        <div
            className="flex min-h-screen items-center
                justify-center bg-slate-950 px-6
                text-center text-red-400"
        >
            O perfil desta conta não possui permissão de acesso.
        </div>
    );
}

const elementoRaiz = document.getElementById("root");

/*
 * Inicializa o React somente nas páginas
 * que possuem o elemento raiz.
 */
if (elementoRaiz) {
    const pagina = elementoRaiz.dataset.page || "landing";

    const navegar = (caminho: string) => {
        window.location.href = caminho;
    };

    /*
     * A sessão já foi criada pelo servidor durante
     * o login ou cadastro.
     *
     * O usuário não é armazenado no localStorage.
     */
    const aoEntrar = (_usuario: User) => {
        navegar("/dashboard");
    };

    const renderizarPagina = () => {
        switch (pagina) {
            case "landing":
                return (
                    <LandingPage
                        onOpenAuth={(modo) =>
                            navegar(modo === "LOGIN" ? "/login" : "/register")
                        }
                    />
                );

            case "login":
                return (
                    <AuthModal
                        mode="LOGIN"
                        onClose={() => navegar("/")}
                        onLogin={aoEntrar}
                    />
                );

            case "register":
                return (
                    <AuthModal
                        mode="REGISTER"
                        onClose={() => navegar("/")}
                        onLogin={aoEntrar}
                    />
                );

            case "dashboard":
                return <DashboardAutenticado />;

            default:
                return (
                    <LandingPage
                        onOpenAuth={(modo) =>
                            navegar(modo === "LOGIN" ? "/login" : "/register")
                        }
                    />
                );
        }
    };

    createRoot(elementoRaiz).render(
        <StrictMode>{renderizarPagina()}</StrictMode>,
    );
}
