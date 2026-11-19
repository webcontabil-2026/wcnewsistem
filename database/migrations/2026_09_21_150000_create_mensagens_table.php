<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('mensagens')) {
            return;
        }

        Schema::create('mensagens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitacao_id')
                ->constrained('solicitacoes')->cascadeOnDelete();
            $table->foreignId('remetente_user_id')
                ->constrained('users')->cascadeOnDelete();
            $table->text('mensagem');
            $table->timestamp('lida_em')->nullable();
            $table->timestamps();
            $table->index(['solicitacao_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mensagens');
    }
};
