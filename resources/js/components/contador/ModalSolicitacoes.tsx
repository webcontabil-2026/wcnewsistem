import { Inbox, X } from "lucide-react";

import ListaSolicitacoes from "./ListaSolicitacoes";
import type { Solicitacao } from "./dados";

interface PropriedadesModalSolicitacoes {
    estaAberto: boolean;
    solicitacoes: readonly Solicitacao[];
    aoFechar: () => void;
}

/**
 * Modal resumido de solicitações.
 *
 * É aberto pelo atalho disponível na página inicial
 * do dashboard do contador.
 */
export default function ModalSolicitacoes({
    estaAberto,
    solicitacoes,
    aoFechar,
}: PropriedadesModalSolicitacoes) {
    if (!estaAberto) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center
                justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onMouseDown={aoFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-solicitacoes"
                className="flex max-h-[calc(100vh-2rem)] w-full
                    max-w-5xl flex-col overflow-hidden rounded-[32px]
                    border border-white/10 bg-slate-900 shadow-2xl"
                onMouseDown={(evento) => evento.stopPropagation()}
            >
                <div
                    className="flex items-start justify-between gap-4
                        border-b border-white/10 p-5 sm:p-6"
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="hidden h-12 w-12 shrink-0
                                items-center justify-center rounded-2xl
                                bg-brand/10 text-brand sm:flex"
                        >
                            <Inbox className="h-6 w-6" />
                        </div>

                        <div>
                            <p
                                className="text-xs font-bold uppercase
                                    tracking-[0.2em] text-brand"
                            >
                                Resumo de atendimento
                            </p>

                            <h2
                                id="titulo-modal-solicitacoes"
                                className="mt-1 text-2xl font-extrabold
                                    text-white"
                            >
                                Solicitações recebidas
                            </h2>

                            <p className="mt-1 text-sm text-white/40">
                                Consulte rapidamente as solicitações enviadas
                                pelos clientes.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={aoFechar}
                        aria-label="Fechar solicitações"
                        title="Fechar solicitações"
                        className="shrink-0 rounded-xl border
                            border-white/10 bg-white/5 p-2
                            text-white/60 transition-all duration-200
                            hover:rotate-90 hover:border-red-400/30
                            hover:bg-red-500/10 hover:text-red-400
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-400"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-6">
                    <ListaSolicitacoes solicitacoes={solicitacoes} />
                </div>
            </div>
        </div>
    );
}
