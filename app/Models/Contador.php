<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contador extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'contadores';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'user_id',
        'cpf',
        'crc',
        'telefone',
        'status_profissional',
    ];

    /**
     * Retorna o usuário responsável pelo cadastro do contador.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id',
        );
    }

    /**
     * Retorna os vínculos do contador com empresas.
     */
    public function vinculosComEmpresas(): HasMany
    {
        return $this->hasMany(
            EmpresaContador::class,
            'contador_id',
        );
    }

    /**
     * Retorna as solicitações atribuídas ao contador.
     */
    public function solicitacoes(): HasMany
    {
        return $this->hasMany(
            Solicitacao::class,
            'contador_id',
        );
    }
}