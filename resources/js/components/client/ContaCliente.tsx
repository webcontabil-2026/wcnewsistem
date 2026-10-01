import { useState } from "react";
import AlterarSenha from "./conta/AlterarSenha";
import DesativarConta from "./conta/DesativarConta";
import MenuConta from "./conta/MenuConta";

interface ContaClienteProps {
    onVoltar: () => void;
}

type SecaoConta = "menu" | "senha" | "exclusao";

/**
 * Coordena a navegação interna das configurações da conta.
 *
 * Cada tela mantém seus próprios estados e responsabilidades.
 */
export default function ContaCliente({ onVoltar }: ContaClienteProps) {
    const [secaoConta, setSecaoConta] = useState<SecaoConta>("menu");

    if (secaoConta === "senha") {
        return <AlterarSenha onVoltar={() => setSecaoConta("menu")} />;
    }

    if (secaoConta === "exclusao") {
        return <DesativarConta onVoltar={() => setSecaoConta("menu")} />;
    }

    return (
        <MenuConta
            onVoltar={onVoltar}
            onAbrirSenha={() => setSecaoConta("senha")}
            onAbrirExclusao={() => setSecaoConta("exclusao")}
        />
    );
}
