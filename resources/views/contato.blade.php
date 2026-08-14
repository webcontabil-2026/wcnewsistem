@extends('layouts.app')

@section('title', 'Contato - WebContabil')
@section('page', 'contato')

@section('content')
@php
    /*
     * Recupera o perfil e o serviço escolhidos na página de Planos.
     * Caso o visitante acesse o Contato diretamente, os campos permanecem livres.
     */
    $selectedProfile = request('perfil', '');
    $selectedService = request('servico', '');
@endphp

<main class="layout-container layout-section">
    <h1 class="mb-12 mt-6 text-4xl font-bold theme-text-high">
        Contato
    </h1>

    <section class="mb-16">
        <span
            class="text-sm font-bold uppercase tracking-widest
                   text-brand"
        >
            Fale com a gente
        </span>

        <h2
            class="mb-6 mt-4 max-w-3xl text-2xl font-bold
                   theme-text-high"
        >
            Sua contabilidade pode ser mais leve.
        </h2>

        <p
            class="max-w-4xl text-lg leading-relaxed
                   theme-text-low"
        >
            Conte como podemos ajudar. Nossa equipe apresenta os recursos
            disponíveis e orienta os próximos passos para pessoas físicas
            e empresas.
        </p>
    </section>

    <section class="border-y py-12 theme-border">
        {{--
            As informações e o formulário são empilhados em telas menores.
            Em telas grandes, os blocos permanecem lado a lado.
        --}}
        <div
            class="layout-grid grid-cols-1 items-stretch
                   lg:grid-cols-[.8fr_1.2fr]"
        >
            <aside
                class="rounded-2xl bg-brand p-8 text-white
                       shadow-md sm:p-10"
            >
                <h2 class="text-2xl font-black">
                    Estamos por perto
                </h2>

                <p class="mb-8 mt-3 text-white/80">
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

                        <p class="mt-1 break-words font-bold">
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

                        <p class="mt-1 font-bold">
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

                        <p class="mt-1 font-bold">
                            Segunda a sexta, das 9h às 18h
                        </p>
                    </div>
                </div>

                <div class="mt-10 border-t border-white/20 pt-8">
                    <p class="font-bold">
                        O que acontece depois?
                    </p>

                    <p class="mt-2 text-sm leading-relaxed text-white/80">
                        Entendemos sua necessidade, apresentamos os recursos
                        adequados e combinamos os próximos passos, sem
                        compromisso.
                    </p>
                </div>
            </aside>

            <div
                class="rounded-2xl border p-8 shadow-sm
                       theme-border bg-card sm:p-10"
            >
                <h2 class="text-2xl font-black theme-text-high">
                    Vamos conversar?
                </h2>

                <p class="mb-8 mt-2 theme-text-low">
                    Preencha seus dados para simular uma solicitação
                    de contato.
                </p>

                {{--
                    O envio é demonstrativo nesta etapa.
                    O JavaScript impede qualquer transmissão dos dados.
                --}}
                <form
                    id="contact-form"
                    class="grid grid-cols-1 gap-x-6 gap-y-7
                           sm:grid-cols-2"
                    novalidate
                >
                    <label class="block">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            Seu nome
                        </span>

                        <input
                            id="contact-name"
                            type="text"
                            name="nome"
                            placeholder="Como podemos chamar você?"
                            class="wc-form-field"
                            autocomplete="name"
                            maxlength="100"
                            required
                        >
                    </label>

                    <label class="block">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            E-mail
                        </span>

                        <input
                            id="contact-email"
                            type="email"
                            name="email"
                            placeholder="voce@exemplo.com.br"
                            class="wc-form-field"
                            autocomplete="email"
                            maxlength="150"
                            required
                        >
                    </label>

                   {{--
    O perfil é escolhido por botões para manter o mesmo padrão visual
    nos temas claro e escuro.
--}}
<fieldset class="block sm:col-span-2">
    <legend
        class="mb-2 block text-sm font-bold
               theme-text-high"
    >
        Perfil do atendimento
    </legend>

    <div
        class="wc-profile-selector"
        aria-label="Selecione o perfil do atendimento"
    >
        <button
            type="button"
            class="wc-profile-option"
            data-profile-option="pf"
            aria-pressed="{{ $selectedProfile === 'pf' ? 'true' : 'false' }}"
        >
            Pessoa Física
        </button>

        <button
            type="button"
            class="wc-profile-option"
            data-profile-option="pj"
            aria-pressed="{{ $selectedProfile === 'pj' ? 'true' : 'false' }}"
        >
            Pessoa Jurídica
        </button>
    </div>

    {{--
        Armazena a escolha para a validação e para um envio futuro
        ao backend Laravel.
    --}}
    <input
        id="contact-profile"
        type="hidden"
        name="perfil"
        value="{{ $selectedProfile }}"
        required
    >
</fieldset>
{{--
    O documento muda entre CPF e CNPJ conforme o perfil escolhido.
    A máscara e a validação serão controladas pelo JavaScript.
--}}
<label
    id="contact-document-field"
    class="wc-document-field block"
    @if (!$selectedProfile) hidden @endif
>
    <span
        id="contact-document-label"
        class="mb-2 block text-sm font-bold
               theme-text-high"
    >
        {{ $selectedProfile === 'pj' ? 'CNPJ' : 'CPF' }}
    </span>

    <input
        id="contact-document"
        type="text"
        name="documento"
        class="wc-form-field"
        inputmode="numeric"
        autocomplete="off"
        placeholder="{{ $selectedProfile === 'pj'
            ? '00.000.000/0000-00'
            : '000.000.000-00' }}"
        maxlength="{{ $selectedProfile === 'pj' ? '18' : '14' }}"
        @if (!$selectedProfile) disabled @endif
        required
    >

    <span
        id="contact-document-help"
        class="mt-2 block text-xs theme-text-muted"
    >
        {{ $selectedProfile === 'pj'
            ? 'Digite os 14 números do CNPJ.'
            : 'Digite os 11 números do CPF.' }}
    </span>
</label>
                    <label class="block">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            Telefone
                        </span>

                        <input
                            id="contact-phone"
                            type="tel"
                            name="telefone"
                            placeholder="(00) 00000-0000"
                            class="wc-form-field"
                            autocomplete="tel"
                            inputmode="numeric"
maxlength="15"
                        >
                    </label>

                    <label class="block sm:col-span-2">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            Serviço de interesse
                        </span>

                        <input
                            id="contact-service"
                            type="text"
                            name="servico"
                            value="{{ $selectedService }}"
                            placeholder="Qual serviço você procura?"
                            class="wc-form-field"
                            maxlength="120"
                            required
                        >

                        @if ($selectedService)
                            <span
                                class="mt-2 block text-xs
                                       theme-text-muted"
                            >
                                Serviço selecionado anteriormente na
                                página de Planos.
                            </span>
                        @endif
                    </label>

                    <label class="block sm:col-span-2">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            Nome da empresa
                            <span class="font-normal theme-text-muted">
                                (opcional)
                            </span>
                        </span>

                        <input
                            id="contact-company"
                            type="text"
                            name="empresa"
                            placeholder="Informe caso represente uma empresa"
                            class="wc-form-field"
                            autocomplete="organization"
                            maxlength="150"
                        >
                    </label>

                    <label class="block sm:col-span-2">
                        <span
                            class="mb-2 block text-sm font-bold
                                   theme-text-high"
                        >
                            Como podemos ajudar?
                        </span>

                        <textarea
                            id="contact-message"
                            name="mensagem"
                            rows="5"
                            placeholder="Conte um pouco sobre sua necessidade..."
                            class="wc-form-field resize-y"
                            maxlength="1000"
                            required
                        ></textarea>
                    </label>

                    {{--
                        Comunica erros ou sucesso sem recarregar a página.
                    --}}
                    <div
                        id="contact-feedback"
                        class="wc-form-feedback sm:col-span-2"
                        role="status"
                        aria-live="polite"
                        data-visible="false"
                    ></div>

                    <div
                        class="flex flex-col gap-4 sm:col-span-2
                               sm:flex-row sm:items-center"
                    >
                        <button
                            id="contact-submit"
                            type="submit"
                            class="wc-interactive wc-button-primary
                                   inline-flex min-h-12 items-center
                                   justify-center rounded-full px-7
                                   py-3 font-bold"
                        >
                            <span data-submit-label>
                                Enviar interesse
                            </span>
                        </button>

                        <p class="text-xs leading-relaxed theme-text-low">
                            Formulário demonstrativo: nenhum dado será
                            enviado ou armazenado nesta versão.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </section>
</main>

<script>
    /*
     * Controla o perfil, as máscaras e a simulação segura
     * do formulário sem transmitir ou armazenar informações.
     */
    (function () {
        const form = document.getElementById('contact-form');
        const profileInput = document.getElementById('contact-profile');
        const profileOptions = Array.from(
            document.querySelectorAll('[data-profile-option]')
        );

        const documentField = document.getElementById(
            'contact-document-field'
        );
        const documentLabel = document.getElementById(
            'contact-document-label'
        );
        const documentInput = document.getElementById(
            'contact-document'
        );
        const documentHelp = document.getElementById(
            'contact-document-help'
        );

        const phoneInput = document.getElementById('contact-phone');
        const submitButton = document.getElementById('contact-submit');
        const submitLabel = submitButton?.querySelector(
            '[data-submit-label]'
        );
        const feedback = document.getElementById('contact-feedback');

        /*
         * Encerra o script caso algum elemento necessário não exista.
         */
        if (
            !form ||
            !profileInput ||
            !profileOptions.length ||
            !documentField ||
            !documentLabel ||
            !documentInput ||
            !documentHelp ||
            !phoneInput ||
            !submitButton ||
            !submitLabel ||
            !feedback
        ) {
            return;
        }

        /*
         * Mantém somente números e limita a quantidade permitida.
         */
        const onlyDigits = function (value, maximumLength) {
            return value.replace(/\D/g, '').slice(0, maximumLength);
        };

        /*
         * Formata o CPF gradualmente enquanto o usuário digita.
         */
        const formatCpf = function (value) {
            const digits = onlyDigits(value, 11);

            return digits
                .replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1-$2');
        };

        /*
         * Formata o CNPJ gradualmente enquanto o usuário digita.
         */
        const formatCnpj = function (value) {
            const digits = onlyDigits(value, 14);

            return digits
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        };

        /*
         * Formata telefones brasileiros com dez ou onze números.
         */
        const formatPhone = function (value) {
            const digits = onlyDigits(value, 11);

            if (digits.length <= 10) {
                return digits
                    .replace(/^(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{4})(\d)/, '$1-$2');
            }

            return digits
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        };

        /*
         * Apresenta uma mensagem funcional de sucesso ou erro.
         */
        const showFeedback = function (status, message) {
            feedback.dataset.visible = 'true';
            feedback.dataset.status = status;
            feedback.textContent = message;
        };

        /*
         * Configura o campo de documento conforme o perfil escolhido.
         */
        const activateProfile = function (profile, clearDocument = true) {
            const isBusiness = profile === 'pj';

            profileInput.value = profile;

            profileOptions.forEach(function (option) {
                option.setAttribute(
                    'aria-pressed',
                    option.dataset.profileOption === profile
                        ? 'true'
                        : 'false'
                );
            });

            documentField.hidden = false;
            documentInput.disabled = false;
            documentLabel.textContent = isBusiness ? 'CNPJ' : 'CPF';
            documentInput.placeholder = isBusiness
                ? '00.000.000/0000-00'
                : '000.000.000-00';
            documentInput.maxLength = isBusiness ? 18 : 14;
            documentHelp.textContent = isBusiness
                ? 'Digite os 14 números do CNPJ.'
                : 'Digite os 11 números do CPF.';

            if (clearDocument) {
                documentInput.value = '';
            }

            documentInput.setCustomValidity('');
        };

        /*
         * Permite selecionar PF ou PJ usando mouse, teclado ou toque.
         */
        profileOptions.forEach(function (option) {
            option.addEventListener('click', function () {
                activateProfile(option.dataset.profileOption);
                documentInput.focus();

                if (feedback.dataset.status === 'error') {
                    feedback.dataset.visible = 'false';
                }
            });
        });

        /*
         * Preserva o perfil recebido da página de Planos.
         */
        if (profileInput.value === 'pf' || profileInput.value === 'pj') {
            activateProfile(profileInput.value, false);
        }

        /*
         * Aplica a máscara correspondente ao documento escolhido.
         */
        documentInput.addEventListener('input', function () {
            documentInput.value =
                profileInput.value === 'pj'
                    ? formatCnpj(documentInput.value)
                    : formatCpf(documentInput.value);

            documentInput.setCustomValidity('');
        });

        /*
         * Limita e formata o telefone enquanto ele é digitado.
         */
        phoneInput.addEventListener('input', function () {
            phoneInput.value = formatPhone(phoneInput.value);
            phoneInput.setCustomValidity('');
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            /*
             * Exige a escolha do perfil antes de validar os demais campos.
             */
            if (!profileInput.value) {
                showFeedback(
                    'error',
                    'Selecione Pessoa Física ou Pessoa Jurídica.'
                );

                profileOptions[0].focus();
                return;
            }

            const documentDigits = onlyDigits(
                documentInput.value,
                profileInput.value === 'pj' ? 14 : 11
            );

            const requiredDocumentLength =
                profileInput.value === 'pj' ? 14 : 11;

            /*
             * Confere a quantidade de números do CPF ou CNPJ.
             * A validação cadastral completa será realizada no backend.
             */
            if (documentDigits.length !== requiredDocumentLength) {
                documentInput.setCustomValidity(
                    profileInput.value === 'pj'
                        ? 'Digite um CNPJ com 14 números.'
                        : 'Digite um CPF com 11 números.'
                );
            } else {
                documentInput.setCustomValidity('');
            }

            const phoneDigits = onlyDigits(phoneInput.value, 11);

            /*
             * O telefone é opcional, mas, quando preenchido,
             * precisa possuir dez ou onze números.
             */
            if (
                phoneDigits.length > 0 &&
                phoneDigits.length < 10
            ) {
                phoneInput.setCustomValidity(
                    'Digite um telefone com DDD.'
                );
            } else {
                phoneInput.setCustomValidity('');
            }

            if (!form.checkValidity()) {
                form.reportValidity();

                showFeedback(
                    'error',
                    'Confira os campos obrigatórios antes de continuar.'
                );

                return;
            }

            /*
             * Simula o processamento sem enviar os dados preenchidos.
             */
            submitButton.disabled = true;
            submitLabel.textContent = 'Processando...';
            feedback.dataset.visible = 'false';
            feedback.textContent = '';

            window.setTimeout(function () {
                submitButton.disabled = false;
                submitLabel.textContent = 'Enviar interesse';

                showFeedback(
                    'success',
                    'Simulação concluída! Nenhum dado foi enviado nesta versão.'
                );
            }, 800);
        });

        /*
         * Oculta mensagens antigas de erro quando o usuário
         * volta a corrigir o formulário.
         */
        form.addEventListener('input', function () {
            if (feedback.dataset.status === 'error') {
                feedback.dataset.visible = 'false';
                feedback.textContent = '';
            }
        });
    })();
</script>
@endsection