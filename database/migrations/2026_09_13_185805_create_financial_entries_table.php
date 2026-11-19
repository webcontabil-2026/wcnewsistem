<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Migration histórica mantida para instalações que já a registraram.
     *
     * A aplicação atual utiliza a tabela normalizada
     * "lancamentos_financeiros", criada no migration de domínio. Manter este
     * arquivo como operação neutra evita criar uma segunda tabela financeira
     * em instalações novas e não remove dados de instalações antigas.
     */
    public function up(): void
    {
        // Compatibilidade intencionalmente sem alteração de schema.
    }

    public function down(): void
    {
        // Não exclui a tabela legada automaticamente para preservar dados.
    }
};
