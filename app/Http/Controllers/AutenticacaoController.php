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
                    'regex:/^(?=.*\p{L})(?=.*\d).+$/u',
                    'max:255',
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
                    'string',
                    'max:14',
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
                    'max:30',
                    'unique:contadores,crc',
                ],

                /*
                 * Dados empresariais são opcionais.
                 * Caso um deles seja informado, o outro também será exigido.
                 */
                'razaoSocial' => [
                    'nullable',
                    'string',
                    'max:255',
                    'required_with:cnpj',
                ],

                'cnpj' => [
                    'nullable',
                    'string',
                    'max:18',
                    'required_with:razaoSocial',
                    'unique:empresas,cnpj',
                ],
            ],
            [
                'name.required' => 'Informe seu nome.',
                'name.max' => 'O nome não pode ultrapassar 255 caracteres.',

                'email.required' => 'Informe seu e-mail.',
                'email.email' => 'Informe um endereço de e-mail válido.',
                'email.unique' => 'Este e-mail já está cadastrado.',

                'password.required' => 'Informe uma senha.',
                'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
                'password.regex' => 'A senha deve conter pelo menos uma letra e um número.',

                'role.required' => 'Selecione o tipo de acesso.',
                'role.in' => 'O tipo de acesso selecionado é inválido.',

                'cpf.max' => 'O CPF deve ter no máximo 14 caracteres.',

                'crc.required' => 'Informe o CRC do contador.',
                'crc.unique' => 'Este CRC já está cadastrado.',

                'cnpj.unique' => 'Este CNPJ já está cadastrado.',
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

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'E-mail ou senha incorretos.',
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Autenticação realizada com sucesso.',
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
        ];
    }
}