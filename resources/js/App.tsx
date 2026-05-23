/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, UserRole } from "./types";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import ClientDashboard from "./components/ClientDashboard";
import AccountantDashboard from "./components/AccountantDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");

    const handleLogin = (userData: User) => {
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
    };

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
