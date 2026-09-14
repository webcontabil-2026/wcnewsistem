/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import {
    LayoutDashboard,
    Users,
    FileText,
    FolderOpen,
    MessageSquare,
    WalletCards,
    Calendar,
    PlusCircle,
    Settings,
    LogOut,
    Bell,
    Search,
    Video,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Clock,
    CheckCircle2,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    UserRound,
    SlidersHorizontal,
    ShieldCheck,
    KeyRound,
    LockKeyhole,
    Trash2,
    AlertTriangle,
    Eye,
    EyeOff,
    ExternalLink,
} from "lucide-react";
import { User, ReportData, Task } from "../types";
import { cn } from "../lib/utils";
import { ApiError, apiRequest } from "../lib/api";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";
type FinancialEntryType = "receita" | "despesa" | "transferencia" | "ajuste";
type FinancialChartPeriod = 1 | 7 | 15 | 30 | 90 | 180 | 365;
/*
 * Representa o comprovante que já foi armazenado pelo Laravel.
 */
interface FinancialAttachment {
    name: string;
    mimeType: string | null;
    size: number | null;
    url: string;
}
interface FinancialEntry {
    id: number;
    type: FinancialEntryType;
    description: string;
    category: string;
    amount: number;
    date: string;
    attachment: FinancialAttachment | null;
}
interface FinancialBarShapeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fillColor: string;
}

/*
 * Desenha as colunas com cores fixas para impedir
 * que o tema substitua verde e vermelho pelo azul da marca.
 */
function FinancialBarShape({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fillColor,
}: FinancialBarShapeProps) {
    if (width <= 0 || height <= 0) {
        return null;
    }

    const radius = Math.min(8, width / 2, height / 2);

    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={radius}
            ry={radius}
            fill={fillColor}
        />
    );
}
interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}
/*
 * Formata o valor digitado no padrão monetário brasileiro.
 * Exemplo: 123456 será apresentado como R$ 1.234,56.
 */
const formatCurrencyInput = (value: string) => {
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

/*
 * Converte o valor formatado para número antes do salvamento.
 */
const parseCurrencyInput = (value: string) => {
    const digits = value.replace(/\D/g, "");

    return digits ? Number(digits) / 100 : 0;
};
/*
 * Formata números já salvos para apresentação nos cards financeiros.
 */
const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(value);
/*
 * Reduz gradualmente a fonte quando o valor monetário é muito comprido.
 */
const getFinancialValueTextSize = (value: number) => {
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
const financialTypeLabels: Record<FinancialEntryType, string> = {
    receita: "Receita",
    despesa: "Despesa",
    transferencia: "Transferência",
    ajuste: "Ajuste financeiro",
};

const financialCategoryLabels: Record<string, string> = {
    servicos: "Serviços",
    honorarios: "Honorários",
    impostos: "Impostos",
    folha: "Folha de pagamento",
    fornecedores: "Fornecedores",
    equipamentos: "Equipamentos",
    reembolso: "Reembolso",
    outros: "Outros",
};

/*
 * Formata a data sem alterar o dia por causa do fuso horário.
 */
const formatFinancialDate = (date: string) => {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
};
const mockChartData: ReportData[] = [
    { month: "Jan", value: 4000 },
    { month: "Fev", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Abr", value: 4500 },
    { month: "Mai", value: 6000 },
];

const mockWeeklyData = [
    { day: "Seg", value: 12 },
    { day: "Ter", value: 19 },
    { day: "Qua", value: 3 },
    { day: "Qui", value: 5 },
    { day: "Sex", value: 2 },
];

const mockTasks: Task[] = [
    {
        id: "1",
        title: "Enviar NF de Serviços",
        dueDate: "2026-05-16",
        status: "PENDING",
    },
    {
        id: "2",
        title: "Reunião Trimestral",
        dueDate: "2026-05-18",
        status: "IN_PROGRESS",
    },
    {
        id: "3",
        title: "Assinar Balancete",
        dueDate: "2026-05-15",
        status: "COMPLETED",
    },
];

export default function ClientDashboard({
    user,
    onLogout,
}: ClientDashboardProps) {
    const [activeTab, setActiveTab] = useState("inicio");
    /*
     * Controla o formulário de novos lançamentos financeiros.
     * Os dados permanecem temporariamente no navegador até a integração com o banco.
     */
    const [isFinancialEntryModalOpen, setIsFinancialEntryModalOpen] =
        useState(false);

    const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(
        [],
    );

    const [financialEntryForm, setFinancialEntryForm] = useState({
        type: "receita" as FinancialEntryType,
        description: "",
        category: "",
        amount: "",
        date: "",
    });

    const [financialEntryError, setFinancialEntryError] = useState("");
    const [financialEntryMessage, setFinancialEntryMessage] = useState("");
    /*
     * Controla o carregamento e os erros dos dados financeiros.
     */
    const [isLoadingFinancialEntries, setIsLoadingFinancialEntries] =
        useState(true);
    const [isSavingFinancialEntry, setIsSavingFinancialEntry] = useState(false);
    const [financialDataError, setFinancialDataError] = useState("");
    /*
     * Controla o processo de geração do relatório financeiro.
     */
    const [isExportingFinancialPdf, setIsExportingFinancialPdf] =
        useState(false);
    const [financialExportError, setFinancialExportError] = useState("");
    /*
     * Define o período apresentado no gráfico financeiro.
     * O valor representa a quantidade de dias considerados.
     */
    const [financialChartPeriod, setFinancialChartPeriod] =
        useState<FinancialChartPeriod>(30);
    /*
     * Armazena temporariamente o comprovante selecionado.
     * TODO: enviar o arquivo ao armazenamento seguro do servidor.
     */
    const [financialEntryAttachment, setFinancialEntryAttachment] =
        useState<File | null>(null);
    /*
     * Controla qual categoria das configurações está aberta.
     * As funções internas serão conectadas ao banco de dados futuramente.
     */
    const [settingsSection, setSettingsSection] = useState<
        "menu" | "perfil" | "preferencias" | "privacidade" | "conta"
    >("menu");
    /*
     * Armazena temporariamente a prévia da foto escolhida.
     * TODO: enviar e persistir o arquivo no armazenamento seguro do servidor.
     */
    const [profileImagePreview, setProfileImagePreview] = useState<
        string | null
    >(null);
    const [profileImageError, setProfileImageError] = useState("");
    /*
     * Exibe uma confirmação temporária após a validação do formulário.
     * TODO: substituir pela resposta real do servidor quando o perfil
     * estiver conectado ao banco de dados.
     */
    const [profileSaveMessage, setProfileSaveMessage] = useState("");
    /*
     * Mantém temporariamente as preferências escolhidas pelo usuário.
     * TODO: carregar e salvar estas opções no banco de dados
     * quando a integração com o perfil estiver disponível.
     */
    const [userPreferences, setUserPreferences] = useState({
        systemNotifications: true,
        emailNotifications: true,
        documentNotifications: true,
    });

    const [preferencesSaveMessage, setPreferencesSaveMessage] = useState("");
    /*
     * Controla qual opção interna das configurações da conta está aberta.
     * As funções de senha e exclusão permanecerão protegidas em telas separadas.
     */
    const [accountSection, setAccountSection] = useState<
        "menu" | "senha" | "exclusao"
    >("menu");

    /*
     * Controla temporariamente a visualização das senhas.
     * TODO: conectar a alteração de senha à autenticação do servidor.
     */
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    /*
     * Mantém os campos da alteração de senha somente no navegador.
     * TODO: validar a senha atual e salvar a nova senha pelo servidor.
     */
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [passwordSaveMessage, setPasswordSaveMessage] = useState("");
    const [passwordSaveError, setPasswordSaveError] = useState("");
    /*
     * Controla temporariamente o processo de solicitação de desativação da conta.
     * TODO: validar a senha, enviar o código por e-mail e registrar a solicitação
     * no banco de dados quando o sistema de autenticação estiver implementado.
     */
    const [accountDeletionPassword, setAccountDeletionPassword] = useState("");
    const [accountDeletionConfirmation, setAccountDeletionConfirmation] =
        useState(false);
    const [accountDeletionMessage, setAccountDeletionMessage] = useState("");
    const [accountDeletionError, setAccountDeletionError] = useState("");
    const profileImageInputRef = useRef<HTMLInputElement | null>(null);

    /*
     * Controla a rolagem das funções do menu lateral.
     * As setas aparecem somente quando existe conteúdo
     * escondido acima ou abaixo da área visível.
     */
    const sidebarNavRef = useRef<HTMLElement | null>(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const updateSidebarScroll = () => {
        const menu = sidebarNavRef.current;

        if (!menu) {
            return;
        }

        setCanScrollUp(menu.scrollTop > 1);

        setCanScrollDown(
            menu.scrollTop + menu.clientHeight < menu.scrollHeight - 1,
        );
    };

    /*
     * Move o menu suavemente sem impedir a rolagem
     * pelo mouse, touchpad ou toque na tela.
     */
    const scrollSidebar = (direction: "up" | "down") => {
        sidebarNavRef.current?.scrollBy({
            top: direction === "down" ? 180 : -180,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        updateSidebarScroll();

        window.addEventListener("resize", updateSidebarScroll);

        return () => {
            window.removeEventListener("resize", updateSidebarScroll);
        };
    }, []);
    /*
     * Carrega do banco os lançamentos pertencentes ao usuário atual.
     */
    useEffect(() => {
        let isComponentMounted = true;

        const loadFinancialEntries = async () => {
            setFinancialDataError("");

            try {
                const response = await apiRequest<{
                    entries: FinancialEntry[];
                }>("/financial-entries");

                if (isComponentMounted) {
                    setFinancialEntries(response.entries);
                }
            } catch (error) {
                if (isComponentMounted) {
                    setFinancialDataError(
                        error instanceof ApiError
                            ? error.message
                            : "Não foi possível carregar os lançamentos.",
                    );
                }
            } finally {
                if (isComponentMounted) {
                    setIsLoadingFinancialEntries(false);
                }
            }
        };

        void loadFinancialEntries();

        return () => {
            isComponentMounted = false;
        };
    }, []);
    /*
     * Controla a largura do menu lateral.
     * Quando verdadeiro, apenas os ícones das funcionalidades permanecem visíveis.
     */
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    /*
     * Controla a abertura do menu em celulares e tablets.
     * Em telas grandes, o menu lateral permanente continua sendo utilizado.
     */
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    /*
     * Valida e registra temporariamente um lançamento financeiro.
     * TODO: enviar o lançamento ao servidor quando o banco estiver conectado.
     */
    /*
     * Valida o formulário e salva o lançamento no Laravel.
     */
    const handleFinancialEntrySubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const amount = parseCurrencyInput(financialEntryForm.amount);

        if (
            !financialEntryForm.description.trim() ||
            !financialEntryForm.category.trim() ||
            !financialEntryForm.date ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            setFinancialEntryError(
                "Preencha todos os campos e informe um valor maior que zero.",
            );
            return;
        }

        setFinancialEntryError("");
        setFinancialDataError("");
        setFinancialEntryMessage("");
        setIsSavingFinancialEntry(true);

        try {
            /*
             * FormData permite enviar os campos e o comprovante
             * na mesma requisição.
             */
            const requestData = new FormData();

            requestData.append("type", financialEntryForm.type);
            requestData.append(
                "description",
                financialEntryForm.description.trim(),
            );
            requestData.append("category", financialEntryForm.category.trim());
            requestData.append("amount", amount.toFixed(2));
            requestData.append("date", financialEntryForm.date);

            if (financialEntryAttachment) {
                requestData.append("attachment", financialEntryAttachment);
            }

            const response = await apiRequest<{
                message: string;
                entry: FinancialEntry;
            }>("/financial-entries", {
                method: "POST",
                body: requestData,
            });

            /*
             * O painel recebe o lançamento já salvo e identificado pelo banco.
             */
            setFinancialEntries((currentEntries) => [
                response.entry,
                ...currentEntries,
            ]);

            setFinancialEntryForm({
                type: "receita",
                description: "",
                category: "",
                amount: "",
                date: "",
            });

            setFinancialEntryAttachment(null);
            setFinancialEntryMessage(response.message);
            setIsFinancialEntryModalOpen(false);
        } catch (error) {
            if (error instanceof ApiError) {
                const firstValidationError = Object.values(
                    error.errors,
                ).flat()[0];

                setFinancialEntryError(firstValidationError ?? error.message);
            } else {
                setFinancialEntryError("Não foi possível salvar o lançamento.");
            }
        } finally {
            setIsSavingFinancialEntry(false);
        }
    };
    /*
     * Calcula automaticamente o resumo com base nos lançamentos cadastrados.
     * Transferências e ajustes permanecem neutros nesta etapa.
     */
    const financialSummary = financialEntries.reduce(
        (summary, entry) => {
            if (entry.type === "receita") {
                summary.revenue += entry.amount;
            }

            if (entry.type === "despesa") {
                summary.expenses += entry.amount;
            }

            return summary;
        },
        {
            revenue: 0,
            expenses: 0,
        },
    );

    const financialBalance =
        financialSummary.revenue - financialSummary.expenses;
    /*
     * Agrupa receitas e despesas pela data do lançamento.
     * Transferências e ajustes não entram no gráfico nesta etapa.
     */
    /*
     * Filtra os lançamentos pelo período escolhido e agrupa os valores.
     * Períodos de até 30 dias são agrupados por dia.
     * Períodos maiores são agrupados por mês.
     */
    /*
     * Monta um período contínuo para o gráfico.
     * O intervalo termina hoje ou na data futura mais recente cadastrada.
     */
    const financialChartData = (() => {
        const chartEntries = financialEntries.filter(
            (entry) => entry.type === "receita" || entry.type === "despesa",
        );

        const today = new Date();

        today.setHours(23, 59, 59, 999);

        const referenceDate = chartEntries.reduce((latestDate, entry) => {
            const [year, month, day] = entry.date.split("-").map(Number);

            const entryDate = new Date(year, month - 1, day);

            return entryDate > latestDate ? entryDate : latestDate;
        }, new Date(today));

        referenceDate.setHours(23, 59, 59, 999);

        const groupByMonth = financialChartPeriod >= 90;

        const groupedEntries: Record<
            string,
            {
                date: string;
                label: string;
                receitas: number;
                despesas: number;
            }
        > = {};

        let periodStart: Date;

        if (groupByMonth) {
            const monthCount =
                financialChartPeriod === 90
                    ? 3
                    : financialChartPeriod === 180
                      ? 6
                      : 12;

            periodStart = new Date(
                referenceDate.getFullYear(),
                referenceDate.getMonth() - (monthCount - 1),
                1,
            );

            const currentMonth = new Date(periodStart);

            while (currentMonth <= referenceDate) {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth() + 1;
                const key = `${year}-${String(month).padStart(2, "0")}`;

                groupedEntries[key] = {
                    date: key,
                    label: `${String(month).padStart(2, "0")}/${String(
                        year,
                    ).slice(-2)}`,
                    receitas: 0,
                    despesas: 0,
                };

                currentMonth.setMonth(currentMonth.getMonth() + 1);
            }
        } else {
            periodStart = new Date(referenceDate);

            periodStart.setHours(0, 0, 0, 0);
            periodStart.setDate(
                periodStart.getDate() - (financialChartPeriod - 1),
            );

            const currentDay = new Date(periodStart);

            while (currentDay <= referenceDate) {
                const year = currentDay.getFullYear();
                const month = currentDay.getMonth() + 1;
                const day = currentDay.getDate();

                const key = `${year}-${String(month).padStart(
                    2,
                    "0",
                )}-${String(day).padStart(2, "0")}`;

                groupedEntries[key] = {
                    date: key,
                    label: `${String(day).padStart(2, "0")}/${String(
                        month,
                    ).padStart(2, "0")}`,
                    receitas: 0,
                    despesas: 0,
                };

                currentDay.setDate(currentDay.getDate() + 1);
            }
        }

        chartEntries.forEach((entry) => {
            const [year, month, day] = entry.date.split("-").map(Number);

            const entryDate = new Date(year, month - 1, day);

            if (entryDate < periodStart || entryDate > referenceDate) {
                return;
            }

            const groupKey = groupByMonth
                ? `${year}-${String(month).padStart(2, "0")}`
                : entry.date;

            const chartGroup = groupedEntries[groupKey];

            if (!chartGroup) {
                return;
            }

            if (entry.type === "receita") {
                chartGroup.receitas += entry.amount;
            }

            if (entry.type === "despesa") {
                chartGroup.despesas += entry.amount;
            }
        });

        return Object.values(groupedEntries);
    })();
    /*
     * Abre temporariamente o anexo selecionado em uma nova guia.
     */
    /*
     * Abre o comprovante protegido utilizando a rota do Laravel.
     */
    const handleOpenFinancialAttachment = (attachment: FinancialAttachment) => {
        window.open(attachment.url, "_blank", "noopener,noreferrer");
    };

    /*
     * Exclui um lançamento após a confirmação do usuário.
     * TODO: realizar a exclusão também no servidor.
     */
    /*
     * Exclui o lançamento do banco e depois atualiza o painel.
     */
    const handleDeleteFinancialEntry = async (entry: FinancialEntry) => {
        const confirmed = window.confirm(
            `Deseja excluir o lançamento "${entry.description}"?`,
        );

        if (!confirmed) {
            return;
        }

        setFinancialDataError("");

        try {
            const response = await apiRequest<{
                message: string;
            }>(`/financial-entries/${entry.id}`, {
                method: "DELETE",
            });

            setFinancialEntries((currentEntries) =>
                currentEntries.filter(
                    (currentEntry) => currentEntry.id !== entry.id,
                ),
            );

            setFinancialEntryMessage(response.message);
        } catch (error) {
            setFinancialDataError(
                error instanceof ApiError
                    ? error.message
                    : "Não foi possível excluir o lançamento.",
            );
        }
    };
    /*
     * Gera um relatório em PDF considerando o período selecionado no gráfico.
     * Os pacotes são carregados apenas quando o usuário solicita a exportação.
     */
    const handleExportFinancialPdf = async () => {
        setFinancialExportError("");
        setFinancialEntryMessage("");

        /*
         * Usa as mesmas datas apresentadas no gráfico para filtrar o relatório.
         */
        const visiblePeriodKeys = new Set(
            financialChartData.map((item) => item.date),
        );

        const reportEntries = financialEntries
            .filter((entry) => {
                const entryPeriodKey =
                    financialChartPeriod >= 90
                        ? entry.date.slice(0, 7)
                        : entry.date;

                return visiblePeriodKeys.has(entryPeriodKey);
            })
            .sort((firstEntry, secondEntry) =>
                secondEntry.date.localeCompare(firstEntry.date),
            );

        if (reportEntries.length === 0) {
            setFinancialExportError(
                "Não existem lançamentos no período selecionado para exportar.",
            );
            return;
        }

        setIsExportingFinancialPdf(true);

        try {
            const [{ jsPDF }, { autoTable }] = await Promise.all([
                import("jspdf"),
                import("jspdf-autotable"),
            ]);

            const periodLabels: Record<FinancialChartPeriod, string> = {
                1: "1 dia",
                7: "1 semana",
                15: "15 dias",
                30: "1 mês",
                90: "3 meses",
                180: "6 meses",
                365: "12 meses",
            };

            const reportSummary = reportEntries.reduce(
                (summary, entry) => {
                    if (entry.type === "receita") {
                        summary.revenue += entry.amount;
                    }

                    if (entry.type === "despesa") {
                        summary.expenses += entry.amount;
                    }

                    return summary;
                },
                {
                    revenue: 0,
                    expenses: 0,
                },
            );

            const reportBalance =
                reportSummary.revenue - reportSummary.expenses;

            const document = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = document.internal.pageSize.getWidth();

            /*
             * Cabeçalho do relatório.
             */
            document.setFillColor(12, 68, 124);
            document.rect(0, 0, pageWidth, 28, "F");

            document.setTextColor(255, 255, 255);
            document.setFont("helvetica", "bold");
            document.setFontSize(11);
            document.text("WebContabil", 14, 11);

            document.setFontSize(17);
            document.text("Relatório financeiro", 14, 21);

            /*
             * Informações do relatório.
             */
            document.setTextColor(40, 50, 65);
            document.setFont("helvetica", "normal");
            document.setFontSize(9);

            document.text(`Cliente: ${user.name}`, 14, 37);
            document.text(
                `Período selecionado: ${periodLabels[financialChartPeriod]}`,
                14,
                43,
            );

            document.text(
                `Emitido em: ${new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                }).format(new Date())}`,
                14,
                49,
            );

            /*
             * Resumo financeiro.
             */
            document.setFont("helvetica", "bold");
            document.setFontSize(9);

            document.setTextColor(5, 150, 105);
            document.text(
                `Receitas: ${formatCurrencyValue(reportSummary.revenue)}`,
                105,
                38,
            );

            document.setTextColor(220, 38, 38);
            document.text(
                `Despesas: ${formatCurrencyValue(reportSummary.expenses)}`,
                105,
                45,
            );

            document.setTextColor(
                reportBalance >= 0 ? 5 : 220,
                reportBalance >= 0 ? 150 : 38,
                reportBalance >= 0 ? 105 : 38,
            );

            document.text(
                `Saldo: ${formatCurrencyValue(reportBalance)}`,
                190,
                38,
            );

            document.setTextColor(40, 50, 65);
            document.text(`Lançamentos: ${reportEntries.length}`, 190, 45);

            /*
             * Tabela de movimentações.
             */
            autoTable(document, {
                startY: 58,
                head: [
                    [
                        "Data",
                        "Tipo",
                        "Categoria",
                        "Descrição",
                        "Valor",
                        "Anexo",
                    ],
                ],
                body: reportEntries.map((entry) => {
                    const valuePrefix =
                        entry.type === "receita"
                            ? "+"
                            : entry.type === "despesa"
                              ? "-"
                              : "";

                    return [
                        formatFinancialDate(entry.date),
                        financialTypeLabels[entry.type],
                        financialCategoryLabels[entry.category] ??
                            entry.category,
                        entry.description,
                        `${valuePrefix}${formatCurrencyValue(entry.amount)}`,
                        entry.attachment?.name ?? "Sem anexo",
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
                didParseCell: (tableData) => {
                    if (
                        tableData.section !== "body" ||
                        tableData.column.index !== 4
                    ) {
                        return;
                    }

                    const entry = reportEntries[tableData.row.index];

                    if (entry?.type === "receita") {
                        tableData.cell.styles.textColor = [5, 150, 105];
                        tableData.cell.styles.fontStyle = "bold";
                    }

                    if (entry?.type === "despesa") {
                        tableData.cell.styles.textColor = [220, 38, 38];
                        tableData.cell.styles.fontStyle = "bold";
                    }
                },
            });

            /*
             * Adiciona numeração em todas as páginas geradas.
             */
            const pageCount = document.getNumberOfPages();

            for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
                document.setPage(pageNumber);

                const pageHeight = document.internal.pageSize.getHeight();

                document.setFont("helvetica", "normal");
                document.setFontSize(8);
                document.setTextColor(100, 110, 125);

                document.text(
                    `Página ${pageNumber} de ${pageCount}`,
                    pageWidth - 14,
                    pageHeight - 8,
                    {
                        align: "right",
                    },
                );
            }

            const currentDate = new Date().toISOString().slice(0, 10);

            document.save(`relatorio-financeiro-${currentDate}.pdf`);

            setFinancialEntryMessage(
                "Relatório financeiro exportado com sucesso.",
            );
        } catch (error) {
            console.error("Erro ao gerar o relatório financeiro:", error);

            setFinancialExportError(
                "Não foi possível gerar o relatório financeiro.",
            );
        } finally {
            setIsExportingFinancialPdf(false);
        }
    };
    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <aside
                className={cn(
                    /*
                     * O menu altera somente a própria largura.
                     * O conteúdo principal utiliza flex-grow e ocupa automaticamente
                     * todo o espaço liberado quando o menu é recolhido.
                     */
                    "hidden lg:flex shrink-0 flex-col bg-white/5 backdrop-blur-2xl",
                    "border-r border-white/10 transition-[width] duration-300",
                    isSidebarCollapsed ? "w-24" : "w-72",
                )}
            >
                <div
                    className={cn(
                        "min-h-24 px-5 flex items-center border-b border-white/5",
                        isSidebarCollapsed
                            ? "justify-center"
                            : "justify-between gap-3",
                    )}
                >
                    <div
                        className={cn(
                            "flex items-center min-w-0",
                            isSidebarCollapsed ? "justify-center" : "gap-3",
                        )}
                    >
                        <BrandLogo
                            size="client"
                            className="shadow-lg shadow-brand/40"
                        />

                        {!isSidebarCollapsed && (
                            <span
                                className="font-bold text-xl tracking-tighter
                               text-white whitespace-nowrap"
                            >
                                WebContabil
                            </span>
                        )}
                    </div>

                    {!isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(true)}
                            className="w-10 h-10 shrink-0 rounded-xl
                           flex items-center justify-center
                           text-white/40 hover:text-brand
                           hover:bg-white/5 transition-colors"
                            aria-label="Recolher menu lateral"
                            title="Recolher menu"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isSidebarCollapsed && (
                    <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="mx-auto mt-4 w-11 h-11 rounded-xl
                       flex items-center justify-center
                       text-white/40 hover:text-brand
                       hover:bg-white/5 transition-colors"
                        aria-label="Expandir menu lateral"
                        title="Expandir menu"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </button>
                )}
                <div className="relative flex-grow min-h-0 py-8">
                    <nav
                        ref={sidebarNavRef}
                        onScroll={updateSidebarScroll}
                        className={cn(
                            "wc-sidebar-scroll h-full overflow-y-auto",
                            "space-y-2 py-6",
                            isSidebarCollapsed ? "px-3" : "px-6",
                        )}
                    >
                        {/*
                         * Funções principais disponíveis para o cliente.
                         * O conteúdo de cada aba será implementado separadamente.
                         */}
                        <SidebarItem
                            active={activeTab === "inicio"}
                            onClick={() => setActiveTab("inicio")}
                            icon={<LayoutDashboard className="w-5 h-5" />}
                            label="Início"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "servicos"}
                            onClick={() => setActiveTab("servicos")}
                            icon={<FileText className="w-5 h-5" />}
                            label="Serviços"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "documentos"}
                            onClick={() => setActiveTab("documentos")}
                            icon={<FolderOpen className="w-5 h-5" />}
                            label="Documentos"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "conversas"}
                            onClick={() => setActiveTab("conversas")}
                            icon={<MessageSquare className="w-5 h-5" />}
                            label="Conversas"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "agenda"}
                            onClick={() => setActiveTab("agenda")}
                            icon={<Calendar className="w-5 h-5" />}
                            label="Agenda Fiscal"
                            collapsed={isSidebarCollapsed}
                        />

                        <SidebarItem
                            active={activeTab === "financeiro"}
                            onClick={() => setActiveTab("financeiro")}
                            icon={<WalletCards className="w-5 h-5" />}
                            label="Financeiro"
                            collapsed={isSidebarCollapsed}
                        />

                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={activeTab === "configuracoes"}
                                onClick={() => {
                                    setActiveTab("configuracoes");
                                    setSettingsSection("menu");
                                }}
                                icon={<Settings className="w-5 h-5" />}
                                label="Configurações"
                                collapsed={isSidebarCollapsed}
                            />
                            <SidebarItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Sair do sistema"
                                collapsed={isSidebarCollapsed}
                                danger
                            />
                        </div>
                    </nav>

                    {canScrollUp && (
                        <button
                            type="button"
                            onClick={() => scrollSidebar("up")}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-10
                                       w-8 h-8 rounded-full
                                       flex items-center justify-center
                                       bg-slate-950/40 backdrop-blur-md
                                       text-white/60 hover:text-white
                                       hover:bg-slate-950/70
                                       transition-all"
                            aria-label="Exibir funções anteriores"
                            title="Subir no menu"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}

                    {canScrollDown && (
                        <button
                            type="button"
                            onClick={() => scrollSidebar("down")}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10
                                       w-8 h-8 rounded-full
                                       flex items-center justify-center
                                       bg-slate-950/40 backdrop-blur-md
                                       text-white/60 hover:text-white
                                       hover:bg-slate-950/70
                                       transition-all"
                            aria-label="Exibir mais funções"
                            title="Descer no menu"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </aside>

            {/*
             * Menu móvel do painel do cliente.
             * O fundo escurecido fecha o menu quando o usuário toca fora do painel.
             */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Fechar menu lateral"
                    />

                    <aside
                        className="relative z-10 w-[min(20rem,88vw)] h-full
                       flex flex-col bg-slate-900
                       border-r border-white/10 shadow-2xl"
                        aria-label="Menu do painel do cliente"
                    >
                        <div
                            className="min-h-24 px-5 flex items-center
                           justify-between gap-3
                           border-b border-white/10"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <BrandLogo
                                    size="client"
                                    className="shadow-lg shadow-brand/40"
                                />

                                <span
                                    className="font-bold text-xl tracking-tighter
                                   text-white whitespace-nowrap"
                                >
                                    WebContabil
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-11 h-11 shrink-0 rounded-xl
                               flex items-center justify-center
                               text-white/50 hover:text-brand
                               hover:bg-white/5 transition-colors"
                                aria-label="Fechar menu lateral"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-grow overflow-y-auto px-5 py-6 space-y-2">
                            <SidebarItem
                                active={activeTab === "inicio"}
                                onClick={() => {
                                    setActiveTab("inicio");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="Dashboard"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "servicos"}
                                onClick={() => {
                                    setActiveTab("servicos");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<FileText className="w-5 h-5" />}
                                label="Planos & Serviços"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "agenda"}
                                onClick={() => {
                                    setActiveTab("agenda");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<Calendar className="w-5 h-5" />}
                                label="Agenda Fiscal"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={activeTab === "gestao"}
                                onClick={() => {
                                    setActiveTab("gestao");
                                    setIsMobileMenuOpen(false);
                                }}
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                label="Gestão de Tarefas"
                                collapsed={false}
                            />
                        </nav>

                        <div className="p-5 border-t border-white/10 space-y-2">
                            <SidebarItem
                                active={false}
                                onClick={() => setIsMobileMenuOpen(false)}
                                icon={<Settings className="w-5 h-5" />}
                                label="Configurações e preferências"
                                collapsed={false}
                            />

                            <SidebarItem
                                active={false}
                                onClick={onLogout}
                                icon={<LogOut className="w-5 h-5" />}
                                label="Encerrar Sessão"
                                collapsed={false}
                                danger
                            />
                        </div>
                    </aside>
                </div>
            )}

            <main className="min-w-0 flex-grow flex flex-col overflow-x-hidden overflow-y-auto">
                {" "}
                {/*
                 * O cabeçalho utiliza altura mínima e espaçamento fluido para manter
                 * os elementos confortáveis em notebooks e monitores maiores.
                 */}
                <header
                    className="min-h-24 bg-white/5 backdrop-blur-md
               border-b border-white/10 flex flex-wrap
               items-center justify-between gap-4
               px-4 sm:px-6 xl:px-10 py-3
               sticky top-0 z-10"
                >
                    <div
                        className="flex items-center gap-4 bg-white/5
               px-4 sm:px-5 py-3 rounded-2xl
               border border-white/5 backdrop-blur-sm
               w-full sm:w-auto sm:min-w-72"
                    >
                        <Search className="w-4 h-4 text-white/20" />
                        <input
                            placeholder="Buscar notas, relatórios..."
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                        />
                    </div>

                    <div
                        className="flex items-center justify-end
               gap-3 sm:gap-5 xl:gap-8
               w-full sm:w-auto"
                    >
                        {/*
                         * Em celulares e tablets, abre a versão móvel do menu lateral.
                         */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-11 h-11 shrink-0 rounded-xl
               border border-white/10 bg-white/5
               flex items-center justify-center
               text-white hover:text-brand transition-colors"
                            aria-label="Abrir menu lateral"
                            title="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <ThemeToggle />

                        <button className="relative p-2 text-white/40 hover:text-brand transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-slate-900 shadow-lg shadow-brand/20"></span>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white tracking-tight">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase mt-0.5">
                                    {user.razaoSocial}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-brand font-black text-lg shadow-xl">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>
                {/*
                 * Exibe a tela de configurações separadamente do painel inicial.
                 * As funções serão conectadas ao banco de dados em uma etapa futura.
                 */}
                {activeTab === "configuracoes" &&
                    settingsSection === "menu" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <div className="mb-8">
                                <p className="text-brand font-bold text-xs uppercase tracking-[0.2em] mb-2">
                                    Gestão da conta
                                </p>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    Configurações e preferências
                                </h1>

                                <p className="text-white/50 font-medium mt-2 max-w-2xl">
                                    Gerencie seus dados pessoais, preferências,
                                    privacidade e opções de segurança da conta.
                                </p>
                            </div>
                            {/*
                             * Organiza as configurações em categorias.
                             * Cada categoria receberá suas funções em etapas separadas.
                             */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <button
                                    type="button"
                                    onClick={() => setSettingsSection("perfil")}
                                    className="group p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-brand/40"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                                            <UserRound className="w-6 h-6" />
                                        </div>

                                        <div className="flex-grow">
                                            <h2 className="text-lg font-bold text-white">
                                                Perfil
                                            </h2>
                                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                Atualize sua foto e seus dados
                                                pessoais.
                                            </p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettingsSection("preferencias")
                                    }
                                    className="group p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-brand/40"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                                            <SlidersHorizontal className="w-6 h-6" />
                                        </div>

                                        <div className="flex-grow">
                                            <h2 className="text-lg font-bold text-white">
                                                Preferências
                                            </h2>
                                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                Personalize tema, notificações e
                                                exibição.
                                            </p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettingsSection("privacidade")
                                    }
                                    className="group p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-brand/40"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>

                                        <div className="flex-grow">
                                            <h2 className="text-lg font-bold text-white">
                                                Privacidade
                                            </h2>
                                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                Consulte dados, consentimentos e
                                                direitos de privacidade.
                                            </p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSettingsSection("conta")}
                                    className="group p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-brand/40"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                                            <KeyRound className="w-6 h-6" />
                                        </div>

                                        <div className="flex-grow">
                                            <h2 className="text-lg font-bold text-white">
                                                Configurações da conta
                                            </h2>
                                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                Gerencie senha, segurança e
                                                situação da conta.
                                            </p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                                    </div>
                                </button>
                            </div>
                        </section>
                    )}
                {/*
                 * Exibe a área de perfil dentro das configurações.
                 * TODO: conectar edição, upload da foto e salvamento ao banco de dados.
                 */}
                {activeTab === "configuracoes" &&
                    settingsSection === "perfil" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <button
                                type="button"
                                onClick={() => setSettingsSection("menu")}
                                className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors hover:text-brand"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                                Voltar para configurações
                            </button>

                            <div className="mb-8">
                                <p className="text-brand font-bold text-xs uppercase tracking-[0.2em] mb-2">
                                    Dados pessoais
                                </p>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    Perfil
                                </h1>

                                <p className="text-white/50 font-medium mt-2 max-w-2xl">
                                    Atualize sua foto e as informações
                                    utilizadas para identificar sua conta.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-[18rem_1fr] gap-6">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                                    <div
                                        className="
        mx-auto h-24 w-24 overflow-hidden rounded-3xl
        bg-brand/10 text-brand
        flex items-center justify-center
    "
                                    >
                                        {profileImagePreview ? (
                                            <img
                                                src={profileImagePreview}
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
                                        Utilize uma imagem nítida para facilitar
                                        sua identificação.
                                    </p>

                                    {/*
                                     * Campo oculto responsável por abrir o seletor de imagens.
                                     * TODO: enviar e armazenar a foto no servidor quando o backend for implementado.
                                     */}
                                    <input
                                        ref={profileImageInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0];

                                            if (!file) {
                                                return;
                                            }

                                            const allowedTypes = [
                                                "image/png",
                                                "image/jpeg",
                                                "image/webp",
                                            ];
                                            const maxSizeInBytes =
                                                5 * 1024 * 1024;

                                            if (
                                                !allowedTypes.includes(
                                                    file.type,
                                                )
                                            ) {
                                                setProfileImageError(
                                                    "Selecione uma imagem PNG, JPG ou WebP.",
                                                );
                                                event.target.value = "";
                                                return;
                                            }

                                            if (file.size > maxSizeInBytes) {
                                                setProfileImageError(
                                                    "A imagem deve possuir no máximo 5 MB.",
                                                );
                                                event.target.value = "";
                                                return;
                                            }

                                            setProfileImageError("");

                                            const reader = new FileReader();

                                            reader.onload = () => {
                                                if (
                                                    typeof reader.result ===
                                                    "string"
                                                ) {
                                                    setProfileImagePreview(
                                                        reader.result,
                                                    );
                                                }
                                            };

                                            reader.readAsDataURL(file);
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            profileImageInputRef.current?.click()
                                        }
                                        className="w-full rounded-xl bg-brand px-5 py-3 font-bold text-slate-950 transition-all hover:brightness-110"
                                    >
                                        Alterar foto
                                    </button>

                                    {profileImageError && (
                                        <p
                                            className="text-sm font-semibold text-red-400"
                                            role="alert"
                                        >
                                            {profileImageError}
                                        </p>
                                    )}
                                </div>

                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();

                                        /*
                                         * Executa as validações nativas definidas nos campos.
                                         * TODO: enviar os dados e a foto ao servidor após a
                                         * integração com o banco de dados.
                                         */
                                        if (
                                            !event.currentTarget.checkValidity()
                                        ) {
                                            event.currentTarget.reportValidity();
                                            return;
                                        }

                                        setProfileSaveMessage(
                                            "Alterações validadas. O salvamento definitivo será conectado ao servidor.",
                                        );
                                        /*
                                         * Remove automaticamente a confirmação para não manter
                                         * uma mensagem antiga permanentemente na interface.
                                         */
                                        window.setTimeout(() => {
                                            setProfileSaveMessage("");
                                        }, 4000);
                                    }}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
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
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
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
                                                    const input =
                                                        event.currentTarget;
                                                    const digits = input.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 11);

                                                    input.value =
                                                        digits.length <= 10
                                                            ? digits
                                                                  .replace(
                                                                      /^(\d{2})(\d)/,
                                                                      "($1) $2",
                                                                  )
                                                                  .replace(
                                                                      /(\d{4})(\d)/,
                                                                      "$1-$2",
                                                                  )
                                                            : digits
                                                                  .replace(
                                                                      /^(\d{2})(\d)/,
                                                                      "($1) $2",
                                                                  )
                                                                  .replace(
                                                                      /(\d{5})(\d)/,
                                                                      "$1-$2",
                                                                  );
                                                }}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
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
                                                    const input =
                                                        event.currentTarget;
                                                    const digits = input.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 11);

                                                    input.value = digits
                                                        .replace(
                                                            /(\d{3})(\d)/,
                                                            "$1.$2",
                                                        )
                                                        .replace(
                                                            /(\d{3})(\d)/,
                                                            "$1.$2",
                                                        )
                                                        .replace(
                                                            /(\d{3})(\d{1,2})$/,
                                                            "$1-$2",
                                                        );
                                                }}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
                                            />
                                        </label>
                                    </div>

                                    <div className="md:col-span-2 mt-2 flex flex-col gap-4">
                                        {profileSaveMessage && (
                                            <p
                                                className="
                w-full rounded-xl border border-emerald-500/30
                bg-emerald-500/10 px-4 py-3
                text-sm font-semibold text-emerald-500
            "
                                                role="status"
                                                aria-live="polite"
                                            >
                                                {profileSaveMessage}
                                            </p>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="
                w-full rounded-xl bg-brand px-6 py-3
                font-bold text-slate-950
                transition-all duration-200
                hover:brightness-110 hover:shadow-lg
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-brand
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
                    )}
                {activeTab === "configuracoes" &&
                    settingsSection === "preferencias" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <button
                                type="button"
                                onClick={() => setSettingsSection("menu")}
                                className="
                    mb-7 inline-flex items-center gap-2
                    font-semibold text-white/70
                    transition-colors hover:text-brand
                "
                            >
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                Voltar para configurações
                            </button>

                            <header className="mb-8">
                                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                    Personalização
                                </p>

                                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                    Preferências
                                </h1>

                                <p className="mt-2 max-w-2xl font-medium text-white/50">
                                    Personalize a aparência e escolha quais
                                    avisos deseja receber.
                                </p>
                            </header>

                            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                                {/*
                                 * Utiliza o seletor de tema já existente no sistema.
                                 * A preferência visual é aplicada imediatamente.
                                 */}
                                <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-white">
                                            Aparência
                                        </h2>

                                        <p className="mt-1 text-sm leading-relaxed text-white/50">
                                            Escolha o tema mais confortável para
                                            utilizar a plataforma.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
                                        <div>
                                            <p className="font-bold text-white">
                                                Tema da plataforma
                                            </p>

                                            <p className="mt-1 text-sm text-white/50">
                                                Alterne entre os modos claro e
                                                escuro.
                                            </p>
                                        </div>

                                        <ThemeToggle />
                                    </div>
                                </article>

                                {/*
                                 * As opções abaixo são mantidas temporariamente no navegador.
                                 * TODO: carregar e salvar as preferências no banco de dados.
                                 */}
                                <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-white">
                                            Notificações
                                        </h2>

                                        <p className="mt-1 text-sm leading-relaxed text-white/50">
                                            Defina quais tipos de avisos deseja
                                            receber.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                key: "systemNotifications" as const,
                                                title: "Notificações do sistema",
                                                description:
                                                    "Avisos sobre atividades, prazos e atualizações.",
                                            },
                                            {
                                                key: "emailNotifications" as const,
                                                title: "Notificações por e-mail",
                                                description:
                                                    "Receba informações importantes no e-mail cadastrado.",
                                            },
                                            {
                                                key: "documentNotifications" as const,
                                                title: "Avisos sobre documentos",
                                                description:
                                                    "Seja avisado sobre novos arquivos, pedidos e entregas.",
                                            },
                                        ].map((preference) => {
                                            const isEnabled =
                                                userPreferences[preference.key];

                                            return (
                                                <div
                                                    key={preference.key}
                                                    className="
                                        flex items-center justify-between
                                        gap-4 rounded-2xl bg-white/5 p-4
                                    "
                                                >
                                                    <div>
                                                        <p className="font-bold text-white">
                                                            {preference.title}
                                                        </p>

                                                        <p className="mt-1 text-sm leading-relaxed text-white/50">
                                                            {
                                                                preference.description
                                                            }
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={isEnabled}
                                                        aria-label={
                                                            preference.title
                                                        }
                                                        onClick={() => {
                                                            setUserPreferences(
                                                                (current) => ({
                                                                    ...current,
                                                                    [preference.key]:
                                                                        !isEnabled,
                                                                }),
                                                            );

                                                            setPreferencesSaveMessage(
                                                                "",
                                                            );
                                                        }}
                                                        className={cn(
                                                            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                                                            isEnabled
                                                                ? "bg-brand"
                                                                : "bg-white/20",
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform",
                                                                isEnabled
                                                                    ? "translate-x-5"
                                                                    : "translate-x-0",
                                                            )}
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </article>
                            </div>

                            <div className="mt-6 flex flex-col items-end gap-3">
                                {preferencesSaveMessage && (
                                    <p
                                        className="
                            w-full rounded-xl border border-emerald-500/30
                            bg-emerald-500/10 px-4 py-3
                            text-sm font-semibold text-emerald-500
                        "
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {preferencesSaveMessage}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        /*
                                         * Confirma apenas a validação local nesta etapa.
                                         * TODO: persistir as preferências no banco de dados.
                                         */
                                        setPreferencesSaveMessage(
                                            "Preferências validadas. O salvamento definitivo será conectado ao servidor.",
                                        );

                                        window.setTimeout(() => {
                                            setPreferencesSaveMessage("");
                                        }, 4000);
                                    }}
                                    className="
                        w-full rounded-xl bg-brand px-6 py-3
                        font-bold text-slate-950
                        transition-all duration-200
                        hover:brightness-110 hover:shadow-lg
                        sm:w-auto sm:min-w-52
                    "
                                >
                                    Salvar preferências
                                </button>
                            </div>
                        </section>
                    )}
                {activeTab === "configuracoes" &&
                    settingsSection === "privacidade" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <div className="mx-auto max-w-5xl">
                                {/* Retorna ao menu principal das configurações. */}
                                <button
                                    type="button"
                                    onClick={() => setSettingsSection("menu")}
                                    className="
                        mb-8 inline-flex items-center gap-2
                        text-sm font-bold text-white/70
                        transition-colors hover:text-brand
                    "
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Voltar para configurações
                                </button>

                                <header className="mb-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                        Proteção de dados
                                    </p>

                                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                        Privacidade
                                    </h1>

                                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                                        Consulte informações sobre o tratamento
                                        de dados, seus direitos e os documentos
                                        legais da WebContabil.
                                    </p>
                                </header>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Direciona para a Política de Privacidade completa. */}
                                    <a
                                        href="/politica-de-privacidade"
                                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                        "
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                                            >
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <h2 className="text-lg font-bold text-white">
                                                    Política de Privacidade
                                                </h2>

                                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                                    Veja quais categorias de
                                                    dados poderão ser tratadas e
                                                    para quais finalidades.
                                                </p>
                                            </div>

                                            <ChevronRight
                                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                                            />
                                        </div>
                                    </a>

                                    {/* Direciona para os Termos de Uso da plataforma. */}
                                    <a
                                        href="/termos-de-uso"
                                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                        "
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                                            >
                                                <FileText className="h-6 w-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <h2 className="text-lg font-bold text-white">
                                                    Termos de Uso
                                                </h2>

                                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                                    Consulte as regras,
                                                    responsabilidades e
                                                    condições de utilização da
                                                    plataforma.
                                                </p>
                                            </div>

                                            <ChevronRight
                                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                                            />
                                        </div>
                                    </a>

                                    {/* Abre o texto oficial e integral da LGPD em uma nova guia. */}
                                    <a
                                        href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                            group rounded-3xl border border-white/10
                            bg-white/5 p-6 transition-all
                            hover:border-brand/40 hover:bg-white/10
                            md:col-span-2
                        "
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="
                                    flex h-12 w-12 shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-brand/10 text-brand
                                "
                                            >
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <h2 className="text-lg font-bold text-white">
                                                    Lei Geral de Proteção de
                                                    Dados
                                                </h2>

                                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                                    Acesse a versão oficial e
                                                    integral da Lei nº
                                                    13.709/2018 no portal do
                                                    Planalto.
                                                </p>
                                            </div>

                                            <ChevronRight
                                                className="
                                    mt-1 h-5 w-5 text-white/30
                                    transition-transform
                                    group-hover:translate-x-1
                                    group-hover:text-brand
                                "
                                            />
                                        </div>
                                    </a>
                                </div>

                                {/*
                                 * AVISO DE DESENVOLVIMENTO:
                                 * As solicitações relacionadas aos dados pessoais deverão ser
                                 * conectadas ao banco de dados, à autenticação e ao canal
                                 * oficial de privacidade quando esses recursos forem criados.
                                 */}
                                <div
                                    className="
                        mt-6 rounded-3xl border border-brand/30
                        bg-brand/10 p-5
                    "
                                >
                                    <p className="text-sm leading-relaxed text-white/70">
                                        <strong className="text-white">
                                            Versão em desenvolvimento:
                                        </strong>{" "}
                                        as funções para solicitar acesso,
                                        correção ou outras providências
                                        relacionadas aos dados serão
                                        implementadas com a integração do banco
                                        de dados e do canal oficial de
                                        privacidade.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                {activeTab === "configuracoes" &&
                    settingsSection === "conta" &&
                    accountSection === "menu" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <div className="mx-auto max-w-5xl">
                                <button
                                    type="button"
                                    onClick={() => setSettingsSection("menu")}
                                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-brand"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Voltar para configurações
                                </button>

                                <header className="mb-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                        Segurança da conta
                                    </p>
                                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                        Configurações da conta
                                    </h1>
                                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                                        Gerencie sua senha, segurança e situação
                                        da conta.
                                    </p>
                                </header>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAccountSection("senha")
                                        }
                                        className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-brand/40 hover:bg-white/10"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                                                <LockKeyhole className="h-6 w-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <h2 className="text-lg font-bold text-white">
                                                    Senha e segurança
                                                </h2>
                                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                                    Altere sua senha e consulte
                                                    as opções de proteção da
                                                    conta.
                                                </p>
                                            </div>

                                            <ChevronRight className="mt-1 h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAccountSection("exclusao")
                                        }
                                        className="group rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-left transition-all hover:border-red-500/50 hover:bg-red-500/10"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                                <Trash2 className="h-6 w-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <h2 className="text-lg font-bold text-white">
                                                    Situação da conta
                                                </h2>
                                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                                    Consulte as informações
                                                    antes de solicitar a
                                                    desativação da conta.
                                                </p>
                                            </div>

                                            <ChevronRight className="mt-1 h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-red-500" />
                                        </div>
                                    </button>
                                </div>

                                <div className="mt-6 rounded-3xl border border-brand/30 bg-brand/10 p-5">
                                    <p className="text-sm leading-relaxed text-white/70">
                                        <strong className="text-white">
                                            Versão em desenvolvimento:
                                        </strong>{" "}
                                        alterações de senha, códigos enviados
                                        por e-mail e solicitações relacionadas à
                                        conta serão conectados à autenticação e
                                        ao banco de dados futuramente.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                {activeTab === "configuracoes" &&
                    settingsSection === "conta" &&
                    accountSection === "senha" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <div className="mx-auto max-w-4xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAccountSection("menu");
                                        setPasswordSaveMessage("");
                                        setPasswordSaveError("");
                                    }}
                                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-brand"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Voltar para configurações da conta
                                </button>

                                <header className="mb-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                        Proteção da conta
                                    </p>

                                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                        Senha e segurança
                                    </h1>

                                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                                        Defina uma senha segura para proteger o
                                        acesso à sua conta.
                                    </p>
                                </header>

                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setPasswordSaveMessage("");
                                        setPasswordSaveError("");

                                        if (
                                            !currentPassword ||
                                            !newPassword ||
                                            !passwordConfirmation
                                        ) {
                                            setPasswordSaveError(
                                                "Preencha todos os campos.",
                                            );
                                            return;
                                        }

                                        if (newPassword.length < 8) {
                                            setPasswordSaveError(
                                                "A nova senha deve possuir pelo menos 8 caracteres.",
                                            );
                                            return;
                                        }

                                        if (
                                            newPassword !== passwordConfirmation
                                        ) {
                                            setPasswordSaveError(
                                                "A confirmação não corresponde à nova senha.",
                                            );
                                            return;
                                        }

                                        /*
                                         * TODO: validar a senha atual e salvar a nova senha pelo servidor.
                                         * Também será necessário invalidar sessões antigas e registrar
                                         * esta alteração no histórico de segurança da conta.
                                         */
                                        setPasswordSaveMessage(
                                            "Senha validada. A alteração definitiva será conectada ao servidor.",
                                        );
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setPasswordConfirmation("");
                                    }}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
                                >
                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="current-password"
                                                className="mb-2 block text-sm font-bold text-white"
                                            >
                                                Senha atual
                                            </label>

                                            <div className="relative">
                                                <input
                                                    id="current-password"
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={currentPassword}
                                                    onChange={(event) => {
                                                        setCurrentPassword(
                                                            event.target.value,
                                                        );
                                                        setPasswordSaveMessage(
                                                            "",
                                                        );
                                                        setPasswordSaveError(
                                                            "",
                                                        );
                                                    }}
                                                    maxLength={72}
                                                    autoComplete="current-password"
                                                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                                                    placeholder="Digite sua senha atual"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            (currentValue) =>
                                                                !currentValue,
                                                        )
                                                    }
                                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition-colors hover:text-brand"
                                                    aria-label={
                                                        showCurrentPassword
                                                            ? "Ocultar senha atual"
                                                            : "Exibir senha atual"
                                                    }
                                                    title={
                                                        showCurrentPassword
                                                            ? "Ocultar senha atual"
                                                            : "Exibir senha atual"
                                                    }
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="new-password"
                                                    className="mb-2 block text-sm font-bold text-white"
                                                >
                                                    Nova senha
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        id="new-password"
                                                        type={
                                                            showNewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={newPassword}
                                                        onChange={(event) => {
                                                            setNewPassword(
                                                                event.target
                                                                    .value,
                                                            );
                                                            setPasswordSaveMessage(
                                                                "",
                                                            );
                                                            setPasswordSaveError(
                                                                "",
                                                            );
                                                        }}
                                                        minLength={8}
                                                        maxLength={72}
                                                        autoComplete="new-password"
                                                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                                                        placeholder="Mínimo de 8 caracteres"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                (
                                                                    currentValue,
                                                                ) =>
                                                                    !currentValue,
                                                            )
                                                        }
                                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition-colors hover:text-brand"
                                                        aria-label={
                                                            showNewPassword
                                                                ? "Ocultar nova senha"
                                                                : "Exibir nova senha"
                                                        }
                                                        title={
                                                            showNewPassword
                                                                ? "Ocultar nova senha"
                                                                : "Exibir nova senha"
                                                        }
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="password-confirmation"
                                                    className="mb-2 block text-sm font-bold text-white"
                                                >
                                                    Confirmar nova senha
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        id="password-confirmation"
                                                        type={
                                                            showPasswordConfirmation
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            passwordConfirmation
                                                        }
                                                        onChange={(event) => {
                                                            setPasswordConfirmation(
                                                                event.target
                                                                    .value,
                                                            );
                                                            setPasswordSaveMessage(
                                                                "",
                                                            );
                                                            setPasswordSaveError(
                                                                "",
                                                            );
                                                        }}
                                                        minLength={8}
                                                        maxLength={72}
                                                        autoComplete="new-password"
                                                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                                                        placeholder="Digite novamente"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPasswordConfirmation(
                                                                (
                                                                    currentValue,
                                                                ) =>
                                                                    !currentValue,
                                                            )
                                                        }
                                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition-colors hover:text-brand"
                                                        aria-label={
                                                            showPasswordConfirmation
                                                                ? "Ocultar confirmação"
                                                                : "Exibir confirmação"
                                                        }
                                                        title={
                                                            showPasswordConfirmation
                                                                ? "Ocultar confirmação"
                                                                : "Exibir confirmação"
                                                        }
                                                    >
                                                        {showPasswordConfirmation ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4">
                                            <p className="text-sm leading-relaxed text-white/70">
                                                Use pelo menos 8 caracteres.
                                                Evite dados pessoais e senhas
                                                utilizadas em outros serviços.
                                            </p>
                                        </div>

                                        {passwordSaveError && (
                                            <div
                                                role="alert"
                                                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                                            >
                                                {passwordSaveError}
                                            </div>
                                        )}

                                        {passwordSaveMessage && (
                                            <div
                                                role="status"
                                                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400"
                                            >
                                                {passwordSaveMessage}
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="w-full rounded-2xl bg-brand px-6 py-3 font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                                            >
                                                Alterar senha
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                    )}
                {activeTab === "configuracoes" &&
                    settingsSection === "conta" &&
                    accountSection === "exclusao" && (
                        <section className="p-4 sm:p-6 xl:p-10">
                            <div className="mx-auto max-w-4xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAccountSection("menu");
                                        setAccountDeletionPassword("");
                                        setAccountDeletionConfirmation(false);
                                        setAccountDeletionMessage("");
                                        setAccountDeletionError("");
                                    }}
                                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-brand"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Voltar para configurações da conta
                                </button>
                                <header className="mb-8">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                        Situação da conta
                                    </p>

                                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                        Desativação da conta
                                    </h1>

                                    <p className="mt-2 max-w-3xl font-medium text-white/60">
                                        Consulte cuidadosamente as informações
                                        antes de solicitar a desativação da sua
                                        conta.
                                    </p>
                                </header>
                                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                Esta ação exige confirmação
                                            </h2>

                                            <p className="mt-2 leading-relaxed text-white/70">
                                                A solicitação não apagará
                                                imediatamente todas as
                                                informações. A conta será
                                                desativada, e os dados poderão
                                                ser mantidos durante os períodos
                                                necessários para o cumprimento
                                                de obrigações legais,
                                                regulatórias, fiscais e
                                                contábeis.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <form
                                    className="mt-6 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setAccountDeletionError("");
                                        setAccountDeletionMessage("");

                                        if (!accountDeletionPassword.trim()) {
                                            setAccountDeletionError(
                                                "Digite sua senha para continuar.",
                                            );
                                            return;
                                        }

                                        if (!accountDeletionConfirmation) {
                                            setAccountDeletionError(
                                                "Você precisa marcar a confirmação antes de continuar.",
                                            );
                                            return;
                                        }

                                        /*
                                         * TODO: quando o banco de dados e a autenticação forem implementados:
                                         * 1. validar a senha atual no servidor;
                                         * 2. enviar e validar o código recebido por e-mail;
                                         * 3. registrar a solicitação e a data da desativação;
                                         * 4. aplicar os prazos legais de retenção dos dados.
                                         */
                                        setAccountDeletionMessage(
                                            "Solicitação validada. A confirmação por e-mail e a desativação definitiva serão conectadas ao servidor futuramente.",
                                        );
                                    }}
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Confirme sua solicitação
                                        </h2>
                                        <p className="mt-2 leading-relaxed text-white/70">
                                            Antes de continuar, leia os
                                            documentos aplicáveis e confirme que
                                            compreendeu as consequências da
                                            desativação.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <a
                                            href="/termos-de-uso"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 font-bold text-brand transition-colors hover:bg-white/10"
                                        >
                                            Termos de Uso
                                            <ExternalLink className="h-4 w-4" />
                                        </a>

                                        <a
                                            href="/politica-de-privacidade"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 font-bold text-brand transition-colors hover:bg-white/10"
                                        >
                                            Política de Privacidade
                                            <ExternalLink className="h-4 w-4" />
                                        </a>

                                        <a
                                            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 font-bold text-brand transition-colors hover:bg-white/10"
                                        >
                                            LGPD na íntegra
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="account-deletion-password"
                                            className="mb-2 block text-sm font-bold text-white"
                                        >
                                            Confirme sua senha
                                        </label>

                                        <input
                                            id="account-deletion-password"
                                            type="password"
                                            value={accountDeletionPassword}
                                            onChange={(event) => {
                                                setAccountDeletionPassword(
                                                    event.target.value,
                                                );
                                                setAccountDeletionError("");
                                                setAccountDeletionMessage("");
                                            }}
                                            autoComplete="current-password"
                                            maxLength={128}
                                            placeholder="Digite sua senha atual"
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-400"
                                        />
                                    </div>

                                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <input
                                            type="checkbox"
                                            checked={
                                                accountDeletionConfirmation
                                            }
                                            onChange={(event) => {
                                                setAccountDeletionConfirmation(
                                                    event.target.checked,
                                                );
                                                setAccountDeletionError("");
                                                setAccountDeletionMessage("");
                                            }}
                                            className="mt-1 h-5 w-5 shrink-0 accent-brand"
                                        />

                                        <span className="leading-relaxed text-white/80">
                                            Confirmo que li os Termos de Uso, a
                                            Política de Privacidade e a LGPD.
                                            Estou ciente de que minha conta será
                                            desativada e de que determinados
                                            dados poderão ser mantidos durante
                                            os prazos exigidos por obrigações
                                            legais, regulatórias, fiscais e
                                            contábeis.
                                        </span>
                                    </label>

                                    {accountDeletionError && (
                                        <div
                                            role="alert"
                                            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                                        >
                                            {accountDeletionError}
                                        </div>
                                    )}

                                    {accountDeletionMessage && (
                                        <div
                                            role="status"
                                            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400"
                                        >
                                            {accountDeletionMessage}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={
                                                !accountDeletionPassword.trim() ||
                                                !accountDeletionConfirmation
                                            }
                                            className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                                        >
                                            Solicitar desativação da conta
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    )}
                {activeTab === "financeiro" && (
                    <section className="space-y-8 p-4 sm:p-6 xl:p-10">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                    Gestão financeira
                                </p>

                                <h1 className="text-4xl font-extrabold tracking-tighter text-white">
                                    Controle Financeiro
                                </h1>

                                <p className="mt-1 font-medium text-white/40">
                                    Acompanhe lançamentos, receitas, despesas e
                                    resultados.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleExportFinancialPdf()
                                    }
                                    disabled={isExportingFinancialPdf}
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                                >
                                    {isExportingFinancialPdf
                                        ? "Exportando..."
                                        : "Exportar PDF"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        /*
                                         * Abre a área financeira e apresenta o formulário
                                         * responsável por salvar o lançamento no banco.
                                         */
                                        setActiveTab("financeiro");
                                        setFinancialEntryError("");
                                        setFinancialEntryMessage("");
                                        setIsFinancialEntryModalOpen(true);
                                    }}
                                    className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/40"
                                >
                                    Novo Lançamento
                                </button>
                            </div>
                        </div>

                        {financialEntryMessage && (
                            <div
                                role="status"
                                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400"
                            >
                                {financialEntryMessage}
                            </div>
                        )}
                        {financialDataError && (
                            <div
                                role="alert"
                                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                            >
                                {financialDataError}
                            </div>
                        )}

                        {isLoadingFinancialEntries && (
                            <div
                                role="status"
                                className="rounded-2xl border border-brand/20 bg-brand/10 p-4 text-sm font-medium text-brand-light"
                            >
                                Carregando lançamentos financeiros...
                            </div>
                        )}
                        {financialExportError && (
                            <div
                                role="alert"
                                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                            >
                                {financialExportError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Resumo financeiro
                                </h2>

                                <p className="mt-1 text-sm text-white/40">
                                    Valores calculados a partir dos lançamentos
                                    cadastrados.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                <article className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-xl">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
                                            Receitas
                                        </p>

                                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                                    </div>

                                    <p
                                        className={cn(
                                            "whitespace-nowrap font-extrabold tracking-tight text-emerald-400 tabular-nums",
                                            getFinancialValueTextSize(
                                                financialSummary.revenue,
                                            ),
                                        )}
                                    >
                                        {formatCurrencyValue(
                                            financialSummary.revenue,
                                        )}
                                    </p>
                                </article>

                                <article className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-xl">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-400">
                                            Despesas
                                        </p>

                                        <WalletCards className="h-5 w-5 text-red-400" />
                                    </div>

                                    <p
                                        className={cn(
                                            "whitespace-nowrap font-extrabold tracking-tight text-red-400 tabular-nums",
                                            getFinancialValueTextSize(
                                                financialSummary.expenses,
                                            ),
                                        )}
                                    >
                                        {formatCurrencyValue(
                                            financialSummary.expenses,
                                        )}
                                    </p>
                                </article>

                                <article className="rounded-[28px] border border-brand/30 bg-brand/10 p-6 backdrop-blur-xl">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand">
                                            Saldo
                                        </p>

                                        <WalletCards className="h-5 w-5 text-brand" />
                                    </div>

                                    <p
                                        className={cn(
                                            "whitespace-nowrap font-extrabold tracking-tight tabular-nums",
                                            getFinancialValueTextSize(
                                                financialBalance,
                                            ),
                                            financialBalance >= 0
                                                ? "text-emerald-400"
                                                : "text-red-400",
                                        )}
                                    >
                                        {formatCurrencyValue(financialBalance)}
                                    </p>
                                </article>

                                <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                                            Lançamentos
                                        </p>

                                        <FileText className="h-5 w-5 text-brand" />
                                    </div>

                                    <p className="text-2xl font-extrabold text-white">
                                        {financialEntries.length}
                                    </p>
                                </article>
                            </div>

                            <p className="text-xs text-white/30">
                                Transferências e ajustes financeiros não alteram
                                o saldo nesta etapa.
                            </p>
                        </div>
                        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8">
                            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Fluxo financeiro
                                    </h2>

                                    <p className="mt-1 text-sm text-white/40">
                                        Comparação entre receitas e despesas no
                                        período selecionado.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <select
                                        value={financialChartPeriod}
                                        onChange={(event) =>
                                            setFinancialChartPeriod(
                                                Number(
                                                    event.target.value,
                                                ) as FinancialChartPeriod,
                                            )
                                        }
                                        aria-label="Selecionar período do gráfico"
                                        className="cursor-pointer rounded-xl border border-white/10 bg-[#1e2c42] px-4 py-2.5 text-sm font-bold text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                                    >
                                        <option
                                            className="bg-[#0f1f35]"
                                            value={1}
                                        >
                                            1 dia
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={7}
                                        >
                                            1 semana
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={15}
                                        >
                                            15 dias
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={30}
                                        >
                                            1 mês
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={90}
                                        >
                                            3 meses
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={180}
                                        >
                                            6 meses
                                        </option>

                                        <option
                                            className="bg-[#0f1f35]"
                                            value={365}
                                        >
                                            12 meses
                                        </option>
                                    </select>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                            Receitas
                                        </div>

                                        <div className="flex items-center gap-2 text-red-400">
                                            <span className="h-3 w-3 rounded-full bg-red-400" />
                                            Despesas
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {financialChartData.length === 0 ? (
                                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
                                    <BarChart className="h-9 w-9 text-white/20" />

                                    <p className="mt-3 text-sm font-medium text-white/40">
                                        Cadastre receitas ou despesas para
                                        visualizar o gráfico.
                                    </p>
                                </div>
                            ) : (
                                <div className="h-80 w-full min-w-0 overflow-hidden">
                                    {" "}
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                        minWidth={0}
                                    >
                                        <BarChart
                                            data={financialChartData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="4 4"
                                                vertical={false}
                                                stroke="rgba(148, 163, 184, 0.15)"
                                            />

                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: "#94a3b8",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                }}
                                            />

                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                width={70}
                                                tick={{
                                                    fill: "#94a3b8",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                }}
                                                tickFormatter={(value) =>
                                                    new Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                            notation: "compact",
                                                            maximumFractionDigits: 1,
                                                        },
                                                    ).format(Number(value))
                                                }
                                            />

                                            <Tooltip
                                                cursor={{
                                                    fill: "rgba(148, 163, 184, 0.08)",
                                                }}
                                                formatter={(value) =>
                                                    formatCurrencyValue(
                                                        Number(value),
                                                    )
                                                }
                                                labelFormatter={(label) =>
                                                    `Data: ${label}`
                                                }
                                                contentStyle={{
                                                    backgroundColor: "#0f1f35",
                                                    border: "1px solid rgba(148, 163, 184, 0.25)",
                                                    borderRadius: "16px",
                                                    color: "#ffffff",
                                                    boxShadow:
                                                        "0 20px 40px rgba(0, 0, 0, 0.35)",
                                                }}
                                                labelStyle={{
                                                    color: "#ffffff",
                                                    fontWeight: 700,
                                                }}
                                                itemStyle={{
                                                    color: "#f8fafc",
                                                    fontWeight: 600,
                                                }}
                                            />

                                            <Bar
                                                dataKey="receitas"
                                                name="Receitas"
                                                fill="#10b981"
                                                maxBarSize={48}
                                                shape={
                                                    <FinancialBarShape fillColor="#10b981" />
                                                }
                                            />

                                            <Bar
                                                dataKey="despesas"
                                                name="Despesas"
                                                fill="#f43f5e"
                                                maxBarSize={48}
                                                shape={
                                                    <FinancialBarShape fillColor="#f43f5e" />
                                                }
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </section>
                        <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    Movimentações recentes
                                </h2>

                                <p className="mt-1 text-sm text-white/40">
                                    Consulte os lançamentos cadastrados e seus
                                    documentos.
                                </p>
                            </div>

                            {financialEntries.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                    <FileText className="mx-auto h-8 w-8 text-white/20" />

                                    <p className="mt-3 text-sm font-medium text-white/40">
                                        Nenhuma movimentação cadastrada.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {financialEntries.map((entry) => {
                                        const isRevenue =
                                            entry.type === "receita";
                                        const isExpense =
                                            entry.type === "despesa";

                                        return (
                                            <article
                                                key={entry.id}
                                                className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10 lg:flex-row lg:items-center"
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                                                        isRevenue
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : isExpense
                                                              ? "bg-red-500/10 text-red-400"
                                                              : "bg-brand/10 text-brand",
                                                    )}
                                                >
                                                    <WalletCards className="h-6 w-6" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-bold text-white">
                                                            {entry.description}
                                                        </h3>

                                                        <span
                                                            className={cn(
                                                                "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                                isRevenue
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : isExpense
                                                                      ? "bg-red-500/10 text-red-400"
                                                                      : "bg-brand/10 text-brand",
                                                            )}
                                                        >
                                                            {
                                                                financialTypeLabels[
                                                                    entry.type
                                                                ]
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                                                        <span>
                                                            {financialCategoryLabels[
                                                                entry.category
                                                            ] ?? entry.category}
                                                        </span>

                                                        <span>
                                                            {formatFinancialDate(
                                                                entry.date,
                                                            )}
                                                        </span>

                                                        {entry.attachment && (
                                                            <span className="max-w-52 truncate text-brand">
                                                                {
                                                                    entry
                                                                        .attachment
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p
                                                    className={cn(
                                                        "shrink-0 text-lg font-extrabold",
                                                        isRevenue
                                                            ? "text-emerald-400"
                                                            : isExpense
                                                              ? "text-red-400"
                                                              : "text-brand",
                                                    )}
                                                >
                                                    {isRevenue
                                                        ? "+"
                                                        : isExpense
                                                          ? "-"
                                                          : ""}
                                                    {formatCurrencyValue(
                                                        entry.amount,
                                                    )}
                                                </p>

                                                <div className="flex shrink-0 gap-2">
                                                    {entry.attachment && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenFinancialAttachment(
                                                                    entry.attachment!,
                                                                )
                                                            }
                                                            title="Abrir anexo"
                                                            aria-label={`Abrir anexo de ${entry.description}`}
                                                            className="rounded-xl border border-brand/20 bg-brand/10 p-2.5 text-brand transition-colors hover:bg-brand/20"
                                                        >
                                                            <ExternalLink className="h-5 w-5" />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteFinancialEntry(
                                                                entry,
                                                            )
                                                        }
                                                        title="Excluir lançamento"
                                                        aria-label={`Excluir ${entry.description}`}
                                                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition-colors hover:bg-red-500/20"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                        {isFinancialEntryModalOpen && (
                            <div
                                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
                                onMouseDown={() =>
                                    setIsFinancialEntryModalOpen(false)
                                }
                            >
                                <div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="financial-entry-title"
                                    className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
                                    onMouseDown={(event) =>
                                        event.stopPropagation()
                                    }
                                >
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                                                Controle financeiro
                                            </p>

                                            <h2
                                                id="financial-entry-title"
                                                className="mt-1 text-2xl font-extrabold text-white"
                                            >
                                                Novo lançamento
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsFinancialEntryModalOpen(
                                                    false,
                                                )
                                            }
                                            aria-label="Fechar formulário"
                                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={handleFinancialEntrySubmit}
                                        className="space-y-5"
                                    >
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <label className="space-y-2">
                                                <span className="text-sm font-bold text-white">
                                                    Tipo
                                                </span>

                                                <select
                                                    value={
                                                        financialEntryForm.type
                                                    }
                                                    onChange={(event) =>
                                                        setFinancialEntryForm(
                                                            (currentForm) => ({
                                                                ...currentForm,
                                                                type: event
                                                                    .target
                                                                    .value as FinancialEntryType,
                                                            }),
                                                        )
                                                    }
                                                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#1e2c42] px-4 py-3 text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                                                >
                                                    <option
                                                        className="bg-[#0f1f35] text-white"
                                                        value="receita"
                                                    >
                                                        Receita
                                                    </option>

                                                    <option
                                                        className="bg-[#0f1f35] text-white"
                                                        value="despesa"
                                                    >
                                                        Despesa
                                                    </option>

                                                    <option
                                                        className="bg-[#0f1f35] text-white"
                                                        value="transferencia"
                                                    >
                                                        Transferência
                                                    </option>

                                                    <option
                                                        className="bg-[#0f1f35] text-white"
                                                        value="ajuste"
                                                    >
                                                        Ajuste financeiro
                                                    </option>
                                                </select>
                                            </label>

                                            <label className="space-y-2">
                                                <span className="text-sm font-bold text-white">
                                                    Categoria
                                                </span>

                                                <select
                                                    value={
                                                        financialEntryForm.category
                                                    }
                                                    onChange={(event) =>
                                                        setFinancialEntryForm(
                                                            (currentForm) => ({
                                                                ...currentForm,
                                                                category:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        )
                                                    }
                                                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#1e2c42] px-4 py-3 text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                                                >
                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value=""
                                                    >
                                                        Selecione uma categoria
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="servicos"
                                                    >
                                                        Serviços
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="honorarios"
                                                    >
                                                        Honorários
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="impostos"
                                                    >
                                                        Impostos
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="folha"
                                                    >
                                                        Folha de pagamento
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="fornecedores"
                                                    >
                                                        Fornecedores
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="equipamentos"
                                                    >
                                                        Equipamentos
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="reembolso"
                                                    >
                                                        Reembolso
                                                    </option>

                                                    <option
                                                        className="bg-slate-900 text-white"
                                                        value="outros"
                                                    >
                                                        Outros
                                                    </option>
                                                </select>
                                            </label>
                                        </div>

                                        <label className="block space-y-2">
                                            <span className="text-sm font-bold text-white">
                                                Descrição
                                            </span>

                                            <input
                                                type="text"
                                                value={
                                                    financialEntryForm.description
                                                }
                                                onChange={(event) =>
                                                    setFinancialEntryForm(
                                                        (currentForm) => ({
                                                            ...currentForm,
                                                            description:
                                                                event.target
                                                                    .value,
                                                        }),
                                                    )
                                                }
                                                placeholder="Descreva o lançamento"
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                                            />
                                        </label>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <label className="space-y-2">
                                                <span className="text-sm font-bold text-white">
                                                    Valor
                                                </span>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={
                                                        financialEntryForm.amount
                                                    }
                                                    onChange={(event) =>
                                                        setFinancialEntryForm(
                                                            (currentForm) => ({
                                                                ...currentForm,
                                                                amount: formatCurrencyInput(
                                                                    event.target
                                                                        .value,
                                                                ),
                                                            }),
                                                        )
                                                    }
                                                    placeholder="R$ 0,00"
                                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
                                                />
                                            </label>

                                            <label className="space-y-2">
                                                <span className="text-sm font-bold text-white">
                                                    Data
                                                </span>

                                                <input
                                                    type="date"
                                                    value={
                                                        financialEntryForm.date
                                                    }
                                                    onChange={(event) =>
                                                        setFinancialEntryForm(
                                                            (currentForm) => ({
                                                                ...currentForm,
                                                                date: event
                                                                    .target
                                                                    .value,
                                                            }),
                                                        )
                                                    }
                                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-brand"
                                                />
                                            </label>
                                        </div>
                                        <label className="block space-y-2">
                                            <span className="text-sm font-bold text-white">
                                                Comprovante ou documento
                                            </span>

                                            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 transition-colors hover:border-brand/60">
                                                <FileText className="h-6 w-6 shrink-0 text-brand" />

                                                <input
                                                    type="file"
                                                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                                    onChange={(event) => {
                                                        const selectedFile =
                                                            event.target
                                                                .files?.[0] ??
                                                            null;

                                                        if (!selectedFile) {
                                                            setFinancialEntryAttachment(
                                                                null,
                                                            );
                                                            return;
                                                        }

                                                        const allowedTypes = [
                                                            "application/pdf",
                                                            "image/png",
                                                            "image/jpeg",
                                                        ];

                                                        const maximumSize =
                                                            10 * 1024 * 1024;

                                                        if (
                                                            !allowedTypes.includes(
                                                                selectedFile.type,
                                                            )
                                                        ) {
                                                            setFinancialEntryAttachment(
                                                                null,
                                                            );
                                                            setFinancialEntryError(
                                                                "Selecione um arquivo PDF, JPG ou PNG.",
                                                            );
                                                            event.target.value =
                                                                "";
                                                            return;
                                                        }

                                                        if (
                                                            selectedFile.size >
                                                            maximumSize
                                                        ) {
                                                            setFinancialEntryAttachment(
                                                                null,
                                                            );
                                                            setFinancialEntryError(
                                                                "O arquivo deve possuir no máximo 10 MB.",
                                                            );
                                                            event.target.value =
                                                                "";
                                                            return;
                                                        }

                                                        setFinancialEntryAttachment(
                                                            selectedFile,
                                                        );
                                                        setFinancialEntryError(
                                                            "",
                                                        );
                                                    }}
                                                    className="block w-full text-sm text-white/60 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand file:px-4 file:py-2 file:font-bold file:text-white file:transition-colors hover:file:bg-brand-light"
                                                />
                                            </div>

                                            <p className="text-xs text-white/40">
                                                Campo opcional. Aceita PDF, JPG
                                                ou PNG de até 10 MB.
                                            </p>

                                            {financialEntryAttachment && (
                                                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                                                    <CheckCircle2 className="h-5 w-5 shrink-0" />

                                                    <span className="min-w-0 truncate">
                                                        {
                                                            financialEntryAttachment.name
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </label>
                                        {financialEntryError && (
                                            <div
                                                role="alert"
                                                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                                            >
                                                {financialEntryError}
                                            </div>
                                        )}

                                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsFinancialEntryModalOpen(
                                                        false,
                                                    )
                                                }
                                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={
                                                    isSavingFinancialEntry
                                                }
                                                className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-light disabled:cursor-wait disabled:opacity-60"
                                            >
                                                {isSavingFinancialEntry
                                                    ? "Salvando..."
                                                    : "Salvar lançamento"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </section>
                )}
                <div
                    className={cn(
                        "p-4 sm:p-6 xl:p-10 space-y-8 xl:space-y-10",
                        activeTab !== "inicio" && "hidden",
                    )}
                >
                    <div
                        className="flex flex-col md:flex-row
               md:justify-between md:items-end gap-6"
                    >
                        <div>
                            <p className="text-brand font-bold text-xs uppercase tracking-[0.2em] mb-1">
                                Visão Geral
                            </p>
                            <h1 className="text-4xl font-extrabold text-white tracking-tighter">
                                Olá, {user.name.split(" ")[0]}.
                            </h1>
                            <p className="text-white/40 font-medium mt-1">
                                Estatísticas e fluxos de caixa em tempo real.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleExportFinancialPdf()
                                    }
                                    disabled={isExportingFinancialPdf}
                                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors disabled:cursor-wait disabled:opacity-60"
                                >
                                    {isExportingFinancialPdf
                                        ? "Exportando..."
                                        : "Exportar PDF"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        /*
                                         * Direciona para o financeiro e abre
                                         * o formulário de novo lançamento.
                                         */
                                        setActiveTab("financeiro");
                                        setFinancialEntryError("");
                                        setFinancialEntryMessage("");
                                        setIsFinancialEntryModalOpen(true);
                                    }}
                                    className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/40"
                                >
                                    Novo Lançamento
                                </button>
                            </div>
                        </div>
                    </div>
                    {/*
                     * Exibe na tela inicial o mesmo resumo calculado
                     * a partir dos lançamentos financeiros do usuário.
                     */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            title="Receitas"
                            value={formatCurrencyValue(
                                financialSummary.revenue,
                            )}
                            trend="Entradas"
                            trendUp={true}
                        />

                        <StatCard
                            title="Despesas"
                            value={formatCurrencyValue(
                                financialSummary.expenses,
                            )}
                            trend="Saídas"
                            trendUp={false}
                        />

                        <StatCard
                            title="Saldo"
                            value={formatCurrencyValue(financialBalance)}
                            trend={
                                financialBalance >= 0 ? "Positivo" : "Negativo"
                            }
                            trendUp={financialBalance >= 0}
                        />

                        <StatCard
                            title="Lançamentos"
                            value={String(financialEntries.length)}
                            trend="Total"
                            trendUp={true}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="font-bold text-xl text-white tracking-tight">
                                        Controle Mensal
                                    </h3>
                                    <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">
                                        Faturamento vs Despesas
                                    </p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-brand" />
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockChartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="rgba(255,255,255,0.05)"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "rgba(255,255,255,0.3)",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "rgba(255,255,255,0.3)",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(255,255,255,0.05)",
                                            }}
                                            contentStyle={{
                                                backgroundColor: "#0f172a",
                                                borderRadius: "16px",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                boxShadow:
                                                    "0 25px 50px -12px rgb(0 0 0 / 0.5)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#0C447C"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="font-bold text-xl text-white tracking-tight">
                                        Atividade
                                    </h3>
                                    <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">
                                        Frequência Semanal
                                    </p>
                                </div>
                                <Clock className="w-6 h-6 text-brand" />
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockWeeklyData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="rgba(255,255,255,0.05)"
                                        />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "rgba(255,255,255,0.3)",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "rgba(255,255,255,0.3)",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#0f172a",
                                                borderRadius: "16px",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#185FA5"
                                            strokeWidth={4}
                                            dot={{
                                                r: 6,
                                                fill: "#185FA5",
                                                strokeWidth: 2,
                                                stroke: "#0f172a",
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10">
                            <h3 className="font-bold text-xl text-white mb-8 flex items-center gap-3">
                                <PlusCircle className="w-6 h-6 text-brand" />
                                Serviços Rápidos
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <QuickAction
                                    icon={<Video className="w-8 h-8" />}
                                    label="Agendar Reunião"
                                />
                                <QuickAction
                                    icon={<FileText className="w-8 h-8" />}
                                    label="Solictar Guia"
                                />
                                <QuickAction
                                    icon={<CheckCircle2 className="w-8 h-8" />}
                                    label="Validar NF-e"
                                />
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 flex flex-col">
                            <h3 className="font-bold text-xl text-white mb-8 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-brand" />
                                Calendário
                            </h3>
                            <div className="space-y-6 flex-grow">
                                {mockTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-5 p-4 rounded-[20px] hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
                                    >
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                                task.status === "COMPLETED"
                                                    ? "bg-success text-white"
                                                    : "bg-white/5 text-white/40",
                                            )}
                                        >
                                            {task.status === "COMPLETED" ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : (
                                                <Clock className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-white mb-1">
                                                {task.title}
                                            </p>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">
                                                {task.dueDate}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand hover:bg-brand/10 border border-brand/20 rounded-2xl transition-all">
                                Painel Geral
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    title,
    value,
    trend,
    trendUp,
}: {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
}) {
    return (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-black mb-4">
                {title}
            </p>
            <h2 className="whitespace-nowrap text-xl 2xl:text-2xl font-black text-white tracking-tight tabular-nums">
                {" "}
                {value}
            </h2>
            <p
                className={cn(
                    "mt-4 text-sm font-bold uppercase tracking-[0.2em]",
                    trendUp ? "text-success" : "text-white/50",
                )}
            >
                {trend}
            </p>
        </div>
    );
}

function SidebarItem({
    active,
    onClick,
    icon,
    label,
    collapsed,
    danger = false,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            /*
             * O título permite identificar a funcionalidade quando
             * o menu está compacto e apresenta somente os ícones.
             */
            title={collapsed ? label : undefined}
            aria-label={label}
            className={cn(
                "group wc-sidebar-item flex items-center rounded-3xl transition-all w-full",
                collapsed ? "justify-center p-2" : "gap-3 px-4 py-2 text-left",
                active
                    ? "bg-brand text-white border border-brand/50 shadow-2xl shadow-brand/40"
                    : danger
                      ? "wc-sidebar-item-danger"
                      : "wc-sidebar-item-default",
            )}
        >
            <div
                className="
        wc-sidebar-item-icon
        w-10 h-10 shrink-0 rounded-3xl
        bg-white/5 flex items-center justify-center
        transition-colors
    "
            >
                {icon}
            </div>

            {!collapsed && (
                <span className="text-sm font-bold whitespace-nowrap">
                    {label}
                </span>
            )}
        </button>
    );
}

function QuickAction({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <button className="rounded-3xl border border-white/10 p-5 text-left bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-brand">{icon}</span>
                <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-sm font-bold text-white">{label}</p>
        </button>
    );
}
