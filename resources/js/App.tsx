/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, UserRole } from "./types";
import { ApiError, apiRequest } from "./lib/api";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import ClientDashboard from "./components/ClientDashboard";
import AccountantDashboard from "./components/AccountantDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    /*
     * Evita mostrar a página pública enquanto o Laravel verifica a sessão.
     */
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
    /*
     * Recupera a sessão existente ao abrir ou atualizar a página.
     */
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await apiRequest<{
                    user: User;
                }>("/auth/current");

                setUser(response.user);
            } catch (error) {
                /*
                 * O código 401 é esperado quando ninguém está conectado.
                 */
                if (!(error instanceof ApiError && error.status === 401)) {
                    console.error("Erro ao restaurar a sessão:", error);
                }

                setUser(null);
            } finally {
                setIsCheckingSession(false);
            }
        };

        void restoreSession();
    }, []);
    const handleLogin = (userData: User) => {
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    /*
     * Encerra a sessão também no servidor.
     */
    const handleLogout = async () => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Erro ao encerrar a sessão:", error);
        } finally {
            setUser(null);

            /*
             * Recarrega o token CSRF após o encerramento da sessão.
             */
            window.location.assign("/");
        }
    };
    if (isCheckingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
                <p className="text-sm font-semibold text-white/60">
                    Verificando sessão...
                </p>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="relative min-h-screen font-sans bg-slate-950 text-slate-200 overflow-hidden">
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0C447C] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#185FA5] rounded-full blur-[120px]"></div>
                </div>

                <motion.div
                    className="relative z-10"
                    animate={{
                        filter: isAuthModalOpen
                            ? "grayscale(100%) blur(4px)"
                            : "grayscale(0%) blur(0px)",
                        opacity: isAuthModalOpen ? 0.6 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <LandingPage
                        onOpenAuth={(mode) => {
                            setAuthMode(mode);
                            setIsAuthModalOpen(true);
                        }}
                    />
                </motion.div>

                <AnimatePresence>
                    {isAuthModalOpen && (
                        <AuthModal
                            mode={authMode}
                            onClose={() => setIsAuthModalOpen(false)}
                            onLogin={handleLogin}
                        />
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0C447C] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#185FA5] rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 min-h-screen">
                {user.role === "CLIENT" && (
                    <ClientDashboard user={user} onLogout={handleLogout} />
                )}
                {user.role === "ACCOUNTANT" && (
                    <AccountantDashboard user={user} onLogout={handleLogout} />
                )}
                {user.role === "ADMIN" && (
                    <AdminDashboard user={user} onLogout={handleLogout} />
                )}
            </div>
        </div>
    );
}
