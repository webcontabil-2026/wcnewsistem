<?php

namespace App\Http\Controllers;

use App\Models\CategoriaFinanceira;
use App\Models\LancamentoFinanceiro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LancamentoFinanceiroController extends Controller
{
    /**
     * Lista os lançamentos financeiros do cliente autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado para este usuário.',
                'entries' => [],
            ], 404);
        }

        $entries = $cliente
            ->lancamentosFinanceiros()
            ->with('categoria')
            ->latest('data_lancamento')
            ->latest('id')
            ->get()
            ->map(
                fn (LancamentoFinanceiro $entry) =>
                    $this->formatEntry($entry)
            );

        return response()->json([
            'entries' => $entries,
        ]);
    }

    /**
     * Cria um novo lançamento financeiro para o cliente autenticado.
     */
    public function store(Request $request): JsonResponse
    {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado para este usuário.',
            ], 404);
        }

        $validated = $request->validate(
            [
                'type' => [
                    'required',
                    Rule::in([
                        'receita',
                        'despesa',
                        'transferencia',
                        'ajuste',
                    ]),
                ],

                'description' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'category' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'amount' => [
                    'required',
                    'numeric',
                    'gt:0',
                    'lte:9999999999999.99',
                ],

                'date' => [
                    'required',
                    'date_format:Y-m-d',
                ],
            ],
            [
                'type.required' => 'Selecione o tipo do lançamento.',
                'type.in' => 'O tipo de lançamento selecionado é inválido.',

                'description.required' => 'Informe a descrição.',
                'description.max' => 'A descrição não pode ultrapassar 255 caracteres.',

                'category.required' => 'Selecione uma categoria.',

                'amount.required' => 'Informe o valor.',
                'amount.numeric' => 'Informe um valor válido.',
                'amount.gt' => 'O valor deve ser maior que zero.',
                'amount.lte' => 'O valor informado ultrapassa o limite permitido.',

                'date.required' => 'Informe a data.',
                'date.date_format' => 'Informe uma data válida.',
            ],
        );

        /*
         * Procura a categoria informada pelo frontend.
         *
         * O frontend continua enviando o nome da categoria,
         * enquanto o banco trabalha com categoria_id.
         */
        $categoria = CategoriaFinanceira::query()
            ->whereRaw('LOWER(nome) = ?', [
                mb_strtolower($validated['category']),
            ])
            ->first();

        if (!$categoria) {
            return response()->json([
                'message' => 'Categoria financeira não encontrada.',
                'errors' => [
                    'category' => [
                        'A categoria informada não existe no banco.',
                    ],
                ],
            ], 422);
        }

        /*
         * Cria o lançamento usando os nomes reais das colunas do banco.
         */
        $entry = $cliente
            ->lancamentosFinanceiros()
            ->create([
                'categoria_id' => $categoria->id,
                'descricao' => $validated['description'],
                'valor' => $validated['amount'],
                'tipo' => $validated['type'],
                'data_lancamento' => $validated['date'],
                'status' => 'ativo',
            ]);

        /*
         * Carrega a categoria para devolver os dados completos ao frontend.
         */
        $entry->load('categoria');

        return response()->json([
            'message' => 'Lançamento cadastrado com sucesso.',
            'entry' => $this->formatEntry($entry),
        ], 201);
    }

    /**
     * Exclui um lançamento pertencente ao cliente autenticado.
     */
    public function destroy(
        Request $request,
        int $financialEntry
    ): JsonResponse {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado para este usuário.',
            ], 404);
        }

        $entry = $cliente
            ->lancamentosFinanceiros()
            ->findOrFail($financialEntry);

        $entry->delete();

        return response()->json([
            'message' => 'Lançamento excluído com sucesso.',
        ]);
    }

    /**
     * Converte os nomes do banco para o formato que o React já utiliza.
     *
     * Isso evita alterações desnecessárias no frontend.
     *
     * @return array<string, mixed>
     */
    private function formatEntry(
        LancamentoFinanceiro $entry
    ): array {
        return [
            'id' => $entry->id,

            'type' => $entry->tipo,

            'description' => $entry->descricao,

            'category' => $entry->categoria?->nome,

            'amount' => (float) $entry->valor,

            'date' => $entry->data_lancamento
                ->format('Y-m-d'),

            /*
             * O anexo será integrado depois com a tabela documentos.
             */
            'attachment' => null,
        ];
    }
}