<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria as preferências individuais de cada usuário.
     *
     * O tema é armazenado como texto para permitir novas opções
     * futuramente, como alto contraste e outras paletas acessíveis.
     */
    public function up(): void
    {
        Schema::create('preferencias_usuario', function (Blueprint $table) {
            $table->id();

            // Cada usuário possui apenas um conjunto de preferências.
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            /*
             * Não utilizamos enum para facilitar a inclusão futura
             * de novos temas e modos de acessibilidade.
             *
             * Exemplos futuros:
             * dark
             * light
             * high-contrast
             */
            $table->string('tema', 40)->default('dark');

            // Preferências de notificações do usuário.
            $table->boolean('notificacoes_sistema')->default(true);
            $table->boolean('notificacoes_email')->default(true);
            $table->boolean('notificacoes_documentos')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Remove a tabela caso esta migration precise ser revertida.
     */
    public function down(): void
    {
        Schema::dropIfExists('preferencias_usuario');
    }
};