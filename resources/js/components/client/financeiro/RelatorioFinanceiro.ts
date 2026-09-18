import type { User } from "../../../types";
import type { LancamentoFinanceiro, PeriodoGraficoFinanceiro } from "./tipos";
import { formatCurrencyValue, formatFinancialDate } from "./formatadores";

const rotulosPeriodo: Record<PeriodoGraficoFinanceiro, string> = {
    1: "1 dia",
    7: "1 semana",
    15: "15 dias",
    30: "1 mês",
    90: "3 meses",
    180: "6 meses",
    365: "12 meses",
};

const rotulosTipo = {
    receita: "Receita",
    despesa: "Despesa",
    transferencia: "Transferência",
    ajuste: "Ajuste financeiro",
} as const;

const rotulosCategoria: Record<string, string> = {
    servicos: "Serviços",
    honorarios: "Honorários",
    impostos: "Impostos",
    folha: "Folha de pagamento",
    fornecedores: "Fornecedores",
    equipamentos: "Equipamentos",
    reembolso: "Reembolso",
    outros: "Outros",
};

interface GerarRelatorioFinanceiroParams {
    usuario: User;
    lancamentos: LancamentoFinanceiro[];
    periodo: PeriodoGraficoFinanceiro;
    datasVisiveis: string[];
}

/**
 * Gera o relatório financeiro em PDF usando o mesmo período exibido no gráfico.
 */
export const gerarRelatorioFinanceiro = async ({
    usuario,
    lancamentos,
    periodo,
    datasVisiveis,
}: GerarRelatorioFinanceiroParams) => {
    const chavesVisiveis = new Set(datasVisiveis);

    const lancamentosRelatorio = lancamentos
        .filter((lancamento) => {
            const chavePeriodo =
                periodo >= 90 ? lancamento.date.slice(0, 7) : lancamento.date;

            return chavesVisiveis.has(chavePeriodo);
        })
        .sort((primeiro, segundo) => segundo.date.localeCompare(primeiro.date));

    if (lancamentosRelatorio.length === 0) {
        throw new Error(
            "Não existem lançamentos no período selecionado para exportar.",
        );
    }

    const [{ jsPDF }, { autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
    ]);

    const resumo = lancamentosRelatorio.reduce(
        (acumulado, lancamento) => {
            if (lancamento.type === "receita") {
                acumulado.receitas += lancamento.amount;
            }

            if (lancamento.type === "despesa") {
                acumulado.despesas += lancamento.amount;
            }

            return acumulado;
        },
        {
            receitas: 0,
            despesas: 0,
        },
    );

    const saldo = resumo.receitas - resumo.despesas;

    const documento = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const larguraPagina = documento.internal.pageSize.getWidth();

    documento.setFillColor(12, 68, 124);
    documento.rect(0, 0, larguraPagina, 28, "F");

    documento.setTextColor(255, 255, 255);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);
    documento.text("WebContabil", 14, 11);

    documento.setFontSize(17);
    documento.text("Relatório financeiro", 14, 21);

    documento.setTextColor(40, 50, 65);
    documento.setFont("helvetica", "normal");
    documento.setFontSize(9);

    documento.text(`Cliente: ${usuario.name}`, 14, 37);

    documento.text(`Período selecionado: ${rotulosPeriodo[periodo]}`, 14, 43);

    documento.text(
        `Emitido em: ${new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date())}`,
        14,
        49,
    );

    documento.setFont("helvetica", "bold");
    documento.setFontSize(9);

    documento.setTextColor(5, 150, 105);
    documento.text(
        `Receitas: ${formatCurrencyValue(resumo.receitas)}`,
        105,
        38,
    );

    documento.setTextColor(220, 38, 38);
    documento.text(
        `Despesas: ${formatCurrencyValue(resumo.despesas)}`,
        105,
        45,
    );

    documento.setTextColor(
        saldo >= 0 ? 5 : 220,
        saldo >= 0 ? 150 : 38,
        saldo >= 0 ? 105 : 38,
    );

    documento.text(`Saldo: ${formatCurrencyValue(saldo)}`, 190, 38);

    documento.setTextColor(40, 50, 65);
    documento.text(`Lançamentos: ${lancamentosRelatorio.length}`, 190, 45);

    autoTable(documento, {
        startY: 58,
        head: [["Data", "Tipo", "Categoria", "Descrição", "Valor", "Anexo"]],
        body: lancamentosRelatorio.map((lancamento) => {
            const prefixoValor =
                lancamento.type === "receita"
                    ? "+"
                    : lancamento.type === "despesa"
                      ? "-"
                      : "";

            return [
                formatFinancialDate(lancamento.date),
                rotulosTipo[lancamento.type],
                rotulosCategoria[lancamento.category] ?? lancamento.category,
                lancamento.description,
                `${prefixoValor}${formatCurrencyValue(lancamento.amount)}`,
                lancamento.attachment?.name ?? "Sem anexo",
            ];
        }),
        theme: "grid",
        headStyles: {
            fillColor: [12, 68, 124],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 2.5,
            overflow: "linebreak",
            textColor: [40, 50, 65],
        },
        alternateRowStyles: {
            fillColor: [242, 247, 252],
        },
        columnStyles: {
            0: { cellWidth: 24 },
            1: { cellWidth: 28 },
            2: { cellWidth: 38 },
            3: { cellWidth: 75 },
            4: { cellWidth: 35 },
            5: { cellWidth: 55 },
        },
        didParseCell: (dadosTabela) => {
            if (
                dadosTabela.section !== "body" ||
                dadosTabela.column.index !== 4
            ) {
                return;
            }

            const lancamento = lancamentosRelatorio[dadosTabela.row.index];

            if (lancamento?.type === "receita") {
                dadosTabela.cell.styles.textColor = [5, 150, 105];
                dadosTabela.cell.styles.fontStyle = "bold";
            }

            if (lancamento?.type === "despesa") {
                dadosTabela.cell.styles.textColor = [220, 38, 38];
                dadosTabela.cell.styles.fontStyle = "bold";
            }
        },
    });

    const quantidadePaginas = documento.getNumberOfPages();

    for (
        let numeroPagina = 1;
        numeroPagina <= quantidadePaginas;
        numeroPagina += 1
    ) {
        documento.setPage(numeroPagina);

        const alturaPagina = documento.internal.pageSize.getHeight();

        documento.setFont("helvetica", "normal");
        documento.setFontSize(8);
        documento.setTextColor(100, 110, 125);

        documento.text(
            `Página ${numeroPagina} de ${quantidadePaginas}`,
            larguraPagina - 14,
            alturaPagina - 8,
            {
                align: "right",
            },
        );
    }

    const agora = new Date();

    const dataLocal = [
        agora.getFullYear(),
        String(agora.getMonth() + 1).padStart(2, "0"),
        String(agora.getDate()).padStart(2, "0"),
    ].join("-");

    documento.save(`relatorio-financeiro-${dataLocal}.pdf`);
};
