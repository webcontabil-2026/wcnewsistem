<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Solicitacao extends Model
{
    public const STATUS_PENDENTE = 'pendente';

    public const STATUS_AGUARDANDO_CLIENTE = 'aguardando_cliente';

    public const STATUS_EM_ANDAMENTO = 'em_andamento';

    public const STATUS_CONCLUIDA = 'concluida';

    public const STATUS_CANCELADA = 'cancelada';
    
    protected $table = 'solicitacoes';

    protected $fillable = [
        'cliente_id',
        'contador_id',
        'empresa_id',
        'servico_id',
        'descricao',
        'valor_orcamento',
        'status',
        'data_solicitacao',
        'data_resposta',
    ];

    /*
     * Converte valores e datas recebidos do banco.
     */

    protected function casts(): array
    {
        return [
            'valor_orcamento' => 'decimal:2',
            'data_solicitacao' => 'datetime',
            'data_resposta' => 'datetime',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function contador(): BelongsTo
    {
        return $this->belongsTo(Contador::class);
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function servico(): BelongsTo
    {
        return $this->belongsTo(Servico::class);
    }
}
