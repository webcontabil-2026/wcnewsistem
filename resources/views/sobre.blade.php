@extends('layouts.app')

@section('title', 'Sobre Nós - WebContabil')
@section('page', 'sobre')

@section('content')
    <main class="max-w-6xl mx-auto px-4 py-20">
        {{-- Cabeçalho da Página --}}
        <h1 class="text-4xl font-bold theme-text-high mt-6 mb-12">Sobre Nós</h1>

        {{-- Seção Principal / O Manifesto --}}
        <section class="mb-16">
            <p class="text-xl font-medium theme-text-high leading-relaxed mb-6">
                O <span class="text-brand font-semibold">WebContábil</span> é um sistema web voltado à contabilidade online, desenvolvido para resolver as principais demandas de escritórios e profissionais contábeis de forma rápida, eficaz e segura.
            </p>
            <p class="text-lg theme-text-low leading-relaxed">
                A plataforma centraliza em um único ambiente todos os processos que um contador realiza no dia a dia, eliminando de vez o uso de ferramentas dispersas e reduzindo drasticamente os erros operacionais que atrasam a produtividade.
            </p>
        </section>

        {{-- Seção Nossa Missão --}}
        <section class="grid md:grid-cols-2 gap-12 items-center mb-20 border-t border-b theme-border py-12">
            <div>
                <h2 class="text-2xl font-bold theme-text-high mb-4">Nossa Missão e Propósito</h2>
                <p class="text-base theme-text-low leading-relaxed mb-4">
                    Nascemos com o propósito de transformar a rotina contábil através da tecnologia. Sabemos que o dia a dia de um escritório exige precisão milimétrica e total conformidade com a legislação. 
                </p>
                <p class="text-base theme-text-low leading-relaxed">
                    Por isso, nossa missão é desmistificar a burocracia e entregar uma interface intuitiva que devolva o tempo precioso dos profissionais, permitindo que foquem no atendimento consultivo e no crescimento estratégico de seus clientes.
                </p>
            </div>
            <div class="theme-surface-muted border theme-border rounded-2xl p-8 text-center flex flex-col justify-center min-h-64">
                <span class="text-sm font-semibold text-brand tracking-wider uppercase mb-2">Tecnologia Humana</span>
                <p class="text-xl italic theme-text-high">"Mais que automatizar processos, nosso objetivo é valorizar o tempo do contador."</p>
            </div>
        </section>

        {{-- Seção Pilares / Diferenciais --}}
        <section class="mb-16">
            <h2 class="text-2xl font-bold theme-text-high text-center mb-10">Por que o WebContábil?</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                {{-- Card 1 --}}
                <div class="p-6 rounded-xl border theme-border bg-card shadow-sm">
                    <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4 text-xl font-bold">🛡️</div>
                    <h3 class="text-lg font-bold theme-text-high mb-2">Segurança Absoluta</h3>
                    <p class="text-sm theme-text-low leading-relaxed">
                        Protegemos os dados da sua empresa e de seus clientes com criptografia de ponta e armazenamento em nuvem de alta confiabilidade.
                    </p>
                </div>

                {{-- Card 2 --}}
                <div class="p-6 rounded-xl border theme-border bg-card shadow-sm">
                    <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4 text-xl font-bold">⚡</div>
                    <h3 class="text-lg font-bold theme-text-high mb-2">Eficiência Operacional</h3>
                    <p class="text-sm theme-text-low leading-relaxed">
                        Automação de rotinas repetitivas que elimina o retrabalho, minimiza falhas humanas e otimiza as entregas da equipe.
                    </p>
                </div>

                {{-- Card 3 --}}
                <div class="p-6 rounded-xl border theme-border bg-card shadow-sm">
                    <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4 text-xl font-bold">🔄</div>
                    <h3 class="text-lg font-bold theme-text-high mb-2">Centralização Total</h3>
                    <p class="text-sm theme-text-low leading-relaxed">
                        Diga adeus às dezenas de planilhas soltas. Gerencie guias, relatórios e comunicações em um único ecossistema integrado.
                    </p>
                </div>
            </div>
        </section>

        {{-- Seção Final / CTA --}}
        <section class="text-center bg-brand text-white rounded-2xl p-10 mt-12 shadow-md">
            <h2 class="text-2xl font-bold mb-3">Pronto para modernizar seu escritório?</h2>
            <p class="text-white/80 max-w-xl mx-auto mb-6">Descubra como o WebContábil pode simplificar sua gestão diária e elevar o nível das suas entregas.</p>
            <a href="/register" class="inline-block bg-white text-brand font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                Começar Agora
            </a>
        </section>
    </main>
@endsection
