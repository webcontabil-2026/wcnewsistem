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
    {{--
        Cabeçalho compartilhado pelas páginas públicas internas.
        Os estados de página atual serão acrescentados no Passo 2.
    --}}
    <header
        class="theme-header sticky top-0 z-10 border-b
               backdrop-blur-md"
    >
        <div
            class="layout-container-wide flex min-h-20 flex-wrap
                   items-center justify-between gap-4 py-3"
        >
            {{--
                A marca também funciona como um caminho acessível
                para retornar à página inicial.
            --}}
            <a
                href="/"
                class="wc-interactive flex items-center gap-4 rounded-xl"
                aria-label="Ir para a página inicial da WebContabil"
            >
                <div
                    class="brand-bg-square flex items-center justify-center
                           shadow-lg shadow-brand/40"
                >
                    <span
                        class="header-logo"
                        role="img"
                        aria-label="Logotipo WebContabil"
                    ></span>
                </div>

                <span
                    class="text-lg font-bold tracking-tight
                           theme-text-high"
                >
                    WebContabil
                </span>
            </a>

            {{--
                Mantém a mesma resposta visual de mouse, teclado e toque
                utilizada na tela inicial.
            --}}
            <nav
                class="flex flex-wrap items-center justify-center gap-2
                       text-xs font-bold uppercase tracking-widest
                       sm:gap-4"
                aria-label="Navegação principal"
            >
                <a
                    href="/"
                    class="wc-interactive wc-public-link"
                >
                    Início
                </a>

                <a
                    href="/sobre"
                    class="wc-interactive wc-public-link"
                >
                    Sobre Nós
                </a>

                <a
                    href="/servicos"
                    class="wc-interactive wc-public-link"
                >
                    Serviços
                </a>

                <a
                    href="/planos"
                    class="wc-interactive wc-public-link"
                >
                    Planos
                </a>

                <a
                    href="/contato"
                    class="wc-interactive wc-public-link"
                >
                    Contato
                </a>
            </nav>

            {{--
                As ações usam as classes globais para manter o mesmo
                padrão visual da página inicial.
            --}}
            <div class="layout-actions flex items-center gap-3">
                <a
                    href="/"
                    class="wc-interactive wc-button-primary inline-flex
                           min-h-11 items-center justify-center gap-2
                           rounded-full px-4 py-2 text-sm font-semibold"
                >
                    <span aria-hidden="true">←</span>
                    Voltar ao Início
                </a>

                <button
                    id="theme-toggle"
                    type="button"
                    class="wc-interactive wc-button-secondary min-h-11
                           rounded-lg px-4 py-2 text-sm font-semibold"
                    aria-label="Alternar entre os temas claro e escuro"
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