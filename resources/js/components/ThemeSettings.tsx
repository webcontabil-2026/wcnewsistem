/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

type ThemeKey = "light" | "dark";

const themeLabels: Record<ThemeKey, string> = {
    light: "Claro",
    dark: "Escuro",
};

const themeOptions: ThemeKey[] = ["light", "dark"];

function applyTheme(theme: ThemeKey) {
    const themeWindow = window as typeof window & {
        wcApplyTheme?: (selectedTheme: ThemeKey) => string;
    };

    if (typeof themeWindow.wcApplyTheme === "function") {
        themeWindow.wcApplyTheme(theme);
    }
}

export default function ThemeSettings() {
    const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(() => {
        if (typeof window === "undefined") {
            return "light";
        }
        const stored = window.localStorage.getItem("wc-theme");
        return stored === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        applyTheme(selectedTheme);
    }, [selectedTheme]);

    return (
        <section className="space-y-6 w-full">
            <div className="rounded-[28px] border border-white/10 bg-white/5 theme-block p-8 shadow-2xl">
                <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-black">
                        Configurações de Tema
                    </p>
                    <h2 className="text-3xl font-extrabold text-white">
                        Seletor do Tema Interno
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
                        O tema usa a paleta RGB global do sistema e é aplicado a todas as telas.
                        Escolha o modo que deve ser usado nesta aba de configurações.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {themeOptions.map((theme) => (
                        <button
                            key={theme}
                            type="button"
                            onClick={() => setSelectedTheme(theme)}
                            className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                                selectedTheme === theme
                                    ? "border-brand/60 bg-brand/10 text-white"
                                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                            }`}
                        >
                            <span className="block text-xs uppercase tracking-[0.25em] font-black mb-2">
                                {themeLabels[theme]}
                            </span>
                            <span className="block text-sm font-semibold">
                                {theme === "light" ? "Tema claro" : "Tema escuro"}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                        ["--theme-background", "Fundo"],
                        ["--theme-surface", "Superfície"],
                        ["--theme-text-primary", "Texto principal"],
                        ["--theme-text-secondary", "Texto secundário"],
                        ["--theme-highlight", "Destaque"],
                        ["--theme-border", "Bordas"],
                    ].map(([variable, label]) => (
                        <div key={variable} className="theme-surface theme-border rounded-3xl border p-4">
                            <p className="theme-text-low text-[11px] uppercase tracking-[0.25em] font-black mb-2">
                                {label}
                            </p>
                            <pre className="theme-text-high text-[13px] leading-6 break-words">
                                {`var(${variable})`}
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
