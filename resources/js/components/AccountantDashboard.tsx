/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from "react";
import {
    Users,
    Inbox,
    Send,
    FileCheck,
    Search,
    Bell,
    LogOut,
    Settings,
    Filter,
    MoreHorizontal,
    UserCheck,
    Clock,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import { User } from "../types";
import { cn } from "../lib/utils";

interface AccountantDashboardProps {
    user: User;
    onLogout: () => void;
}

const mockRequests = [
    {
        id: "1",
        client: "Alpha Tech Ltda",
        type: "Folha de Pagamento",
        date: "Há 10 min",
        status: "URGENTE",
    },
    {
        id: "2",
        client: "Bazar do Sol",
        type: "Conciliação Bancária",
        date: "Há 1 hora",
        status: "NORMAL",
    },
    {
        id: "3",
        client: "Construtora Forte",
        type: "DRE Trimestral",
        date: "Há 5 horas",
        status: "AGUARDANDO",
    },
];

export default function AccountantDashboard({
    user,
    onLogout,
}: AccountantDashboardProps) {
    const [activeTab, setActiveTab] = useState("recebidos");

    return (
        <div className="flex h-screen overflow-hidden text-slate-200">
            <aside className="w-24 bg-white/5 backdrop-blur-2xl flex flex-col items-center py-10 gap-10 border-r border-white/10">
                <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/40">
                    <Inbox className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-6">
                    <SideNavItem active icon={<Users className="w-6 h-6" />} />
                    <SideNavItem icon={<FileCheck className="w-6 h-6" />} />
                    <SideNavItem icon={<Settings className="w-6 h-6" />} />
                </div>
                <button
                    onClick={onLogout}
                    className="mt-auto p-4 text-white/20 hover:text-red-400 transition-colors group"
                >
                    <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
            </aside>

            <main className="flex-grow flex flex-col overflow-hidden">
                <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-10">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black text-white tracking-tighter">
                            WebContabil{" "}
                            <span className="text-brand">Accountant</span>
                        </h2>
                        <span className="text-[10px] bg-brand text-white px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/40">
                            CRC: {user.crc}
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md">
                            <Search className="w-4 h-4 text-white/20" />
                            <input
                                placeholder="Buscar cliente..."
                                className="bg-transparent border-none outline-none text-sm w-40 text-white placeholder:text-white/20"
                            />
                        </div>
                        <button className="p-3 text-white/20 hover:text-brand transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border border-slate-900"></span>
                        </button>
                        <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-white font-black shadow-xl">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex overflow-hidden">
                    <div className="w-[400px] bg-white/5 border-r border-white/10 flex flex-col">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h3 className="font-bold text-white tracking-tight">
                                    Solicitações Recebidas
                                </h3>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                                    Status de Protocolos
                                </p>
                            </div>
                            <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-brand transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 space-y-3">
                            {mockRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="p-6 bg-white/5 rounded-[24px] border border-white/5 hover:border-brand/30 hover:bg-white/10 cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className={cn(
                                                "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                                                req.status === "URGENTE"
                                                    ? "bg-danger/20 text-danger"
                                                    : "bg-brand/20 text-brand",
                                            )}
                                        >
                                            {req.status}
                                        </span>
                                        <span className="text-[10px] font-black text-white/20 tracking-tighter uppercase">
                                            {req.date}
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-white mb-2 leading-none tracking-tight">
                                        {req.client}
                                    </p>
                                    <p className="text-xs text-white/40 font-medium flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-brand/60" />
                                        {req.type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-12 flex items-center justify-center">
                        <div className="max-w-xl w-full text-center space-y-10">
                            <div className="w-32 h-32 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 flex items-center justify-center mx-auto text-brand shadow-2xl">
                                <Inbox className="w-12 h-12" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-extrabold text-white tracking-tighter">
                                    Seu Workspace Contábil.
                                </h2>
                                <p className="text-white/40 text-lg font-medium max-w-sm mx-auto">
                                    Selecione uma solicitação para processar os
                                    dados e enviar os relatórios com
                                    criptografia total.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <WorkspaceCard
                                    icon={<UserCheck className="w-6 h-6" />}
                                    label="Clientes Gerenciados"
                                    count="12 ativos"
                                />
                                <WorkspaceCard
                                    icon={<Send className="w-6 h-6" />}
                                    label="Processamentos"
                                    count="05 pautas"
                                />
                                <WorkspaceCard
                                    icon={<AlertCircle className="w-6 h-6" />}
                                    label="Prazos Fiscais"
                                    count="02 alertas"
                                />
                                <WorkspaceCard
                                    icon={<Clock className="w-6 h-6" />}
                                    label="Tempo de Resposta"
                                    count="~14 min"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SideNavItem({ icon, active }: { icon: ReactNode; active?: boolean }) {
    return (
        <button
            className={cn(
                "p-4 rounded-[20px] transition-all group",
                active
                    ? "bg-brand text-white border border-brand/50 shadow-2xl shadow-brand/40"
                    : "text-white/20 hover:text-white",
            )}
        >
            <div className="group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </button>
    );
}

function WorkspaceCard({
    icon,
    label,
    count,
}: {
    icon: ReactNode;
    label: string;
    count: string;
}) {
    return (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 text-left group hover:bg-white/10 hover:border-brand/30 transition-all cursor-pointer">
            <div className="text-brand mb-6 group-hover:scale-110 transition-transform w-fit p-3 bg-brand/10 rounded-2xl">
                {icon}
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                {label}
            </p>
            <p className="text-lg font-bold text-white tracking-tight">
                {count}
            </p>
        </div>
    );
}
