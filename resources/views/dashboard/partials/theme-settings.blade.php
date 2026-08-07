<section class="space-y-6 w-full">
    <div class="rounded-[28px] border border-white/10 bg-white/5 theme-block p-8 shadow-2xl">
        <div class="flex flex-col gap-2">
            <p class="text-xs uppercase tracking-[0.3em] text-white/40 font-black">
                Configurações de Tema
            </p>
            <h2 class="text-3xl font-extrabold text-white">
                Seletor de Tema Interno
            </h2>
            <p class="text-sm text-white/50 leading-relaxed max-w-2xl">
                Altere o tema do painel a partir desta aba de configuração. O tema é aplicado no layout global e preservado no navegador.
            </p>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <button
                type="button"
                onclick="window.wcApplyTheme && window.wcApplyTheme('light')"
                class="rounded-3xl border px-5 py-4 text-left transition-all border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
            >
                <span class="block text-xs uppercase tracking-[0.25em] font-black mb-2">
                    Claro
                </span>
                <span class="block text-sm font-semibold">Tema claro</span>
            </button>
            <button
                type="button"
                onclick="window.wcApplyTheme && window.wcApplyTheme('dark')"
                class="rounded-3xl border px-5 py-4 text-left transition-all border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
            >
                <span class="block text-xs uppercase tracking-[0.25em] font-black mb-2">
                    Escuro
                </span>
                <span class="block text-sm font-semibold">Tema escuro</span>
            </button>
        </div>

        <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p class="text-white/40 text-[11px] uppercase tracking-[0.25em] font-black mb-2">
                    Fundo
                </p>
                <pre class="text-[13px] leading-6 text-white/80 break-words">var(--theme-background)</pre>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p class="text-white/40 text-[11px] uppercase tracking-[0.25em] font-black mb-2">
                    Destaque
                </p>
                <pre class="text-[13px] leading-6 text-white/80 break-words">var(--theme-highlight)</pre>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p class="text-white/40 text-[11px] uppercase tracking-[0.25em] font-black mb-2">
                    Principal
                </p>
                <pre class="text-[13px] leading-6 text-white/80 break-words">var(--theme-header-text)</pre>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p class="text-white/40 text-[11px] uppercase tracking-[0.25em] font-black mb-2">
                    Secundário
                </p>
                <pre class="text-[13px] leading-6 text-white/80 break-words">var(--theme-secondary)</pre>
            </div>
        </div>
    </div>
</section>
