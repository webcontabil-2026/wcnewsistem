<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'clientes';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'user_id',
        'cpf',
        'telefone',
        'data_nascimento',
    ];

    /**
     * Converte automaticamente campos vindos do banco.
     */
    protected function casts(): array
    {
        return [
            'data_nascimento' => 'date:Y-m-d',
        ];
    }

    /**
     * Retorna o usuário responsável por este cadastro de cliente.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Retorna os lançamentos financeiros pertencentes ao cliente.
     */
    public function lancamentosFinanceiros(): HasMany
    {
        return $this->hasMany(
            LancamentoFinanceiro::class,
            'cliente_id'
        );
    }

    /**
     * Retorna os documentos vinculados ao cliente.
     */
    public function documentos(): HasMany
    {
        return $this->hasMany(
            Documento::class,
            'cliente_id'
        );
    }
    /**
 * Retorna as empresas pertencentes ao cliente.
 */
public function empresas(): HasMany
{
    return $this->hasMany(
        Empresa::class,
        'cliente_id'
    );
}
}