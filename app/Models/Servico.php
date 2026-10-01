<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Servico extends Model
{
    protected $table = 'servicos';

    protected $fillable = [
        'nome',
        'descricao',
        'tipo_cliente',
        'preco',
        'status',
    ];

    /*
     * Converte o preço para o formato decimal utilizado pelo banco.
     */
    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
        ];
    }

    /*
     * Retorna as solicitações relacionadas ao serviço.
     */
    public function solicitacoes(): HasMany
    {
        return $this->hasMany(Solicitacao::class);
    }
}