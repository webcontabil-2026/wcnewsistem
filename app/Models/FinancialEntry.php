<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialEntry extends Model
{
    use HasFactory;

    /**
     * Campos que podem ser preenchidos pela aplicação.
     */
    protected $fillable = [
        'user_id',
        'type',
        'description',
        'category',
        'amount',
        'date',
        'attachment_path',
        'attachment_original_name',
        'attachment_mime_type',
        'attachment_size',
    ];

    /**
     * Converte automaticamente valores vindos do banco.
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date' => 'date:Y-m-d',
            'attachment_size' => 'integer',
        ];
    }

    /**
     * Retorna o cliente proprietário do lançamento.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}