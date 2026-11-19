import { useCallback, useEffect, useState } from "react";

import { ApiError, apiRequest } from "../../lib/api";
import type { SolicitacaoCliente, StatusSolicitacao } from "../client/solicitacoes/tipos";

const mensagemErro = (error: unknown, padrao: string) => {
    if (error instanceof ApiError) {
        return Object.values(error.errors).flat()[0] ?? error.message;
    }
    return padrao;
};

export default function useSolicitacoesContador() {
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [processandoId, setProcessandoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await apiRequest<{ solicitacoes: SolicitacaoCliente[] }>(
                "/api/solicitacoes",
            );
            setSolicitacoes(resposta.solicitacoes);
        } catch (error) {
            setErro(mensagemErro(error, "Não foi possível carregar as solicitações."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void carregar();
    }, [carregar]);

    const substituir = (solicitacao: SolicitacaoCliente) => {
        setSolicitacoes((atuais) =>
            atuais.map((item) =>
                item.id === solicitacao.id ? solicitacao : item,
            ),
        );
    };

    const enviarOrcamento = async (id: number, valorOrcamento: number) => {
        setProcessandoId(id);
        setErro("");
        setMensagem("");

        try {
            const resposta = await apiRequest<{
                message: string;
                solicitacao: SolicitacaoCliente;
            }>(`/api/solicitacoes/${id}/orcamento`, {
                method: "PATCH",
                body: JSON.stringify({ valorOrcamento }),
            });
            substituir(resposta.solicitacao);
            setMensagem(resposta.message);
        } catch (error) {
            setErro(mensagemErro(error, "Não foi possível enviar o orçamento."));
        } finally {
            setProcessandoId(null);
        }
    };

    const atualizarStatus = async (id: number, status: StatusSolicitacao) => {
        setProcessandoId(id);
        setErro("");
        setMensagem("");

        try {
            const resposta = await apiRequest<{
                message: string;
                solicitacao: SolicitacaoCliente;
            }>(`/api/solicitacoes/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            substituir(resposta.solicitacao);
            setMensagem(resposta.message);
        } catch (error) {
            setErro(mensagemErro(error, "Não foi possível atualizar o atendimento."));
        } finally {
            setProcessandoId(null);
        }
    };

    return {
        solicitacoes,
        carregando,
        processandoId,
        erro,
        mensagem,
        carregar,
        enviarOrcamento,
        atualizarStatus,
    };
}
