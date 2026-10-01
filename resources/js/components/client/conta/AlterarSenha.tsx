import { useState, type FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import CampoSenha from "./CampoSenha";

interface AlterarSenhaProps {
    onVoltar: () => void;
}

/**
 * Tela responsável pela validação visual
 * do formulário de alteração de senha.
 */
export default function AlterarSenha({ onVoltar }: AlterarSenhaProps) {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

    const [mensagemSenha, setMensagemSenha] = useState("");
    const [erroSenha, setErroSenha] = useState("");

    /**
     * Remove mensagens anteriores quando o usuário
     * modifica algum campo do formulário.
     */
    const limparMensagens = () => {
        setMensagemSenha("");
        setErroSenha("");
    };

    const alterarSenha = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        limparMensagens();

        if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
            setErroSenha("Preencha todos os campos.");

            return;
        }

        if (novaSenha.length < 8) {
            setErroSenha("A nova senha deve possuir pelo menos 8 caracteres.");

            return;
        }

        if (novaSenha !== confirmacaoSenha) {
            setErroSenha("A confirmação não corresponde à nova senha.");

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
                    onSubmit={alterarSenha}
                    className="
                        rounded-3xl border
                        border-white/10
                        bg-white/5 p-5
                        sm:p-8
                    "
                >
                    <div className="space-y-6">
                        <CampoSenha
                            id="current-password"
                            rotulo="Senha atual"
                            valor={senhaAtual}
                            placeholder="Digite sua senha atual"
                            autoComplete="current-password"
                            aoAlterar={(valor) => {
                                setSenhaAtual(valor);
                                limparMensagens();
                            }}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <CampoSenha
                                id="new-password"
                                rotulo="Nova senha"
                                valor={novaSenha}
                                placeholder="Mínimo de 8 caracteres"
                                autoComplete="new-password"
                                minLength={8}
                                aoAlterar={(valor) => {
                                    setNovaSenha(valor);
                                    limparMensagens();
                                }}
                            />

                            <CampoSenha
                                id="password-confirmation"
                                rotulo="Confirmar nova senha"
                                valor={confirmacaoSenha}
                                placeholder="Digite novamente"
                                autoComplete="new-password"
                                minLength={8}
                                aoAlterar={(valor) => {
                                    setConfirmacaoSenha(valor);
                                    limparMensagens();
                                }}
                            />
                        </div>

                        <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4">
                            <p className="text-sm leading-relaxed text-white/70">
                                Use pelo menos 8 caracteres. Evite dados
                                pessoais e senhas utilizadas em outros serviços.
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
