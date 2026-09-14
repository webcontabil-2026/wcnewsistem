<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Cadastra clientes e contadores.
     * O cadastro público de administradores não é permitido.
     */
    public function register(Request $request): JsonResponse
    {
       $validated = $request->validate(
    [
        'name' => [
            'required',
            'string',
            'max:255',
        ],
        'email' => [
            'required',
            'string',
            'email',
            'max:255',
            'unique:users,email',
        ],
        'password' => [
            'required',
            'string',
            'min:8',

            /*
             * Exige pelo menos uma letra e um número.
             */
            'regex:/^(?=.*\p{L})(?=.*\d).+$/u',

            'max:255',
        ],
        'role' => [
            'required',
            Rule::in(['CLIENT', 'ACCOUNTANT']),
        ],
        'razaoSocial' => [
            'nullable',
            'string',
            'max:255',
        ],
        'cpf' => [
            'nullable',
            'string',
            'max:14',
            'unique:users,cpf',
        ],
        'cnpj' => [
            'nullable',
            'string',
            'max:18',
            'unique:users,cnpj',
        ],
        'crc' => [
            Rule::requiredIf(
                $request->input('role') === 'ACCOUNTANT'
            ),
            'nullable',
            'string',
            'max:30',
            'unique:users,crc',
        ],
    ],
    [
        'name.required' => 'Informe seu nome.',
        'name.max' => 'O nome não pode ultrapassar 255 caracteres.',

        'email.required' => 'Informe seu e-mail.',
        'email.email' => 'Informe um endereço de e-mail válido.',
        'email.unique' => 'Este e-mail já está cadastrado.',
        'email.max' => 'O e-mail informado é muito longo.',

        'password.required' => 'Informe uma senha.',
        'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
        'password.regex' => 'A senha deve conter pelo menos uma letra e um número.',
        'password.max' => 'A senha não pode ultrapassar 255 caracteres.',

        'role.required' => 'Selecione o tipo de acesso.',
        'role.in' => 'O tipo de acesso selecionado é inválido.',

        'razaoSocial.max' => 'A razão social não pode ultrapassar 255 caracteres.',

        'cpf.max' => 'O CPF deve ter no máximo 14 caracteres.',
        'cpf.unique' => 'Este CPF já está cadastrado.',

        'cnpj.max' => 'O CNPJ deve ter no máximo 18 caracteres.',
        'cnpj.unique' => 'Este CNPJ já está cadastrado.',

        'crc.required' => 'Informe o CRC do contador.',
        'crc.max' => 'O CRC deve ter no máximo 30 caracteres.',
        'crc.unique' => 'Este CRC já está cadastrado.',
    ],
);

        /*
         * O cargo é atribuído separadamente porque não faz parte
         * dos campos liberados para preenchimento em massa.
         */
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'razao_social' => $validated['razaoSocial'] ?? null,
            'cpf' => $validated['cpf'] ?? null,
            'cnpj' => $validated['cnpj'] ?? null,
            'crc' => $validated['crc'] ?? null,
        ]);

        $user->role = $validated['role'];
        $user->save();

        /*
         * Inicia a sessão imediatamente após o cadastro.
         */
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Conta cadastrada com sucesso.',
            'user' => $this->formatUser($user),
        ], 201);
    }

    /**
     * Autentica o usuário pelo e-mail e pela senha.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(
    [
        'email' => [
            'required',
            'string',
            'email',
        ],
        'password' => [
            'required',
            'string',
        ],
    ],
    [
        'email.required' => 'Informe seu e-mail.',
        'email.email' => 'Informe um endereço de e-mail válido.',
        'password.required' => 'Informe sua senha.',
    ],
);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'E-mail ou senha incorretos.',
            ], 422);
        }

        /*
         * Regenera a sessão para evitar ataques de fixação de sessão.
         */
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Autenticação realizada com sucesso.',
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Retorna o usuário que possui uma sessão ativa.
     */
    public function current(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Encerra a sessão atual com segurança.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sessão encerrada com sucesso.',
        ]);
    }

    /**
     * Converte os campos do banco para o padrão utilizado pelo React.
     *
     * @return array<string, int|string|null>
     */
    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'razaoSocial' => $user->razao_social,
            'cpf' => $user->cpf,
            'cnpj' => $user->cnpj,
            'crc' => $user->crc,
        ];
    }
}