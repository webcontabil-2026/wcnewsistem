import { CheckCircle2, FileText, X } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { formatCurrencyInput } from "./financeiro/formatadores";
import type { TipoLancamentoFinanceiro } from "./financeiro/tipos";

interface FormularioLancamentoFinanceiro {
    type: TipoLancamentoFinanceiro;
    description: string;
    category: string;
    amount: string;
    date: string;
}

interface NovoLancamentoModalProps {
    aberto: boolean;
    formulario: FormularioLancamentoFinanceiro;
    setFormulario: Dispatch<SetStateAction<FormularioLancamentoFinanceiro>>;
    erro: string;
    setErro: Dispatch<SetStateAction<string>>;
    salvando: boolean;
    anexo: File | null;
    setAnexo: Dispatch<SetStateAction<File | null>>;
    onFechar: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}

/**
 * Modal responsável pelo formulário de criação
 * de um novo lançamento financeiro.
 *
 * O salvamento permanece controlado pelo componente pai,
 * enquanto este componente cuida apenas da interface e
 * das validações locais do arquivo selecionado.
 */
export default function NovoLancamentoModal({
    aberto,
    formulario,
    setFormulario,
    erro,
    setErro,
    salvando,
    anexo,
    setAnexo,
    onFechar,
    onSubmit,
}: NovoLancamentoModalProps) {
    if (!aberto) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onMouseDown={onFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="financial-entry-title"
                className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                            Controle financeiro
                        </p>

                        <h2
                            id="financial-entry-title"
                            className="mt-1 text-2xl font-extrabold text-white"
                        >
                            Novo lançamento
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar formulário"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Tipo
                            </span>

                            <select
                                value={formulario.type}
                                onChange={(event) =>
                                    setFormulario((formularioAtual) => ({
                                        ...formularioAtual,
                                        type: event.target
                                            .value as TipoLancamentoFinanceiro,
                                    }))
                                }
                                className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#1e2c42] px-4 py-3 text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                            >
                                <option
                                    className="bg-[#0f1f35] text-white"
                                    value="receita"
                                >
                                    Receita
                                </option>

                                <option
                                    className="bg-[#0f1f35] text-white"
                                    value="despesa"
                                >
                                    Despesa
                                </option>

                                <option
                                    className="bg-[#0f1f35] text-white"
                                    value="transferencia"
                                >
                                    Transferência
                                </option>

                                <option
                                    className="bg-[#0f1f35] text-white"
                                    value="ajuste"
                                >
                                    Ajuste financeiro
                                </option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Categoria
                            </span>

                            <select
                                value={formulario.category}
                                onChange={(event) =>
                                    setFormulario((formularioAtual) => ({
                                        ...formularioAtual,
                                        category: event.target.value,
                                    }))
                                }
                                className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#1e2c42] px-4 py-3 text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                            >
                                <option
                                    className="bg-slate-900 text-white"
                                    value=""
                                >
                                    Selecione uma categoria
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="servicos"
                                >
                                    Serviços
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="honorarios"
                                >
                                    Honorários
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="impostos"
                                >
                                    Impostos
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="folha"
                                >
                                    Folha de pagamento
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="fornecedores"
                                >
                                    Fornecedores
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="equipamentos"
                                >
                                    Equipamentos
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="reembolso"
                                >
                                    Reembolso
                                </option>

                                <option
                                    className="bg-slate-900 text-white"
                                    value="outros"
                                >
                                    Outros
                                </option>
                            </select>
                        </label>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-bold text-white">
                            Descrição
                        </span>

                        <input
                            type="text"
                            value={formulario.description}
                            onChange={(event) =>
                                setFormulario((formularioAtual) => ({
                                    ...formularioAtual,
                                    description: event.target.value,
                                }))
                            }
                            placeholder="Descreva o lançamento"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                        />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Valor
                            </span>

                            <input
                                type="text"
                                inputMode="numeric"
                                value={formulario.amount}
                                onChange={(event) =>
                                    setFormulario((formularioAtual) => ({
                                        ...formularioAtual,
                                        amount: formatCurrencyInput(
                                            event.target.value,
                                        ),
                                    }))
                                }
                                placeholder="R$ 0,00"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Data
                            </span>

                            <input
                                type="date"
                                value={formulario.date}
                                onChange={(event) =>
                                    setFormulario((formularioAtual) => ({
                                        ...formularioAtual,
                                        date: event.target.value,
                                    }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
                            />
                        </label>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-bold text-white">
                            Comprovante ou documento
                        </span>

                        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 transition-colors hover:border-brand/60">
                            <FileText className="h-6 w-6 shrink-0 text-brand" />

                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                onChange={(event) => {
                                    const arquivoSelecionado =
                                        event.target.files?.[0] ?? null;

                                    if (!arquivoSelecionado) {
                                        setAnexo(null);
                                        return;
                                    }

                                    const tiposPermitidos = [
                                        "application/pdf",
                                        "image/png",
                                        "image/jpeg",
                                    ];

                                    const tamanhoMaximo = 10 * 1024 * 1024;

                                    if (
                                        !tiposPermitidos.includes(
                                            arquivoSelecionado.type,
                                        )
                                    ) {
                                        setAnexo(null);
                                        setErro(
                                            "Selecione um arquivo PDF, JPG ou PNG.",
                                        );

                                        event.target.value = "";

                                        return;
                                    }

                                    if (
                                        arquivoSelecionado.size > tamanhoMaximo
                                    ) {
                                        setAnexo(null);
                                        setErro(
                                            "O arquivo deve possuir no máximo 10 MB.",
                                        );

                                        event.target.value = "";

                                        return;
                                    }

                                    setAnexo(arquivoSelecionado);
                                    setErro("");
                                }}
                                className="block w-full text-sm text-white/60 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand file:px-4 file:py-2 file:font-bold file:text-white file:transition-colors hover:file:bg-brand-light"
                            />
                        </div>

                        <p className="text-xs text-white/40">
                            Campo opcional. Aceita PDF, JPG ou PNG de até 10 MB.
                        </p>

                        {anexo && (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />

                                <span className="min-w-0 truncate">
                                    {anexo.name}
                                </span>
                            </div>
                        )}
                    </label>

                    {erro && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                        >
                            {erro}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onFechar}
                            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-light disabled:cursor-wait disabled:opacity-60"
                        >
                            {salvando ? "Salvando..." : "Salvar lançamento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
