<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'documentos';

    /**
     * Campos que podem ser preenchidos pela aplicação.
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
     * Converte automaticamente os campos vindos do banco.
     */
    protected function casts(): array
    {
        return [
            'tamanho' => 'integer',
        ];
    }

    /**
     * Retorna o cliente relacionado ao documento.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(
            Cliente::class,
            'cliente_id'
        );
    }

    /**
     * Retorna a empresa relacionada ao documento, quando existir.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(
            Empresa::class,
            'empresa_id'
        );
    }

    /**
     * Retorna o usuário que enviou o documento.
     */
    public function enviadoPor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'enviado_por'
        );
    }

     /**
     * Retorna o usuário destinatário do documento.
     */
    public function enviadoPara(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'enviado_para'
        );
    }

    /**
     * Retorna o lançamento financeiro relacionado ao documento.
     */
    public function lancamentoFinanceiro(): BelongsTo
    {
        return $this->belongsTo(
            LancamentoFinanceiro::class,
            'lancamento_financeiro_id'
        );
    }
}