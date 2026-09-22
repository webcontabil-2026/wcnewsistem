import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import ClientDashboard from "./components/ClientDashboard";
import AccountantDashboard from "./components/AccountantDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { ApiError, apiRequest } from "./lib/api";
import { User } from "./types";

/**
 * Controla o dashboard usando exclusivamente a sessão autenticada
 * pelo Laravel.
 */
function DashboardAutenticado() {
    const [user, setUser] = useState<User | null>(null);
    const [verificandoSessao, setVerificandoSessao] = useState(true);
    const [erroSessao, setErroSessao] = useState("");

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
                    setUser(resposta.user);
                }
            } catch (error) {
                /*
                 * Usuários sem sessão são encaminhados para o login.
                 */
                if (error instanceof ApiError && error.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                if (componenteAtivo) {
                    setErroSessao(
                        error instanceof ApiError
                            ? error.message
                            : "Não foi possível verificar sua sessão.",
                    );
                }
            } finally {
                if (componenteAtivo) {
                    setVerificandoSessao(false);
                }
            }
        };

        void carregarSessao();

        return () => {
            componenteAtivo = false;
        };
    }, []);

    /*
     * Encerra a sessão no servidor e retorna à página inicial.
     */
    const encerrarSessao = async () => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Erro ao encerrar a sessão:", error);
        } finally {
            window.location.replace("/");
        }
    };

    if (verificandoSessao) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
                <p className="text-sm font-semibold text-white/60">
                    Verificando sessão...
                </p>
            </div>
        );
    }

    if (erroSessao) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-200">
                <p className="text-sm font-semibold text-red-400">
                    {erroSessao}
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (user.role === "CLIENT") {
        return <ClientDashboard user={user} onLogout={encerrarSessao} />;
    }

    if (user.role === "ACCOUNTANT") {
        return <AccountantDashboard user={user} onLogout={encerrarSessao} />;
    }

    if (user.role === "ADMIN") {
        return <AdminDashboard user={user} onLogout={encerrarSessao} />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-red-400">
            O perfil desta conta não possui permissão de acesso.
        </div>
    );
}

const rootElement = document.getElementById("root");

/*
 * Inicializa o React somente nas páginas que possuem o elemento raiz.
 */
if (rootElement) {
    const page = rootElement.dataset.page || "landing";

    const navigate = (path: string) => {
        window.location.href = path;
    };

    /*
     * A sessão já foi criada pelo servidor durante o login ou cadastro.
     * Não armazenamos o usuário no localStorage.
     */
    const handleLogin = (_user: User) => {
        navigate("/dashboard");
    };

    const renderPage = () => {
        switch (page) {
            case "landing":
                return (
                    <LandingPage
                        onOpenAuth={(mode) =>
                            navigate(mode === "LOGIN" ? "/login" : "/register")
                        }
                    />
                );

            case "login":
                return (
                    <AuthModal
                        mode="LOGIN"
                        onClose={() => navigate("/")}
                        onLogin={handleLogin}
                    />
                );

            case "register":
                return (
                    <AuthModal
                        mode="REGISTER"
                        onClose={() => navigate("/")}
                        onLogin={handleLogin}
                    />
                );

            case "dashboard":
                return <DashboardAutenticado />;

            default:
                return (
                    <LandingPage
                        onOpenAuth={(mode) =>
                            navigate(mode === "LOGIN" ? "/login" : "/register")
                        }
                    />
                );
        }
    };

    createRoot(rootElement).render(<StrictMode>{renderPage()}</StrictMode>);
}
