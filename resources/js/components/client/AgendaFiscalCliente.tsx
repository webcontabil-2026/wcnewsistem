import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";

const compromissos = [
    { dia: "07", titulo: "FGTS Digital", detalhe: "Conferência da competência anterior" },
    { dia: "15", titulo: "EFD-Reinf", detalhe: "Revisão de eventos e retenções" },
    { dia: "20", titulo: "DAS / tributos federais", detalhe: "Validar guias aplicáveis à empresa" },
    { dia: "25", titulo: "Documentos mensais", detalhe: "Separar notas, extratos e comprovantes" },
];

export default function AgendaFiscalCliente() {
    const mesAtual = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <section className="flex-grow overflow-y-auto p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                        Organização mensal
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Agenda fiscal
                    </h1>
                    <p className="max-w-3xl font-medium text-white/50">
                        Um roteiro de conferência para {mesAtual}. Confirme os
                        vencimentos específicos da sua empresa com o contador.
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
                    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                        {compromissos.map((item) => (
                            <article key={item.dia} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand text-white">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Dia</span>
                                    <span className="text-xl font-extrabold leading-none">{item.dia}</span>
                                </div>
                                <div className="min-w-0 py-1">
                                    <h2 className="font-extrabold text-white">{item.titulo}</h2>
                                    <p className="mt-1 text-sm text-white/50">{item.detalhe}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                        <CalendarDays className="h-8 w-8 text-brand" />
                        <h2 className="mt-5 text-xl font-extrabold text-white">Antes do vencimento</h2>
                        <ul className="mt-4 space-y-4 text-sm text-white/60">
                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />Envie documentos com antecedência.</li>
                            <li className="flex gap-3"><Clock3 className="h-5 w-5 shrink-0 text-brand" />Acompanhe retornos em Solicitações.</li>
                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />Guarde os comprovantes em Documentos.</li>
                        </ul>
                    </aside>
                </div>
            </div>
        </section>
    );
}
