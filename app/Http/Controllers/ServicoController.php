<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\JsonResponse;

class ServicoController extends Controller
{
    /**
     * Retorna os serviços ativos disponíveis para solicitação.
     */
    public function listar(): JsonResponse
    {
        $servicos = Servico::query()
            ->where('status', 'ativo')
            ->orderBy('tipo_cliente')
            ->orderBy('nome')
            ->get()
            ->map(fn (Servico $servico): array => [
                'id' => $servico->id,
                'nome' => $servico->nome,
                'descricao' => $servico->descricao,
                'tipoCliente' => $servico->tipo_cliente,
                'preco' => $servico->preco !== null
                    ? (float) $servico->preco
                    : null,
            ])
            ->values();

        return response()->json([
            'servicos' => $servicos,
        ]);
    }
}