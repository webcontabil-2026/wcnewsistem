<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Contador;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class AutenticacaoController extends Controller
{
    /**
     * Cadastra um novo cliente ou contador.
     *
     * Os dados básicos ficam em "users" e os dados específicos
     * são enviados para "clientes", "contadores" ou "empresas".
     */
    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'cpf' => $request->filled('cpf')
                ? preg_replace('/\D/', '', (string) $request->input('cpf'))
                : null,
            'cnpj' => $request->filled('cnpj')
                ? preg_replace('/\D/', '', (string) $request->input('cnpj'))
                : null,
            'crc' => $request->filled('crc')
                ? strtoupper(trim((string) $request->input('crc')))
                : null,
        ]);

        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:254',
                    'unique:users,email',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/^(?=.*\p{L})(?=.*\d).+$/u',
                    'max:72',
                ],

                'role' => [
                    'required',
                    Rule::in([
                        'CLIENT',
                        'ACCOUNTANT',
                    ]),
                ],

                /*
                 * CPF pode pertencer tanto ao cliente quanto ao contador.
                 * A validação específica será realizada mais abaixo.
                 */
                'cpf' => [
                    'nullable',
                    'digits:11',
                ],

                /*
                 * CRC é obrigatório somente para contadores.
                 */
                'crc' => [
                    Rule::requiredIf(
                        $request->input('role') === 'ACCOUNTANT'
                    ),
                    'nullable',
                    'string',
                    'max:20',
                    'regex:/^[A-Z0-9.\/-]+$/',
                    'unique:contadores,crc',
                ],

                /*
                 * Dados empresariais são opcionais.
                 * Caso um deles seja informado, o outro também será exigido.
                 */
                'razaoSocial' => [
                    'nullable',
                    'string',
                    'max:150',
                    'required_with:cnpj',
                ],

                'cnpj' => [
                    'nullable',
                    'digits:14',
                    'required_with:razaoSocial',
                    'unique:empresas,cnpj',
                ],
            ],
            [
                'name.required' => 'Informe seu nome.',
                'name.max' => 'O nome não pode ultrapassar 100 caracteres.',

                'email.required' => 'Informe seu e-mail.',
                'email.email' => 'Informe um endereço de e-mail válido.',
                'email.unique' => 'Este e-mail já está cadastrado.',

                'password.required' => 'Informe uma senha.',
                'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
                'password.regex' => 'A senha deve conter pelo menos uma letra e um número.',

                'role.required' => 'Selecione o tipo de acesso.',
                'role.in' => 'O tipo de acesso selecionado é inválido.',

                'cpf.digits' => 'O CPF deve possuir exatamente 11 dígitos.',

                'crc.required' => 'Informe o CRC do contador.',
                'crc.unique' => 'Este CRC já está cadastrado.',
                'crc.max' => 'O CRC não pode ultrapassar 20 caracteres.',
                'crc.regex' => 'O CRC possui caracteres inválidos.',

                'cnpj.unique' => 'Este CNPJ já está cadastrado.',
                'cnpj.digits' => 'O CNPJ deve possuir exatamente 14 dígitos.',
                'cnpj.required_with' => 'Informe o CNPJ da empresa.',

                'razaoSocial.required_with' => 'Informe a razão social da empresa.',
            ],
        );

        /*
         * Verifica o CPF na tabela correspondente ao tipo de usuário.
         */
        if (!empty($validated['cpf'])) {
            $cpfExiste = $validated['role'] === 'CLIENT'
                ? Cliente::where('cpf', $validated['cpf'])->exists()
                : Contador::where('cpf', $validated['cpf'])->exists();

            if ($cpfExiste) {
                return response()->json([
                    'message' => 'Este CPF já está cadastrado.',
                    'errors' => [
                        'cpf' => [
                            'Este CPF já está cadastrado.',
                        ],
                    ],
                ], 422);
            }
        }

        /*
         * A transação garante que o cadastro seja criado por completo.
         *
         * Se alguma das etapas falhar, nenhuma alteração será mantida
         * no banco de dados.
         */
        $user = DB::transaction(function () use ($validated) {
            /*
             * Cria os dados comuns de autenticação.
             */
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
                'status' => 'ativo',
            ]);

            /*
             * Cadastro específico de cliente.
             */
            if ($validated['role'] === 'CLIENT') {
                $cliente = Cliente::create([
                    'user_id' => $user->id,
                    'cpf' => $validated['cpf'] ?? null,
                ]);

                /*
                 * Caso sejam informados dados empresariais,
                 * cria também uma empresa vinculada ao cliente.
                 */
                if (
                    !empty($validated['cnpj']) &&
                    !empty($validated['razaoSocial'])
                ) {
                    Empresa::create([
                        'cliente_id' => $cliente->id,
                        'cnpj' => $validated['cnpj'],
                        'razao_social' => $validated['razaoSocial'],
                    ]);
                }
            }

            /*
             * Cadastro específico de contador.
             */
            if ($validated['role'] === 'ACCOUNTANT') {
                Contador::create([
                    'user_id' => $user->id,
                    'cpf' => $validated['cpf'] ?? null,
                    'crc' => $validated['crc'],
                    'status_profissional' => 'ativo',
                ]);
            }

            return $user;
        });

        /*
         * Faz login automaticamente após o cadastro.
         */
        Auth::login($user);

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Conta cadastrada com sucesso.',
            'user' => $this->formatUser($user),
        ], 201);
    }

    /**
     * Autentica o usuário usando e-mail e senha.
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

        if (!Auth::attempt([
            ...$credentials,
            'status' => 'ativo',
        ])) {
            return response()->json([
                'message' => 'E-mail ou senha incorretos.',
            ], 422);
        }

        if ($request->user()?->role === 'ADMIN') {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Use a entrada administrativa exclusiva.',
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Autenticação realizada com sucesso.',
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Acesso administrativo separado do cadastro e login públicos.
     * Além das credenciais pessoais, exige a chave privada do servidor.
     */
    public function adminLogin(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'email' => ['required', 'string', 'email', 'max:254'],
            'password' => ['required', 'string', 'max:72'],
            'accessKey' => ['required', 'string', 'max:128'],
        ]);

        $chaveConfigurada = (string) config('webcontabil.admin_access_key', '');

        if (
            $chaveConfigurada === '' ||
            !hash_equals($chaveConfigurada, $dados['accessKey']) ||
            !Auth::attempt([
                'email' => $dados['email'],
                'password' => $dados['password'],
                'role' => 'ADMIN',
                'status' => 'ativo',
            ])
        ) {
            return response()->json([
                'message' => 'Credenciais administrativas inválidas.',
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Acesso administrativo autorizado.',
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Retorna o usuário atualmente autenticado.
     */
    public function current(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Encerra a sessão do usuário.
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
     * Converte os dados do banco para o formato esperado pelo React.
     *
     * Assim o frontend não precisa conhecer a organização interna
     * das tabelas do banco de dados.
     *
     * @return array<string, mixed>
     */
    private function formatUser(User $user): array
    {
        /*
         * Carrega os relacionamentos somente quando necessário.
         */
        $user->loadMissing([
            'cliente',
            'contador',
        ]);

        $empresa = null;

        /*
         * Se o usuário for cliente, recupera sua primeira empresa.
         */
        if ($user->cliente) {
            $empresa = $user->cliente
                ->empresas()
                ->first();
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,

            'cpf' => $user->cliente?->cpf
                ?? $user->contador?->cpf,

            'crc' => $user->contador?->crc,

            'razaoSocial' => $empresa?->razao_social,

            'cnpj' => $empresa?->cnpj,

            'telefone' => $user->cliente?->telefone
                ?? $user->contador?->telefone,

            'fotoUrl' => $user->foto_perfil
                ? Storage::disk('public')->url($user->foto_perfil)
                : null,
        ];
    }
}
