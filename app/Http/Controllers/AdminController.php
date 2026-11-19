<?php

namespace App\Http\Controllers;

use App\Models\LancamentoFinanceiro;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Retorna somente indicadores reais do banco para o painel administrativo.
     */
    public function resumo(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json([
                'message' => 'Acesso permitido somente a administradores.',
            ], 403);
        }

        $usuariosRecentes = User::query()
            ->latest('id')
            ->limit(8)
            ->get(['id', 'name', 'email', 'role', 'status', 'created_at'])
            ->map(fn (User $usuario) => [
                'id' => $usuario->id,
                'nome' => $usuario->name,
                'email' => $usuario->email,
                'perfil' => $usuario->role,
                'status' => $usuario->status,
                'criadoEm' => $usuario->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'resumo' => [
                'usuarios' => User::query()->count(),
                'clientes' => User::query()->where('role', 'CLIENT')->count(),
                'contadores' => User::query()->where('role', 'ACCOUNTANT')->count(),
                'solicitacoes' => Solicitacao::query()->count(),
                'pendentes' => Solicitacao::query()
                    ->where('status', Solicitacao::STATUS_PENDENTE)
                    ->count(),
                'emAndamento' => Solicitacao::query()
                    ->where('status', Solicitacao::STATUS_EM_ANDAMENTO)
                    ->count(),
                'contatosNovos' => DB::table('contatos')
                    ->where('status', 'novo')
                    ->count(),
                'volumeFinanceiro' => (float) LancamentoFinanceiro::query()
                    ->where('status', 'ativo')
                    ->sum('valor'),
            ],
            'usuariosRecentes' => $usuariosRecentes,
        ]);
    }
}
