@extends('layouts.app')

@section('title', 'Serviços e Planos - WebContabil')
@section('page', 'planos')

@section('content')
@php
    /*
     * Serviços demonstrativos destinados a pessoas físicas.
     * Os valores e limites serão substituídos pelas condições comerciais reais.
     */
    $personalServices = [
        [
            'title' => 'Declaração de Imposto de Renda',
            'description' => 'Preparação, revisão e envio da declaração anual da pessoa física.',
            'included' => [
                'Análise dos documentos',
                'Preenchimento e revisão',
                'Envio da declaração',
                'Entrega do recibo',
            ],
            'limit' => 'Até 2 fontes de renda, 2 contas bancárias e 1 bem declarado.',
            'audience' => 'Contribuintes que precisam entregar a declaração anual.',
            'price' => 'A partir de R$ 119,90',
        ],
        [
            'title' => 'Declaração Retificadora',
            'description' => 'Correção de informações incompletas ou incorretas em uma declaração já enviada.',
            'included' => [
                'Análise da declaração original',
                'Identificação das inconsistências',
                'Preparação da correção',
                'Envio da retificação',
            ],
            'limit' => 'Uma declaração e até 3 correções cadastrais ou financeiras.',
            'audience' => 'Pessoas que identificaram erros após o envio.',
            'price' => 'A partir de R$ 99,90',
        ],
        [
            'title' => 'Regularização de CPF',
            'description' => 'Análise da situação cadastral e orientação para solucionar pendências no CPF.',
            'included' => [
                'Consulta da situação cadastral',
                'Identificação da pendência',
                'Orientação sobre documentos',
                'Acompanhamento da solicitação',
            ],
            'limit' => 'Um CPF e uma solicitação de regularização.',
            'audience' => 'Pessoas com CPF suspenso ou pendente de regularização.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Consulta de Malha Fiscal',
            'description' => 'Análise de pendências em uma declaração retida para verificação e abertura de processos para resolução.',
            'included' => [
                'Identificação das pendências',
                'Conferência dos documentos',
                'Orientação sobre correções',
                'Organização dos comprovantes',
            ],
            'limit' => 'Uma declaração e uma análise inicial.',
            'audience' => 'Contribuintes com declaração retida ou com pendências.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Carnê-Leão e DARF',
            'description' => 'Apuração mensal de rendimentos e preparação da respectiva guia de pagamento.',
            'included' => [
                'Organização dos rendimentos',
                'Cálculo mensal',
                'Emissão de uma DARF',
                'Resumo para a declaração anual',
            ],
            'limit' => 'Uma competência mensal e até 20 lançamentos.',
            'audience' => 'Autônomos, profissionais liberais e pessoas com rendimentos mensais.',
            'price' => 'A partir de R$ 89,90',
        ],
        [
            'title' => 'Apuração de Ganho de Capital',
            'description' => 'Análise e cálculo relacionado à venda de um bem ou direito.',
            'included' => [
                'Análise da compra e da venda',
                'Cálculo do ganho',
                'Orientação sobre o imposto',
                'Emissão da guia quando aplicável',
            ],
            'limit' => 'Um bem e uma operação de venda.',
            'audience' => 'Pessoas que venderam imóveis, veículos ou outros bens.',
            'price' => 'A partir de R$ 119,90',
        ],
    ];

    /*
     * Serviços demonstrativos destinados a pessoas jurídicas.
     * Os valores permanecem sob consulta porque dependem do porte e da operação.
     */
    $businessServices = [
        [
            'title' => 'Abertura de Empresa',
            'description' => 'Acompanhamento da criação e da regularização inicial de uma empresa.',
            'included' => [
                'Análise inicial do negócio',
                'Orientação sobre atividades',
                'Acompanhamento cadastral',
                'Lista de documentos necessários',
            ],
            'limit' => 'Um CNPJ, um estabelecimento, até 3 sócios e até 5 atividades.',
            'audience' => 'Empreendedores que estão iniciando um negócio.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Alteração e Regularização',
            'description' => 'Atualização ou correção dos dados cadastrais de uma empresa existente.',
            'included' => [
                'Análise cadastral',
                'Orientação sobre alterações',
                'Acompanhamento das pendências',
                'Organização dos documentos',
            ],
            'limit' => 'Um CNPJ e até 3 alterações no mesmo processo.',
            'audience' => 'Empresas que precisam atualizar ou regularizar seus dados.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Contabilidade Mensal',
            'description' => 'Acompanhamento recorrente das movimentações e obrigações contábeis.',
            'included' => [
                'Organização dos documentos',
                'Acompanhamento mensal',
                'Conciliação financeira',
                'Demonstrativos básicos',
            ],
            'limit' => 'Uma empresa, um estabelecimento, até 3 contas financeiras e 300 lançamentos mensais.',
            'audience' => 'Pequenas empresas que precisam de acompanhamento contínuo.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Gestão Fiscal e Tributária',
            'description' => 'Acompanhamento de impostos, guias, vencimentos e obrigações fiscais.',
            'included' => [
                'Apuração de tributos',
                'Organização das guias',
                'Calendário de vencimentos',
                'Acompanhamento de pendências',
            ],
            'limit' => 'Um CNPJ, um estabelecimento e as obrigações do regime contratado.',
            'audience' => 'Empresas que desejam organizar sua rotina fiscal.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Folha de Pagamento',
            'description' => 'Processamento das informações relacionadas aos colaboradores e responsáveis.',
            'included' => [
                'Folha mensal e pró-labore',
                'Férias',
                'Admissões e desligamentos',
                'Organização dos encargos',
            ],
            'limit' => 'Até 55 colaboradores, incluindo funcionários e responsáveis cadastrados.',
            'audience' => 'Empresas de pequeno porte com equipe própria.',
            'price' => 'Sob consulta',
        ],
        [
            'title' => 'Relatórios e Consultoria',
            'description' => 'Apresentação de resultados para apoiar decisões financeiras e administrativas.',
            'included' => [
                'Resumo de receitas e despesas',
                'Demonstrativos e indicadores',
                'Reunião de acompanhamento',
                'Orientação sobre pontos de atenção',
            ],
            'limit' => 'Até 3 relatórios e uma reunião de acompanhamento por mês.',
            'audience' => 'Empresas que desejam acompanhar seus resultados com clareza.',
            'price' => 'Sob consulta',
        ],
    ];
@endphp

<main class="layout-container layout-section">
    <header class="mx-auto mb-12 max-w-4xl text-center">
        <span
            class="text-sm font-bold uppercase tracking-widest text-brand"
        >
            Serviços para cada necessidade
        </span>

        <h1
            class="mt-4 text-4xl font-black tracking-tight
                   theme-text-high sm:text-5xl"
        >
            Escolha o atendimento ideal para você.
        </h1>

        <p
            class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed
                   theme-text-low"
        >
            Encontre serviços pontuais para pessoas físicas ou solicite
            uma proposta personalizada para sua empresa.
        </p>
    </header>

    {{--
        Permite alternar entre os serviços de pessoa física e jurídica
        sem recarregar a página.
    --}}
    <div
        class="wc-plan-selector mb-12"
        role="tablist"
        aria-label="Selecione o perfil dos serviços"
    >
        <button
            id="plan-tab-personal"
            type="button"
            class="wc-plan-tab"
            role="tab"
            aria-selected="true"
            aria-controls="plan-panel-personal"
            tabindex="0"
            data-plan-tab="personal"
        >
            Pessoa Física
        </button>

        <button
            id="plan-tab-business"
            type="button"
            class="wc-plan-tab"
            role="tab"
            aria-selected="false"
            aria-controls="plan-panel-business"
            tabindex="-1"
            data-plan-tab="business"
        >
            Pessoa Jurídica
        </button>
    </div>

    {{--
        Painel de serviços destinados a pessoas físicas.
    --}}
    <section
        id="plan-panel-personal"
        class="wc-plan-panel"
        role="tabpanel"
        aria-labelledby="plan-tab-personal"
        data-plan-panel="personal"
    >
        <div class="mb-8">
            <h2 class="text-2xl font-black theme-text-high">
                Serviços para Pessoa Física
            </h2>

            <p class="mt-2 theme-text-low">
                Atendimentos pontuais com valores iniciais demonstrativos.
            </p>
        </div>

        <div class="layout-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            @foreach ($personalServices as $service)
                <article class="wc-service-card p-6 sm:p-7">
                    <div class="mb-5">
                        <span
                            class="inline-flex rounded-full bg-brand/10
                                   px-3 py-1 text-xs font-black uppercase
                                   tracking-wider text-brand"
                        >
                            Pessoa Física
                        </span>

                        <h3
                            class="mt-4 text-2xl font-black leading-tight
                                   theme-text-high"
                        >
                            {{ $service['title'] }}
                        </h3>

                        <p class="mt-3 leading-relaxed theme-text-low">
                            {{ $service['description'] }}
                        </p>
                    </div>

                    <div class="mb-5">
                        <p
                            class="text-2xl font-black text-brand"
                            aria-label="Valor {{ $service['price'] }}"
                        >
                            {{ $service['price'] }}
                        </p>

                        <p class="mt-1 text-xs theme-text-muted">
                            Valor demonstrativo sujeito à análise.
                        </p>
                    </div>

                    <div class="wc-service-limit mb-5">
                        <strong class="block text-sm theme-text-high">
                            Limite da oferta
                        </strong>

                        <span class="mt-1 block text-sm leading-relaxed">
                            {{ $service['limit'] }}
                        </span>
                    </div>

                    <details class="wc-service-details mb-6 pt-4">
                        <summary>
                            Ver detalhes
                        </summary>

                        <div class="pb-2 pt-3">
                            <p class="text-sm font-bold theme-text-high">
                                O serviço inclui:
                            </p>

                            <ul class="mt-3 space-y-2">
                                @foreach ($service['included'] as $item)
                                    <li
                                        class="flex gap-2 text-sm
                                               theme-text-low"
                                    >
                                        <span
                                            class="font-black text-brand"
                                            aria-hidden="true"
                                        >
                                            ✓
                                        </span>

                                        <span>{{ $item }}</span>
                                    </li>
                                @endforeach
                            </ul>

                            <p class="mt-4 text-sm theme-text-low">
                                <strong class="theme-text-high">
                                    Indicado para:
                                </strong>

                                {{ $service['audience'] }}
                            </p>
                        </div>
                    </details>

                    <a
                        href="/contato?perfil=pf&servico={{ urlencode($service['title']) }}"
                        class="wc-interactive wc-button-primary mt-auto
                               inline-flex min-h-12 items-center
                               justify-center rounded-full px-5 py-3
                               text-center font-bold"
                        aria-label="Solicitar o serviço {{ $service['title'] }}"
                    >
                        Solicitar serviço
                    </a>
                </article>
            @endforeach
        </div>
    </section>

    {{--
        Painel de serviços destinados a pessoas jurídicas.
        Inicia oculto e é apresentado pelo seletor acima.
    --}}
    <section
        id="plan-panel-business"
        class="wc-plan-panel"
        role="tabpanel"
        aria-labelledby="plan-tab-business"
        data-plan-panel="business"
        hidden
    >
        <div class="mb-8">
            <h2 class="text-2xl font-black theme-text-high">
                Serviços para Pessoa Jurídica
            </h2>

            <p class="mt-2 theme-text-low">
                Propostas personalizadas de acordo com o porte e a
                complexidade da empresa.
            </p>
        </div>

        <div class="layout-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            @foreach ($businessServices as $service)
                <article class="wc-service-card p-6 sm:p-7">
                    <div class="mb-5">
                        <span
                            class="inline-flex rounded-full bg-brand/10
                                   px-3 py-1 text-xs font-black uppercase
                                   tracking-wider text-brand"
                        >
                            Pessoa Jurídica
                        </span>

                        <h3
                            class="mt-4 text-2xl font-black leading-tight
                                   theme-text-high"
                        >
                            {{ $service['title'] }}
                        </h3>

                        <p class="mt-3 leading-relaxed theme-text-low">
                            {{ $service['description'] }}
                        </p>
                    </div>

                    <div class="mb-5">
                        <p class="text-2xl font-black text-brand">
                            {{ $service['price'] }}
                        </p>

                        <p class="mt-1 text-xs theme-text-muted">
                            Proposta definida após análise da empresa.
                        </p>
                    </div>

                    <div class="wc-service-limit mb-5">
                        <strong class="block text-sm theme-text-high">
                            Limite demonstrativo
                        </strong>

                        <span class="mt-1 block text-sm leading-relaxed">
                            {{ $service['limit'] }}
                        </span>
                    </div>

                    <details class="wc-service-details mb-6 pt-4">
                        <summary>
                            Ver detalhes
                        </summary>

                        <div class="pb-2 pt-3">
                            <p class="text-sm font-bold theme-text-high">
                                O serviço inclui:
                            </p>

                            <ul class="mt-3 space-y-2">
                                @foreach ($service['included'] as $item)
                                    <li
                                        class="flex gap-2 text-sm
                                               theme-text-low"
                                    >
                                        <span
                                            class="font-black text-brand"
                                            aria-hidden="true"
                                        >
                                            ✓
                                        </span>

                                        <span>{{ $item }}</span>
                                    </li>
                                @endforeach
                            </ul>

                            <p class="mt-4 text-sm theme-text-low">
                                <strong class="theme-text-high">
                                    Indicado para:
                                </strong>

                                {{ $service['audience'] }}
                            </p>
                        </div>
                    </details>

                    <a
                        href="/contato?perfil=pj&servico={{ urlencode($service['title']) }}"
                        class="wc-interactive wc-button-primary mt-auto
                               inline-flex min-h-12 items-center
                               justify-center rounded-full px-5 py-3
                               text-center font-bold"
                        aria-label="Solicitar proposta para {{ $service['title'] }}"
                    >
                        Solicitar proposta
                    </a>
                </article>
            @endforeach
        </div>
    </section>

    {{--
        Deixa claro que esta página ainda utiliza condições fictícias.
    --}}
    <aside
        class="mt-12 rounded-2xl border p-5 text-center
               theme-border theme-surface-muted"
        aria-label="Aviso sobre preços e condições"
    >
        <p class="text-sm leading-relaxed theme-text-low">
            <strong class="theme-text-high">
                Conteúdo demonstrativo:
            </strong>

            valores, limites e condições apresentados são fictícios.
            Serviços adicionais ou situações de maior complexidade
            estarão sujeitos à análise e proposta personalizada.
        </p>
    </aside>
</main>

<script>
    /*
     * Controla a alternância acessível entre Pessoa Física e
     * Pessoa Jurídica sem recarregar a página.
     */
    (function () {
        const tabs = Array.from(
            document.querySelectorAll('[data-plan-tab]')
        );

        const panels = Array.from(
            document.querySelectorAll('[data-plan-panel]')
        );

        /*
         * Encerra o script com segurança caso os elementos não existam.
         */
        if (!tabs.length || !panels.length) {
            return;
        }

        /*
         * Apresenta o painel escolhido e atualiza os atributos
         * utilizados por leitores de tela e navegação por teclado.
         */
        const activateTab = function (selectedTab, moveFocus = false) {
            const selectedPanel = selectedTab.dataset.planTab;

            tabs.forEach(function (tab) {
                const isSelected = tab === selectedTab;

                tab.setAttribute(
                    'aria-selected',
                    isSelected ? 'true' : 'false'
                );

                tab.setAttribute(
                    'tabindex',
                    isSelected ? '0' : '-1'
                );
            });

            panels.forEach(function (panel) {
                panel.hidden =
                    panel.dataset.planPanel !== selectedPanel;
            });

            if (moveFocus) {
                selectedTab.focus();
            }
        };

        /*
         * Permite alterar o perfil utilizando mouse ou toque.
         */
        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                activateTab(tab);
            });

            /*
             * Permite navegar pelas abas usando as setas,
             * Home e End, conforme o padrão de acessibilidade.
             */
            tab.addEventListener('keydown', function (event) {
                let nextIndex = index;

                if (
                    event.key === 'ArrowRight' ||
                    event.key === 'ArrowDown'
                ) {
                    nextIndex = (index + 1) % tabs.length;
                } else if (
                    event.key === 'ArrowLeft' ||
                    event.key === 'ArrowUp'
                ) {
                    nextIndex =
                        (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === 'Home') {
                    nextIndex = 0;
                } else if (event.key === 'End') {
                    nextIndex = tabs.length - 1;
                } else {
                    return;
                }

                event.preventDefault();
                activateTab(tabs[nextIndex], true);
            });
        });
    })();
</script>
@endsection