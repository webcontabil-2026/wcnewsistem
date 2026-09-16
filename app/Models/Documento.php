<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    /**
     * Tabela utilizada pelo model.
     */
    protected $table = 'documentos';

    /**
     * Campos permitidos para preenchimento em massa.
     */
    protected $fillable = [
        'cliente_id',
        'empresa_id',
        'lancamento_financeiro_id',
        'enviado_por',
        'enviado_para',
        'nome_original',
        'nome_arquivo',
        'caminho',
        'tipo_mime',
        'tamanho',
        'status',
    ];

    /**
     * Conversões automáticas aplicadas aos dados do banco.
     */
    protected function casts(): array
    {
        return [
            'tamanho' => 'integer',
        ];
    }

    /**
     * Cliente proprietário do documento.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(
            Cliente::class,
            'cliente_id'
        );
    }

    /**
     * Empresa relacionada ao documento, quando existir.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(
            Empresa::class,
            'empresa_id'
        );
    }

    /**
     * Usuário responsável pelo envio do documento.
     */
    public function enviadoPor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'enviado_por'
        );
    }

    /**
     * Usuário destinatário do documento, quando existir.
     */
    public function enviadoPara(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'enviado_para'
        );
    }

    /**
     * Lançamento financeiro associado ao documento, quando aplicável.
     */
    public function lancamentoFinanceiro(): BelongsTo
    {
        return $this->belongsTo(
            LancamentoFinanceiro::class,
            'lancamento_financeiro_id'
        );
    }
}