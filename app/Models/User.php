<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'status',
])]
#[Hidden([
    'password',
    'remember_token',
])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Converte automaticamente os campos do usuário.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Retorna o cadastro de cliente relacionado ao usuário.
     */
    public function cliente(): HasOne
    {
        return $this->hasOne(
            Cliente::class,
            'user_id'
        );
    }

    /**
     * Retorna o cadastro de contador relacionado ao usuário.
     *
     * O model Contador será criado no próximo passo.
     */
    public function contador(): HasOne
    {
        return $this->hasOne(
            Contador::class,
            'user_id'
        );
    }
}