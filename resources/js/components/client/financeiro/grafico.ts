import {
    DadosGraficoFinanceiro,
    LancamentoFinanceiro,
    PeriodoGraficoFinanceiro,
} from "./tipos";

/**
 * Monta os dados utilizados pelo gráfico financeiro.
 *
 * - Períodos menores que 90 dias são agrupados por dia.
 * - Períodos de 90 dias ou mais são agrupados por mês.
 * - O intervalo termina hoje ou na data futura mais recente cadastrada.
 */
export const criarDadosGraficoFinanceiro = (
    lancamentos: LancamentoFinanceiro[],
    periodo: PeriodoGraficoFinanceiro,
): DadosGraficoFinanceiro[] => {
    const lancamentosDoGrafico = lancamentos.filter(
        (lancamento) =>
            lancamento.type === "receita" || lancamento.type === "despesa",
    );

    const hoje = new Date();

    hoje.setHours(23, 59, 59, 999);

    const dataReferencia = lancamentosDoGrafico.reduce(
        (dataMaisRecente, lancamento) => {
            const [ano, mes, dia] = lancamento.date.split("-").map(Number);

            const dataLancamento = new Date(ano, mes - 1, dia);

            return dataLancamento > dataMaisRecente
                ? dataLancamento
                : dataMaisRecente;
        },
        new Date(hoje),
    );

    dataReferencia.setHours(23, 59, 59, 999);

    const agruparPorMes = periodo >= 90;

    const grupos: Record<string, DadosGraficoFinanceiro> = {};

    let inicioPeriodo: Date;

    if (agruparPorMes) {
        const quantidadeMeses = periodo === 90 ? 3 : periodo === 180 ? 6 : 12;

        inicioPeriodo = new Date(
            dataReferencia.getFullYear(),
            dataReferencia.getMonth() - (quantidadeMeses - 1),
            1,
        );

        const mesAtual = new Date(inicioPeriodo);

        while (mesAtual <= dataReferencia) {
            const ano = mesAtual.getFullYear();
            const mes = mesAtual.getMonth() + 1;
            const chave = `${ano}-${String(mes).padStart(2, "0")}`;

            grupos[chave] = {
                date: chave,
                label: `${String(mes).padStart(2, "0")}/${String(ano).slice(-2)}`,
                receitas: 0,
                despesas: 0,
            };

            mesAtual.setMonth(mesAtual.getMonth() + 1);
        }
    } else {
        inicioPeriodo = new Date(dataReferencia);

        inicioPeriodo.setHours(0, 0, 0, 0);
        inicioPeriodo.setDate(inicioPeriodo.getDate() - (periodo - 1));

        const diaAtual = new Date(inicioPeriodo);

        while (diaAtual <= dataReferencia) {
            const ano = diaAtual.getFullYear();
            const mes = diaAtual.getMonth() + 1;
            const dia = diaAtual.getDate();

            const chave = `${ano}-${String(mes).padStart(2, "0")}-${String(
                dia,
            ).padStart(2, "0")}`;

            grupos[chave] = {
                date: chave,
                label: `${String(dia).padStart(2, "0")}/${String(mes).padStart(
                    2,
                    "0",
                )}`,
                receitas: 0,
                despesas: 0,
            };

            diaAtual.setDate(diaAtual.getDate() + 1);
        }
    }

    lancamentosDoGrafico.forEach((lancamento) => {
        const [ano, mes, dia] = lancamento.date.split("-").map(Number);

        const dataLancamento = new Date(ano, mes - 1, dia);

        if (dataLancamento < inicioPeriodo || dataLancamento > dataReferencia) {
            return;
        }

        const chaveGrupo = agruparPorMes
            ? `${ano}-${String(mes).padStart(2, "0")}`
            : lancamento.date;

        const grupo = grupos[chaveGrupo];

        if (!grupo) {
            return;
        }

        if (lancamento.type === "receita") {
            grupo.receitas += lancamento.amount;
        }

        if (lancamento.type === "despesa") {
            grupo.despesas += lancamento.amount;
        }
    });

    return Object.values(grupos);
};
