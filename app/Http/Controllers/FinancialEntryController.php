<?php

namespace App\Http\Controllers;

use App\Models\FinancialEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FinancialEntryController extends Controller
{
    /**
     * Lista somente os lançamentos do usuário autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $entries = $request->user()
            ->financialEntries()
            ->latest('date')
            ->latest('id')
            ->get()
            ->map(fn (FinancialEntry $entry) => $this->formatEntry($entry));

        return response()->json([
            'entries' => $entries,
        ]);
    }

    /**
     * Salva um novo lançamento financeiro.
     */
    public function store(Request $request): JsonResponse
    {
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
                    Rule::in([
                        'servicos',
                        'honorarios',
                        'impostos',
                        'folha',
                        'fornecedores',
                        'equipamentos',
                        'reembolso',
                        'outros',
                    ]),
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
                'description.max' => 'A descrição não pode ultrapassar 255 caracteres.',

                'category.required' => 'Selecione uma categoria.',
                'category.in' => 'A categoria selecionada é inválida.',

                'amount.required' => 'Informe o valor.',
                'amount.numeric' => 'Informe um valor válido.',
                'amount.gt' => 'O valor deve ser maior que zero.',
                'amount.lte' => 'O valor informado ultrapassa o limite permitido.',

                'date.required' => 'Informe a data.',
                'date.date_format' => 'Informe uma data válida.',

                'attachment.file' => 'O comprovante selecionado é inválido.',
                'attachment.mimes' => 'O comprovante deve ser PDF, JPG ou PNG.',
                'attachment.max' => 'O comprovante deve possuir no máximo 10 MB.',
            ],
        );

        $attachment = $request->file('attachment');
        $attachmentPath = null;

        /*
         * O arquivo recebe um nome interno aleatório e fica fora da pasta pública.
         */
        if ($attachment) {
            $attachmentPath = $attachment->store(
                "financial-attachments/{$request->user()->id}",
                'local',
            );
        }

        $entry = $request->user()
            ->financialEntries()
            ->create([
                'type' => $validated['type'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'attachment_path' => $attachmentPath,
                'attachment_original_name' => $attachment?->getClientOriginalName(),
                'attachment_mime_type' => $attachment?->getMimeType(),
                'attachment_size' => $attachment?->getSize(),
            ]);

        return response()->json([
            'message' => 'Lançamento cadastrado com sucesso.',
            'entry' => $this->formatEntry($entry),
        ], 201);
    }

    /**
     * Baixa o comprovante somente se ele pertencer ao usuário autenticado.
     */
    public function downloadAttachment(
        Request $request,
        int $financialEntry
    ): StreamedResponse {
        $entry = $request->user()
            ->financialEntries()
            ->findOrFail($financialEntry);

        if (
            !$entry->attachment_path ||
            !Storage::disk('local')->exists($entry->attachment_path)
        ) {
            abort(404, 'Comprovante não encontrado.');
        }

        return Storage::disk('local')->download(
            $entry->attachment_path,
            $entry->attachment_original_name ?? 'comprovante',
            [
                'Content-Type' => $entry->attachment_mime_type
                    ?? 'application/octet-stream',
            ],
        );
    }

    /**
     * Exclui somente lançamentos pertencentes ao usuário autenticado.
     */
    public function destroy(
        Request $request,
        int $financialEntry
    ): JsonResponse {
        $entry = $request->user()
            ->financialEntries()
            ->findOrFail($financialEntry);

        if ($entry->attachment_path) {
            Storage::disk('local')->delete($entry->attachment_path);
        }

        $entry->delete();

        return response()->json([
            'message' => 'Lançamento excluído com sucesso.',
        ]);
    }

    /**
     * Converte o lançamento para o formato utilizado pelo React.
     *
     * @return array<string, mixed>
     */
    private function formatEntry(FinancialEntry $entry): array
    {
        return [
            'id' => $entry->id,
            'type' => $entry->type,
            'description' => $entry->description,
            'category' => $entry->category,
            'amount' => (float) $entry->amount,
            'date' => $entry->date->format('Y-m-d'),
            'attachment' => $entry->attachment_path
                ? [
                    'name' => $entry->attachment_original_name,
                    'mimeType' => $entry->attachment_mime_type,
                    'size' => $entry->attachment_size,
                    'url' => url(
                        "/financial-entries/{$entry->id}/attachment"
                    ),
                ]
                : null,
        ];
    }
}