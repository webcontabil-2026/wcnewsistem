<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mensagem extends Model
{
    protected $table = 'mensagens';

    protected $fillable = [
        'solicitacao_id',
        'remetente_user_id',
        'mensagem',
        'lida_em',
    ];

    protected function casts(): array
    {
        return [
            'lida_em' => 'datetime',
        ];
    }

    public function solicitacao(): BelongsTo
    {
        return $this->belongsTo(Solicitacao::class);
    }

    public function remetente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'remetente_user_id');
    }
}
