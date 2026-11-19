import { useState, type FormEvent } from "react";
import { AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";
import { ApiError, apiRequest } from "../../../lib/api";

interface DesativarContaProps {
    onVoltar: () => void;
}

/**
 * Tela de solicitação de desativação da conta.
 *
 * A conta é bloqueada no servidor sem remover registros
 * que possam estar sujeitos a prazos legais de retenção.
 */
export default function DesativarConta({ onVoltar }: DesativarContaProps) {
    const [senhaExclusao, setSenhaExclusao] = useState("");
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);

    const [mensagemExclusao, setMensagemExclusao] = useState("");
    const [erroExclusao, setErroExclusao] = useState("");
    const [processando, setProcessando] = useState(false);
    const [aguardandoCodigo, setAguardandoCodigo] = useState(false);
    const [codigo, setCodigo] = useState("");

    const limparMensagens = () => {
        setMensagemExclusao("");
        setErroExclusao("");
    };

    const solicitarDesativacao = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        limparMensagens();

        if (!aguardandoCodigo && !senhaExclusao.trim()) {
            setErroExclusao("Digite sua senha para continuar.");

            return;
        }

        if (!aguardandoCodigo && !confirmacaoExclusao) {
            setErroExclusao(
                "Você precisa marcar a confirmação antes de continuar.",
            );

            return;
        }

        if (aguardandoCodigo && !/^\d{6}$/.test(codigo)) {
            setErroExclusao("Digite o código de 6 dígitos enviado por e-mail.");
            return;
        }

        setProcessando(true);

        try {
            if (!aguardandoCodigo) {
                const resposta = await apiRequest<{
                    message: string;
                    codigoDesenvolvimento?: string | null;
                }>("/conta/desativacao/solicitar", {
                    method: "POST",
                    body: JSON.stringify({
                        senha: senhaExclusao,
                        confirmacao: confirmacaoExclusao,
                    }),
                });

                setAguardandoCodigo(true);
                setMensagemExclusao(
                    resposta.codigoDesenvolvimento
                        ? `${resposta.message} Código local: ${resposta.codigoDesenvolvimento}`
                        : resposta.message,
                );
            } else {
                const confirmar = window.confirm(
                    "Confirma a desativação? Você será desconectado ao concluir.",
                );

                if (!confirmar) return;

                const resposta = await apiRequest<{ message: string }>(
                    "/conta/desativacao/confirmar",
                    {
                        method: "POST",
                        body: JSON.stringify({ codigo }),
                    },
                );
                setMensagemExclusao(resposta.message);
                window.setTimeout(() => window.location.replace("/"), 900);
            }
        } catch (error) {
            setErroExclusao(
                error instanceof ApiError
                    ? Object.values(error.errors).flat()[0] ?? error.message
                    : "Não foi possível desativar a conta.",
            );
        } finally {
            setProcessando(false);
        }
    };

    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-4xl">
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
                    onSubmit={solicitarDesativacao}
                >
                    {!aguardandoCodigo && (<>
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
                                limparMensagens();
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
                                limparMensagens();
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
                    </>)}

                    {aguardandoCodigo && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <label
                                htmlFor="account-deletion-code"
                                className="mb-2 block text-sm font-bold text-white"
                            >
                                Código de confirmação
                            </label>
                            <p className="mb-4 text-sm text-white/60">
                                Digite o código de 6 dígitos enviado para o
                                e-mail cadastrado. Ele expira em 15 minutos.
                            </p>
                            <input
                                id="account-deletion-code"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={codigo}
                                onChange={(event) => {
                                    setCodigo(
                                        event.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6),
                                    );
                                    setErroExclusao("");
                                }}
                                maxLength={6}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-2xl font-black tracking-[0.4em] text-white outline-none focus:border-red-400"
                            />
                        </div>
                    )}

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
                                processando ||
                                (!aguardandoCodigo &&
                                    (!senhaExclusao.trim() ||
                                        !confirmacaoExclusao)) ||
                                (aguardandoCodigo && codigo.length !== 6)
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
                            {processando
                                ? "Processando..."
                                : aguardandoCodigo
                                  ? "Confirmar e desativar"
                                  : "Enviar código por e-mail"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
