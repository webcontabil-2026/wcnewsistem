@extends('layouts.app')

@section('title', 'Contato - WebContábil')
@section('page', 'contato')

@section('content')
<main class="layout-container layout-section">
    <h1 class="text-4xl font-bold theme-text-high mt-6 mb-12">
        Contato
    </h1>

    <section class="mb-16">
        <div>
            <span
                class="text-sm font-bold uppercase
                       tracking-widest text-brand"
            >
                Fale com a gente
            </span>

            <h2
                class="text-2xl font-bold theme-text-high
                       mt-4 mb-6 max-w-3xl"
            >
                Sua contabilidade pode ser mais leve.
            </h2>

            <p
                class="text-lg theme-text-low max-w-4xl
                       leading-relaxed"
            >
                Conte como funciona seu escritório. Nossa equipe apresenta
                a plataforma e ajuda a imaginar um fluxo mais organizado
                para contadores e clientes.
            </p>
        </div>
    </section>

    <section class="border-t border-b theme-border py-12">
        {{--
            A área de contato possui uma única coluna em telas menores.
            Em telas grandes, as informações e o formulário ficam lado a lado.
        --}}
        <div
            class="layout-grid grid-cols-1
                   lg:grid-cols-[.8fr_1.2fr] items-stretch"
        >
            <aside class="rounded-2xl bg-brand text-white p-8 sm:p-10">
                <h2 class="text-2xl font-black">
                    Estamos por perto
                </h2>

                <p class="text-white/80 mt-3 mb-8">
                    Escolha o canal que preferir. Os dados abaixo são
                    fictícios e servem apenas para demonstração.
                </p>

                <div class="space-y-6">
                    <div>
                        <p
                            class="text-xs uppercase tracking-widest
                                   text-white/60"
                        >
                            E-mail
                        </p>

                        <p class="font-bold mt-1 break-words">
                            ola@webcontabil.exemplo
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-xs uppercase tracking-widest
                                   text-white/60"
                        >
                            WhatsApp
                        </p>

                        <p class="font-bold mt-1">
                            (11) 4000-2026
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-xs uppercase tracking-widest
                                   text-white/60"
                        >
                            Atendimento
                        </p>

                        <p class="font-bold mt-1">
                            Segunda a sexta, das 9h às 18h
                        </p>
                    </div>
                </div>

                <div class="mt-10 pt-8 border-t border-white/20">
                    <p class="font-bold">
                        O que acontece depois?
                    </p>

                    <p class="text-white/80 mt-2 text-sm leading-relaxed">
                        Entendemos sua necessidade, apresentamos os recursos
                        ideais e combinamos os próximos passos — sem
                        compromisso.
                    </p>
                </div>
            </aside>

            <div
                class="rounded-2xl border theme-border bg-card
                       p-8 sm:p-10 shadow-sm"
            >
                <h2 class="text-2xl font-black theme-text-high">
                    Vamos conversar?
                </h2>

                <p class="theme-text-low mt-2 mb-8">
                    Preencha seus dados para simular uma solicitação
                    de contato.
                </p>

                {{--
                    O formulário utiliza uma coluna no celular e duas colunas
                    em telas maiores. Campos extensos continuam ocupando
                    toda a largura disponível.
                --}}
                <form
                    class="grid grid-cols-1 sm:grid-cols-2
                           gap-x-6 gap-y-7"
                    action="#"
                    method="get"
                >
                    <label class="block">
                        <span
                            class="block text-sm font-bold
                                   theme-text-high mb-2"
                        >
                            Seu nome
                        </span>

                        <input
                            type="text"
                            name="nome"
                            placeholder="Como podemos chamar você?"
                            class="w-full rounded-xl border theme-border
                                   bg-transparent px-4 py-3 theme-text-high
                                   focus:outline-none focus:ring-2
                                   focus:ring-brand"
                            required
                        >
                    </label>

                    <label class="block">
                        <span
                            class="block text-sm font-bold
                                   theme-text-high mb-2"
                        >
                            E-mail profissional
                        </span>

                        <input
                            type="email"
                            name="email"
                            placeholder="voce@escritorio.com.br"
                            class="w-full rounded-xl border theme-border
                                   bg-transparent px-4 py-3 theme-text-high
                                   focus:outline-none focus:ring-2
                                   focus:ring-brand"
                            required
                        >
                    </label>

                    <label class="block sm:col-span-2">
                        <span
                            class="block text-sm font-bold
                                   theme-text-high mb-2"
                        >
                            Nome do escritório
                        </span>

                        <input
                            type="text"
                            name="escritorio"
                            placeholder="Seu escritório contábil"
                            class="w-full rounded-xl border theme-border
                                   bg-transparent px-4 py-3 theme-text-high
                                   focus:outline-none focus:ring-2
                                   focus:ring-brand"
                        >
                    </label>

                    <label class="block sm:col-span-2">
                        <span
                            class="block text-sm font-bold
                                   theme-text-high mb-2"
                        >
                            Como podemos ajudar?
                        </span>

                        <textarea
                            name="mensagem"
                            rows="5"
                            placeholder="Conte um pouco sobre sua rotina e seus desafios..."
                            class="w-full rounded-xl border theme-border
                                   bg-transparent px-4 py-3 theme-text-high
                                   focus:outline-none focus:ring-2
                                   focus:ring-brand"
                            required
                        ></textarea>
                    </label>

                    <div
                        class="sm:col-span-2 flex flex-col
                               sm:flex-row sm:items-center gap-4"
                    >
                        <button
                            type="submit"
                            class="rounded-full bg-brand text-white
                                   font-bold px-7 py-3
                                   hover:bg-brand-light transition"
                        >
                            Enviar interesse
                        </button>

                        <p class="text-xs theme-text-low">
                            Formulário demonstrativo; nenhum dado será
                            enviado nesta versão.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </section>
</main>
@endsection