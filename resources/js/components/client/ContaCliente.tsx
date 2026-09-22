import { useState } from "react";
import {
    AlertTriangle,
    ChevronRight,
    ExternalLink,
    Eye,
    EyeOff,
    LockKeyhole,
    Trash2,
} from "lucide-react";

interface ContaClienteProps {
    onVoltar: () => void;
}

type SecaoConta = "menu" | "senha" | "exclusao";

/**
 * Configurações relacionadas à segurança
 * e à situação da conta do cliente.
 */
export default function ContaCliente({ onVoltar }: ContaClienteProps) {
    const [secaoConta, setSecaoConta] = useState<SecaoConta>("menu");

    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

    const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] =
        useState(false);

    const [senhaAtual, setSenhaAtual] = useState("");

    const [novaSenha, setNovaSenha] = useState("");

    const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

    const [mensagemSenha, setMensagemSenha] = useState("");

    const [erroSenha, setErroSenha] = useState("");

    const [senhaExclusao, setSenhaExclusao] = useState("");

    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);

    const [mensagemExclusao, setMensagemExclusao] = useState("");

    const [erroExclusao, setErroExclusao] = useState("");

    /**
     * Retorna ao menu principal da conta
     * e limpa mensagens temporárias.
     */
    const voltarMenuConta = () => {
        setSecaoConta("menu");

        setMensagemSenha("");
        setErroSenha("");

        setMensagemExclusao("");
        setErroExclusao("");
    };

    /**
     * Tela principal das configurações da conta.
     */
    if (secaoConta === "menu") {
        return (
            <section className="p-4 sm:p-6 xl:p-10">
                <div className="mx-auto max-w-5xl">
                    <button
                        type="button"
                        onClick={onVoltar}
                        className="
                            mb-8 inline-flex
                            items-center gap-2
                            text-sm font-bold
                            text-white/70
                            transition-colors
                            hover:text-brand
                        "
                    >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Voltar para configurações
                    </button>

                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                            Segurança da conta
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Configurações da conta
                        </h1>

                        <p className="mt-2 max-w-3xl font-medium text-white/60">
                            Gerencie sua senha, segurança e situação da conta.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setSecaoConta("senha")}
                            className="
                                group rounded-3xl
                                border border-white/10
                                bg-white/5 p-6
                                text-left
                                transition-all
                                hover:border-brand/40
                                hover:bg-white/10
                            "
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                    <LockKeyhole className="h-6 w-6" />
                                </div>

                                <div className="flex-grow">
                                    <h2 className="text-lg font-bold text-white">
                                        Senha e segurança
                                    </h2>

                                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                                        Altere sua senha e consulte as opções de
                                        proteção da conta.
                                    </p>
                                </div>

                                <ChevronRight className="mt-1 h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSecaoConta("exclusao")}
                            className="
                                group rounded-3xl
                                border border-red-500/20
                                bg-red-500/5 p-6
                                text-left
                                transition-all
                                hover:border-red-500/50
                                hover:bg-red-500/10
                            "
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                    <Trash2 className="h-6 w-6" />
                                </div>

                                <div className="flex-grow">
                                    <h2 className="text-lg font-bold text-white">
                                        Situação da conta
                                    </h2>

                                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                                        Consulte as informações antes de
                                        solicitar a desativação da conta.
                                    </p>
                                </div>

                                <ChevronRight className="mt-1 h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-red-500" />
                            </div>
                        </button>
                    </div>

                    <div className="mt-6 rounded-3xl border border-brand/30 bg-brand/10 p-5">
                        <p className="text-sm leading-relaxed text-white/70">
                            <strong className="text-white">
                                Versão em desenvolvimento:
                            </strong>{" "}
                            alterações de senha, códigos enviados por e-mail e
                            solicitações relacionadas à conta serão conectados à
                            autenticação e ao banco de dados futuramente.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * Tela de alteração de senha.
     */
    if (secaoConta === "senha") {
        return (
            <section className="p-4 sm:p-6 xl:p-10">
                <div className="mx-auto max-w-4xl">
                    <button
                        type="button"
                        onClick={voltarMenuConta}
                        className="
                            mb-8 inline-flex
                            items-center gap-2
                            text-sm font-bold
                            text-white/70
                            transition-colors
                            hover:text-brand
                        "
                    >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Voltar para configurações da conta
                    </button>

                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                            Proteção da conta
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Senha e segurança
                        </h1>

                        <p className="mt-2 max-w-3xl font-medium text-white/60">
                            Defina uma senha segura para proteger o acesso à sua
                            conta.
                        </p>
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();

                            setMensagemSenha("");
                            setErroSenha("");

                            if (
                                !senhaAtual ||
                                !novaSenha ||
                                !confirmacaoSenha
                            ) {
                                setErroSenha("Preencha todos os campos.");

                                return;
                            }

                            if (novaSenha.length < 8) {
                                setErroSenha(
                                    "A nova senha deve possuir pelo menos 8 caracteres.",
                                );

                                return;
                            }

                            if (novaSenha !== confirmacaoSenha) {
                                setErroSenha(
                                    "A confirmação não corresponde à nova senha.",
                                );

                                return;
                            }

                            /*
                             * TODO:
                             * validar a senha atual no servidor,
                             * salvar a nova senha,
                             * invalidar sessões antigas
                             * e registrar a alteração.
                             */
                            setMensagemSenha(
                                "Senha validada. A alteração definitiva será conectada ao servidor.",
                            );

                            setSenhaAtual("");
                            setNovaSenha("");
                            setConfirmacaoSenha("");
                        }}
                        className="
                            rounded-3xl border
                            border-white/10
                            bg-white/5 p-5
                            sm:p-8
                        "
                    >
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="mb-2 block text-sm font-bold text-white"
                                >
                                    Senha atual
                                </label>

                                <div className="relative">
                                    <input
                                        id="current-password"
                                        type={
                                            mostrarSenhaAtual
                                                ? "text"
                                                : "password"
                                        }
                                        value={senhaAtual}
                                        onChange={(event) => {
                                            setSenhaAtual(event.target.value);

                                            setMensagemSenha("");

                                            setErroSenha("");
                                        }}
                                        maxLength={72}
                                        autoComplete="current-password"
                                        className="
                                            w-full rounded-2xl
                                            border border-white/10
                                            bg-white/10
                                            px-4 py-3 pr-12
                                            text-white
                                            outline-none
                                            transition-colors
                                            placeholder:text-white/30
                                            focus:border-brand
                                        "
                                        placeholder="Digite sua senha atual"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMostrarSenhaAtual(
                                                (atual) => !atual,
                                            )
                                        }
                                        className="
                                            absolute inset-y-0
                                            right-0 flex w-12
                                            items-center
                                            justify-center
                                            text-white/50
                                            transition-colors
                                            hover:text-brand
                                        "
                                        aria-label={
                                            mostrarSenhaAtual
                                                ? "Ocultar senha atual"
                                                : "Exibir senha atual"
                                        }
                                        title={
                                            mostrarSenhaAtual
                                                ? "Ocultar senha atual"
                                                : "Exibir senha atual"
                                        }
                                    >
                                        {mostrarSenhaAtual ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="new-password"
                                        className="mb-2 block text-sm font-bold text-white"
                                    >
                                        Nova senha
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="new-password"
                                            type={
                                                mostrarNovaSenha
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={novaSenha}
                                            onChange={(event) => {
                                                setNovaSenha(
                                                    event.target.value,
                                                );

                                                setMensagemSenha("");

                                                setErroSenha("");
                                            }}
                                            minLength={8}
                                            maxLength={72}
                                            autoComplete="new-password"
                                            className="
                                                w-full rounded-2xl
                                                border border-white/10
                                                bg-white/10
                                                px-4 py-3 pr-12
                                                text-white
                                                outline-none
                                                transition-colors
                                                placeholder:text-white/30
                                                focus:border-brand
                                            "
                                            placeholder="Mínimo de 8 caracteres"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMostrarNovaSenha(
                                                    (atual) => !atual,
                                                )
                                            }
                                            className="
                                                absolute inset-y-0
                                                right-0 flex w-12
                                                items-center
                                                justify-center
                                                text-white/50
                                                transition-colors
                                                hover:text-brand
                                            "
                                            aria-label={
                                                mostrarNovaSenha
                                                    ? "Ocultar nova senha"
                                                    : "Exibir nova senha"
                                            }
                                            title={
                                                mostrarNovaSenha
                                                    ? "Ocultar nova senha"
                                                    : "Exibir nova senha"
                                            }
                                        >
                                            {mostrarNovaSenha ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password-confirmation"
                                        className="mb-2 block text-sm font-bold text-white"
                                    >
                                        Confirmar nova senha
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password-confirmation"
                                            type={
                                                mostrarConfirmacaoSenha
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmacaoSenha}
                                            onChange={(event) => {
                                                setConfirmacaoSenha(
                                                    event.target.value,
                                                );

                                                setMensagemSenha("");

                                                setErroSenha("");
                                            }}
                                            minLength={8}
                                            maxLength={72}
                                            autoComplete="new-password"
                                            className="
                                                w-full rounded-2xl
                                                border border-white/10
                                                bg-white/10
                                                px-4 py-3 pr-12
                                                text-white
                                                outline-none
                                                transition-colors
                                                placeholder:text-white/30
                                                focus:border-brand
                                            "
                                            placeholder="Digite novamente"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMostrarConfirmacaoSenha(
                                                    (atual) => !atual,
                                                )
                                            }
                                            className="
                                                absolute inset-y-0
                                                right-0 flex w-12
                                                items-center
                                                justify-center
                                                text-white/50
                                                transition-colors
                                                hover:text-brand
                                            "
                                            aria-label={
                                                mostrarConfirmacaoSenha
                                                    ? "Ocultar confirmação"
                                                    : "Exibir confirmação"
                                            }
                                            title={
                                                mostrarConfirmacaoSenha
                                                    ? "Ocultar confirmação"
                                                    : "Exibir confirmação"
                                            }
                                        >
                                            {mostrarConfirmacaoSenha ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4">
                                <p className="text-sm leading-relaxed text-white/70">
                                    Use pelo menos 8 caracteres. Evite dados
                                    pessoais e senhas utilizadas em outros
                                    serviços.
                                </p>
                            </div>

                            {erroSenha && (
                                <div
                                    role="alert"
                                    className="
                                        rounded-2xl border
                                        border-red-500/30
                                        bg-red-500/10 p-4
                                        text-sm font-medium
                                        text-red-400
                                    "
                                >
                                    {erroSenha}
                                </div>
                            )}

                            {mensagemSenha && (
                                <div
                                    role="status"
                                    className="
                                        rounded-2xl border
                                        border-emerald-500/30
                                        bg-emerald-500/10
                                        p-4 text-sm
                                        font-medium
                                        text-emerald-400
                                    "
                                >
                                    {mensagemSenha}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="
                                        w-full rounded-2xl
                                        bg-brand px-6 py-3
                                        font-bold
                                        text-slate-950
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:shadow-lg
                                        sm:w-auto
                                    "
                                >
                                    Alterar senha
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }

    /**
     * Tela de solicitação de desativação.
     */
    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-4xl">
                <button
                    type="button"
                    onClick={() => {
                        voltarMenuConta();

                        setSenhaExclusao("");
                        setConfirmacaoExclusao(false);
                    }}
                    className="
                        mb-8 inline-flex
                        items-center gap-2
                        text-sm font-bold
                        text-white/70
                        transition-colors
                        hover:text-brand
                    "
                >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar para configurações da conta
                </button>

                <div className="mb-8">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                        Situação da conta
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Desativação da conta
                    </h1>

                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                        Consulte cuidadosamente as informações antes de
                        solicitar a desativação da sua conta.
                    </p>
                </div>

                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
                            <AlertTriangle className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Esta ação exige confirmação
                            </h2>

                            <p className="mt-2 leading-relaxed text-white/70">
                                A solicitação não apagará imediatamente todas as
                                informações. A conta será desativada, e os dados
                                poderão ser mantidos durante os períodos
                                necessários para o cumprimento de obrigações
                                legais, regulatórias, fiscais e contábeis.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    className="mt-6 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
                    onSubmit={(event) => {
                        event.preventDefault();

                        setErroExclusao("");
                        setMensagemExclusao("");

                        if (!senhaExclusao.trim()) {
                            setErroExclusao("Digite sua senha para continuar.");

                            return;
                        }

                        if (!confirmacaoExclusao) {
                            setErroExclusao(
                                "Você precisa marcar a confirmação antes de continuar.",
                            );

                            return;
                        }

                        /*
                         * TODO:
                         * 1. validar senha no servidor;
                         * 2. enviar código por e-mail;
                         * 3. registrar a solicitação;
                         * 4. aplicar prazos legais de retenção.
                         */
                        setMensagemExclusao(
                            "Solicitação validada. A confirmação por e-mail e a desativação definitiva serão conectadas ao servidor futuramente.",
                        );
                    }}
                >
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Confirme sua solicitação
                        </h2>

                        <p className="mt-2 leading-relaxed text-white/70">
                            Antes de continuar, leia os documentos aplicáveis e
                            confirme que compreendeu as consequências da
                            desativação.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <a
                            href="/termos-de-uso"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                flex items-center
                                justify-between
                                rounded-2xl
                                border border-white/10
                                bg-white/5 p-4
                                font-bold text-brand
                                transition-colors
                                hover:bg-white/10
                            "
                        >
                            Termos de Uso
                            <ExternalLink className="h-4 w-4" />
                        </a>

                        <a
                            href="/politica-de-privacidade"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                flex items-center
                                justify-between
                                rounded-2xl
                                border border-white/10
                                bg-white/5 p-4
                                font-bold text-brand
                                transition-colors
                                hover:bg-white/10
                            "
                        >
                            Política de Privacidade
                            <ExternalLink className="h-4 w-4" />
                        </a>

                        <a
                            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                flex items-center
                                justify-between
                                rounded-2xl
                                border border-white/10
                                bg-white/5 p-4
                                font-bold text-brand
                                transition-colors
                                hover:bg-white/10
                            "
                        >
                            LGPD na íntegra
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                    <div>
                        <label
                            htmlFor="account-deletion-password"
                            className="mb-2 block text-sm font-bold text-white"
                        >
                            Confirme sua senha
                        </label>

                        <input
                            id="account-deletion-password"
                            type="password"
                            value={senhaExclusao}
                            onChange={(event) => {
                                setSenhaExclusao(event.target.value);

                                setErroExclusao("");

                                setMensagemExclusao("");
                            }}
                            autoComplete="current-password"
                            maxLength={128}
                            placeholder="Digite sua senha atual"
                            className="
                                w-full rounded-2xl
                                border border-white/10
                                bg-white/5 px-5 py-4
                                text-white outline-none
                                transition-colors
                                placeholder:text-white/30
                                focus:border-red-400
                            "
                        />
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <input
                            type="checkbox"
                            checked={confirmacaoExclusao}
                            onChange={(event) => {
                                setConfirmacaoExclusao(event.target.checked);

                                setErroExclusao("");

                                setMensagemExclusao("");
                            }}
                            className="mt-1 h-5 w-5 shrink-0 accent-brand"
                        />

                        <span className="leading-relaxed text-white/80">
                            Confirmo que li os Termos de Uso, a Política de
                            Privacidade e a LGPD. Estou ciente de que minha
                            conta será desativada e de que determinados dados
                            poderão ser mantidos durante os prazos exigidos por
                            obrigações legais, regulatórias, fiscais e
                            contábeis.
                        </span>
                    </label>

                    {erroExclusao && (
                        <div
                            role="alert"
                            className="
                                rounded-2xl border
                                border-red-500/30
                                bg-red-500/10 p-4
                                text-sm font-medium
                                text-red-400
                            "
                        >
                            {erroExclusao}
                        </div>
                    )}

                    {mensagemExclusao && (
                        <div
                            role="status"
                            className="
                                rounded-2xl border
                                border-emerald-500/30
                                bg-emerald-500/10
                                p-4 text-sm
                                font-medium
                                text-emerald-400
                            "
                        >
                            {mensagemExclusao}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                !senhaExclusao.trim() || !confirmacaoExclusao
                            }
                            className="
                                w-full rounded-2xl
                                border border-red-500/30
                                bg-red-500/10
                                px-6 py-3
                                font-bold text-red-400
                                transition-all
                                hover:border-red-500/50
                                hover:bg-red-500/20
                                hover:text-red-300
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                sm:w-auto
                            "
                        >
                            Solicitar desativação da conta
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
