@extends('layouts.app')

@section('title', 'Planos - WebContábil')
@section('page', 'planos')

@section('content')
<main class="layout-container layout-section">
    <h1 class="text-4xl font-bold theme-text-high mt-6 mb-12">
        Planos
    </h1>

    <section class="mb-16">
        <div class="max-w-4xl">
            <span
                class="text-sm font-bold uppercase tracking-widest text-brand"
            >
                Planos fictícios para demonstração
            </span>

            <h2 class="text-2xl font-bold theme-text-high mt-4 mb-6">
                Um plano para cada fase do escritório.
            </h2>

            <p class="text-lg theme-text-low leading-relaxed">
                Comece com o essencial e evolua conforme sua carteira cresce.
                Valores e condições abaixo são ilustrativos.
            </p>
        </div>
    </section>

    <section class="border-t border-b theme-border py-12 mb-16">
        {{--
            A grade utiliza o padrão global de espaçamento.
            Em telas menores, os planos aparecem um abaixo do outro.
            Em telas grandes, os três planos ficam alinhados lado a lado.
        --}}
        <div
            class="layout-grid grid-cols-1 lg:grid-cols-3 items-stretch"
        >
            @foreach ([
                [
                    'Essencial',
                    'Para começar a organizar a operação.',
                    'R$ 89',
                    [
                        'Até 30 clientes',
                        'Documentos e impostos',
                        'Agenda de obrigações',
                        'Suporte por e-mail',
                    ],
                    false,
                ],
                [
                    'Profissional',
                    'Para escritórios em crescimento.',
                    'R$ 189',
                    [
                        'Até 100 clientes',
                        'Todos os recursos do Essencial',
                        'Painéis operacionais',
                        'Avisos automáticos',
                        'Suporte prioritário',
                    ],
                    true,
                ],
                [
                    'Escala',
                    'Para equipes e carteiras maiores.',
                    'Sob consulta',
                    [
                        'Clientes sob medida',
                        'Todos os recursos do Profissional',
                        'Perfis avançados de acesso',
                        'Implantação acompanhada',
                        'Atendimento dedicado',
                    ],
                    false,
                ],
            ] as [$name, $description, $price, $features, $featured])
                <article
                    class="relative flex flex-col rounded-2xl border
                           {{ $featured
                                ? 'border-brand ring-2 ring-brand/20'
                                : 'theme-border'
                           }}
                           bg-card p-8 shadow-sm"
                >
                    @if ($featured)
                        <span
                            class="absolute -top-4 left-1/2
                                   -translate-x-1/2 rounded-full
                                   bg-brand px-4 py-2 text-xs
                                   font-black uppercase tracking-wider
                                   text-white whitespace-nowrap"
                        >
                            Mais escolhido
                        </span>
                    @endif

                    <h2 class="text-2xl font-black theme-text-high">
                        {{ $name }}
                    </h2>

                    <p class="theme-text-low mt-2 min-h-12">
                        {{ $description }}
                    </p>

                    <p class="text-4xl font-black text-brand mt-7">
                        {{ $price }}
                    </p>

                    <p class="text-sm theme-text-low">
                        {{
                            $price === 'Sob consulta'
                                ? 'proposta personalizada'
                                : 'por mês*'
                        }}
                    </p>

                    <ul class="space-y-4 my-8 flex-1">
                        @foreach ($features as $feature)
                            <li class="flex gap-3 theme-text-high">
                                <span
                                    class="text-brand font-black"
                                    aria-hidden="true"
                                >
                                    ✓
                                </span>

                                <span>{{ $feature }}</span>
                            </li>
                        @endforeach
                    </ul>

                    <a
                        href="/contato"
                        class="block rounded-full px-6 py-3 text-center
                               font-bold transition
                               {{ $featured
                                    ? 'bg-brand text-white hover:bg-brand-light'
                                    : 'border theme-border theme-text-high hover:bg-brand hover:text-white'
                               }}"
                    >
                        Quero conhecer
                    </a>
                </article>
            @endforeach
        </div>

        <p class="text-center text-sm theme-text-low mt-8">
            * Conteúdo, preços e condições temporariamente fictícios,
            criados para apresentação da plataforma.
        </p>
    </section>
</main>
@endsection