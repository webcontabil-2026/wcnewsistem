<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', config('app.name', 'WebContabil'))</title>

        @include('partials.theme')

        @php
            $manifestPath = public_path('build/manifest.json');
        @endphp

        @if (file_exists($manifestPath))
            @php
                $manifest = json_decode(file_get_contents($manifestPath), true);
                $cssEntry = $manifest['resources/css/app.css'] ?? null;
                $jsEntry = $manifest['resources/js/app.js'] ?? null;
            @endphp

            @if ($cssEntry && $jsEntry)
                <link
                    rel="stylesheet"
                    href="/build/{{ trim($cssEntry['file'], '/') }}"
                >
                <script
                    type="module"
                    src="/build/{{ trim($jsEntry['file'], '/') }}"
                ></script>
            @else
                @vite([
                    'resources/css/app.css',
                    'resources/js/app.js',
                ])
            @endif
        @else
            @vite([
                'resources/css/app.css',
                'resources/js/app.js',
            ])
        @endif
    </head>

    <body class="theme-page min-h-screen">
        @php
            /*
             * Identifica a página atual para decidir se o conteúdo será
             * renderizado pelo React ou diretamente por uma view Blade.
             */
            $currentPage = trim($__env->yieldContent('page')) ?: 'landing';

            /*
             * Estas páginas possuem cabeçalhos próprios controlados pelo React.
             * As demais páginas utilizam o cabeçalho compartilhado abaixo.
             */
            $reactPages = [
                'landing',
                'login',
                'register',
                'dashboard',
            ];
        @endphp

        @if (!in_array($currentPage, $reactPages))
            <header
                class="border-b border-white/10 bg-slate-900/80
                       backdrop-blur-md sticky top-0 z-10"
            >
                <div
                    class="layout-container-wide flex flex-wrap items-center
                           justify-between min-h-20 py-2 gap-4"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="flex items-center justify-center
                                   brand-bg-square shadow-lg shadow-brand/40"
                        >
                            <span
                                class="header-logo"
                                role="img"
                                aria-label="WebContabil"
                            ></span>
                        </div>

                        <span
                            class="text-lg font-bold theme-text-high
                                   tracking-tight"
                        >
                            WebContabil
                        </span>
                    </div>

                    <nav
                        class="flex flex-wrap items-center gap-4 text-xs
                               font-bold uppercase tracking-widest
                               theme-text-high"
                        aria-label="Navegação principal"
                    >
                        <a
                            href="/"
                            class="theme-link hover:underline"
                        >
                            Início
                        </a>

                        <a
                            href="/sobre"
                            class="theme-link hover:underline"
                        >
                            Sobre Nós
                        </a>

                        <a
                            href="/servicos"
                            class="theme-link hover:underline"
                        >
                            Serviços
                        </a>

                        <a
                            href="/planos"
                            class="theme-link hover:underline"
                        >
                            Planos
                        </a>

                        <a
                            href="/contato"
                            class="theme-link hover:underline"
                        >
                            Contato
                        </a>
                    </nav>

                    <div class="layout-actions flex items-center gap-4">
                        <a
                            href="/"
                            class="inline-flex items-center gap-2 rounded-full
                                   px-4 py-2 bg-brand text-white
                                   hover:bg-brand-light transition
                                   text-sm font-semibold"
                        >
                            ← Voltar ao Início
                        </a>

                        <button
                            id="theme-toggle"
                            type="button"
                            class="px-3 py-2 rounded-md border text-sm
                                   font-medium theme-text-high
                                   hover:opacity-70 transition"
                        >
                            Alternar Tema
                        </button>
                    </div>
                </div>
            </header>
        @endif

        @if (in_array($currentPage, $reactPages))
            <div
                id="root"
                data-page="@yield('page', 'landing')"
                data-role="@yield('role', 'CLIENT')"
                class="min-h-screen"
            ></div>
        @else
            @yield('content')
        @endif

        <script>
            /*
             * Mantém o botão do cabeçalho sincronizado com o tema global
             * armazenado no navegador.
             */
            (function () {
                const button = document.getElementById('theme-toggle');

                /*
                 * Algumas páginas possuem cabeçalho controlado pelo React.
                 * Nessas telas o botão deste layout não existe.
                 */
                if (!button) {
                    return;
                }

                /*
                 * Atualiza o texto do botão para indicar qual tema será
                 * ativado no próximo clique.
                 */
                const updateButton = function (theme) {
                    button.textContent =
                        theme === 'dark'
                            ? 'Modo Claro'
                            : 'Modo Escuro';
                };

                /*
                 * Aplica o tema salvo ao carregar a página e atualiza
                 * imediatamente o texto apresentado ao usuário.
                 */
                const currentTheme = window.wcApplyTheme(
                    document.documentElement.dataset.theme
                );

                updateButton(currentTheme);

                /*
                 * Alterna entre os temas claro e escuro sempre que o usuário
                 * aciona o botão do cabeçalho.
                 */
                button.addEventListener('click', function () {
                    const nextTheme =
                        document.documentElement.dataset.theme === 'dark'
                            ? 'light'
                            : 'dark';

                    updateButton(
                        window.wcApplyTheme(nextTheme)
                    );
                });
            })();
        </script>
    </body>
</html>