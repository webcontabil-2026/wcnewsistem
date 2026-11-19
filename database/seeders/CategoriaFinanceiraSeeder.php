<?php

namespace Database\Seeders;

use App\Models\CategoriaFinanceira;
use Illuminate\Database\Seeder;

class CategoriaFinanceiraSeeder extends Seeder
{
    /**
     * Mantém as opções do formulário financeiro sincronizadas com o banco.
     */
    public function run(): void
    {
        $categorias = [
            ['nome' => 'Vendas', 'tipo' => 'receita'],
            ['nome' => 'Serviços', 'tipo' => 'receita'],
            ['nome' => 'Honorários', 'tipo' => 'receita'],
            ['nome' => 'Investimentos', 'tipo' => 'receita'],
            ['nome' => 'Outras receitas', 'tipo' => 'receita'],
            ['nome' => 'Impostos', 'tipo' => 'despesa'],
            ['nome' => 'Fornecedores', 'tipo' => 'despesa'],
            ['nome' => 'Folha de pagamento', 'tipo' => 'despesa'],
            ['nome' => 'Aluguel', 'tipo' => 'despesa'],
            ['nome' => 'Equipamentos', 'tipo' => 'despesa'],
            ['nome' => 'Reembolso', 'tipo' => 'despesa'],
            ['nome' => 'Serviços essenciais', 'tipo' => 'despesa'],
            ['nome' => 'Outras despesas', 'tipo' => 'despesa'],
            ['nome' => 'Transferência', 'tipo' => 'transferencia'],
            ['nome' => 'Ajuste', 'tipo' => 'ajuste'],
        ];

        foreach ($categorias as $categoria) {
            CategoriaFinanceira::query()->updateOrCreate(
                ['nome' => $categoria['nome']],
                [
                    'tipo' => $categoria['tipo'],
                    'descricao' => null,
                ],
            );
        }
    }
}
