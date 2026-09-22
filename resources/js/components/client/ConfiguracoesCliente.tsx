import {
    ChevronRight,
    KeyRound,
    ShieldCheck,
    SlidersHorizontal,
    UserRound,
} from "lucide-react";

type SecaoConfiguracoes = "perfil" | "preferencias" | "privacidade" | "conta";

interface ConfiguracoesClienteProps {
    onSelecionarSecao: (secao: SecaoConfiguracoes) => void;
}

/**
 * Menu principal das configurações do cliente.
 *
 * Organiza as funções em quatro áreas:
 * perfil, preferências, privacidade e conta.
 */
export default function ConfiguracoesCliente({
    onSelecionarSecao,
}: ConfiguracoesClienteProps) {
    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                    Gestão da conta
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Configurações e preferências
                </h1>

                <p className="mt-2 max-w-2xl font-medium text-white/50">
                    Gerencie seus dados pessoais, preferências, privacidade e
                    opções de segurança da conta.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <button
                    type="button"
                    onClick={() => onSelecionarSecao("perfil")}
                    className="
                        group rounded-3xl border
                        border-white/10 bg-white/5
                        p-5 text-left transition-all
                        hover:border-brand/40
                        hover:bg-white/10
                        sm:p-6
                    "
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <UserRound className="h-6 w-6" />
                        </div>

                        <div className="flex-grow">
                            <h2 className="text-lg font-bold text-white">
                                Perfil
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                Atualize sua foto e seus dados pessoais.
                            </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelecionarSecao("preferencias")}
                    className="
                        group rounded-3xl border
                        border-white/10 bg-white/5
                        p-5 text-left transition-all
                        hover:border-brand/40
                        hover:bg-white/10
                        sm:p-6
                    "
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <SlidersHorizontal className="h-6 w-6" />
                        </div>

                        <div className="flex-grow">
                            <h2 className="text-lg font-bold text-white">
                                Preferências
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                Personalize tema, notificações e exibição.
                            </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelecionarSecao("privacidade")}
                    className="
                        group rounded-3xl border
                        border-white/10 bg-white/5
                        p-5 text-left transition-all
                        hover:border-brand/40
                        hover:bg-white/10
                        sm:p-6
                    "
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <ShieldCheck className="h-6 w-6" />
                        </div>

                        <div className="flex-grow">
                            <h2 className="text-lg font-bold text-white">
                                Privacidade
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                Consulte dados, consentimentos e direitos de
                                privacidade.
                            </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelecionarSecao("conta")}
                    className="
                        group rounded-3xl border
                        border-white/10 bg-white/5
                        p-5 text-left transition-all
                        hover:border-brand/40
                        hover:bg-white/10
                        sm:p-6
                    "
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <KeyRound className="h-6 w-6" />
                        </div>

                        <div className="flex-grow">
                            <h2 className="text-lg font-bold text-white">
                                Configurações da conta
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                Gerencie senha, segurança e situação da conta.
                            </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                    </div>
                </button>
            </div>
        </section>
    );
}
