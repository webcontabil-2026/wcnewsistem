import { ChevronRight, FileText, ShieldCheck } from "lucide-react";

interface PrivacidadeClienteProps {
    onVoltar: () => void;
}

/**
 * Tela de privacidade do cliente.
 *
 * Centraliza os documentos legais e as informações
 * relacionadas ao tratamento de dados da plataforma.
 */
export default function PrivacidadeCliente({
    onVoltar,
}: PrivacidadeClienteProps) {
    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={onVoltar}
                    className="
                        mb-8 inline-flex items-center gap-2
                        text-sm font-bold text-white/70
                        transition-colors hover:text-brand
                    "
                >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar para configurações
                </button>

                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                        Proteção de dados
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Privacidade
                    </h1>

                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                        Consulte informações sobre o tratamento de dados, seus
                        direitos e os documentos legais da WebContabil.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <a
                        href="/politica-de-privacidade"
                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                            >
                                <ShieldCheck className="h-6 w-6" />
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-lg font-bold text-white">
                                    Política de Privacidade
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                    Veja quais categorias de dados poderão ser
                                    tratadas e para quais finalidades.
                                </p>
                            </div>

                            <ChevronRight
                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                            />
                        </div>
                    </a>

                    <a
                        href="/termos-de-uso"
                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                            >
                                <FileText className="h-6 w-6" />
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-lg font-bold text-white">
                                    Termos de Uso
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                    Consulte as regras, responsabilidades e
                                    condições de utilização da plataforma.
                                </p>
                            </div>

                            <ChevronRight
                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                            />
                        </div>
                    </a>

                    <a
                        href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                        target="_blank"
                        rel="noreferrer"
                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                            md:col-span-2
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                            >
                                <ShieldCheck className="h-6 w-6" />
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-lg font-bold text-white">
                                    Lei Geral de Proteção de Dados
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                    Acesse a versão oficial e integral da Lei nº
                                    13.709/2018 no portal do Planalto.
                                </p>
                            </div>

                            <ChevronRight
                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                            />
                        </div>
                    </a>
                </div>

                <div
                    className="
                        mt-6 rounded-3xl
                        border border-brand/30
                        bg-brand/10 p-5
                    "
                >
                    <p className="text-sm leading-relaxed text-white/70">
                        <strong className="text-white">
                            Versão em desenvolvimento:
                        </strong>{" "}
                        as funções para solicitar acesso, correção ou outras
                        providências relacionadas aos dados serão implementadas
                        com a integração do banco de dados e do canal oficial de
                        privacidade.
                    </p>
                </div>
            </div>
        </section>
    );
}
