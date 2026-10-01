import { ChevronRight, LockKeyhole, Trash2 } from "lucide-react";

interface MenuContaProps {
    onVoltar: () => void;
    onAbrirSenha: () => void;
    onAbrirExclusao: () => void;
}

/**
 * Menu principal das configurações de segurança da conta.
 */
export default function MenuConta({
    onVoltar,
    onAbrirSenha,
    onAbrirExclusao,
}: MenuContaProps) {
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
                        onClick={onAbrirSenha}
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
                        onClick={onAbrirExclusao}
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
                                    Consulte as informações antes de solicitar a
                                    desativação da conta.
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
