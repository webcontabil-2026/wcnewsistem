<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona a relação entre documentos e lançamentos financeiros.
     */
    public function up(): void
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->foreignId('lancamento_financeiro_id')
                ->nullable()
                ->after('empresa_id')
                ->constrained('lancamentos_financeiros')
                ->nullOnDelete();
        });
    }

    /**
     * Remove a relação caso a migration seja revertida.
     */
    public function down(): void
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->dropForeign([
                'lancamento_financeiro_id'
            ]);

            $table->dropColumn(
                'lancamento_financeiro_id'
            );
        });
    }
};