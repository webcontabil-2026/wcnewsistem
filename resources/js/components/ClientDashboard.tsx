/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiRequest } from "../lib/api";
import { User } from "../types";
import ClientHeader from "./client/ClientHeader";
import ClientSidebar from "./client/ClientSidebar";
import AgendaFiscalCliente from "./client/AgendaFiscalCliente";
import ConfiguracoesCliente from "./client/ConfiguracoesCliente";
import ContaCliente from "./client/ContaCliente";
import DashboardInicio from "./client/DashboardInicio";
import DocumentosCliente from "./client/DocumentosCliente";
import FinanceiroCliente from "./client/FinanceiroCliente";
import NovoLancamentoModal from "./client/NovoLancamentoModal";
import PerfilCliente from "./client/PerfilCliente";
import PreferenciasCliente from "./client/PreferenciasCliente";
import PrivacidadeCliente from "./client/PrivacidadeCliente";
import ServicosCliente from "./client/ServicosCliente";
import ConversasSolicitacao from "./solicitacoes/ConversasSolicitacao";
import { parseCurrencyInput } from "./client/financeiro/formatadores";
import { criarDadosGraficoFinanceiro } from "./client/financeiro/grafico";
import { gerarRelatorioFinanceiro } from "./client/financeiro/RelatorioFinanceiro";
import {
    AnexoFinanceiro,
    LancamentoFinanceiro,
    PeriodoGraficoFinanceiro,
    TipoLancamentoFinanceiro,
} from "./client/financeiro/tipos";
import SolicitacoesCliente from "./client/solicitacoes/SolicitacoesCliente";
import useSolicitacoesCliente from "./client/solicitacoes/useSolicitacoesCliente";

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}

export default function ClientDashboard({
    user,
    onLogout,
}: ClientDashboardProps) {
    const [activeTab, setActiveTab] = useState("inicio");

    /*
     * Controla as solicitações e os orçamentos
     * pertencentes ao cliente autenticado.
     */
    const {
        solicitacoes,
        carregandoSolicitacoes,
        respondendoSolicitacaoId,
        erroSolicitacoes,
        mensagemSolicitacoes,
        carregarSolicitacoes,
        responderOrcamento,
    } = useSolicitacoesCliente();

    const [isFinancialEntryModalOpen, setIsFinancialEntryModalOpen] =
        useState(false);

    const [financialEntries, setFinancialEntries] = useState<
        LancamentoFinanceiro[]
    >([]);

    const [financialEntryForm, setFinancialEntryForm] = useState({
        type: "receita" as TipoLancamentoFinanceiro,
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
        useState<PeriodoGraficoFinanceiro>(30);

    const [financialEntryAttachment, setFinancialEntryAttachment] =
        useState<File | null>(null);

    /*
     * Controla qual categoria das configurações está aberta.
     */
    const [settingsSection, setSettingsSection] = useState<
        "menu" | "perfil" | "preferencias" | "privacidade" | "conta"
    >("menu");

    /*
     * Controla a abertura do menu em celulares e tablets.
     */
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /*
     * Carrega do banco os lançamentos pertencentes
     * ao usuário autenticado.
     */
    useEffect(() => {
        let isComponentMounted = true;

        const loadFinancialEntries = async () => {
            setFinancialDataError("");

            try {
                const response = await apiRequest<{
                    entries: LancamentoFinanceiro[];
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
                entry: LancamentoFinanceiro;
            }>("/financial-entries", {
                method: "POST",
                body: requestData,
            });

            /*
             * O painel recebe o lançamento já salvo
             * e identificado pelo banco.
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
     * Calcula automaticamente o resumo com base
     * nos lançamentos cadastrados.
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

    const financialChartData = criarDadosGraficoFinanceiro(
        financialEntries,
        financialChartPeriod,
    );

    /*
     * Abre o comprovante protegido utilizando
     * a rota do Laravel.
     */
    const handleOpenFinancialAttachment = (attachment: AnexoFinanceiro) => {
        window.open(attachment.url, "_blank", "noopener,noreferrer");
    };

    /*
     * Exclui o lançamento do banco e atualiza o painel.
     */
    const handleDeleteFinancialEntry = async (entry: LancamentoFinanceiro) => {
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
     * Gera um relatório em PDF considerando
     * o período selecionado no gráfico.
     */
    const handleExportFinancialPdf = async () => {
        setFinancialExportError("");
        setFinancialEntryMessage("");
        setIsExportingFinancialPdf(true);

        try {
            await gerarRelatorioFinanceiro({
                usuario: user,
                lancamentos: financialEntries,
                periodo: financialChartPeriod,
                datasVisiveis: financialChartData.map((item) => item.date),
            });

            setFinancialEntryMessage(
                "Relatório financeiro exportado com sucesso.",
            );
        } catch (error) {
            console.error("Erro ao gerar o relatório financeiro:", error);

            setFinancialExportError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível gerar o relatório financeiro.",
            );
        } finally {
            setIsExportingFinancialPdf(false);
        }
    };

    return (
        <div className="system-layout flex h-screen overflow-hidden">
            <ClientSidebar
                activeTab={activeTab}
                menuMobileAberto={isMobileMenuOpen}
                onSelecionarAba={setActiveTab}
                onAbrirConfiguracoes={() => {
                    setActiveTab("configuracoes");
                    setSettingsSection("menu");
                }}
                onFecharMenuMobile={() => setIsMobileMenuOpen(false)}
                onLogout={onLogout}
            />

            <main className="flex min-w-0 flex-grow flex-col overflow-x-hidden overflow-y-auto">
                <ClientHeader
                    user={user}
                    onAbrirMenuMobile={() => setIsMobileMenuOpen(true)}
                />

                {activeTab === "configuracoes" &&
                    settingsSection === "menu" && (
                        <ConfiguracoesCliente
                            onSelecionarSecao={(secao) =>
                                setSettingsSection(secao)
                            }
                        />
                    )}

                {activeTab === "configuracoes" &&
                    settingsSection === "perfil" && (
                        <PerfilCliente
                            user={user}
                            onVoltar={() => setSettingsSection("menu")}
                        />
                    )}

                {activeTab === "configuracoes" &&
                    settingsSection === "preferencias" && (
                        <PreferenciasCliente
                            onVoltar={() => setSettingsSection("menu")}
                        />
                    )}

                {activeTab === "configuracoes" &&
                    settingsSection === "privacidade" && (
                        <PrivacidadeCliente
                            onVoltar={() => setSettingsSection("menu")}
                        />
                    )}

                {activeTab === "configuracoes" &&
                    settingsSection === "conta" && (
                        <ContaCliente
                            onVoltar={() => setSettingsSection("menu")}
                        />
                    )}

                {activeTab === "solicitacoes" && (
                    <SolicitacoesCliente
                        solicitacoes={solicitacoes}
                        carregando={carregandoSolicitacoes}
                        respondendoId={respondendoSolicitacaoId}
                        erro={erroSolicitacoes}
                        mensagem={mensagemSolicitacoes}
                        onRecarregar={carregarSolicitacoes}
                        onResponder={responderOrcamento}
                    />
                )}

                {activeTab === "servicos" && (
                    <ServicosCliente
                        onSolicitacaoCriada={() => {
                            void carregarSolicitacoes();
                            setActiveTab("solicitacoes");
                        }}
                    />
                )}

                {activeTab === "documentos" && (
                    <DocumentosCliente
                        lancamentos={financialEntries}
                        onAbrirAnexo={handleOpenFinancialAttachment}
                    />
                )}

                {activeTab === "conversas" && (
                    <ConversasSolicitacao solicitacoes={solicitacoes} />
                )}

                {activeTab === "agenda" && <AgendaFiscalCliente />}

                {activeTab === "financeiro" && (
                    <>
                        <FinanceiroCliente
                            lancamentos={financialEntries}
                            resumo={financialSummary}
                            saldo={financialBalance}
                            dadosGrafico={financialChartData}
                            periodoGrafico={financialChartPeriod}
                            carregando={isLoadingFinancialEntries}
                            exportandoPdf={isExportingFinancialPdf}
                            mensagem={financialEntryMessage}
                            erroDados={financialDataError}
                            erroExportacao={financialExportError}
                            onNovoLancamento={() => {
                                setFinancialEntryError("");
                                setFinancialEntryMessage("");
                                setIsFinancialEntryModalOpen(true);
                            }}
                            onExportarPdf={handleExportFinancialPdf}
                            onAlterarPeriodo={setFinancialChartPeriod}
                            onAbrirAnexo={handleOpenFinancialAttachment}
                            onExcluirLancamento={handleDeleteFinancialEntry}
                        />

                        <NovoLancamentoModal
                            aberto={isFinancialEntryModalOpen}
                            formulario={financialEntryForm}
                            setFormulario={setFinancialEntryForm}
                            erro={financialEntryError}
                            setErro={setFinancialEntryError}
                            salvando={isSavingFinancialEntry}
                            anexo={financialEntryAttachment}
                            setAnexo={setFinancialEntryAttachment}
                            onFechar={() => setIsFinancialEntryModalOpen(false)}
                            onSubmit={handleFinancialEntrySubmit}
                        />
                    </>
                )}

                {activeTab === "inicio" && (
                    <DashboardInicio
                        user={user}
                        receitas={financialSummary.revenue}
                        despesas={financialSummary.expenses}
                        saldo={financialBalance}
                        totalLancamentos={financialEntries.length}
                        exportandoPdf={isExportingFinancialPdf}
                        onExportarPdf={handleExportFinancialPdf}
                        onNovoLancamento={() => {
                            setActiveTab("financeiro");
                            setFinancialEntryError("");
                            setFinancialEntryMessage("");
                            setIsFinancialEntryModalOpen(true);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
