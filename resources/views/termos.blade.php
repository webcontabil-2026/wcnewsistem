@extends('layouts.app')

@section('title', 'Termos de Uso - WebContabil')
@section('page', 'termos')

@section('content')
    <main class="layout-container layout-section">
        {{--
            Apresenta o propósito dos Termos de Uso e identifica
            as regras aplicáveis à utilização da plataforma.
        --}}
        <header class="mb-12">
            <p
                class="mb-3 text-sm font-semibold uppercase
                       tracking-wider text-brand"
            >
                Regras e responsabilidades
            </p>

            <h1
                class="mb-4 text-3xl font-bold break-words
                       theme-text-high sm:text-5xl"
            >
                Termos de Uso
            </h1>

            <p
                class="max-w-3xl text-base leading-relaxed
                       theme-text-low sm:text-lg"
            >
                Estes termos apresentam as condições para cadastro,
                acesso e utilização dos serviços da WebContabil.
            </p>
        </header>

        {{--
            Informa que estes Termos descrevem o funcionamento planejado
            para a versão da plataforma ainda em desenvolvimento.
        --}}
        <section
           class="rounded-2xl border p-6
       theme-border theme-surface-muted"
            aria-labelledby="terms-development-title"
        >
            <h2
                id="terms-development-title"
                class="mb-3 text-lg font-bold theme-text-high"
            >
                Termos da versão em desenvolvimento
            </h2>

            <p class="text-base leading-relaxed theme-text-low">
                A WebContabil é um projeto acadêmico em desenvolvimento.
                Estes Termos apresentam as regras previstas para a utilização
                da plataforma e deverão ser revisados conforme o banco de
                dados, as integrações e as funcionalidades forem implementados.
            </p>

            <p class="mt-3 text-sm font-semibold theme-text-high">
                Última atualização: agosto de 2026.
            </p>
        </section>

        {{--
            Define quando os Termos passam a ser aceitos pelo usuário.
        --}}
      <div class="mt-12 max-w-4xl space-y-10">
            <section aria-labelledby="terms-acceptance-title">
                <h2
                    id="terms-acceptance-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    1. Aceitação dos Termos
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Estes Termos estabelecem as condições para cadastro,
                        acesso e utilização da plataforma WebContabil por
                        clientes, contadores e administradores.
                    </p>

                    <p>
                        Ao criar uma conta ou utilizar os recursos da
                        plataforma, o usuário declara que leu e compreendeu
                        estes Termos e concorda em respeitar as regras
                        aplicáveis ao seu perfil de acesso.
                    </p>

                    <p>
                        Caso o usuário não concorde com estas condições, ele
                        não deverá concluir o cadastro nem utilizar as áreas
                        restritas da plataforma.
                    </p>
                </div>
            </section>

            {{--
                Esclarece que a plataforma organiza e acompanha os serviços,
                mas não realiza automaticamente a atividade contábil.
            --}}
            <section aria-labelledby="terms-purpose-title">
                <h2
                    id="terms-purpose-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    2. Natureza e finalidade da plataforma
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        A WebContabil foi projetada para centralizar a
                        comunicação, os documentos e o acompanhamento dos
                        serviços realizados entre clientes, contadores e
                        administradores.
                    </p>

                    <p>
                        A plataforma poderá oferecer recursos para solicitação
                        de serviços, elaboração de orçamentos, envio de
                        documentos, comunicação, pagamentos, entregas e
                        avaliações.
                    </p>

                    <p>
                        Os serviços contábeis não são executados
                        automaticamente pela WebContabil. Eles são realizados
                        por contadores responsáveis, enquanto a plataforma
                        oferece recursos para organizar, registrar e acompanhar
                        essas atividades.
                    </p>
                </div>
            </section>
                        {{--
                Define as condições básicas para criação, utilização
                e proteção das contas de acesso.
            --}}
            <section aria-labelledby="terms-account-title">
                <h2
                    id="terms-account-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    3. Cadastro e acesso à conta
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Para utilizar as áreas restritas da WebContabil, o
                        usuário deverá fornecer informações verdadeiras,
                        completas e atualizadas durante o cadastro.
                    </p>

                    <p>
                        Dependendo do perfil e do serviço solicitado, poderão
                        ser necessários documentos adicionais para confirmar
                        a identidade do usuário, os dados da empresa ou a
                        habilitação profissional do contador.
                    </p>

                    <p>
                        Cada conta deverá ser utilizada somente por seu titular.
                        O usuário será responsável por proteger suas
                        credenciais de acesso e não deverá compartilhar sua
                        senha com terceiros.
                    </p>

                    <p>
                        O usuário deverá comunicar à equipe responsável pela
                        plataforma caso identifique acesso indevido, perda das
                        credenciais ou qualquer atividade suspeita em sua conta.
                    </p>
                </div>
            </section>

            {{--
                Apresenta os deveres aplicáveis a todos os perfis
                que utilizarem a plataforma.
            --}}
            <section aria-labelledby="terms-responsibilities-title">
                <h2
                    id="terms-responsibilities-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    4. Responsabilidades gerais dos usuários
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Todos os usuários deverão utilizar a WebContabil de
                        maneira responsável, respeitando a legislação
                        aplicável, estes Termos e os direitos de terceiros.
                    </p>

                    <p>Ao utilizar a plataforma, o usuário deverá:</p>

                    <ul class="list-disc space-y-2 pl-6">
                        <li>
                            fornecer informações e documentos legítimos;
                        </li>

                        <li>
                            manter seus dados cadastrais atualizados;
                        </li>

                        <li>
                            respeitar os prazos, valores e condições acordados;
                        </li>

                        <li>
                            utilizar os canais de comunicação de maneira
                            respeitosa e profissional;
                        </li>

                        <li>
                            proteger informações confidenciais às quais tiver
                            acesso;
                        </li>

                        <li>
                            não utilizar a plataforma para atividades ilegais,
                            fraudulentas ou prejudiciais.
                        </li>
                    </ul>

                    <p>
                        O usuário será responsável pelas informações,
                        documentos, mensagens e demais conteúdos que inserir
                        ou compartilhar por meio de sua conta.
                    </p>
                </div>
            </section>

            {{--
                Diferencia as responsabilidades dos clientes e dos
                profissionais responsáveis pelos serviços contábeis.
            --}}
            <section aria-labelledby="terms-specific-duties-title">
                <h2
                    id="terms-specific-duties-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    5. Responsabilidades de clientes e contadores
                </h2>

                <div class="space-y-6 text-base leading-relaxed theme-text-low">
                    <div>
                        <h3
                            class="mb-3 text-lg font-bold theme-text-high"
                        >
                            Responsabilidades dos clientes
                        </h3>

                        <p class="mb-3">
                            O cliente deverá fornecer informações e documentos
                            corretos, legíveis e dentro dos prazos necessários
                            para a realização dos serviços contratados.
                        </p>

                        <p>
                            Também será responsabilidade do cliente analisar
                            propostas, confirmar condições, acompanhar
                            solicitações e comunicar possíveis erros ou
                            alterações relevantes.
                        </p>
                    </div>

                    <div>
                        <h3
                            class="mb-3 text-lg font-bold theme-text-high"
                        >
                            Responsabilidades dos contadores
                        </h3>

                        <p class="mb-3">
                            O contador deverá fornecer informações
                            profissionais verdadeiras e manter seus dados de
                            habilitação atualizados, incluindo o registro no
                            Conselho Regional de Contabilidade, quando
                            aplicável.
                        </p>

                        <p>
                            Os serviços deverão ser realizados com cuidado,
                            confidencialidade e responsabilidade profissional,
                            respeitando as condições acordadas com o cliente e
                            as normas aplicáveis à atividade contábil.
                        </p>
                    </div>
                </div>
            </section>
            {{--
                Explica como serão apresentadas e aceitas as propostas
                para os serviços solicitados pelos clientes.
            --}}
            <section aria-labelledby="terms-services-title">
                <h2
                    id="terms-services-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    6. Solicitação de serviços e orçamentos
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Os serviços contábeis poderão ser solicitados por meio
                        da plataforma ou pelos canais de atendimento
                        disponibilizados pela WebContabil.
                    </p>

                    <p>
                        Os valores não serão necessariamente fixos, pois poderão
                        variar de acordo com a natureza do serviço, a
                        complexidade, os documentos necessários, os prazos e
                        as condições específicas de cada solicitação.
                    </p>

                    <p>
                        Antes da contratação, o cliente deverá receber uma
                        proposta ou orçamento contendo as principais condições
                        do serviço, como valor, prazo estimado, forma de
                        pagamento e responsabilidades envolvidas.
                    </p>

                    <p>
                        A contratação será considerada confirmada somente após
                        a aceitação das condições apresentadas e, quando
                        aplicável, a confirmação do pagamento.
                    </p>

                    <p>
                        Alterações no escopo do serviço poderão exigir uma nova
                        análise, modificação do prazo e atualização do valor
                        inicialmente informado.
                    </p>
                </div>
            </section>

            {{--
                Estabelece regras para o envio e a organização dos
                documentos e das comunicações relacionadas aos serviços.
            --}}
            <section aria-labelledby="terms-documents-title">
                <h2
                    id="terms-documents-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    7. Documentos e comunicações
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        A plataforma poderá permitir o envio, o armazenamento,
                        a organização e o compartilhamento de documentos
                        necessários para a realização e o acompanhamento dos
                        serviços contratados.
                    </p>

                    <p>
                        O usuário deverá verificar se os documentos enviados
                        estão corretos, completos, legíveis e relacionados à
                        finalidade do serviço solicitado.
                    </p>

                    <p>
                        As mensagens, solicitações, confirmações, propostas,
                        pendências e entregas registradas na plataforma poderão
                        ser mantidas como histórico da relação entre clientes,
                        contadores e administradores.
                    </p>

                    <p>
                        Informações confidenciais deverão ser compartilhadas
                        somente com usuários autorizados e pelos canais
                        disponibilizados ou indicados pela WebContabil.
                    </p>

                    <p>
                        O envio de um documento não garante sua aprovação
                        automática. O contador responsável poderá solicitar
                        correções, informações complementares ou uma nova
                        versão do arquivo.
                    </p>
                </div>
            </section>

            {{--
                Apresenta as condições gerais previstas para pagamentos,
                cancelamentos e possíveis reembolsos.
            --}}
            <section aria-labelledby="terms-payments-title">
                <h2
                    id="terms-payments-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    8. Pagamentos, cancelamentos e reembolsos
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Os valores, vencimentos e formas de pagamento deverão
                        ser apresentados ao cliente antes da confirmação da
                        contratação.
                    </p>

                    <p>
                        Quando houver processamento eletrônico, o pagamento
                        poderá ser realizado por um provedor contratado. A
                        WebContabil não deverá armazenar os dados completos de
                        cartões utilizados nas transações.
                    </p>

                    <p>
                        Pedidos de cancelamento deverão ser analisados conforme
                        o estágio de execução do serviço, os custos já
                        assumidos, as condições da proposta aceita e a
                        legislação aplicável.
                    </p>

                    <p>
                        A existência e o valor de um possível reembolso
                        dependerão das circunstâncias da contratação e da parte
                        do serviço que já tiver sido realizada.
                    </p>

                    <p>
                        As regras definitivas sobre pagamentos, cancelamentos
                        e reembolsos deverão ser atualizadas antes da
                        disponibilização comercial da plataforma.
                    </p>
                </div>
            </section>

                        {{--
                Explica como a conclusão dos serviços poderá ser
                registrada e acompanhada pela plataforma.
            --}}
            <section aria-labelledby="terms-delivery-title">
                <h2
                    id="terms-delivery-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    9. Entrega, confirmação e avaliação
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Após a realização do serviço, o contador responsável
                        poderá registrar sua conclusão e disponibilizar os
                        documentos ou resultados correspondentes por meio da
                        plataforma.
                    </p>

                    <p>
                        O cliente deverá conferir os arquivos e as informações
                        recebidas e comunicar possíveis erros, dúvidas ou
                        pendências dentro do prazo informado para o serviço.
                    </p>

                    <p>
                        A confirmação de recebimento não impede a comunicação
                        posterior de problemas que não poderiam ser
                        identificados imediatamente, respeitadas as condições
                        acordadas e a legislação aplicável.
                    </p>

                    <p>
                        Quando o recurso estiver disponível, o cliente poderá
                        avaliar o atendimento e o serviço recebido. As
                        avaliações deverão ser verdadeiras, respeitosas e
                        relacionadas à experiência do usuário.
                    </p>
                </div>
            </section>

            {{--
                Identifica comportamentos incompatíveis com a finalidade
                e com a segurança da plataforma.
            --}}
            <section aria-labelledby="terms-prohibited-title">
                <h2
                    id="terms-prohibited-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    10. Condutas proibidas
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Não será permitido utilizar a WebContabil para
                        atividades ilegais, fraudulentas ou que prejudiquem
                        outros usuários, a plataforma ou terceiros.
                    </p>

                    <p>O usuário não deverá:</p>

                    <ul class="list-disc space-y-2 pl-6">
                        <li>
                            cadastrar informações falsas ou utilizar a
                            identidade de outra pessoa;
                        </li>

                        <li>
                            enviar documentos falsificados, maliciosos ou sem
                            autorização;
                        </li>

                        <li>
                            tentar acessar contas, documentos ou áreas para as
                            quais não possua autorização;
                        </li>

                        <li>
                            compartilhar credenciais de acesso ou facilitar o
                            uso indevido de sua conta;
                        </li>

                        <li>
                            interferir no funcionamento, na segurança ou na
                            disponibilidade da plataforma;
                        </li>

                        <li>
                            utilizar mensagens para ameaças, discriminação,
                            assédio, divulgação indevida ou envio de conteúdo
                            ofensivo;
                        </li>

                        <li>
                            utilizar informações obtidas pela plataforma para
                            finalidade diferente daquela relacionada ao
                            serviço autorizado.
                        </li>
                    </ul>
                </div>
            </section>

            {{--
                Define as situações que poderão limitar o acesso e
                esclarece o procedimento previsto para encerrar uma conta.
            --}}
            <section aria-labelledby="terms-suspension-title">
                <h2
                    id="terms-suspension-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    11. Suspensão e encerramento da conta
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        O acesso de uma conta poderá ser temporariamente
                        limitado quando houver indícios de fraude, uso
                        indevido, risco à segurança, descumprimento destes
                        Termos ou necessidade de verificação de informações.
                    </p>

                    <p>
                        Sempre que possível e adequado, o usuário será
                        informado sobre a limitação e poderá apresentar
                        esclarecimentos ou corrigir a situação identificada.
                    </p>

                    <p>
                        O usuário poderá solicitar o encerramento de sua conta.
                        A exclusão não deverá ocorrer de forma imediata e
                        dependerá da confirmação da identidade do solicitante,
                        inclusive por código enviado ao e-mail cadastrado
                        quando esse recurso estiver implementado.
                    </p>

                    <p>
                        Antes da exclusão definitiva, poderão ser verificadas
                        pendências financeiras, serviços em andamento,
                        documentos necessários e obrigações legais de
                        conservação de registros.
                    </p>

                    <p>
                        Alguns dados poderão permanecer armazenados pelo período
                        necessário ao cumprimento de obrigações legais, à
                        prevenção de fraudes, à preservação de registros
                        contábeis ou ao exercício de direitos.
                    </p>
                </div>
            </section>

                        {{--
                Esclarece que a plataforma poderá passar por
                indisponibilidades durante seu funcionamento.
            --}}
            <section aria-labelledby="terms-availability-title">
                <h2
                    id="terms-availability-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    12. Disponibilidade e limitações da plataforma
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        A WebContabil buscará manter seus recursos disponíveis
                        e funcionando adequadamente, mas não poderá garantir
                        acesso contínuo e sem interrupções.
                    </p>

                    <p>
                        A plataforma poderá ficar temporariamente indisponível
                        por manutenção, atualização, falhas técnicas,
                        problemas de conexão, incidentes de segurança ou
                        situações externas ao controle da equipe responsável.
                    </p>

                    <p>
                        Recursos ainda não implementados, identificados como
                        demonstração ou pertencentes à versão em
                        desenvolvimento não deverão ser considerados serviços
                        definitivamente disponíveis.
                    </p>

                    <p>
                        A WebContabil não substitui a análise profissional do
                        contador nem garante resultados que dependam de
                        informações fornecidas pelos usuários, decisões de
                        autoridades públicas ou serviços de terceiros.
                    </p>
                </div>
            </section>

            {{--
                Protege os elementos próprios da plataforma sem limitar
                a propriedade dos usuários sobre seus documentos.
            --}}
            <section aria-labelledby="terms-intellectual-property-title">
                <h2
                    id="terms-intellectual-property-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    13. Propriedade intelectual
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        A identidade visual, o nome, a organização das telas,
                        os textos próprios, o código e os demais elementos
                        desenvolvidos para a WebContabil deverão ser protegidos
                        conforme a legislação aplicável.
                    </p>

                    <p>
                        O acesso à plataforma não transfere ao usuário a
                        propriedade desses elementos nem concede autorização
                        para copiar, modificar, distribuir ou explorar o
                        sistema fora das finalidades permitidas.
                    </p>

                    <p>
                        Os documentos e conteúdos enviados pelo usuário
                        continuarão pertencendo aos seus respectivos titulares.
                        Seu tratamento pela plataforma deverá ocorrer somente
                        para as finalidades relacionadas aos serviços, à
                        segurança e ao cumprimento de obrigações aplicáveis.
                    </p>
                </div>
            </section>

            {{--
                Relaciona estes Termos à Política de Privacidade
                disponível em uma página específica.
            --}}
            <section aria-labelledby="terms-privacy-title">
                <h2
                    id="terms-privacy-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    14. Privacidade e proteção de dados
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        A utilização da WebContabil poderá envolver o
                        tratamento de dados pessoais, empresariais, contábeis,
                        profissionais, financeiros e de segurança.
                    </p>

                    <p>
                        As categorias de dados, suas finalidades, as formas de
                        compartilhamento e os direitos dos titulares são
                        apresentados na
                        <a
                            href="/politica-de-privacidade"
                            class="font-semibold text-brand underline
                                   underline-offset-4"
                        >
                            Política de Privacidade</a>.
                    </p>

                    <p>
                        Estes Termos e a Política de Privacidade deverão ser
                        interpretados em conjunto durante a utilização da
                        plataforma.
                    </p>
                </div>
            </section>

            {{--
                Informa que os Termos poderão acompanhar as mudanças
                realizadas na plataforma e em suas regras.
            --}}
            <section aria-labelledby="terms-updates-title">
                <h2
                    id="terms-updates-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    15. Alterações destes Termos
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Estes Termos poderão ser atualizados para refletir
                        mudanças nas funcionalidades, nos serviços, no banco
                        de dados, nos fornecedores, nas medidas de segurança
                        ou nas exigências legais aplicáveis à WebContabil.
                    </p>

                    <p>
                        Quando uma alteração for relevante, a nova versão
                        deverá ser apresentada aos usuários pela plataforma ou
                        por outro canal de comunicação adequado.
                    </p>

                    <p>
                        A data exibida no início da página permitirá
                        identificar quando estes Termos foram atualizados.
                    </p>
                </div>
            </section>

            {{--
                TODO antes da disponibilização definitiva:
                substituir este aviso por um e-mail ou formulário
                oficial de atendimento.
            --}}
            <section aria-labelledby="terms-contact-title">
                <h2
                    id="terms-contact-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    16. Canal de atendimento e disposições finais
                </h2>

                <div class="space-y-4 text-base leading-relaxed theme-text-low">
                    <p>
                        Dúvidas, solicitações ou comunicações relacionadas a
                        estes Termos deverão ser encaminhadas pelo canal
                        oficial de atendimento disponibilizado pela
                        WebContabil.
                    </p>

                    <div
                        class="rounded-xl border p-5
                               theme-border theme-surface-muted"
                    >
                        <p>
                            <strong class="theme-text-high">
                                Situação atual:
                            </strong>

                            o canal oficial de atendimento ainda está sendo
                            definido pela equipe do projeto. As informações de
                            contato deverão ser incluídas nesta página antes
                            da disponibilização definitiva da plataforma.
                        </p>
                    </div>

                    <p>
                        Caso alguma disposição destes Termos seja considerada
                        inválida ou inaplicável, as demais disposições
                        permanecerão válidas, sempre que possível.
                    </p>

                    <p>
                        As situações não previstas deverão ser analisadas de
                        acordo com as condições da contratação e com a
                        legislação brasileira aplicável.
                    </p>
                </div>
            </section>

        </div>

    </main>
@endsection