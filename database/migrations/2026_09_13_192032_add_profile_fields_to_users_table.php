<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona os dados de perfil e a função de acesso aos usuários.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            /*
             * O cargo será definido no cadastro e confirmado pelo servidor.
             * Administradores não poderão se cadastrar publicamente.
             */
            $table->string('role', 20)
                ->default('CLIENT')
                ->index();

            $table->string('razao_social')->nullable();
            $table->string('cpf', 14)->nullable()->unique();
            $table->string('cnpj', 18)->nullable()->unique();
            $table->string('crc', 30)->nullable()->unique();
        });
    }

    /**
     * Remove os campos caso a migration seja revertida.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropUnique(['cpf']);
            $table->dropUnique(['cnpj']);
            $table->dropUnique(['crc']);

            $table->dropColumn([
                'role',
                'razao_social',
                'cpf',
                'cnpj',
                'crc',
            ]);
        });
    }
};