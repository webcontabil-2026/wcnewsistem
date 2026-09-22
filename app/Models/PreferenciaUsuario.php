<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreferenciaUsuario extends Model
{
    use HasFactory;

    /**
     * Tabela associada ao model.
     */
    protected $table = 'preferencias_usuario';

    /**
     * Campos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'user_id',
        'tema',
        'notificacoes_sistema',
        'notificacoes_email',
        'notificacoes_documentos',
    ];

    /**
     * Converte automaticamente os campos booleanos.
     */
    protected $casts = [
        'notificacoes_sistema' => 'boolean',
        'notificacoes_email' => 'boolean',
        'notificacoes_documentos' => 'boolean',
    ];

    /**
     * Usuário dono destas preferências.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}