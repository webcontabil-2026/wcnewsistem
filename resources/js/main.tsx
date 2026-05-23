import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import ClientDashboard from "./components/ClientDashboard";
import AccountantDashboard from "./components/AccountantDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { User, UserRole } from "./types";

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

// Debug logs: temporários — removíveis após diagnóstico
try {
    console.log("[wc] main.tsx loaded", { href: window.location.href });
    console.log("[wc] rootElement dataset", rootElement.dataset);
} catch (e) {
    console.error("[wc] debug log failed", e);
}

const page = rootElement.dataset.page || "landing";
const role = (rootElement.dataset.role as UserRole | undefined) || "CLIENT";

const navigate = (path: string) => {
    window.location.href = path;
};

const saveUser = (user: User) => {
    localStorage.setItem("webcontabil-user", JSON.stringify(user));
};

const loadUser = (): User | null => {
    try {
        const stored = localStorage.getItem("webcontabil-user");
        return stored ? (JSON.parse(stored) as User) : null;
    } catch {
        return null;
    }
};

const defaultUser: User = {
    id: "demo",
    name: "Usuário Teste",
    email: "demo@webcontabil.com",
    role,
    razaoSocial: "WebContabil",
    cpf: "",
    cnpj: "",
    crc: "",
};

const handleLogin = (user: User) => {
    saveUser(user);
    navigate("/dashboard");
};

const handleLogout = () => {
    localStorage.removeItem("webcontabil-user");
    navigate("/");
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

        case "dashboard": {
            const storedUser = loadUser();
            const currentUser = storedUser || defaultUser;

            if (currentUser.role === "CLIENT") {
                return (
                    <ClientDashboard
                        user={currentUser}
                        onLogout={handleLogout}
                    />
                );
            }

            if (currentUser.role === "ACCOUNTANT") {
                return (
                    <AccountantDashboard
                        user={currentUser}
                        onLogout={handleLogout}
                    />
                );
            }

            return (
                <AdminDashboard user={currentUser} onLogout={handleLogout} />
            );
        }

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
