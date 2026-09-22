import { Bell, Menu, Search } from "lucide-react";

import { User } from "../../types";

interface ClientHeaderProps {
    user: User;
    onAbrirMenuMobile: () => void;
}

/**
 * Cabeçalho principal do painel do cliente.
 *
 * Mantém a busca, acesso ao menu móvel,
 * alternância de tema, notificações e
 * identificação do usuário autenticado.
 */
export default function ClientHeader({
    user,
    onAbrirMenuMobile,
}: ClientHeaderProps) {
    return (
        <header
            className="min-h-24 bg-white/5 backdrop-blur-md
               border-b border-white/10 flex flex-wrap
               items-center justify-between gap-4
               px-4 sm:px-6 xl:px-10 py-3
               sticky top-0 z-10"
        >
            <div
                className="flex items-center gap-4 bg-white/5
               px-4 sm:px-5 py-3 rounded-2xl
               border border-white/5 backdrop-blur-sm
               w-full sm:w-auto sm:min-w-72"
            >
                <Search className="w-4 h-4 text-white/20" />

                <input
                    placeholder="Buscar notas, relatórios..."
                    className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                />
            </div>

            <div
                className="flex items-center justify-end
               gap-3 sm:gap-5 xl:gap-8
               w-full sm:w-auto"
            >
                <button
                    type="button"
                    onClick={onAbrirMenuMobile}
                    className="lg:hidden w-11 h-11 shrink-0 rounded-xl
               border border-white/10 bg-white/5
               flex items-center justify-center
               text-white hover:text-brand transition-colors"
                    aria-label="Abrir menu lateral"
                    title="Abrir menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <button
                    type="button"
                    className="relative p-2 text-white/40 hover:text-brand transition-colors"
                    aria-label="Notificações"
                    title="Notificações"
                >
                    <Bell className="w-6 h-6" />

                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-slate-900 shadow-lg shadow-brand/20" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white tracking-tight">
                            {user.name}
                        </p>

                        <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase mt-0.5">
                            {user.razaoSocial}
                        </p>
                    </div>

                    <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-brand font-black text-lg shadow-xl">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
}
