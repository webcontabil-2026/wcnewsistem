/**
 * Formata o valor digitado no padrão monetário brasileiro.
 * Exemplo: 123456 será apresentado como R$ 1.234,56.
 */
export const formatCurrencyInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);

    if (!digits) {
        return "";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(Number(digits) / 100);
};

/**
 * Converte um valor monetário formatado para número.
 */
export const parseCurrencyInput = (value: string) => {
    const digits = value.replace(/\D/g, "");

    return digits ? Number(digits) / 100 : 0;
};

/**
 * Formata valores numéricos para Real brasileiro.
 */
export const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(value);

/**
 * Ajusta o tamanho visual de valores monetários muito grandes.
 */
export const getFinancialValueTextSize = (value: number) => {
    const formattedValue = formatCurrencyValue(Math.abs(value));

    if (formattedValue.length >= 19) {
        return "text-sm";
    }

    if (formattedValue.length >= 16) {
        return "text-base";
    }

    if (formattedValue.length >= 13) {
        return "text-lg";
    }

    return "text-2xl";
};

/**
 * Formata datas YYYY-MM-DD sem sofrer alteração por fuso horário.
 */
export const formatFinancialDate = (date: string) => {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
};
