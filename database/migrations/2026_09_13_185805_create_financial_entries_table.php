<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela responsável pelos lançamentos financeiros.
     */
    public function up(): void
    {
        Schema::create('financial_entries', function (Blueprint $table) {
            $table->id();

            /*
             * Identifica o cliente proprietário do lançamento.
             * Os lançamentos serão excluídos caso o usuário seja removido.
             */
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('type', 30);
            $table->string('description', 255);
            $table->string('category', 50);
            $table->decimal('amount', 15, 2);
            $table->date('date');

            /*
             * Informações do comprovante anexado.
             * O arquivo será armazenado fora da área pública.
             */
            $table->string('attachment_path')->nullable();
            $table->string('attachment_original_name')->nullable();
            $table->string('attachment_mime_type', 100)->nullable();
            $table->unsignedBigInteger('attachment_size')->nullable();

            $table->timestamps();

            /*
             * Melhora as consultas do gráfico por usuário, tipo e data.
             */
            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Remove a tabela caso a migration seja revertida.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_entries');
    }
};