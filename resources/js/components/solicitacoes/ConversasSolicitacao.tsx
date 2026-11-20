import { LoaderCircle, MessageSquare, RefreshCw, Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiRequest } from "../../lib/api";
import { cn } from "../../lib/utils";
import type { SolicitacaoCliente } from "../client/solicitacoes/tipos";

interface MensagemApi {
    id: number;
    remetenteId: number;
    remetenteNome: string | null;
    mensagem: string;
    dataEnvio: string | null;
    propria: boolean;
}

interface ConversasSolicitacaoProps {
    solicitacoes: SolicitacaoCliente[];
    titulo?: string;
    subtitulo?: string;
}

const formatarData = (valor: string | null) => {
    if (!valor) return "Agora";
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(valor));
};

export default function ConversasSolicitacao({
    solicitacoes,
    titulo = "Conversas",
    subtitulo = "Fale com o profissional responsável por cada solicitação.",
}: ConversasSolicitacaoProps) {
    const disponiveis = useMemo(
        () => solicitacoes.filter((solicitacao) => solicitacao.contador),
        [solicitacoes],
    );
    const [selecionadaId, setSelecionadaId] = useState<number | null>(null);
    const [mensagens, setMensagens] = useState<MensagemApi[]>([]);
    const [texto, setTexto] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!disponiveis.length) {
            setSelecionadaId(null);
            return;
        }

        if (!disponiveis.some((item) => item.id === selecionadaId)) {
            setSelecionadaId(disponiveis[0].id);
        }
    }, [disponiveis, selecionadaId]);

    const carregarMensagens = async (
        solicitacaoId: number,
        silencioso = false,
    ) => {
        if (!silencioso) setCarregando(true);
        setErro("");

        try {
            const resposta = await apiRequest<{ mensagens: MensagemApi[] }>(
                `/api/solicitacoes/${solicitacaoId}/mensagens`,
            );
            setMensagens(resposta.mensagens);
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? error.message
                    : "Não foi possível carregar a conversa.",
            );
        } finally {
            if (!silencioso) setCarregando(false);
        }
    };

    useEffect(() => {
        if (selecionadaId !== null) {
            void carregarMensagens(selecionadaId);

            const intervalo = window.setInterval(() => {
                void carregarMensagens(selecionadaId, true);
            }, 15000);

            return () => window.clearInterval(intervalo);
        }
    }, [selecionadaId]);

    const enviar = async (event: FormEvent) => {
        event.preventDefault();

        if (selecionadaId === null || !texto.trim()) return;

        setEnviando(true);
        setErro("");

        try {
            const resposta = await apiRequest<{ mensagem: MensagemApi }>(
                `/api/solicitacoes/${selecionadaId}/mensagens`,
                {
                    method: "POST",
                    body: JSON.stringify({ mensagem: texto.trim() }),
                },
            );
            setMensagens((atuais) => [...atuais, resposta.mensagem]);
            setTexto("");
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? Object.values(error.errors).flat()[0] ?? error.message
                    : "Não foi possível enviar a mensagem.",
            );
        } finally {
            setEnviando(false);
        }
    };

    const selecionada = disponiveis.find((item) => item.id === selecionadaId);

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                        Atendimento seguro
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        {titulo}
                    </h1>
                    <p className="max-w-3xl font-medium text-white/50">{subtitulo}</p>
                </header>

                {!disponiveis.length ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
                        <MessageSquare className="mx-auto h-10 w-10 text-white/30" />
                        <p className="mt-4 font-extrabold text-white/70">Nenhuma conversa disponível</p>
                        <p className="mx-auto mt-1 max-w-xl text-sm text-white/40">
                            A conversa é liberada automaticamente quando um contador assume e responde uma solicitação.
                        </p>
                    </div>
                ) : (
                    <div className="grid min-h-[34rem] overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-[20rem_1fr]">
                        <aside className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r">
                            <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/40">
                                Atendimentos
                            </p>
                            <div className="space-y-2">
                                {disponiveis.map((solicitacao) => (
                                    <button
                                        key={solicitacao.id}
                                        type="button"
                                        onClick={() => setSelecionadaId(solicitacao.id)}
                                        className={cn(
                                            "w-full rounded-2xl border p-4 text-left transition-colors",
                                            selecionadaId === solicitacao.id
                                                ? "border-brand bg-brand text-white"
                                                : "border-transparent bg-white/5 text-white/70 hover:border-white/10 hover:bg-white/10",
                                        )}
                                    >
                                        <span className="block truncate font-extrabold">
                                            {solicitacao.servico.nome}
                                        </span>
                                        <span className="mt-1 block truncate text-xs opacity-70">
                                            {solicitacao.contador?.nome ?? solicitacao.cliente.nome}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <div className="flex min-h-[30rem] min-w-0 flex-col">
                            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                                <div className="min-w-0">
                                    <h2 className="truncate font-extrabold text-white">
                                        {selecionada?.servico.nome}
                                    </h2>
                                    <p className="truncate text-xs text-white/50">
                                        Solicitação #{selecionada?.id} · atualização automática
                                    </p>
                                </div>
                                {selecionadaId && (
                                    <button
                                        type="button"
                                        onClick={() => void carregarMensagens(selecionadaId)}
                                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white"
                                        aria-label="Atualizar conversa"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
                                {carregando ? (
                                    <LoaderCircle className="m-auto h-8 w-8 animate-spin text-brand" />
                                ) : mensagens.length ? (
                                    mensagens.map((mensagem) => (
                                        <article
                                            key={mensagem.id}
                                            className={cn(
                                                "max-w-[85%] rounded-2xl px-4 py-3",
                                                mensagem.propria
                                                    ? "ml-auto bg-brand text-white"
                                                    : "mr-auto border border-white/10 bg-white/10 text-white",
                                            )}
                                        >
                                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                {mensagem.mensagem}
                                            </p>
                                            <p className="mt-2 text-[10px] font-semibold opacity-60">
                                                {mensagem.remetenteNome} · {formatarData(mensagem.dataEnvio)}
                                            </p>
                                        </article>
                                    ))
                                ) : (
                                    <div className="m-auto text-center text-white/40">
                                        <MessageSquare className="mx-auto h-8 w-8" />
                                        <p className="mt-3 text-sm font-semibold">Inicie esta conversa</p>
                                    </div>
                                )}
                            </div>

                            {erro && <p role="alert" className="px-5 pb-2 text-sm font-semibold text-red-400">{erro}</p>}

                            <form onSubmit={enviar} className="border-t border-white/10 p-4">
                                <div className="flex gap-3">
                                <label className="sr-only" htmlFor="mensagem-atendimento">Mensagem</label>
                                <input
                                    id="mensagem-atendimento"
                                    value={texto}
                                    onChange={(event) => setTexto(event.target.value)}
                                    maxLength={2000}
                                    placeholder="Digite sua mensagem..."
                                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
                                />
                                <button
                                    type="submit"
                                    disabled={enviando || !texto.trim()}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Enviar mensagem"
                                >
                                    {enviando ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </button>
                                </div>
                                <p className="mt-1 text-right text-[10px] font-semibold text-white/40">{texto.length}/2000</p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
