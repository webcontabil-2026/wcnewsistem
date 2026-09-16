<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LancamentoFinanceiro extends Model
{
    use HasFactory;

    /**
     * Tabela utilizada pelo model.
     */
    protected $table = 'lancamentos_financeiros';

    /**
     * Campos permitidos para preenchimento em massa.
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
     * Conversões automáticas aplicadas aos dados do banco.
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
     * Cliente proprietário do lançamento.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(
            Cliente::class,
            'cliente_id'
        );
    }

    /**
     * Categoria financeira associada ao lançamento.
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(
            CategoriaFinanceira::class,
            'categoria_id'
        );
    }

    /**
     * Empresa relacionada ao lançamento, quando existir.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(
            Empresa::class,
            'empresa_id'
        );
    }

    /**
     * Documentos vinculados ao lançamento financeiro.
     */
    public function documentos(): HasMany
    {
        return $this->hasMany(
            Documento::class,
            'lancamento_financeiro_id'
        );
    }
}