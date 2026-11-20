<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ContaController extends Controller
{
    public function atualizarPerfil(Request $request): JsonResponse
    {
        $usuario = $request->user();
        $cliente = $usuario->cliente;
        $contador = $usuario->contador;

        $request->merge([
            'cpf' => $request->filled('cpf')
                ? preg_replace('/\D/', '', (string) $request->input('cpf'))
                : null,
            'crc' => $request->filled('crc')
                ? strtoupper(trim((string) $request->input('crc')))
                : null,
            'telefone' => $request->filled('telefone')
                ? trim((string) $request->input('telefone'))
                : null,
        ]);

        $regraCpfUnico = $contador
            ? Rule::unique('contadores', 'cpf')->ignore($contador->id)
            : ($cliente
                ? Rule::unique('clientes', 'cpf')->ignore($cliente->id)
                : Rule::unique('clientes', 'cpf'));

        $dados = $request->validate(
            [
                'name' => ['required', 'string', 'min:3', 'max:100'],
                'email' => [
                    'required',
                    'email',
                    'max:254',
                    Rule::unique('users', 'email')->ignore($usuario->id),
                ],
                'telefone' => ['nullable', 'string', 'max:20'],
                'cpf' => [
                    'nullable',
                    'digits:11',
                    $regraCpfUnico,
                ],
                'crc' => [
                    Rule::requiredIf((bool) $contador),
                    'nullable',
                    'string',
                    'max:20',
                    'regex:/^[A-Z0-9.\/-]+$/',
                    $contador
                        ? Rule::unique('contadores', 'crc')->ignore($contador->id)
                        : Rule::unique('contadores', 'crc'),
                ],
                'foto' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:5120',
                ],
            ],
            [
                'email.unique' => 'Este e-mail já pertence a outra conta.',
                'cpf.digits' => 'O CPF deve possuir exatamente 11 dígitos.',
                'cpf.unique' => 'Este CPF já pertence a outra conta.',
                'crc.required' => 'Informe o CRC profissional.',
                'crc.unique' => 'Este CRC já pertence a outro contador.',
                'crc.max' => 'O CRC não pode ultrapassar 20 caracteres.',
                'crc.regex' => 'O CRC possui caracteres inválidos.',
                'foto.image' => 'Selecione uma imagem válida.',
                'foto.max' => 'A imagem deve possuir no máximo 5 MB.',
            ],
        );

        $usuario->update([
            'name' => $dados['name'],
            'email' => $dados['email'],
        ]);

        if ($cliente) {
            $cliente->update([
                'telefone' => $dados['telefone'] ?? null,
                'cpf' => $dados['cpf'] ?? null,
            ]);
        }

        if ($contador) {
            $contador->update([
                'telefone' => $dados['telefone'] ?? null,
                'cpf' => $dados['cpf'] ?? null,
                'crc' => $dados['crc'],
            ]);
        }

        if ($request->hasFile('foto')) {
            $caminhoAnterior = $usuario->foto_perfil;
            $novoCaminho = $request->file('foto')->store(
                "fotos-perfil/{$usuario->id}",
                'public',
            );

            $usuario->update(['foto_perfil' => $novoCaminho]);

            if ($caminhoAnterior) {
                Storage::disk('public')->delete($caminhoAnterior);
            }
        }

        return response()->json([
            'message' => 'Perfil atualizado com sucesso.',
            'user' => [
                'name' => $usuario->name,
                'email' => $usuario->email,
                'cpf' => $cliente?->cpf ?? $contador?->cpf,
                'crc' => $contador?->crc,
                'telefone' => $cliente?->telefone ?? $contador?->telefone,
                'fotoUrl' => $usuario->foto_perfil
                    ? Storage::disk('public')->url($usuario->foto_perfil)
                    : null,
            ],
        ]);
    }

    public function alterarSenha(Request $request): JsonResponse
    {
        $dados = $request->validate(
            [
                'senhaAtual' => ['required', 'string'],
                'novaSenha' => [
                    'required',
                    'confirmed',
                    Password::min(8)->letters()->numbers(),
                ],
            ],
            [
                'novaSenha.confirmed' => 'A confirmação não corresponde à nova senha.',
            ],
        );

        if (!Hash::check($dados['senhaAtual'], $request->user()->password)) {
            return response()->json([
                'message' => 'A senha atual está incorreta.',
                'errors' => [
                    'senhaAtual' => ['A senha atual está incorreta.'],
                ],
            ], 422);
        }

        $request->user()->update(['password' => $dados['novaSenha']]);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Senha alterada com sucesso.',
        ]);
    }

    public function solicitarDesativacao(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'senha' => ['required', 'string'],
            'confirmacao' => ['accepted'],
        ]);

        if (!Hash::check($dados['senha'], $request->user()->password)) {
            return response()->json([
                'message' => 'A senha informada está incorreta.',
            ], 422);
        }

        $codigo = (string) random_int(100000, 999999);

        DB::table('solicitacoes_desativacao_conta')->updateOrInsert(
            ['user_id' => $request->user()->id],
            [
                'codigo_hash' => hash('sha256', $codigo),
                'expira_em' => now()->addMinutes(15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        Mail::raw(
            "Seu código de confirmação da WebContabil é {$codigo}. Ele expira em 15 minutos.",
            function ($mensagem) use ($request) {
                $mensagem
                    ->to($request->user()->email)
                    ->subject('Confirmação de desativação da conta');
            },
        );

        return response()->json([
            'message' => 'Enviamos um código de confirmação para o seu e-mail.',
            'codigoDesenvolvimento' => app()->environment('local')
                ? $codigo
                : null,
        ]);
    }

    public function confirmarDesativacao(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'codigo' => ['required', 'digits:6'],
        ]);

        $solicitacao = DB::table('solicitacoes_desativacao_conta')
            ->where('user_id', $request->user()->id)
            ->first();

        if (
            !$solicitacao ||
            now()->greaterThan($solicitacao->expira_em) ||
            !hash_equals(
                $solicitacao->codigo_hash,
                hash('sha256', $dados['codigo']),
            )
        ) {
            return response()->json([
                'message' => 'O código é inválido ou expirou.',
            ], 422);
        }

        DB::transaction(function () use ($request) {
            $request->user()->update(['status' => 'inativo']);

            DB::table('solicitacoes_desativacao_conta')
                ->where('user_id', $request->user()->id)
                ->delete();
        });

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Conta desativada com sucesso.',
        ]);
    }
}
