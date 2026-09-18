/**
 * Tipos utilizados pelo módulo financeiro do painel do cliente.
 *
 * O backend Laravel ainda utiliza propriedades em inglês no contrato da API.
 * Por isso, os nomes dos campos recebidos e enviados são preservados aqui.
 */

export type TipoLancamentoFinanceiro =
    | "receita"
    | "despesa"
    | "transferencia"
    | "ajuste";

export type PeriodoGraficoFinanceiro = 1 | 7 | 15 | 30 | 90 | 180 | 365;

/**
 * Representa um comprovante já armazenado pelo backend.
 */
export interface AnexoFinanceiro {
    name: string;
    mimeType: string | null;
    size: number | null;
    url: string;
}

/**
 * Representa um lançamento financeiro retornado pela API.
 */
export interface LancamentoFinanceiro {
    id: number;
    type: TipoLancamentoFinanceiro;
    description: string;
    category: string;
    amount: number;
    date: string;
    attachment: AnexoFinanceiro | null;
}

/**
 * Estrutura utilizada pelo gráfico financeiro.
 */
export interface DadosGraficoFinanceiro {
    date: string;
    label: string;
    receitas: number;
    despesas: number;
}
