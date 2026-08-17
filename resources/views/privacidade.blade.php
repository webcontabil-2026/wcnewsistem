@extends('layouts.app')

@section('title', 'Política de Privacidade - WebContabil')
@section('page', 'privacidade')

@section('content')
    <main class="layout-container layout-section">
        {{--
            Cabeçalho da Política de Privacidade.
            O conteúdo será organizado em seções curtas e acessíveis.
        --}}
        <header class="mb-12">
            <p
                class="mb-3 text-sm font-semibold uppercase
                       tracking-wider text-brand"
            >
                Privacidade e proteção de dados
            </p>

            <h1
                class="mb-4 text-3xl font-bold
       break-words theme-text-high sm:text-5xl"
            >
                Política de Privacidade
            </h1>

            <p
                class="max-w-3xl text-base leading-relaxed
                       theme-text-low sm:text-lg"
            >
               Esta política apresenta como a WebContabil tratará
dados pessoais, empresariais, contábeis e financeiros
durante a utilização de seus serviços.
            </p>
        </header>

        {{--
            Esclarece que a plataforma ainda está sendo desenvolvida
            e evita apresentar recursos planejados como já concluídos.
        --}}
        <aside
            class="mb-12 rounded-2xl border border-brand/30
                   bg-brand/10 p-6"
            aria-labelledby="privacy-version-title"
        >
            <h2
                id="privacy-version-title"
                class="mb-3 text-lg font-bold theme-text-high"
            >
                Política da versão em desenvolvimento
            </h2>

            <p class="leading-relaxed theme-text-low">
                A WebContabil é um projeto acadêmico em desenvolvimento.
                As regras apresentadas nesta página descrevem o
                funcionamento planejado para a plataforma e deverão ser
                revisadas conforme o banco de dados, as integrações e os
                recursos de segurança forem implementados.
            </p>

            <p class="mt-3 text-sm font-semibold theme-text-high">
                Última atualização: agosto de 2026.
            </p>
        </aside>

        {{--
            Mantém o conteúdo em uma largura confortável para leitura
            e separa cada assunto em uma seção identificável.
        --}}
        <div class="max-w-4xl space-y-10">
            <section aria-labelledby="privacy-purpose-title">
                <h2
                    id="privacy-purpose-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    1. Finalidade da Política
                </h2>

                <div class="space-y-4 leading-relaxed theme-text-low">
                    <p>
                        Esta Política de Privacidade explica quais
                        informações poderão ser tratadas pela WebContabil,
                        por que elas serão necessárias e como deverão ser
                        protegidas durante a utilização da plataforma.
                    </p>

                    <p>
                        A WebContabil foi projetada para centralizar a
                        comunicação, os documentos e o acompanhamento dos
                        serviços realizados entre clientes, contadores e
                        administradores.
                    </p>
                </div>
            </section>

            <section aria-labelledby="privacy-platform-title">
                <h2
                    id="privacy-platform-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    2. Funcionamento da plataforma
                </h2>

                <div class="space-y-4 leading-relaxed theme-text-low">
                    <p>
                        A plataforma oferece um ambiente para cadastro de
                        usuários, solicitação e acompanhamento de serviços,
                        elaboração de orçamentos, comunicação, envio de
                        documentos, pagamentos, entregas e avaliações.
                    </p>

                    <p>
                        Os serviços contábeis não são executados
                        automaticamente pela WebContabil. Eles são
                        realizados por contadores responsáveis, enquanto
                        a plataforma fornece os recursos necessários para
                        organizar, registrar e acompanhar essas atividades.
                    </p>

                    <p>
                        O armazenamento principal da plataforma e suas
                        cópias de segurança possuem funções diferentes.
                        As cópias de segurança serão utilizadas para
                        recuperação de informações em caso de falhas,
                        incidentes ou perda de dados.
                    </p>
                </div>
            </section>

            {{--
                Apresenta as categorias de dados previstas na documentação
                sem indicar uma coleta ilimitada de informações.
            --}}
            <section aria-labelledby="privacy-data-title">
                <h2
                    id="privacy-data-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    3. Dados que poderão ser tratados
                </h2>

                <p class="mb-6 leading-relaxed theme-text-low">
                    A WebContabil poderá tratar os dados necessários para
                    cadastrar usuários, validar profissionais, organizar
                    documentos e acompanhar os serviços contratados.
                </p>

                <div class="wc-privacy-grid">
                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Dados cadastrais
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Nome, e-mail, telefone, CPF, CNPJ, nome da
                            empresa, perfil de acesso e demais informações
                            necessárias para identificar o usuário.
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Dados profissionais
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Registro profissional, CRC e documentos
                            utilizados para verificar e autorizar o
                            cadastro dos contadores.
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Documentos contábeis
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Contratos, declarações, notas fiscais, guias,
                            comprovantes, folhas de pagamento e documentos
                            fiscais, trabalhistas, tributários ou
                            financeiros relacionados ao serviço.
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Serviços e comunicações
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Solicitações, propostas, valores, condições,
                            mensagens, arquivos, pendências, entregas,
                            confirmações e avaliações.
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Pagamentos
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Forma de pagamento, situação, valor,
                            identificador da transação, comprovantes,
                            cancelamentos, estornos e repasses.
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border p-6
                               theme-border theme-surface-muted"
                    >
                        <h3
                            class="mb-3 text-lg font-bold
                                   theme-text-high"
                        >
                            Segurança e auditoria
                        </h3>

                        <p class="text-sm leading-relaxed theme-text-low">
                            Endereço IP, datas, horários, tentativas de
                            acesso, alterações, confirmações e registros
                            necessários para segurança e rastreabilidade.
                        </p>
                    </article>
                </div>

                <div
                    class="mt-6 rounded-xl border p-5
                           theme-border"
                >
                    <p class="text-sm leading-relaxed theme-text-low">
                        <strong class="theme-text-high">
                            Importante:
                        </strong>
                        senhas deverão ser protegidas por técnicas
                        apropriadas de resumo criptográfico. Os dados
                        completos de cartões não serão armazenados pela
                        WebContabil e deverão ser processados pelo
                        provedor de pagamentos contratado.
                    </p>
                </div>
            </section>

            {{--
                Relaciona cada tratamento às finalidades da plataforma
                e evita o uso genérico ou ilimitado das informações.
            --}}
            <section aria-labelledby="privacy-use-title">
                <h2
                    id="privacy-use-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    4. Para que os dados serão utilizados
                </h2>

                <p class="mb-5 leading-relaxed theme-text-low">
                    Os dados e documentos serão tratados conforme a
                    necessidade de cada funcionalidade e poderão ser
                    utilizados para:
                </p>

                <ul
                    class="list-disc space-y-3 pl-6
                           leading-relaxed theme-text-low"
                >
                    <li>
                        criar, validar e administrar contas de clientes,
                        contadores e administradores;
                    </li>

                    <li>
                        verificar a identidade dos usuários e a
                        regularidade profissional dos contadores;
                    </li>

                    <li>
                        receber solicitações, elaborar orçamentos e
                        acompanhar os serviços contratados;
                    </li>

                    <li>
                        armazenar, organizar, disponibilizar e recuperar
                        documentos relacionados aos serviços;
                    </li>

                    <li>
                        permitir a comunicação entre clientes, contadores
                        e responsáveis pela administração da plataforma;
                    </li>

                    <li>
                        processar pagamentos, confirmações, cancelamentos,
                        estornos e repasses por meio de provedores
                        contratados;
                    </li>

                    <li>
                        registrar entregas, aceites, avaliações, alterações
                        e demais eventos necessários para auditoria;
                    </li>

                    <li>
                        prevenir fraudes, acessos indevidos, perda de dados
                        e outras ameaças à segurança;
                    </li>

                    <li>
                        cumprir obrigações legais, fiscais, regulatórias e
                        atender solicitações das autoridades competentes;
                    </li>

                    <li>
                        exercer direitos em processos administrativos,
                        judiciais ou arbitrais, quando necessário.
                    </li>
                </ul>
            </section>
                       {{--
                Informa as justificativas legais previstas para o
                tratamento dos dados pessoais na plataforma.
            --}}
            <section aria-labelledby="privacy-legal-basis-title">
                <h2
                    id="privacy-legal-basis-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    5. Bases legais para o tratamento
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        O tratamento dos dados deverá estar relacionado a
                        uma finalidade legítima e poderá ocorrer com base
                        nas hipóteses previstas pela legislação aplicável.
                    </p>

                    <ul class="list-disc space-y-3 pl-6">
                        <li>
                            execução de contrato ou de procedimentos
                            solicitados antes da contratação de um serviço;
                        </li>

                        <li>
                            cumprimento de obrigações legais, fiscais,
                            regulatórias ou profissionais;
                        </li>

                        <li>
                            exercício regular de direitos em processos
                            administrativos, judiciais ou arbitrais;
                        </li>

                        <li>
                            prevenção a fraudes e proteção da segurança
                            dos usuários e da plataforma;
                        </li>

                        <li>
                            atendimento a interesses legítimos, desde que
                            avaliados os direitos e as expectativas dos
                            titulares;
                        </li>

                        <li>
                            consentimento do titular nas situações em que
                            essa autorização for necessária.
                        </li>
                    </ul>

                    <p>
                        A base legal utilizada poderá variar conforme o
                        tipo de dado, o perfil do usuário e a finalidade
                        específica de cada operação.
                    </p>
                </div>
            </section>

            {{--
                Define os limites de acesso de cada perfil e esclarece
                quando fornecedores ou autoridades poderão receber dados.
            --}}
            <section aria-labelledby="privacy-access-title">
                <h2
                    id="privacy-access-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                    6. Quem poderá acessar ou receber os dados
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        O acesso às informações deverá respeitar o perfil
                        do usuário, sua participação no serviço e a
                        necessidade de cada atividade.
                    </p>

                    <ul class="list-disc space-y-3 pl-6">
                        <li>
                            <strong class="theme-text-high">
                                Clientes:
                            </strong>
                            poderão acessar seus próprios dados,
                            documentos, solicitações e serviços.
                        </li>

                        <li>
                            <strong class="theme-text-high">
                                Contadores:
                            </strong>
                            poderão acessar as informações dos clientes e
                            serviços pelos quais forem responsáveis.
                        </li>

                        <li>
                            <strong class="theme-text-high">
                                Administradores:
                            </strong>
                            poderão acessar informações quando necessário
                            para validação, suporte, segurança, auditoria,
                            mediação ou cumprimento de obrigações.
                        </li>

                        <li>
                            <strong class="theme-text-high">
                                Fornecedores contratados:
                            </strong>
                            poderão tratar dados necessários para
                            hospedagem, armazenamento, pagamentos,
                            comunicações e proteção da plataforma.
                        </li>

                        <li>
                            <strong class="theme-text-high">
                                Autoridades competentes:
                            </strong>
                            poderão receber informações quando houver
                            obrigação legal, ordem judicial ou solicitação
                            válida de uma autoridade pública.
                        </li>
                    </ul>

                    <p>
                        O acesso administrativo não deverá ser livre ou
                        indiscriminado. Ações envolvendo mensagens,
                        documentos ou dados confidenciais deverão possuir
                        finalidade, autorização e registro para auditoria.
                    </p>

                    <p>
                        A WebContabil não comercializará dados pessoais
                        nem os compartilhará para finalidades incompatíveis
                        com os serviços informados nesta política.
                    </p>
                </div>
            </section>

            {{--
                Registra as medidas de segurança previstas sem afirmar
                que recursos ainda em desenvolvimento já estão ativos.
            --}}
            <section aria-labelledby="privacy-security-title">
                <h2
                    id="privacy-security-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                   7. Segurança e proteção das informações
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        A WebContabil deverá adotar medidas técnicas e
                        administrativas compatíveis com a confidencialidade
                        dos dados contábeis, empresariais e pessoais
                        tratados pela plataforma.
                    </p>

                    <p>
                        Entre as medidas previstas para o desenvolvimento
                        e a operação do sistema estão:
                    </p>

                    <ul class="list-disc space-y-3 pl-6">
                        <li>
                            criptografia das informações durante a
                            transmissão e, quando aplicável, durante o
                            armazenamento;
                        </li>

                        <li>
                            proteção das senhas por técnicas apropriadas
                            de resumo criptográfico;
                        </li>

                        <li>
                            controle de acesso conforme o perfil e a
                            responsabilidade de cada usuário;
                        </li>

                        <li>
                            autenticação adicional em acessos e ações
                            consideradas críticas;
                        </li>

                        <li>
                            registro de acessos, alterações, confirmações
                            e eventos relevantes para auditoria;
                        </li>

                        <li>
                            bloqueio ou limitação de tentativas suspeitas
                            de autenticação;
                        </li>

                        <li>
                            cópias de segurança e procedimentos de
                            recuperação de informações;
                        </li>

                        <li>
                            monitoramento, correção de vulnerabilidades e
                            resposta a incidentes de segurança;
                        </li>

                        <li>
                            separação lógica dos dados pertencentes a
                            diferentes clientes e serviços.
                        </li>
                    </ul>

                    <p>
                        As medidas descritas serão verificadas e atualizadas
                        conforme a implementação do sistema. Nenhum ambiente
                        digital é completamente isento de riscos, mas a
                        plataforma deverá trabalhar para prevenir, detectar
                        e reduzir possíveis incidentes.
                    </p>
                </div>
            </section>

            {{--
                Diferencia encerramento da conta, exclusão de dados
                e preservação necessária para obrigações legais.
            --}}
            <section aria-labelledby="privacy-retention-title">
                <h2
                    id="privacy-retention-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                 8. Armazenamento, retenção e exclusão
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        Os dados serão mantidos durante o período necessário
                        para prestar os serviços, manter o histórico das
                        atividades e atender às finalidades apresentadas
                        nesta política.
                    </p>

                    <p>
                        Os prazos de retenção poderão variar conforme a
                        categoria da informação, o serviço realizado e as
                        obrigações legais, fiscais, regulatórias, contratuais
                        ou de auditoria aplicáveis.
                    </p>

                    <p>
                        Quando o usuário solicitar a exclusão da conta, a
                        WebContabil deverá confirmar sua identidade por meio
                        de um código enviado ao endereço de e-mail
                        cadastrado antes de executar a solicitação.
                    </p>

                    <p>
                        Após a confirmação, a plataforma deverá:
                    </p>

                    <ol class="list-decimal space-y-3 pl-6">
                        <li>
                            encerrar o acesso do usuário e revogar suas
                            sessões ou autorizações ativas;
                        </li>

                        <li>
                            identificar quais dados podem ser eliminados
                            imediatamente;
                        </li>

                        <li>
                            preservar temporariamente as informações
                            necessárias ao cumprimento de obrigações ou
                            ao exercício de direitos;
                        </li>

                        <li>
                            eliminar ou anonimizar os dados quando não
                            existir outra finalidade legítima para sua
                            manutenção;
                        </li>

                        <li>
                            aplicar a exclusão ou anonimização às cópias
                            de segurança conforme o ciclo seguro de
                            renovação dos backups.
                        </li>
                    </ol>

                    <p>
                        O encerramento da conta não implica necessariamente
                        a eliminação imediata de todos os registros. Alguns
                        dados poderão ser preservados de forma restrita
                        quando sua manutenção for exigida ou permitida
                        pela legislação.
                    </p>
                </div>
            </section>

            {{--
                Apresenta os principais direitos previstos pela LGPD
                e informa que pedidos exigirão validação de identidade.
            --}}
            <section aria-labelledby="privacy-rights-title">
                <h2
                    id="privacy-rights-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                9. Direitos dos titulares dos dados
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        Nos termos da legislação aplicável, o titular
                        poderá solicitar:
                    </p>

                    <ul class="list-disc space-y-3 pl-6">
                        <li>
                            confirmação da existência de tratamento de
                            seus dados pessoais;
                        </li>

                        <li>
                            acesso às informações associadas à sua conta;
                        </li>

                        <li>
                            correção de dados incompletos, inexatos ou
                            desatualizados;
                        </li>

                        <li>
                            informações sobre finalidades, acessos e
                            compartilhamentos;
                        </li>

                        <li>
                            portabilidade dos dados, quando aplicável e
                            tecnicamente possível;
                        </li>

                        <li>
                            anonimização, bloqueio ou eliminação de dados
                            desnecessários, excessivos ou tratados em
                            desconformidade;
                        </li>

                        <li>
                            eliminação de dados tratados com base no
                            consentimento, quando não houver outra
                            justificativa para sua manutenção;
                        </li>

                        <li>
                            revogação do consentimento e oposição a
                            determinados tratamentos, quando aplicável;
                        </li>

                        <li>
                            revisão de decisões exclusivamente
                            automatizadas que afetem seus interesses,
                            caso esse tipo de recurso seja implementado.
                        </li>
                    </ul>

                    <p>
                        Antes de atender uma solicitação, a WebContabil
                        poderá exigir informações adicionais para
                        confirmar a identidade do solicitante e impedir
                        acessos ou exclusões indevidas.
                    </p>

                    <p>
                        Alguns pedidos poderão ser limitados quando a
                        manutenção dos dados for necessária para cumprir
                        obrigações legais, preservar registros contábeis,
                        prevenir fraudes ou exercer direitos.
                    </p>
                </div>
            </section>
{{--
    Antes da publicação definitiva:
    substituir o aviso abaixo pelo canal oficial de privacidade,
    incluindo e-mail ou formulário funcional.
--}}


            {{--
                Informa com transparência que o canal oficial ainda será
                definido antes da disponibilização real da plataforma.
            --}}
            <section aria-labelledby="privacy-contact-title">
                <h2
                    id="privacy-contact-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                   10. Canal de privacidade
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        A WebContabil deverá disponibilizar um canal oficial
                        para dúvidas, solicitações e exercício dos direitos
                        relacionados à proteção de dados.
                    </p>

                    <div
                        class="rounded-2xl border border-brand/30
                               bg-brand/10 p-5"
                    >
                        <p class="text-sm leading-relaxed theme-text-low">
                            <strong class="theme-text-high">
                                Situação atual:
                            </strong>
                            o canal de privacidade ainda está sendo
                            definido pela equipe do projeto. As informações
                            de contato serão incluídas nesta página antes
                            da disponibilização definitiva da plataforma.
                        </p>
                    </div>

                    <p>
                        Solicitações relacionadas a dados pessoais deverão
                        ser registradas, verificadas e respondidas de forma
                        segura, respeitando os prazos e as condições
                        previstos na legislação aplicável.
                    </p>
                </div>
            </section>

            {{--
                Explica como futuras mudanças serão apresentadas aos
                usuários e mantém a data da política verificável.
            --}}
            <section aria-labelledby="privacy-update-title">
                <h2
                    id="privacy-update-title"
                    class="mb-4 text-2xl font-bold theme-text-high"
                >
                 11. Atualizações desta política
                </h2>

                <div class="space-y-5 leading-relaxed theme-text-low">
                    <p>
                        Esta política poderá ser atualizada para refletir
                        alterações nas funcionalidades, no banco de dados,
                        nos fornecedores, nas medidas de segurança ou nas
                        exigências legais aplicáveis à WebContabil.
                    </p>

                    <p>
                        Quando uma alteração for relevante, a nova versão
                        deverá ser apresentada aos usuários por meio da
                        plataforma ou de outro canal de comunicação
                        adequado.
                    </p>

                    <p>
                        A data exibida no início da página permitirá
                        identificar quando esta política foi revisada
                        pela última vez.
                    </p>
                </div>
            </section>

           

        </div>

    </main>
@endsection