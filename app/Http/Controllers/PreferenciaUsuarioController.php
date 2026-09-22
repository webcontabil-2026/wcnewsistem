<?php

namespace App\Http\Controllers;

use App\Models\PreferenciaUsuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreferenciaUsuarioController extends Controller
{
    /**
     * Retorna as preferências do usuário autenticado.
     *
     * Caso ainda não exista um registro, cria automaticamente
     * as preferências padrão para esse usuário.
     */
    public function show(Request $request): JsonResponse
    {
        $preferencia = PreferenciaUsuario::firstOrCreate(
            [
                'user_id' => $request->user()->id,
            ],
            [
                'tema' => 'dark',
                'notificacoes_sistema' => true,
                'notificacoes_email' => true,
                'notificacoes_documentos' => true,
            ],
        );

        return response()->json([
            'preferencia' => [
                'tema' => $preferencia->tema,
                'notificacoes_sistema' => $preferencia->notificacoes_sistema,
                'notificacoes_email' => $preferencia->notificacoes_email,
                'notificacoes_documentos' => $preferencia->notificacoes_documentos,
            ],
        ]);
    }

    /**
     * Atualiza as preferências do usuário autenticado.
     */
    public function update(Request $request): JsonResponse
    {
        $dadosValidados = $request->validate([
            /*
             * Mantemos o tema como texto para permitir
             * novas opções futuramente.
             *
             * Exemplos:
             * dark
             * light
             * high-contrast
             */
            'tema' => [
                'required',
                'string',
                'max:40',
            ],

            'notificacoes_sistema' => [
                'required',
                'boolean',
            ],

            'notificacoes_email' => [
                'required',
                'boolean',
            ],

            'notificacoes_documentos' => [
                'required',
                'boolean',
            ],
        ]);

        $preferencia = PreferenciaUsuario::updateOrCreate(
            [
                'user_id' => $request->user()->id,
            ],
            $dadosValidados,
        );

        return response()->json([
            'message' => 'Preferências atualizadas com sucesso.',
            'preferencia' => [
                'tema' => $preferencia->tema,
                'notificacoes_sistema' => $preferencia->notificacoes_sistema,
                'notificacoes_email' => $preferencia->notificacoes_email,
                'notificacoes_documentos' => $preferencia->notificacoes_documentos,
            ],
        ]);
    }
}