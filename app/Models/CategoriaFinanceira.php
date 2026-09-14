<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaFinanceira extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'categorias_financeiras';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'nome',
        'tipo',
        'descricao',
    ];

    /**
     * Retorna os lançamentos financeiros vinculados à categoria.
     */
    public function lancamentosFinanceiros(): HasMany
    {
        return $this->hasMany(
            LancamentoFinanceiro::class,
            'categoria_id'
        );
    }
}