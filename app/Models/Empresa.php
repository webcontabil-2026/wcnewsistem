<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'empresas';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'cliente_id',
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'porte',
        'situacao',
        'telefone',
        'email',
        'endereco',
        'cidade',
        'estado',
        'cep',
    ];

    /**
     * Retorna o cliente proprietário da empresa.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(
            Cliente::class,
            'cliente_id'
        );
    }

    /**
     * Retorna os lançamentos financeiros vinculados à empresa.
     */
    public function lancamentosFinanceiros(): HasMany
    {
        return $this->hasMany(
            LancamentoFinanceiro::class,
            'empresa_id'
        );
    }

    /**
     * Retorna os documentos vinculados à empresa.
     */
    public function documentos(): HasMany
    {
        return $this->hasMany(
            Documento::class,
            'empresa_id'
        );
    }    /**
     * Retorna os vínculos entre a empresa e os contadores.
     */
    public function vinculosComContadores(): HasMany
    {
        return $this->hasMany(
            EmpresaContador::class,
            'empresa_id'
        );
    }
}
