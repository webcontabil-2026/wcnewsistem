import { useEffect, useState, type ReactNode } from "react";
import {
    Activity,
    BadgeDollarSign,
    BriefcaseBusiness,
    ClipboardList,
    LoaderCircle,
    LogOut,
    Mail,
    RefreshCw,
    ShieldCheck,
    UserRound,
    Users,
} from "lucide-react";

import type { User } from "../types";
import { ApiError, apiRequest } from "../lib/api";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
}

interface ResumoAdmin {
    usuarios: number;
    clientes: number;
    contadores: number;
    solicitacoes: number;
    pendentes: number;
    emAndamento: number;
    volumeFinanceiro: number;
    contatosNovos: number;
}

interface UsuarioRecente {
    id: number;
    nome: string;
    email: string;
    perfil: User["role"];
    status: string;
    criadoEm: string | null;
}

const vazio: ResumoAdmin = {
    usuarios: 0,
    clientes: 0,
    contadores: 0,
    solicitacoes: 0,
    pendentes: 0,
    emAndamento: 0,
    volumeFinanceiro: 0,
    contatosNovos: 0,
};

const perfis: Record<User["role"], string> = {
    CLIENT: "Cliente",
    ACCOUNTANT: "Contador",
    ADMIN: "Administrador",
};

export default function AdminDashboard({
    user,
    onLogout,
}: AdminDashboardProps) {
    const [resumo, setResumo] = useState<ResumoAdmin>(vazio);
    const [usuarios, setUsuarios] = useState<UsuarioRecente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregar = async () => {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await apiRequest<{
                resumo: ResumoAdmin;
                usuariosRecentes: UsuarioRecente[];
            }>("/api/admin/resumo");

            setResumo(resposta.resumo);
            setUsuarios(resposta.usuariosRecentes);
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? error.message
                    : "Não foi possível carregar o painel administrativo.",
            );
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        void carregar();
    }, []);

    const cards: Array<{
        titulo: string;
        valor: string | number;
        detalhe: string;
        icone: ReactNode;
    }> = [
        {
            titulo: "Usuários",
            valor: resumo.usuarios,
            detalhe: `${resumo.clientes} clientes`,
            icone: <Users className="h-6 w-6" />,
        },
        {
            titulo: "Contadores",
            valor: resumo.contadores,
            detalhe: "Perfis profissionais",
            icone: <BriefcaseBusiness className="h-6 w-6" />,
        },
        {
            titulo: "Solicitações",
            valor: resumo.solicitacoes,
            detalhe: `${resumo.pendentes} pendente(s)`,
            icone: <ClipboardList className="h-6 w-6" />,
        },
        {
            titulo: "Em andamento",
            valor: resumo.emAndamento,
            detalhe: "Atendimentos ativos",
            icone: <Activity className="h-6 w-6" />,
        },
        {
            titulo: "Novos contatos",
            valor: resumo.contatosNovos,
            detalhe: "Formulário público",
            icone: <Mail className="h-6 w-6" />,
        },
    ];

    return (
        <div className="system-layout min-h-screen">
            <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3 sm:px-7 xl:px-10">
                <div className="flex min-w-0 items-center gap-3">
                    <BrandLogo size="admin" />
                    <div className="min-w-0">
                        <p className="truncate font-extrabold tracking-tight text-white">
                            WebContabil Admin
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
                            Painel autenticado
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-white/70 hover:bg-red-500/10 hover:text-red-400 sm:px-4"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Encerrar sessão</span>
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[96rem] space-y-8 p-4 sm:p-7 xl:p-10">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                            Administração
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Visão geral do sistema
                        </h1>
                        <p className="mt-2 font-medium text-white/50">
                            Olá, {user.name}. Os números abaixo vêm do banco de dados.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void carregar()}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10"
                    >
                        <RefreshCw className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
                        Atualizar
                    </button>
                </div>

                {erro && (
                    <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
                        {erro}
                    </p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    {cards.map((card) => (
                        <article key={card.titulo} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                {card.icone}
                            </div>
                            <p className="mt-6 text-[10px] font-black uppercase tracking-wider text-white/40">
                                {card.titulo}
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-white">
                                {carregando ? "—" : card.valor}
                            </p>
                            <p className="mt-2 text-sm text-white/50">{card.detalhe}</p>
                        </article>
                    ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
                    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-white">
                                    Cadastros recentes
                                </h2>
                                <p className="mt-1 text-sm text-white/50">
                                    Últimos usuários adicionados à plataforma.
                                </p>
                            </div>
                            <ShieldCheck className="h-7 w-7 text-brand" />
                        </div>

                        {carregando ? (
                            <div className="flex min-h-64 items-center justify-center">
                                <LoaderCircle className="h-8 w-8 animate-spin text-brand" />
                            </div>
                        ) : usuarios.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[42rem] text-left text-sm">
                                    <thead className="text-[10px] font-black uppercase tracking-wider text-white/40">
                                        <tr>
                                            <th className="px-6 py-4">Usuário</th>
                                            <th className="px-6 py-4">Perfil</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Cadastro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {usuarios.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-white">{usuario.nome}</p>
                                                    <p className="mt-1 text-xs text-white/40">{usuario.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-white/60">{perfis[usuario.perfil]}</td>
                                                <td className="px-6 py-4"><span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">{usuario.status}</span></td>
                                                <td className="px-6 py-4 text-white/50">{usuario.criadoEm ? new Intl.DateTimeFormat("pt-BR").format(new Date(usuario.criadoEm)) : "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="px-6 py-16 text-center text-white/50">Nenhum usuário encontrado.</p>
                        )}
                    </section>

                    <aside className="space-y-5">
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <BadgeDollarSign className="h-8 w-8 text-brand" />
                            <p className="mt-6 text-[10px] font-black uppercase tracking-wider text-white/40">
                                Volume registrado
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-white">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(resumo.volumeFinanceiro)}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-white/40">
                                Soma dos lançamentos ativos; não representa saldo bancário.
                            </p>
                        </article>
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <UserRound className="h-8 w-8 text-brand" />
                            <p className="mt-5 font-extrabold text-white">Acesso controlado</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/50">
                                Este resumo é validado no servidor e só pode ser consultado por contas ADMIN.
                            </p>
                        </article>
                    </aside>
                </div>
            </main>
        </div>
    );
}
