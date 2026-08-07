import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeKey = "light" | "dark";

type ThemeWindow = typeof window & {
    wcApplyTheme?: (theme: ThemeKey) => ThemeKey;
};

function getCurrentTheme(): ThemeKey {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeKey>(() => getCurrentTheme());

    useEffect(() => {
        /* Mantém todos os seletores sincronizados quando o tema muda. */
        const handleThemeChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ theme: ThemeKey }>;
            setTheme(customEvent.detail?.theme ?? getCurrentTheme());
        };

        window.addEventListener("wc-theme-change", handleThemeChange);
        return () => window.removeEventListener("wc-theme-change", handleThemeChange);
    }, []);

    const nextTheme: ThemeKey = theme === "dark" ? "light" : "dark";
    const label = nextTheme === "dark" ? "Ativar tema escuro" : "Ativar tema claro";

    const toggleTheme = () => {
        const applyTheme = (window as ThemeWindow).wcApplyTheme;
        const selectedTheme = applyTheme?.(nextTheme) ?? nextTheme;
        setTheme(selectedTheme);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors"
            aria-label={label}
            title={label}
        >
            {theme === "dark" ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
            ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
            )}
        </button>
    );
}
