import { Download, FileText, FolderOpen } from "lucide-react";

import type { LancamentoFinanceiro } from "./financeiro/tipos";

interface DocumentosClienteProps {
    lancamentos: LancamentoFinanceiro[];
    onAbrirAnexo: (anexo: NonNullable<LancamentoFinanceiro["attachment"]>) => void;
}

const formatarTamanho = (tamanho: number | null) => {
    if (!tamanho) return "Tamanho não informado";
    if (tamanho < 1024 * 1024) return `${Math.ceil(tamanho / 1024)} KB`;
    return `${(tamanho / 1024 / 1024).toFixed(1)} MB`;
};

export default function DocumentosCliente({
    lancamentos,
    onAbrirAnexo,
}: DocumentosClienteProps) {
    const documentos = lancamentos
        .filter((lancamento) => lancamento.attachment)
        .map((lancamento) => ({
            lancamento,
            anexo: lancamento.attachment!,
        }));

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                        Arquivos protegidos
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Documentos
                    </h1>
                    <p className="max-w-3xl font-medium text-white/50">
                        Comprovantes enviados nos lançamentos financeiros. O
                        download só funciona para o proprietário autenticado.
                    </p>
                </header>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-white">Meus arquivos</h2>
                                <p className="text-sm text-white/50">
                                    {documentos.length} documento(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    {documentos.length ? (
                        <div className="grid gap-3">
                            {documentos.map(({ lancamento, anexo }) => (
                                <article
                                    key={lancamento.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-bold text-white">{anexo.name}</h3>
                                        <p className="mt-1 text-xs text-white/50">
                                            {lancamento.description} · {formatarTamanho(anexo.size)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onAbrirAnexo(anexo)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:border-brand/40 hover:bg-white/10"
                                    >
                                        <Download className="h-4 w-4" />
                                        Baixar
                                    </button>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
                            <FileText className="mx-auto h-9 w-9 text-white/30" />
                            <p className="mt-4 font-bold text-white/70">Nenhum comprovante enviado</p>
                            <p className="mt-1 text-sm text-white/40">
                                Anexe um PDF, JPG ou PNG ao criar um lançamento financeiro.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
