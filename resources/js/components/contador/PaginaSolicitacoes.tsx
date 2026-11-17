import { Inbox } from "lucide-react";

import ListaSolicitacoes from "./ListaSolicitacoes";
import type { Solicitacao } from "./dados";

interface PropriedadesPaginaSolicitacoes {
    solicitacoes: readonly Solicitacao[];
}

/**
 * Página completa de solicitações do contador.
 *
 * É exibida quando o contador acessa "Solicitações"
 * pelo menu lateral.
 */
export default function PaginaSolicitacoes({
    solicitacoes,
}: PropriedadesPaginaSolicitacoes) {
    return (
        <section
            className="flex-grow space-y-8 overflow-y-auto
                p-4 sm:p-6 xl:p-10"
        >
            <div
                className="flex flex-col gap-6
                    md:flex-row md:items-end md:justify-between"
            >
                <div>
                    <p
                        className="mb-1 text-xs font-bold uppercase
                            tracking-[0.2em] text-brand"
                    >
                        Atendimento contábil
                    </p>

                    <h1
                        className="text-3xl font-extrabold
                            tracking-tighter text-white sm:text-4xl"
                    >
                        Solicitações
                    </h1>

                    <p className="mt-1 font-medium text-white/40">
                        Acompanhe e organize as solicitações enviadas pelos
                        clientes.
                    </p>
                </div>

                <div
                    className="flex items-center gap-3 rounded-2xl
                        border border-white/10 bg-white/5
                        px-4 py-3"
                >
                    <div
                        className="flex h-10 w-10 items-center
                            justify-center rounded-xl bg-brand/10
                            text-brand"
                    >
                        <Inbox className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="text-[10px] font-black uppercase
                                tracking-widest text-white/30"
                        >
                            Total recebido
                        </p>

                        <p className="text-lg font-extrabold text-white">
                            {solicitacoes.length}
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="rounded-[32px] border border-white/10
                    bg-white/[0.03] p-4 shadow-xl
                    sm:p-6 xl:p-8"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-extrabold text-white">
                        Fila de atendimento
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                        Selecione um status para visualizar as solicitações
                        correspondentes.
                    </p>
                </div>

                <ListaSolicitacoes solicitacoes={solicitacoes} />
            </div>
        </section>
    );
}
