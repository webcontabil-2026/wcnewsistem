<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', config('app.name', 'WebContabil'))</title>
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
                <link rel="stylesheet" href="/build/{{ trim($cssEntry['file'], '/') }}">
                <script type="module" src="/build/{{ trim($jsEntry['file'], '/') }}"></script>
            @else
                @vite(['resources/css/app.css', 'resources/js/app.js'])
            @endif
        @else
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif
    </head>
    <body class="min-h-screen">
        @php
            $currentPage = trim($__env->yieldContent('page')) ?: 'landing';
        @endphp

        @if ($currentPage !== 'landing')
            <header class="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between h-20 gap-4">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center justify-center w-20 h-20 rounded-xl brand-bg-square shadow-lg shadow-brand/40">
                            <img src="/images/logo.svg" alt="WebContabil" class="header-logo" />
                        </div>
                        <span class="text-lg font-bold theme-text-high tracking-tight">WebContabil</span>
                    </div>
                    <nav class="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest theme-text-high">
                        <a href="/" class="theme-link hover:underline">Início</a>
                        <a href="/sobre" class="theme-link hover:underline">Sobre Nós</a>
                        <a href="/servicos" class="theme-link hover:underline">Serviços</a>
                        <a href="/planos" class="theme-link hover:underline">Planos</a>
                        <a href="/contato" class="theme-link hover:underline">Contato</a>
                    </nav>
                    <div class="flex items-center gap-4">
                        <a href="/" class="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-brand text-white hover:bg-brand-light transition text-sm font-semibold">← Voltar ao Início</a>
                        <button id="theme-toggle" class="px-3 py-2 rounded-md border border-white/20 text-sm font-medium theme-text-high hover:bg-white/10 transition">
                            Alternar Tema
                        </button>
                    </div>
                </div>
            </header>
        @endif

        @if ($currentPage === 'landing')
            <div id="root" data-page="@yield('page', 'landing')" data-role="@yield('role', 'CLIENT')" class="min-h-screen"></div>
        @else
            @yield('content')
        @endif

        <script>
            (function () {
                try {
                    const button = document.getElementById('theme-toggle');
                    const stored = localStorage.getItem('wc-theme');
                    const theme = stored === 'light' ? 'light' : 'dark';
                    document.body.classList.toggle('theme-dark', theme === 'dark');
                    if (button) {
                        button.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
                        button.addEventListener('click', () => {
                            const isDark = document.body.classList.toggle('theme-dark');
                            localStorage.setItem('wc-theme', isDark ? 'dark' : 'light');
                            button.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        </script>
    </body>
</html>
