import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { ApiError, apiRequest } from "../../lib/api";
import { cn } from "../../lib/utils";

type TemaUsuario = "dark" | "light" | "high-contrast";

interface PreferenciasUsuario {
    tema: TemaUsuario;
    notificacoes_sistema: boolean;
    notificacoes_email: boolean;
    notificacoes_documentos: boolean;
}

interface PreferenciasClienteProps {
    onVoltar: () => void;
}

/**
 * Aplica o tema utilizando o sistema global já existente
 * na aplicação.
 *
 * O banco de dados permanece como fonte oficial
 * da preferência do usuário.
 */
const aplicarTema = (tema: TemaUsuario) => {
    const janela = window as typeof window & {
        wcApplyTheme?: (theme: string) => string;
    };

    if (janela.wcApplyTheme) {
        janela.wcApplyTheme(tema);
        return;
    }

    /*
     * Fallback utilizado caso o helper global de tema
     * ainda não esteja disponível.
     */
    document.documentElement.dataset.theme = tema;
};

export default function PreferenciasCliente({
    onVoltar,
}: PreferenciasClienteProps) {
    const [preferencias, setPreferencias] = useState<PreferenciasUsuario>({
        tema: "dark",
        notificacoes_sistema: true,
        notificacoes_email: true,
        notificacoes_documentos: true,
    });

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    /**
     * Carrega as preferências salvas no banco
     * quando a tela é aberta.
     */
    useEffect(() => {
        let componenteMontado = true;

        const carregarPreferencias = async () => {
            setErro("");

            try {
                const resposta = await apiRequest<{
                    preferencia: PreferenciasUsuario;
                }>("/preferencias");

                if (!componenteMontado) {
                    return;
                }

                setPreferencias(resposta.preferencia);

                /*
                 * Aplica imediatamente o tema armazenado
                 * para o usuário autenticado.
                 */
                aplicarTema(resposta.preferencia.tema);
            } catch (error) {
                if (!componenteMontado) {
                    return;
                }

                setErro(
                    error instanceof ApiError
                        ? error.message
                        : "Não foi possível carregar suas preferências.",
                );
            } finally {
                if (componenteMontado) {
                    setCarregando(false);
                }
            }
        };

        void carregarPreferencias();

        return () => {
            componenteMontado = false;
        };
    }, []);

    /**
     * Altera o tema visual imediatamente.
     *
     * A alteração definitiva será salva no banco
     * quando o usuário salvar as preferências.
     */
    const selecionarTema = (tema: TemaUsuario) => {
        setPreferencias((atuais) => ({
            ...atuais,
            tema,
        }));

        aplicarTema(tema);

        setMensagem("");
        setErro("");
    };

    /**
     * Liga ou desliga uma categoria de notificação.
     */
    const alternarNotificacao = (
        campo:
            | "notificacoes_sistema"
            | "notificacoes_email"
            | "notificacoes_documentos",
    ) => {
        setPreferencias((atuais) => ({
            ...atuais,
            [campo]: !atuais[campo],
        }));

        setMensagem("");
        setErro("");
    };

    /**
     * Persiste todas as preferências atuais no Laravel.
     */
    const salvarPreferencias = async () => {
        setSalvando(true);
        setMensagem("");
        setErro("");

        try {
            const resposta = await apiRequest<{
                message: string;
                preferencia: PreferenciasUsuario;
            }>("/preferencias", {
                method: "PUT",
                body: JSON.stringify(preferencias),
            });

            setPreferencias(resposta.preferencia);

            /*
             * Mantém o tema retornado pelo servidor
             * sincronizado com a interface.
             */
            aplicarTema(resposta.preferencia.tema);

            setMensagem(resposta.message);
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? error.message
                    : "Não foi possível salvar suas preferências.",
            );
        } finally {
            setSalvando(false);
        }
    };

    const opcoesNotificacao = [
        {
            campo: "notificacoes_sistema" as const,
            titulo: "Notificações do sistema",
            descricao: "Avisos sobre atividades, prazos e atualizações.",
        },
        {
            campo: "notificacoes_email" as const,
            titulo: "Notificações por e-mail",
            descricao: "Receba informações importantes no e-mail cadastrado.",
        },
        {
            campo: "notificacoes_documentos" as const,
            titulo: "Avisos sobre documentos",
            descricao: "Seja avisado sobre novos arquivos, pedidos e entregas.",
        },
    ];

    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <button
                type="button"
                onClick={onVoltar}
                className="
                    mb-7 inline-flex items-center gap-2
                    font-semibold text-white/70
                    transition-colors hover:text-brand
                "
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Voltar para configurações
            </button>

            <div className="mb-8">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                    Personalização
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Preferências
                </h1>

                <p className="mt-2 max-w-2xl font-medium text-white/50">
                    Personalize a aparência e escolha quais avisos deseja
                    receber.
                </p>
            </div>

            {carregando ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm font-medium text-white/50">
                        Carregando preferências...
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    Aparência
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-white/50">
                                    Escolha o tema mais confortável para
                                    utilizar a plataforma.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/5 p-4">
                                <div className="mb-4">
                                    <p className="font-bold text-white">
                                        Tema da plataforma
                                    </p>

                                    <p className="mt-1 text-sm text-white/50">
                                        Sua escolha ficará vinculada à sua
                                        conta.
                                    </p>
                                </div>

                                {/*
                                 * Utiliza o mesmo padrão visual dos selects
                                 * existentes no módulo financeiro.
                                 */}
                                <select
                                    value={preferencias.tema}
                                    onChange={(event) =>
                                        selecionarTema(
                                            event.target.value as TemaUsuario,
                                        )
                                    }
                                    className="
                                        w-full rounded-xl
                                        border border-white/10
                                        bg-brand
                                        px-4 py-3
                                        text-sm font-bold !text-white
                                        outline-none
                                        transition-colors
                                        hover:border-brand/40
                                        focus:border-brand
                                    "
                                    aria-label="Tema da plataforma"
                                >
                                    <option value="light">Claro</option>

                                    <option value="dark">Escuro</option>
                                </select>

                                <p className="mt-4 text-xs leading-relaxed text-white/40">
                                    A estrutura já está preparada para receber
                                    opções adicionais de acessibilidade, como
                                    alto contraste.
                                </p>
                            </div>
                        </article>

                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    Notificações
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-white/50">
                                    Defina quais tipos de avisos deseja receber.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {opcoesNotificacao.map((opcao) => {
                                    const ativada = preferencias[opcao.campo];

                                    return (
                                        <div
                                            key={opcao.campo}
                                            className="
                                                flex items-center
                                                justify-between gap-4
                                                rounded-2xl
                                                bg-white/5 p-4
                                            "
                                        >
                                            <div>
                                                <p className="font-bold text-white">
                                                    {opcao.titulo}
                                                </p>

                                                <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                    {opcao.descricao}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={ativada}
                                                aria-label={opcao.titulo}
                                                onClick={() =>
                                                    alternarNotificacao(
                                                        opcao.campo,
                                                    )
                                                }
                                                className={cn(
                                                    "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                                                    ativada
                                                        ? "bg-brand"
                                                        : "bg-white/20",
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform",
                                                        ativada
                                                            ? "translate-x-5"
                                                            : "translate-x-0",
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    </div>

                    <div className="mt-6 flex flex-col items-end gap-3">
                        {erro && (
                            <p
                                role="alert"
                                className="
                                    w-full rounded-xl
                                    border border-red-500/30
                                    bg-red-500/10 px-4 py-3
                                    text-sm font-semibold text-red-400
                                "
                            >
                                {erro}
                            </p>
                        )}

                        {mensagem && (
                            <p
                                role="status"
                                aria-live="polite"
                                className="
                                    w-full rounded-xl
                                    border border-emerald-500/30
                                    bg-emerald-500/10 px-4 py-3
                                    text-sm font-semibold text-emerald-500
                                "
                            >
                                {mensagem}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => void salvarPreferencias()}
                            disabled={salvando}
                            className="
                                w-full rounded-xl bg-brand
                                px-6 py-3 font-bold
                                text-slate-950
                                transition-all duration-200
                                hover:brightness-110
                                hover:shadow-lg
                                disabled:cursor-wait
                                disabled:opacity-60
                                sm:w-auto sm:min-w-52
                            "
                        >
                            {salvando ? "Salvando..." : "Salvar preferências"}
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
