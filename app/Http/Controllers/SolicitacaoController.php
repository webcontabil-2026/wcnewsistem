<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SolicitacaoController extends Controller
{
    /**
     * Lista as solicitações permitidas para o usuário autenticado.
     */
    public function listar(Request $request): JsonResponse
    {
        $usuario = $request->user();

        $consulta = Solicitacao::query()
            ->with([
                'cliente.user',
                'contador.user',
                'empresa',
                'servico',
            ]);

        if ($usuario->role === 'CLIENT') {
            $cliente = $usuario->cliente;

            if (!$cliente) {
                return response()->json([
                    'message' => 'O cadastro de cliente não foi encontrado.',
                ], 403);
            }

            $consulta->where('cliente_id', $cliente->id);
        } elseif ($usuario->role === 'ACCOUNTANT') {
            $contador = $usuario->contador;

            if (!$contador) {
                return response()->json([
                    'message' => 'O cadastro de contador não foi encontrado.',
                ], 403);
            }

            /*
             * O contador visualiza solicitações ainda não atribuídas
             * e aquelas que já estão sob sua responsabilidade.
             */
            $consulta->where(
                fn (Builder $consultaContador) => $consultaContador
                    ->whereNull('contador_id')
                    ->orWhere('contador_id', $contador->id),
            );
        } elseif ($usuario->role !== 'ADMIN') {
            return response()->json([
                'message' => 'Seu perfil não possui acesso às solicitações.',
            ], 403);
        }

        $solicitacoes = $consulta
            ->orderByDesc('data_solicitacao')
            ->orderByDesc('id')
            ->get()
            ->map(
                fn (Solicitacao $solicitacao): array =>
                    $this->formatarSolicitacao($solicitacao),
            )
            ->values();

        return response()->json([
            'solicitacoes' => $solicitacoes,
        ]);
    }

    /**
     * Cria uma solicitação para o cliente autenticado.
     */
    public function criar(Request $request): JsonResponse
    {
        $usuario = $request->user();

        if ($usuario->role !== 'CLIENT') {
            return response()->json([
                'message' => 'Somente clientes podem criar solicitações.',
            ], 403);
        }

        $cliente = $usuario->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'O cadastro de cliente não foi encontrado.',
            ], 403);
        }

        $dadosValidados = $request->validate(
            [
                'servicoId' => [
                    'required',
                    'integer',
                    Rule::exists('servicos', 'id')
                        ->where('status', 'ativo'),
                ],

                'empresaId' => [
                    'nullable',
                    'integer',
                    'exists:empresas,id',
                ],

                'descricao' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],
            ],
            [
                'servicoId.required' => 'Selecione um serviço.',
                'servicoId.exists' => 'O serviço selecionado não está disponível.',
                'empresaId.exists' => 'A empresa selecionada não foi encontrada.',
                'descricao.max' => 'A descrição não pode ultrapassar 2000 caracteres.',
            ],
        );

        /*
         * Impede que um cliente utilize uma empresa pertencente
         * a outro cliente.
         */
        if (
            isset($dadosValidados['empresaId']) &&
            !$cliente->empresas()
                ->whereKey($dadosValidados['empresaId'])
                ->exists()
        ) {
            return response()->json([
                'message' => 'A empresa selecionada não pertence à sua conta.',
            ], 403);
        }

        $solicitacao = $cliente->solicitacoes()->create([
            'empresa_id' => $dadosValidados['empresaId'] ?? null,
            'servico_id' => $dadosValidados['servicoId'],
            'descricao' => $dadosValidados['descricao'] ?? null,
            'status' => Solicitacao::STATUS_PENDENTE,
            'data_solicitacao' => now(),
        ]);

        $solicitacao->load([
            'cliente.user',
            'contador.user',
            'empresa',
            'servico',
        ]);

        return response()->json([
            'message' => 'Solicitação enviada com sucesso.',
            'solicitacao' => $this->formatarSolicitacao($solicitacao),
        ], 201);
    }

    /**
     * Registra ou atualiza o orçamento enviado por um contador.
     */
    public function enviarOrcamento(
        Request $request,
        Solicitacao $solicitacao,
    ): JsonResponse {
        $usuario = $request->user();

        if ($usuario->role !== 'ACCOUNTANT') {
            return response()->json([
                'message' => 'Somente contadores podem enviar orçamentos.',
            ], 403);
        }

        $contador = $usuario->contador;

        if (!$contador) {
            return response()->json([
                'message' => 'O cadastro de contador não foi encontrado.',
            ], 403);
        }

        $dadosValidados = $request->validate(
            [
                'valorOrcamento' => [
                    'required',
                    'numeric',
                    'min:0.01',
                    'max:99999999.99',
                ],
            ],
            [
                'valorOrcamento.required' => 'Informe o valor do orçamento.',
                'valorOrcamento.numeric' => 'O orçamento deve possuir um valor numérico.',
                'valorOrcamento.min' => 'O orçamento deve ser maior que zero.',
                'valorOrcamento.max' => 'O valor informado ultrapassa o limite permitido.',
            ],
        );

        /*
         * O bloqueio impede que dois contadores assumam
         * a mesma solicitação simultaneamente.
         */
        $solicitacaoAtualizada = DB::transaction(
            function () use (
                $solicitacao,
                $contador,
                $dadosValidados,
            ): Solicitacao {
                $solicitacaoBloqueada = Solicitacao::query()
                    ->lockForUpdate()
                    ->findOrFail($solicitacao->id);

                if (
                    $solicitacaoBloqueada->contador_id !== null &&
                    $solicitacaoBloqueada->contador_id !== $contador->id
                ) {
                    abort(
                        409,
                        'Esta solicitação já foi assumida por outro contador.',
                    );
                }

                if (
                    !in_array(
                        $solicitacaoBloqueada->status,
                        [
                            Solicitacao::STATUS_PENDENTE,
                            Solicitacao::STATUS_AGUARDANDO_CLIENTE,
                        ],
                        true,
                    )
                ) {
                    abort(
                        422,
                        'O orçamento não pode ser alterado no status atual.',
                    );
                }

                $solicitacaoBloqueada->update([
                    'contador_id' => $contador->id,
                    'valor_orcamento' => $dadosValidados['valorOrcamento'],
                    'status' => Solicitacao::STATUS_AGUARDANDO_CLIENTE,
                    'data_resposta' => now(),
                ]);

                return $solicitacaoBloqueada;
            },
        );

        $solicitacaoAtualizada->load([
            'cliente.user',
            'contador.user',
            'empresa',
            'servico',
        ]);

        return response()->json([
            'message' => 'Orçamento enviado ao cliente com sucesso.',
            'solicitacao' => $this->formatarSolicitacao(
                $solicitacaoAtualizada,
            ),
        ]);
    }

    /**
     * Registra a decisão do cliente sobre o orçamento recebido.
     */
    public function responderOrcamento(
        Request $request,
        Solicitacao $solicitacao,
    ): JsonResponse {
        $usuario = $request->user();

        if ($usuario->role !== 'CLIENT') {
            return response()->json([
                'message' => 'Somente clientes podem responder orçamentos.',
            ], 403);
        }

        $cliente = $usuario->cliente;

        if (!$cliente) {
            return response()->json([
                'message' => 'O cadastro de cliente não foi encontrado.',
            ], 403);
        }

        $dadosValidados = $request->validate(
            [
                'decisao' => [
                    'required',
                    'string',
                    Rule::in(['aceitar', 'recusar']),
                ],
            ],
            [
                'decisao.required' => 'Informe se deseja aceitar ou recusar o orçamento.',
                'decisao.in' => 'A decisão informada não é válida.',
            ],
        );

        /*
         * Bloqueia o registro durante a decisão para impedir
         * alterações simultâneas no orçamento.
         */
        $solicitacaoAtualizada = DB::transaction(
            function () use (
                $solicitacao,
                $cliente,
                $dadosValidados,
            ): Solicitacao {
                $solicitacaoBloqueada = Solicitacao::query()
                    ->lockForUpdate()
                    ->findOrFail($solicitacao->id);

                if ($solicitacaoBloqueada->cliente_id !== $cliente->id) {
                    abort(
                        403,
                        'Esta solicitação não pertence à sua conta.',
                    );
                }

                if (
                    $solicitacaoBloqueada->status !==
                    Solicitacao::STATUS_AGUARDANDO_CLIENTE
                ) {
                    abort(
                        422,
                        'Esta solicitação não possui um orçamento aguardando resposta.',
                    );
                }

                if (
                    $solicitacaoBloqueada->contador_id === null ||
                    $solicitacaoBloqueada->valor_orcamento === null
                ) {
                    abort(
                        422,
                        'O orçamento desta solicitação está incompleto.',
                    );
                }

                $novoStatus = $dadosValidados['decisao'] === 'aceitar'
                    ? Solicitacao::STATUS_EM_ANDAMENTO
                    : Solicitacao::STATUS_CANCELADA;

                $solicitacaoBloqueada->update([
                    'status' => $novoStatus,
                ]);

                return $solicitacaoBloqueada;
            },
        );

        $solicitacaoAtualizada->load([
            'cliente.user',
            'contador.user',
            'empresa',
            'servico',
        ]);

        $mensagem = $dadosValidados['decisao'] === 'aceitar'
            ? 'Orçamento aceito com sucesso.'
            : 'Orçamento recusado com sucesso.';

        return response()->json([
            'message' => $mensagem,
            'solicitacao' => $this->formatarSolicitacao(
                $solicitacaoAtualizada,
            ),
        ]);
    }

    /**
     * Converte uma solicitação para o formato utilizado pelo React.
     *
     * @return array<string, mixed>
     */
    private function formatarSolicitacao(
        Solicitacao $solicitacao,
    ): array {
        return [
            'id' => $solicitacao->id,

            'cliente' => [
                'id' => $solicitacao->cliente_id,
                'nome' => $solicitacao->cliente?->user?->name,
                'email' => $solicitacao->cliente?->user?->email,
            ],

            'contador' => $solicitacao->contador
                ? [
                    'id' => $solicitacao->contador_id,
                    'nome' => $solicitacao->contador->user?->name,
                ]
                : null,

            'empresa' => $solicitacao->empresa
                ? [
                    'id' => $solicitacao->empresa_id,
                    'razaoSocial' => $solicitacao->empresa->razao_social,
                    'nomeFantasia' => $solicitacao->empresa->nome_fantasia,
                ]
                : null,

            'servico' => [
                'id' => $solicitacao->servico_id,
                'nome' => $solicitacao->servico?->nome,
                'tipoCliente' => $solicitacao->servico?->tipo_cliente,
            ],

            'descricao' => $solicitacao->descricao,

            'valorOrcamento' => $solicitacao->valor_orcamento !== null
                ? (float) $solicitacao->valor_orcamento
                : null,

            'status' => $solicitacao->status,

            'dataSolicitacao' => $solicitacao
                ->data_solicitacao
                ?->toIso8601String(),

            'dataResposta' => $solicitacao
                ->data_resposta
                ?->toIso8601String(),
        ];
    }
}