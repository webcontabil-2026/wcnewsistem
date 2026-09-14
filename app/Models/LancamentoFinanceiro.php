<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LancamentoFinanceiro extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'lancamentos_financeiros';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'cliente_id',
        'empresa_id',
        'categoria_id',
        'descricao',
        'valor',
        'tipo',
        'data_lancamento',
        'data_vencimento',
        'data_pagamento',
        'status',
        'observacao',
    ];

    /**
     * Converte automaticamente os campos vindos do banco.
     */
    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'data_lancamento' => 'date:Y-m-d',
            'data_vencimento' => 'date:Y-m-d',
            'data_pagamento' => 'date:Y-m-d',
        ];
    }

    /**
     * Retorna o cliente proprietário do lançamento.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(
            Cliente::class,
            'cliente_id'
        );
    }

    /**
     * Retorna a categoria financeira do lançamento.
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(
            CategoriaFinanceira::class,
            'categoria_id'
        );
    }

    /**
     * Retorna a empresa relacionada ao lançamento, quando existir.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(
            Empresa::class,
            'empresa_id'
        );
    }
}