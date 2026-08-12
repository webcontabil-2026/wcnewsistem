@extends('layouts.app')

@section('title', 'Serviços - WebContábil')
@section('page', 'servicos')

@section('content')
<main class="max-w-6xl mx-auto px-4 py-20">
    <h1 class="text-4xl font-bold theme-text-high mt-6 mb-12">Serviços</h1>

    <section class="mb-16">
        <div>
            <span class="text-sm font-bold uppercase tracking-widest text-brand">Soluções integradas</span>
            <h2 class="text-2xl font-bold theme-text-high mt-4 mb-6 max-w-3xl">A rotina contábil inteira em um fluxo simples.</h2>
            <p class="text-lg theme-text-low max-w-4xl leading-relaxed">Recursos pensados para o escritório orientar seus clientes, receber informações e acompanhar impostos sem depender de mensagens espalhadas.</p>
        </div>
    </section>

    <section class="border-t border-b theme-border py-12 mb-20">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach ([
                ['📁', 'Central de documentos', 'Envie, solicite e organize arquivos por cliente, competência e categoria em um histórico fácil de consultar.'],
                ['🗓️', 'Agenda de obrigações', 'Visualize vencimentos, responsáveis e pendências para antecipar o trabalho antes que o prazo aperte.'],
                ['🧾', 'Gestão de impostos', 'Reúna guias e comprovantes e acompanhe o status de cada imposto com mais clareza.'],
                ['🔔', 'Avisos inteligentes', 'Lembretes ajudam contador e cliente a agir no momento certo, reduzindo atrasos e cobranças manuais.'],
                ['💬', 'Atendimento contextual', 'Converse sobre uma tarefa ou documento específico e preserve todo o contexto da solicitação.'],
                ['📊', 'Visão do escritório', 'Acompanhe a operação em painéis objetivos e identifique rapidamente o que precisa de atenção.'],
            ] as [$icon, $title, $description])
                <article class="rounded-2xl border theme-border bg-card p-7 shadow-sm hover:-translate-y-1 transition">
                    <span class="w-12 h-12 grid place-items-center rounded-xl bg-brand/10 text-xl mb-5">{{ $icon }}</span>
                    <h2 class="text-xl font-bold theme-text-high mb-3">{{ $title }}</h2>
                    <p class="theme-text-low leading-relaxed">{{ $description }}</p>
                </article>
            @endforeach
        </div>
        <div class="mt-16 rounded-2xl bg-brand text-white p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-md">
            <div>
                <h2 class="text-3xl font-black">Seu escritório, no controle.</h2>
                <p class="text-white/80 mt-3 max-w-2xl">Monte um fluxo mais previsível para sua equipe e uma experiência mais transparente para seus clientes.</p>
            </div>
            <a href="/contato" class="shrink-0 rounded-full bg-white text-brand font-bold px-7 py-3 text-center hover:bg-gray-100 transition">Solicitar apresentação</a>
        </div>
    </section>
</main>
@endsection
