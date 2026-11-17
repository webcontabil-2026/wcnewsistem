<?php

namespace Database\Seeders;

use App\Models\Servico;
use Illuminate\Database\Seeder;

class ServicoSeeder extends Seeder
{
    /*
     * Cadastra ou atualiza o catálogo oficial de serviços.
     *
     * O updateOrCreate permite executar este seeder novamente
     * sem duplicar os serviços existentes.
     */
    public function run(): void
    {
        $servicos = [
            [
                'nome' => 'Declaração de Imposto de Renda',
                'descricao' => 'Preparação, revisão e envio da declaração anual da pessoa física.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => 119.90,
            ],
            [
                'nome' => 'Declaração Retificadora',
                'descricao' => 'Correção de informações incompletas ou incorretas em uma declaração já enviada.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => 99.90,
            ],
            [
                'nome' => 'Regularização de CPF',
                'descricao' => 'Análise da situação cadastral e orientação para solucionar pendências no CPF.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => null,
            ],
            [
                'nome' => 'Consulta de Malha Fiscal',
                'descricao' => 'Análise de pendências em uma declaração retida para verificação e abertura de processos para resolução.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => null,
            ],
            [
                'nome' => 'Carnê-Leão e DARF',
                'descricao' => 'Apuração mensal de rendimentos e preparação da respectiva guia de pagamento.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => 89.90,
            ],
            [
                'nome' => 'Apuração de Ganho de Capital',
                'descricao' => 'Análise e cálculo relacionado à venda de um bem ou direito.',
                'tipo_cliente' => 'pessoa_fisica',
                'preco' => 119.90,
            ],
            [
                'nome' => 'Abertura de Empresa',
                'descricao' => 'Acompanhamento da criação e da regularização inicial de uma empresa.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
            [
                'nome' => 'Alteração e Regularização',
                'descricao' => 'Atualização ou correção dos dados cadastrais de uma empresa existente.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
            [
                'nome' => 'Contabilidade Mensal',
                'descricao' => 'Acompanhamento recorrente das movimentações e obrigações contábeis.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
            [
                'nome' => 'Gestão Fiscal e Tributária',
                'descricao' => 'Acompanhamento de impostos, guias, vencimentos e obrigações fiscais.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
            [
                'nome' => 'Folha de Pagamento',
                'descricao' => 'Processamento das informações relacionadas aos colaboradores e responsáveis.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
            [
                'nome' => 'Relatórios e Consultoria',
                'descricao' => 'Apresentação de resultados para apoiar decisões financeiras e administrativas.',
                'tipo_cliente' => 'pessoa_juridica',
                'preco' => null,
            ],
        ];

        foreach ($servicos as $servico) {
            Servico::query()->updateOrCreate(
                [
                    'nome' => $servico['nome'],
                    'tipo_cliente' => $servico['tipo_cliente'],
                ],
                [
                    'descricao' => $servico['descricao'],
                    'preco' => $servico['preco'],
                    'status' => 'ativo',
                ],
            );
        }
    }
}