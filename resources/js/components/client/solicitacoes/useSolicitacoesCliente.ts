import { useCallback, useEffect, useState } from "react";

import { ApiError, apiRequest } from "../../../lib/api";
import { DecisaoOrcamento, SolicitacaoCliente } from "./tipos";

interface RespostaListaSolicitacoes {
    solicitacoes: SolicitacaoCliente[];
}

interface RespostaOrcamento {
    message: string;
    solicitacao: SolicitacaoCliente;
}

/**
 * Retorna uma mensagem adequada para erros da API.
 */
const obterMensagemErro = (error: unknown, mensagemPadrao: string): string => {
    if (error instanceof ApiError) {
        const primeiroErro = Object.values(error.errors).flat()[0];

        return primeiroErro ?? error.message;
    }

    return mensagemPadrao;
};

/**
 * Controla a comunicação entre a tela do cliente
 * e as rotas de solicitações do Laravel.
 */
export default function useSolicitacoesCliente() {
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCliente[]>([]);

    const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);

    const [respondendoSolicitacaoId, setRespondendoSolicitacaoId] = useState<
        number | null
    >(null);

    const [erroSolicitacoes, setErroSolicitacoes] = useState("");
    const [mensagemSolicitacoes, setMensagemSolicitacoes] = useState("");

    /**
     * Busca as solicitações pertencentes ao cliente autenticado.
     */
    const carregarSolicitacoes = useCallback(async () => {
        setCarregandoSolicitacoes(true);
        setErroSolicitacoes("");

        try {
            const resposta =
                await apiRequest<RespostaListaSolicitacoes>(
                    "/api/solicitacoes",
                );

            setSolicitacoes(resposta.solicitacoes);
        } catch (error) {
            setErroSolicitacoes(
                obterMensagemErro(
                    error,
                    "Não foi possível carregar as solicitações.",
                ),
            );
        } finally {
            setCarregandoSolicitacoes(false);
        }
    }, []);

    useEffect(() => {
        void carregarSolicitacoes();
    }, [carregarSolicitacoes]);

    /**
     * Envia ao Laravel a decisão do cliente sobre o orçamento.
     */
    const responderOrcamento = async (
        solicitacaoId: number,
        decisao: DecisaoOrcamento,
    ) => {
        setRespondendoSolicitacaoId(solicitacaoId);
        setErroSolicitacoes("");
        setMensagemSolicitacoes("");

        try {
            const resposta = await apiRequest<RespostaOrcamento>(
                `/api/solicitacoes/${solicitacaoId}/resposta`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        decisao,
                    }),
                },
            );

            /*
             * Substitui somente a solicitação atualizada,
             * preservando as outras solicitações da lista.
             */
            setSolicitacoes((solicitacoesAtuais) =>
                solicitacoesAtuais.map((solicitacao) =>
                    solicitacao.id === resposta.solicitacao.id
                        ? resposta.solicitacao
                        : solicitacao,
                ),
            );

            setMensagemSolicitacoes(resposta.message);
        } catch (error) {
            setErroSolicitacoes(
                obterMensagemErro(
                    error,
                    "Não foi possível responder ao orçamento.",
                ),
            );
        } finally {
            setRespondendoSolicitacaoId(null);
        }
    };

    return {
        solicitacoes,
        carregandoSolicitacoes,
        respondendoSolicitacaoId,
        erroSolicitacoes,
        mensagemSolicitacoes,
        carregarSolicitacoes,
        responderOrcamento,
    };
}
