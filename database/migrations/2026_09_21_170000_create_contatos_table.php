<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('contatos')) {
            return;
        }

        Schema::create('contatos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100);
            $table->string('email', 150);
            $table->string('perfil', 2);
            $table->string('documento', 18);
            $table->string('telefone', 20)->nullable();
            $table->string('servico', 120);
            $table->string('empresa', 150)->nullable();
            $table->text('mensagem');
            $table->string('status', 30)->default('novo');
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contatos');
    }
};
