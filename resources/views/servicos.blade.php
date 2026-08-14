@extends('layouts.app')

@section('title', 'Serviços - WebContábil')
@section('page', 'servicos')

@section('content')
<main class="layout-container layout-section">
    <h1 class="text-4xl font-bold theme-text-high mt-6 mb-12">
        Serviços
    </h1>

    <section class="mb-16">
        <div>
            <span
                class="text-sm font-bold uppercase tracking-widest text-brand"
            >
                Soluções integradas
            </span>

            <h2
                class="text-2xl font-bold theme-text-high
                       mt-4 mb-6 max-w-3xl"
            >
                A rotina contábil inteira em um fluxo simples.
            </h2>

            <p
                class="text-lg theme-text-low max-w-4xl
                       leading-relaxed"
            >
                Recursos pensados para o escritório orientar seus clientes,
                receber informações e acompanhar impostos sem depender de
                mensagens espalhadas.
            </p>
        </div>
    </section>

    <section class="border-t border-b theme-border py-12 mb-20">
        {{--
            A grade utiliza o padrão responsivo global.
            Os cards são empilhados no celular, organizados em duas colunas
            no tablet e em três colunas nas telas maiores.
        --}}
        <div
            class="layout-grid grid-cols-1
                   md:grid-cols-2 lg:grid-cols-3"
        >
            @foreach ([
                [
                    '📁',
                    'Central de documentos',
                    'Envie, solicite e organize arquivos por cliente, competência e categoria em um histórico fácil de consultar.',
                ],
                [
                    '🗓️',
                    'Agenda de obrigações',
                    'Visualize vencimentos, responsáveis e pendências para antecipar o trabalho antes que o prazo aperte.',
                ],
                [
                    '🧾',
                    'Gestão de impostos',
                    'Reúna guias e comprovantes e acompanhe o status de cada imposto com mais clareza.',
                ],
                [
                    '🔔',
                    'Avisos inteligentes',
                    'Lembretes ajudam contador e cliente a agir no momento certo, reduzindo atrasos e cobranças manuais.',
                ],
                [
                    '💬',
                    'Atendimento contextual',
                    'Converse sobre uma tarefa ou documento específico e preserve todo o contexto da solicitação.',
                ],
                [
                    '📊',
                    'Visão do escritório',
                    'Acompanhe a operação em painéis objetivos e identifique rapidamente o que precisa de atenção.',
                ],
            ] as [$icon, $title, $description])
                {{--
    O serviço é informativo nesta etapa.
    Por isso, recebe destaque visual sem assumir aparência de botão.
--}}
<article
    class="wc-information-card rounded-2xl border p-7
           shadow-sm theme-border bg-card"
>
                    <span
    class="wc-information-card-icon mb-5 grid h-12 w-12
           place-items-center rounded-xl bg-brand/10
           text-xl text-brand"
    aria-hidden="true"
>
                        {{ $icon }}
                    </span>

                    <h2 class="text-xl font-bold theme-text-high mb-3">
                        {{ $title }}
                    </h2>

                    <p class="theme-text-low leading-relaxed">
                        {{ $description }}
                    </p>
                </article>
            @endforeach
        </div>

        {{--
            O bloco de chamada utiliza espaçamento menor no celular
            e aumenta sua margem interna conforme a tela fica maior.
        --}}
        <div
            class="mt-16 rounded-2xl bg-brand text-white
                   p-6 sm:p-10 flex flex-col md:flex-row
                   md:items-center justify-between gap-8 shadow-md"
        >
            <div>
                <h2 class="text-3xl font-black">
                    Seu escritório, no controle.
                </h2>

                <p class="text-white/80 mt-3 max-w-2xl">
                    Monte um fluxo mais previsível para sua equipe e uma
                    experiência mais transparente para seus clientes.
                </p>
            </div>

            {{--
    Direciona o visitante ao contato com resposta visual para
    mouse, teclado e toque.
--}}
<a
    href="/contato"
    class="wc-interactive wc-button-secondary inline-flex min-h-11
           shrink-0 items-center justify-center rounded-full
           px-7 py-3 text-center font-bold"
>
    Solicitar apresentação
</a>
        </div>
    </section>
</main>
@endsection