<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MensagemController extends Controller
{
    public function listar(
        Request $request,
        Solicitacao $solicitacao,
    ): JsonResponse {
        $this->autorizarParticipante($request->user(), $solicitacao);

        $mensagens = $solicitacao->mensagens()
            ->with('remetente:id,name')
            ->get()
            ->map(fn (Mensagem $mensagem) => $this->formatar(
                $mensagem,
                $request->user()->id,
            ));

        $solicitacao->mensagens()
            ->where('remetente_user_id', '!=', $request->user()->id)
            ->whereNull('lida_em')
            ->update(['lida_em' => now()]);

        return response()->json(['mensagens' => $mensagens]);
    }

    public function enviar(
        Request $request,
        Solicitacao $solicitacao,
    ): JsonResponse {
        $this->autorizarParticipante($request->user(), $solicitacao);

        $dados = $request->validate(
            [
                'mensagem' => ['required', 'string', 'max:2000'],
            ],
            [
                'mensagem.required' => 'Digite uma mensagem.',
                'mensagem.max' => 'A mensagem não pode ultrapassar 2000 caracteres.',
            ],
        );

        $mensagem = $solicitacao->mensagens()->create([
            'remetente_user_id' => $request->user()->id,
            'mensagem' => trim($dados['mensagem']),
        ]);

        $mensagem->load('remetente:id,name');

        return response()->json([
            'message' => 'Mensagem enviada.',
            'mensagem' => $this->formatar($mensagem, $request->user()->id),
        ], 201);
    }

    private function autorizarParticipante(
        User $usuario,
        Solicitacao $solicitacao,
    ): void {
        $solicitacao->loadMissing(['cliente', 'contador']);

        $participaComoCliente =
            $usuario->role === 'CLIENT' &&
            $solicitacao->cliente?->user_id === $usuario->id;

        $participaComoContador =
            $usuario->role === 'ACCOUNTANT' &&
            $solicitacao->contador?->user_id === $usuario->id;

        if (
            !$participaComoCliente &&
            !$participaComoContador &&
            $usuario->role !== 'ADMIN'
        ) {
            abort(403, 'Você não participa desta conversa.');
        }

        if ($solicitacao->contador_id === null && $usuario->role !== 'ADMIN') {
            abort(422, 'A conversa ficará disponível após a atribuição de um contador.');
        }
    }

    /** @return array<string, mixed> */
    private function formatar(Mensagem $mensagem, int $usuarioId): array
    {
        return [
            'id' => $mensagem->id,
            'remetenteId' => $mensagem->remetente_user_id,
            'remetenteNome' => $mensagem->remetente?->name,
            'mensagem' => $mensagem->mensagem,
            'dataEnvio' => $mensagem->created_at?->toIso8601String(),
            'propria' => $mensagem->remetente_user_id === $usuarioId,
        ];
    }
}
