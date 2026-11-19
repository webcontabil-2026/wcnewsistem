<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria as preferências individuais de cada usuário.
     *
     * O tema é armazenado como texto e validado pela aplicação.
     */
    public function up(): void
    {
        if (Schema::hasTable('preferencias_usuario')) {
            return;
        }

        Schema::create('preferencias_usuario', function (Blueprint $table) {
            $table->id();

            // Cada usuário possui apenas um conjunto de preferências.
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Valores permitidos atualmente: light e dark.
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
