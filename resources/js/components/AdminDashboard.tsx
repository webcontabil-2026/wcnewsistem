/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import {
    Activity,
    Users,
    Database,
    LogOut,
    Terminal,
    Layers,
    Globe,
    ArrowRight,
} from "lucide-react";
import { User } from "../types";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
}

const mockLogs = [
    {
        id: "1",
        action: "Cadastro de Novo Cliente",
        user: "Admin",
        time: "14:22:01",
    },
    {
        id: "2",
        action: "Relatório DRE Gerado",
        user: "Contador #102",
        time: "14:15:45",
    },
    {
        id: "3",
        action: "Tentativa de Login Bloqueada",
        user: "IP: 192.168.1.1",
        time: "13:50:22",
    },
    {
        id: "4",
        action: "Backup de Banco de Dados",
        user: "System",
        time: "04:00:00",
    },
];

export default function AdminDashboard({
    user,
    onLogout,
}: AdminDashboardProps) {
    return (
        <div className="system-layout min-h-screen flex flex-col font-mono">
            <header className="h-20 px-10 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <BrandLogo size="admin" className="shadow-lg shadow-brand/20" />
                    <div className="flex flex-col">
                        <span className="font-black tracking-tighter text-xl text-white">
                            WEB_CONTABIL_ADMIN
                        </span>
                        <span className="text-[10px] text-success font-black uppercase tracking-[0.2em] animate-pulse">
                            System Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-white transition-all border border-white/10 px-4 py-2 rounded-xl backdrop-blur-xl hover:bg-white/5 uppercase tracking-widest"
                    >
                        <LogOut className="w-3 h-3" />
                        Terminate_Session
                    </button>
                </div>
            </header>

            <div className="flex-grow p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="grid sm:grid-cols-3 gap-8">
                        <LogCard
                            icon={<Activity className="w-6 h-6" />}
                            label="CPU Usage"
                            value="12%"
                        />
                        <LogCard
                            icon={<Globe className="w-6 h-6" />}
                            label="Active Users"
                            value="842"
                        />
                        <LogCard
                            icon={<Database className="w-6 h-6" />}
                            label="DB Latency"
                            value="12ms"
                        />
                    </div>

                    <div className="flex-grow bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col min-h-[400px]">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-success" />
                            System_Realtime_Logs
                        </h3>
                        <div className="space-y-6 overflow-y-auto font-mono custom-scrollbar">
                            {mockLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="text-xs flex gap-5 border-b border-white/5 pb-5 group hover:bg-white/[0.02] p-2 rounded-lg transition-colors"
                                >
                                    <span className="text-success font-bold">
                                        [{log.time}]
                                    </span>
                                    <span className="text-blue-400 font-black">
                                        INFO:
                                    </span>
                                    <span className="flex-grow font-medium leading-relaxed">
                                        {log.action}
                                    </span>
                                    <span className="text-white/20 font-bold uppercase text-[9px] self-center">
                                        AUTH://{log.user.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                            <div className="text-[10px] text-success opacity-50 flex items-center gap-2 animate-pulse pt-4">
                                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                                Listening for incoming kernel events...
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-10">
                    <div className="p-10 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl space-y-8">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                            Admin_Controls
                        </h3>
                        <div className="space-y-3">
                            <AdminAction label="Monitorar Servidores" />
                            <AdminAction label="Auditoria de Dados" />
                            <AdminAction label="Gestão de Permissões" />
                            <AdminAction label="Relatórios de Sistema" />
                        </div>
                    </div>

                    <div className="mt-auto p-10 bg-gradient-to-br from-success/10 to-transparent backdrop-blur-2xl rounded-[40px] border border-success/10">
                        <Layers className="w-10 h-10 text-success mb-6 drop-shadow-lg" />
                        <h4 className="font-bold text-xl text-white tracking-tight mb-2">
                            Build v2.4.1
                        </h4>
                        <p className="text-xs text-white/30 leading-relaxed font-medium transition-opacity">
                            Toda atividade administrativa é registrada em logs
                            de redundância tripla para fins de auditoria e
                            segurança cibernética.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LogCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 hover:border-success/30 transition-all group shadow-2xl">
            <div className="text-white/20 mb-6 group-hover:text-success group-hover:scale-110 transition-all">
                {icon}
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                {label}
            </p>
            <h2 className="text-3xl font-black text-white mt-1 tracking-tighter">
                {value}
            </h2>
        </div>
    );
}

function AdminAction({ label }: { label: string }) {
    return (
        <button className="w-full text-left px-6 py-4 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/5 hover:border-success/30 flex items-center justify-between group transition-all">
            <span className="text-[11px] font-bold text-white/40 group-hover:text-white uppercase tracking-widest">
                {label}
            </span>
            <ArrowRight className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0" />
        </button>
    );
}
