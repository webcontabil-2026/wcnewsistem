<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ContatoController extends Controller
{
    public function enviar(Request $request): JsonResponse
    {
        $dados = $request->validate(
            [
                'nome' => ['required', 'string', 'max:100'],
                'email' => ['required', 'email', 'max:150'],
                'perfil' => ['required', Rule::in(['pf', 'pj'])],
                'documento' => ['required', 'string', 'max:18'],
                'telefone' => ['nullable', 'string', 'max:20'],
                'servico' => ['required', 'string', 'max:120'],
                'empresa' => ['nullable', 'string', 'max:150'],
                'mensagem' => ['required', 'string', 'max:1000'],
            ],
            [
                'perfil.in' => 'Selecione Pessoa Física ou Pessoa Jurídica.',
                'mensagem.max' => 'A mensagem não pode ultrapassar 1000 caracteres.',
            ],
        );

        $quantidadeDocumento = strlen(preg_replace('/\D/', '', $dados['documento']));
        $quantidadeEsperada = $dados['perfil'] === 'pj' ? 14 : 11;

        if ($quantidadeDocumento !== $quantidadeEsperada) {
            return response()->json([
                'message' => 'O documento informado não possui a quantidade esperada de números.',
            ], 422);
        }

        DB::table('contatos')->insert([
            ...$dados,
            'status' => 'novo',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Contato enviado com sucesso. Nossa equipe retornará pelo e-mail informado.',
        ], 201);
    }
}
