import { useRef, useState, type FormEvent } from "react";
import { Camera, ChevronRight, LoaderCircle, UserRound } from "lucide-react";

import { ApiError, apiRequest } from "../../lib/api";
import type { User } from "../../types";

interface PerfilClienteProps {
    user: User;
    onVoltar: () => void;
}

interface PerfilResposta {
    message: string;
    user: {
        name: string;
        email: string;
        cpf: string | null;
        telefone: string | null;
        fotoUrl: string | null;
    };
}

const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    return numeros.length <= 10
        ? numeros
              .replace(/^(\d{2})(\d)/, "($1) $2")
              .replace(/(\d{4})(\d)/, "$1-$2")
        : numeros
              .replace(/^(\d{2})(\d)/, "($1) $2")
              .replace(/(\d{5})(\d)/, "$1-$2");
};

const formatarCpf = (valor: string) =>
    valor
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export default function PerfilCliente({ user, onVoltar }: PerfilClienteProps) {
    const [dados, setDados] = useState({
        name: user.name,
        email: user.email,
        telefone: user.telefone ?? "",
        cpf: user.cpf ?? "",
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(user.fotoUrl ?? null);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);
    const fotoRef = useRef<HTMLInputElement | null>(null);

    const selecionarFoto = (arquivo?: File) => {
        if (!arquivo) return;

        if (!["image/png", "image/jpeg", "image/webp"].includes(arquivo.type)) {
            setErro("Selecione uma imagem PNG, JPG ou WebP.");
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            setErro("A imagem deve possuir no máximo 5 MB.");
            return;
        }

        setErro("");
        setFoto(arquivo);
        setPreview(URL.createObjectURL(arquivo));
    };

    const salvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSalvando(true);
        setErro("");
        setMensagem("");

        const formulario = new FormData();
        formulario.append("name", dados.name.trim());
        formulario.append("email", dados.email.trim());
        formulario.append("telefone", dados.telefone.trim());
        formulario.append("cpf", dados.cpf.trim());
        if (foto) formulario.append("foto", foto);

        try {
            const resposta = await apiRequest<PerfilResposta>("/conta/perfil", {
                method: "POST",
                body: formulario,
            });
            setDados({
                name: resposta.user.name,
                email: resposta.user.email,
                telefone: resposta.user.telefone ?? "",
                cpf: resposta.user.cpf ?? "",
            });
            setPreview(resposta.user.fotoUrl);
            setFoto(null);
            setMensagem(resposta.message);
        } catch (error) {
            setErro(
                error instanceof ApiError
                    ? Object.values(error.errors).flat()[0] ?? error.message
                    : "Não foi possível atualizar o perfil.",
            );
        } finally {
            setSalvando(false);
        }
    };

    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <div className="mx-auto max-w-5xl">
                <button type="button" onClick={onVoltar} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-brand">
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar para configurações
                </button>

                <header className="mb-8">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Dados pessoais</p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Perfil</h1>
                    <p className="mt-2 max-w-2xl font-medium text-white/50">Atualize as informações usadas para identificar sua conta.</p>
                </header>

                <form onSubmit={salvar} className="grid gap-6 xl:grid-cols-[18rem_1fr]">
                    <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-brand/10 text-brand">
                            {preview ? <img src={preview} alt="Foto de perfil" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14" />}
                        </div>
                        <input ref={fotoRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => selecionarFoto(event.target.files?.[0])} />
                        <button type="button" onClick={() => fotoRef.current?.click()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10">
                            <Camera className="h-4 w-4" /> Alterar foto
                        </button>
                        <p className="mt-3 text-xs text-white/40">PNG, JPG ou WebP · até 5 MB</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Campo rotulo="Nome completo"><input required minLength={3} maxLength={100} value={dados.name} onChange={(event) => setDados((atual) => ({ ...atual, name: event.target.value }))} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" /></Campo>
                            <Campo rotulo="E-mail"><input required type="email" maxLength={254} value={dados.email} onChange={(event) => setDados((atual) => ({ ...atual, email: event.target.value }))} autoComplete="email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" /></Campo>
                            <Campo rotulo="Telefone"><input type="tel" maxLength={15} value={dados.telefone} onChange={(event) => setDados((atual) => ({ ...atual, telefone: formatarTelefone(event.target.value) }))} placeholder="(00) 00000-0000" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" /></Campo>
                            <Campo rotulo="CPF"><input maxLength={14} value={dados.cpf} onChange={(event) => setDados((atual) => ({ ...atual, cpf: formatarCpf(event.target.value) }))} placeholder="000.000.000-00" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" /></Campo>
                        </div>

                        {erro && <p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">{erro}</p>}
                        {mensagem && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">{mensagem}</p>}

                        <div className="mt-6 flex justify-end">
                            <button type="submit" disabled={salvando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white hover:bg-brand/90 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                                {salvando && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {salvando ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
    return <label className="space-y-2"><span className="text-sm font-bold text-white">{rotulo}</span>{children}</label>;
}
