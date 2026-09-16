<?php

namespace App\Http\Controllers;

use App\Models\CategoriaFinanceira;
use App\Models\Documento;
use App\Models\LancamentoFinanceiro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LancamentoFinanceiroController extends Controller
{
    /**
     * Lista os lançamentos financeiros pertencentes ao cliente autenticado.
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
            ->with([
                'categoria',
                'documentos',
            ])
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
     *
     * Caso exista um comprovante, o arquivo é armazenado de forma privada
     * e seu registro é criado na tabela documentos.
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

                'attachment' => [
                    'nullable',
                    'file',
                    'mimes:pdf,jpg,jpeg,png',
                    'max:10240',
                ],
            ],
            [
                'type.required' => 'Selecione o tipo do lançamento.',
                'type.in' => 'O tipo de lançamento selecionado é inválido.',

                'description.required' => 'Informe a descrição.',
                'description.max' =>
                    'A descrição não pode ultrapassar 255 caracteres.',

                'category.required' => 'Selecione uma categoria.',

                'amount.required' => 'Informe o valor.',
                'amount.numeric' => 'Informe um valor válido.',
                'amount.gt' => 'O valor deve ser maior que zero.',
                'amount.lte' =>
                    'O valor informado ultrapassa o limite permitido.',

                'date.required' => 'Informe a data.',
                'date.date_format' => 'Informe uma data válida.',

                'attachment.file' =>
                    'O comprovante enviado é inválido.',
                'attachment.mimes' =>
                    'O comprovante deve ser PDF, JPG ou PNG.',
                'attachment.max' =>
                    'O comprovante deve possuir no máximo 10 MB.',
            ],
        );

        /**
         * O frontend envia o nome da categoria.
         * O banco utiliza a chave estrangeira categoria_id.
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

        $arquivoSalvo = null;

        try {
            $entry = DB::transaction(function () use (
                $request,
                $validated,
                $cliente,
                $categoria,
                &$arquivoSalvo
            ) {
                /**
                 * Cria o lançamento utilizando os nomes reais
                 * das colunas existentes no banco de dados.
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

                /**
                 * O comprovante é opcional.
                 * Quando enviado, é armazenado no disco local privado.
                 */
                if ($request->hasFile('attachment')) {
                    $arquivo = $request->file('attachment');

                    $arquivoSalvo = $arquivo->store(
                        "documentos/financeiros/{$cliente->id}",
                        'local'
                    );

                    Documento::create([
                        'cliente_id' => $cliente->id,
                        'empresa_id' => $entry->empresa_id,
                        'lancamento_financeiro_id' => $entry->id,
                        'enviado_por' => $request->user()->id,
                        'enviado_para' => null,
                        'nome_original' =>
                            $arquivo->getClientOriginalName(),
                        'nome_arquivo' => basename($arquivoSalvo),
                        'caminho' => $arquivoSalvo,
                        'tipo_mime' => $arquivo->getMimeType(),
                        'tamanho' => $arquivo->getSize(),
                        'status' => 'ativo',
                    ]);
                }

                return $entry;
            });
        } catch (\Throwable $erro) {
            /**
             * Caso a transação falhe depois do armazenamento físico,
             * removemos o arquivo para evitar arquivos órfãos.
             */
            if (
                $arquivoSalvo &&
                Storage::disk('local')->exists($arquivoSalvo)
            ) {
                Storage::disk('local')->delete($arquivoSalvo);
            }

            throw $erro;
        }

        $entry->load([
            'categoria',
            'documentos',
        ]);

        return response()->json([
            'message' => 'Lançamento cadastrado com sucesso.',
            'entry' => $this->formatEntry($entry),
        ], 201);
    }

    /**
     * Faz o download protegido do comprovante relacionado ao lançamento.
     *
     * O lançamento é buscado pela relação do cliente autenticado,
     * impedindo acesso a arquivos pertencentes a outros clientes.
     */
    public function downloadAttachment(
        Request $request,
        int $financialEntry
    ): StreamedResponse|JsonResponse {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente não encontrado para este usuário.',
            ], 404);
        }

        $entry = $cliente
            ->lancamentosFinanceiros()
            ->with('documentos')
            ->findOrFail($financialEntry);

        $documento = $entry->documentos->first();

        if (!$documento) {
            return response()->json([
                'message' => 'Este lançamento não possui comprovante.',
            ], 404);
        }

        if (!Storage::disk('local')->exists($documento->caminho)) {
            return response()->json([
                'message' => 'O arquivo do comprovante não foi encontrado.',
            ], 404);
        }

        return Storage::disk('local')->download(
            $documento->caminho,
            $documento->nome_original,
            [
                'Content-Type' =>
                    $documento->tipo_mime
                    ?? 'application/octet-stream',
            ]
        );
    }

    /**
     * Exclui um lançamento pertencente ao cliente autenticado.
     *
     * Os registros dos documentos são removidos dentro da transação.
     * Os arquivos físicos são apagados após a confirmação da exclusão
     * no banco de dados.
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
            ->with('documentos')
            ->findOrFail($financialEntry);

        $caminhosDosArquivos = $entry
            ->documentos
            ->pluck('caminho')
            ->filter()
            ->values()
            ->all();

        DB::transaction(function () use ($entry) {
            $entry->documentos()->delete();
            $entry->delete();
        });

        /**
         * O arquivo físico só é removido depois que a transação
         * do banco foi concluída com sucesso.
         */
        foreach ($caminhosDosArquivos as $caminho) {
            if (Storage::disk('local')->exists($caminho)) {
                Storage::disk('local')->delete($caminho);
            }
        }

        return response()->json([
            'message' => 'Lançamento excluído com sucesso.',
        ]);
    }

    /**
     * Converte a estrutura interna do banco para o contrato
     * que o frontend React utiliza atualmente.
     *
     * @return array<string, mixed>
     */
    private function formatEntry(
        LancamentoFinanceiro $entry
    ): array {
        $documento = $entry->documentos->first();

        return [
            'id' => $entry->id,

            'type' => $entry->tipo,

            'description' => $entry->descricao,

            'category' => $entry->categoria?->nome,

            'amount' => (float) $entry->valor,

            'date' => $entry->data_lancamento
                ->format('Y-m-d'),

            'attachment' => $documento
                ? [
                    'name' => $documento->nome_original,

                    'mimeType' => $documento->tipo_mime,

                    'size' => $documento->tamanho,

                    'url' =>
                        "/financial-entries/{$entry->id}/attachment",
                ]
                : null,
        ];
    }
}