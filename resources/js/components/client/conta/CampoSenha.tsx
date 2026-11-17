import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface CampoSenhaProps {
    id: string;
    rotulo: string;
    valor: string;
    placeholder: string;
    autoComplete: string;
    aoAlterar: (valor: string) => void;
    minLength?: number;
    maxLength?: number;
}

/**
 * Campo reutilizável para senhas com controle
 * de exibição e ocultação do conteúdo.
 */
export default function CampoSenha({
    id,
    rotulo,
    valor,
    placeholder,
    autoComplete,
    aoAlterar,
    minLength,
    maxLength = 72,
}: CampoSenhaProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const descricaoBotao = mostrarSenha
        ? `Ocultar ${rotulo.toLowerCase()}`
        : `Exibir ${rotulo.toLowerCase()}`;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-bold text-white"
            >
                {rotulo}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={mostrarSenha ? "text" : "password"}
                    value={valor}
                    onChange={(event) => aoAlterar(event.target.value)}
                    minLength={minLength}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    className="
                        w-full rounded-2xl
                        border border-white/10
                        bg-white/10
                        px-4 py-3 pr-12
                        text-white
                        outline-none
                        transition-colors
                        placeholder:text-white/30
                        focus:border-brand
                    "
                    placeholder={placeholder}
                />

                <button
                    type="button"
                    onClick={() => setMostrarSenha((atual) => !atual)}
                    className="
                        absolute inset-y-0
                        right-0 flex w-12
                        items-center
                        justify-center
                        text-white/50
                        transition-colors
                        hover:text-brand
                    "
                    aria-label={descricaoBotao}
                    title={descricaoBotao}
                    aria-pressed={mostrarSenha}
                >
                    {mostrarSenha ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );
}
