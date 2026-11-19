import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    LoaderCircle,
    Search,
    UserRound,
    X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiRequest } from "../../lib/api";
import { cn } from "../../lib/utils";

interface ServicoCatalogo {
    id: number;
    nome: string;
    descricao: string | null;
    tipoCliente: "pessoa_fisica" | "pessoa_juridica";
    preco: number | null;
}

interface ServicosClienteProps {
    onSolicitacaoCriada: () => void;
}

const formatarPreco = (preco: number | null) =>
    preco === null
        ? "Sob consulta"
        : new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
          }).format(preco);

export default function ServicosCliente({
    onSolicitacaoCriada,
}: ServicosClienteProps) {
    const [servicos, setServicos] = useState<ServicoCatalogo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState<"todos" | "pf" | "pj">("todos");
    const [selecionado, setSelecionado] = useState<ServicoCatalogo | null>(null);
    const [descricao, setDescricao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        let ativo = true;

        const carregar = async () => {
            try {
                const resposta = await apiRequest<{
                    servicos: ServicoCatalogo[];
                }>("/api/servicos");

                if (ativo) {
                    setServicos(resposta.servicos);
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error instanceof ApiError
                            ? error.message
                            : "Não foi possível carregar o catálogo.",
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        };

        void carregar();

        return () => {
            ativo = false;
        };
    }, []);

    const servicosVisiveis = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");

        return servicos.filter((servico) => {
            const correspondeTipo =
                filtro === "todos" ||
                (filtro === "pf" && servico.tipoCliente === "pessoa_fisica") ||
                (filtro === "pj" && servico.tipoCliente === "pessoa_juridica");

            const correspondeBusca =
                !termo ||
                servico.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
                (servico.descricao ?? "")
                    .toLocaleLowerCase("pt-BR")
                    .includes(termo);

            return correspondeTipo && correspondeBusca;
        });
    }, [busca, filtro, servicos]);

    const enviarSolicitacao = async (event: FormEvent) => {
        event.preventDefault();

        if (!selecionado) {
            return;
        }

        setEnviando(true);
        setErro("");
        setMensagem("");

        try {
            const resposta = await apiRequest<{ message: string }>(
                "/api/solicitacoes",
                {
                    method: "POST",
                    body: JSON.stringify({
                        servicoId: selecionado.id,
                        descricao: descricao.trim() || null,
                    }),
                },
            );

            setMensagem(resposta.message);
            setSelecionado(null);
            setDescricao("");
            onSolicitacaoCriada();
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? Object.values(error.errors).flat()[0] ?? error.message
                    : "Não foi possível enviar a solicitação.",
            );
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                        Atendimento contábil
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Catálogo de serviços
                    </h1>
                    <p className="max-w-3xl font-medium text-white/50">
                        Escolha o serviço, descreva o que precisa e acompanhe o
                        orçamento pela área de solicitações.
                    </p>
                </header>

                {mensagem && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        {mensagem}
                    </div>
                )}

                {erro && (
                    <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
                        {erro}
                    </div>
                )}

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:max-w-lg">
                        <Search className="h-5 w-5 shrink-0 text-white/40" />
                        <input
                            type="search"
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                            placeholder="Buscar serviço..."
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                    </label>

                    <div className="flex flex-wrap gap-2" aria-label="Filtrar catálogo">
                        {([
                            ["todos", "Todos"],
                            ["pf", "Pessoa física"],
                            ["pj", "Pessoa jurídica"],
                        ] as const).map(([valor, rotulo]) => (
                            <button
                                key={valor}
                                type="button"
                                onClick={() => setFiltro(valor)}
                                className={cn(
                                    "rounded-xl border px-4 py-2 text-sm font-bold transition-colors",
                                    filtro === valor
                                        ? "border-brand bg-brand text-white"
                                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                                )}
                            >
                                {rotulo}
                            </button>
                        ))}
                    </div>
                </div>

                {carregando ? (
                    <div className="flex min-h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                        <LoaderCircle className="h-8 w-8 animate-spin text-brand" />
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {servicosVisiveis.map((servico) => (
                            <article
                                key={servico.id}
                                className="flex min-h-64 flex-col rounded-3xl border border-white/10 bg-white/5 p-6"
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                        {servico.tipoCliente === "pessoa_fisica" ? (
                                            <UserRound className="h-6 w-6" />
                                        ) : (
                                            <BriefcaseBusiness className="h-6 w-6" />
                                        )}
                                    </div>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/50">
                                        {servico.tipoCliente === "pessoa_fisica" ? "Pessoa física" : "Pessoa jurídica"}
                                    </span>
                                </div>

                                <h2 className="text-xl font-extrabold text-white">
                                    {servico.nome}
                                </h2>
                                <p className="mt-3 flex-grow text-sm leading-relaxed text-white/50">
                                    {servico.descricao}
                                </p>
                                <div className="mt-6 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-white/40">
                                            Investimento
                                        </p>
                                        <p className="mt-1 font-extrabold text-brand">
                                            {formatarPreco(servico.preco)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelecionado(servico);
                                            setErro("");
                                        }}
                                        className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand/90"
                                    >
                                        Solicitar
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!carregando && servicosVisiveis.length === 0 && (
                    <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center font-semibold text-white/50">
                        Nenhum serviço corresponde ao filtro informado.
                    </p>
                )}
            </div>

            {selecionado && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={enviarSolicitacao}
                        className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                                    Nova solicitação
                                </p>
                                <h2 className="mt-1 text-2xl font-extrabold text-white">
                                    {selecionado.nome}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelecionado(null)}
                                className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white"
                                aria-label="Fechar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <label className="mt-6 block space-y-2">
                            <span className="text-sm font-bold text-white">
                                Conte o que você precisa
                            </span>
                            <textarea
                                value={descricao}
                                onChange={(event) => setDescricao(event.target.value)}
                                maxLength={2000}
                                rows={6}
                                placeholder="Inclua prazos, dúvidas e informações importantes para o contador."
                                className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
                            />
                        </label>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setSelecionado(null)}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white/70 hover:bg-white/10 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={enviando}
                                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-bold text-white transition-colors hover:bg-brand/90 disabled:cursor-wait disabled:opacity-60"
                            >
                                {enviando && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {enviando ? "Enviando..." : "Enviar solicitação"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
