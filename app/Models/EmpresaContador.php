<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmpresaContador extends Model
{
    use HasFactory;

    /**
     * Nome da tabela correspondente no banco.
     */
    protected $table = 'empresa_contador';

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'empresa_id',
        'contador_id',
        'status',
        'data_inicio',
        'data_fim',
    ];

    /**
     * Converte automaticamente os campos de data.
     */
    protected function casts(): array
    {
        return [
            'data_inicio' => 'date:Y-m-d',
            'data_fim' => 'date:Y-m-d',
        ];
    }

    /**
     * Retorna a empresa relacionada ao vínculo.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(
            Empresa::class,
            'empresa_id'
        );
    }

    /**
     * Retorna o contador relacionado ao vínculo.
     */
    public function contador(): BelongsTo
    {
        return $this->belongsTo(
            Contador::class,
            'contador_id'
        );
    }
}