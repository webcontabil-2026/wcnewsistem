import { useRef, useState } from "react";
import { ChevronRight, UserRound } from "lucide-react";

import { User } from "../../types";

interface PerfilClienteProps {
    user: User;
    onVoltar: () => void;
}

/**
 * Tela de perfil do cliente.
 *
 * Nesta etapa, as alterações continuam sendo validadas
 * apenas no navegador. A persistência definitiva será
 * conectada ao backend posteriormente.
 */
export default function PerfilCliente({ user, onVoltar }: PerfilClienteProps) {
    const [imagemPerfilPreview, setImagemPerfilPreview] = useState<
        string | null
    >(null);

    const [erroImagemPerfil, setErroImagemPerfil] = useState("");

    const [mensagemSalvamento, setMensagemSalvamento] = useState("");

    const inputImagemPerfilRef = useRef<HTMLInputElement | null>(null);

    /**
     * Valida a imagem escolhida antes de gerar
     * a prévia apresentada ao usuário.
     */
    const selecionarImagemPerfil = (
        file: File | undefined,
        input: HTMLInputElement,
    ) => {
        if (!file) {
            return;
        }

        const tiposPermitidos = ["image/png", "image/jpeg", "image/webp"];

        const tamanhoMaximoEmBytes = 5 * 1024 * 1024;

        if (!tiposPermitidos.includes(file.type)) {
            setErroImagemPerfil("Selecione uma imagem PNG, JPG ou WebP.");

            input.value = "";
            return;
        }

        if (file.size > tamanhoMaximoEmBytes) {
            setErroImagemPerfil("A imagem deve possuir no máximo 5 MB.");

            input.value = "";
            return;
        }

        setErroImagemPerfil("");

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImagemPerfilPreview(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    /**
     * Aplica máscara simples de telefone
     * enquanto o usuário digita.
     */
    const formatarTelefone = (valor: string) => {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <= 10) {
            return numeros
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }

        return numeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    };

    /**
     * Aplica a máscara visual do CPF.
     */
    const formatarCpf = (valor: string) =>
        valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return (
        <section className="p-4 sm:p-6 xl:p-10">
            <button
                type="button"
                onClick={onVoltar}
                className="
                    group mb-6 inline-flex
                    items-center gap-2
                    text-sm font-bold
                    text-white/50
                    transition-colors
                    hover:text-brand
                "
            >
                <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                Voltar para configurações
            </button>

            <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                    Dados pessoais
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Perfil
                </h1>

                <p className="mt-2 max-w-2xl font-medium text-white/50">
                    Atualize sua foto e as informações utilizadas para
                    identificar sua conta.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[18rem_1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                    <div
                        className="
                            mx-auto flex h-24 w-24
                            items-center justify-center
                            overflow-hidden rounded-3xl
                            bg-brand/10 text-brand
                        "
                    >
                        {imagemPerfilPreview ? (
                            <img
                                src={imagemPerfilPreview}
                                alt="Prévia da foto de perfil"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-14 w-14 text-brand" />
                        )}
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-white">
                        Foto do perfil
                    </h2>

                    <p className="mt-1 text-sm leading-relaxed text-white/50">
                        Utilize uma imagem nítida para facilitar sua
                        identificação.
                    </p>

                    {/*
                     * Campo oculto utilizado somente para
                     * abrir o seletor de imagens.
                     *
                     * A persistência da foto será conectada
                     * ao armazenamento do servidor futuramente.
                     */}
                    <input
                        ref={inputImagemPerfilRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) =>
                            selecionarImagemPerfil(
                                event.target.files?.[0],
                                event.currentTarget,
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() => inputImagemPerfilRef.current?.click()}
                        className="
                            mt-5 w-full rounded-xl
                            bg-brand px-5 py-3
                            font-bold text-slate-950
                            transition-all
                            hover:brightness-110
                        "
                    >
                        Alterar foto
                    </button>

                    {erroImagemPerfil && (
                        <p
                            className="mt-3 text-sm font-semibold text-red-400"
                            role="alert"
                        >
                            {erroImagemPerfil}
                        </p>
                    )}
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!event.currentTarget.checkValidity()) {
                            event.currentTarget.reportValidity();
                            return;
                        }

                        setMensagemSalvamento(
                            "Alterações validadas. O salvamento definitivo será conectado ao servidor.",
                        );

                        window.setTimeout(() => {
                            setMensagemSalvamento("");
                        }, 4000);
                    }}
                    className="
                        rounded-3xl border
                        border-white/10 bg-white/5
                        p-5 sm:p-6
                    "
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Nome completo
                            </span>

                            <input
                                type="text"
                                defaultValue={user.name}
                                minLength={3}
                                maxLength={100}
                                autoComplete="name"
                                className="
                                    w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3 text-white
                                    outline-none
                                    transition-colors
                                    focus:border-brand
                                "
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                E-mail
                            </span>

                            <input
                                type="email"
                                defaultValue={user.email}
                                maxLength={254}
                                autoComplete="email"
                                className="
                                    w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3 text-white
                                    outline-none
                                    transition-colors
                                    focus:border-brand
                                "
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                Telefone
                            </span>

                            <input
                                type="tel"
                                placeholder="(00) 00000-0000"
                                inputMode="numeric"
                                minLength={14}
                                maxLength={15}
                                autoComplete="tel"
                                onInput={(event) => {
                                    event.currentTarget.value =
                                        formatarTelefone(
                                            event.currentTarget.value,
                                        );
                                }}
                                className="
                                    w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3 text-white
                                    outline-none
                                    transition-colors
                                    focus:border-brand
                                "
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-bold text-white">
                                CPF
                            </span>

                            <input
                                type="text"
                                defaultValue={user.cpf}
                                inputMode="numeric"
                                minLength={14}
                                maxLength={14}
                                autoComplete="off"
                                onInput={(event) => {
                                    event.currentTarget.value = formatarCpf(
                                        event.currentTarget.value,
                                    );
                                }}
                                className="
                                    w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3 text-white
                                    outline-none
                                    transition-colors
                                    focus:border-brand
                                "
                            />
                        </label>
                    </div>

                    <div className="mt-2 flex flex-col gap-4 md:col-span-2">
                        {mensagemSalvamento && (
                            <p
                                className="
                                    w-full rounded-xl
                                    border
                                    border-emerald-500/30
                                    bg-emerald-500/10
                                    px-4 py-3
                                    text-sm font-semibold
                                    text-emerald-500
                                "
                                role="status"
                                aria-live="polite"
                            >
                                {mensagemSalvamento}
                            </p>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="
                                    w-full rounded-xl
                                    bg-brand px-6 py-3
                                    font-bold text-slate-950
                                    transition-all duration-200
                                    hover:brightness-110
                                    hover:shadow-lg
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-brand
                                    focus-visible:ring-offset-2
                                    sm:w-auto sm:min-w-52
                                "
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
