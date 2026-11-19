<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria as tabelas de domínio usadas pelos models da aplicação.
     *
     * As verificações preservam instalações que já possuam essas tabelas,
     * evitando perda de dados ao atualizar uma versão existente do sistema.
     */
    public function up(): void
    {
        if (!Schema::hasTable('clientes')) {
            Schema::create('clientes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()
                    ->constrained()->cascadeOnDelete();
                $table->string('cpf', 14)->nullable()->unique();
                $table->string('telefone', 20)->nullable();
                $table->date('data_nascimento')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contadores')) {
            Schema::create('contadores', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()
                    ->constrained()->cascadeOnDelete();
                $table->string('cpf', 14)->nullable()->unique();
                $table->string('crc', 30)->unique();
                $table->string('telefone', 20)->nullable();
                $table->string('status_profissional', 30)->default('ativo');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('empresas')) {
            Schema::create('empresas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cliente_id')
                    ->constrained('clientes')->cascadeOnDelete();
                $table->string('cnpj', 18)->unique();
                $table->string('razao_social');
                $table->string('nome_fantasia')->nullable();
                $table->string('porte', 40)->nullable();
                $table->string('situacao', 40)->default('ativa');
                $table->string('telefone', 20)->nullable();
                $table->string('email')->nullable();
                $table->string('endereco')->nullable();
                $table->string('cidade', 100)->nullable();
                $table->string('estado', 2)->nullable();
                $table->string('cep', 10)->nullable();
                $table->timestamps();
                $table->index('cliente_id');
            });
        }

        if (!Schema::hasTable('empresa_contador')) {
            Schema::create('empresa_contador', function (Blueprint $table) {
                $table->id();
                $table->foreignId('empresa_id')
                    ->constrained('empresas')->cascadeOnDelete();
                $table->foreignId('contador_id')
                    ->constrained('contadores')->cascadeOnDelete();
                $table->string('status', 30)->default('ativo');
                $table->date('data_inicio')->nullable();
                $table->date('data_fim')->nullable();
                $table->timestamps();
                $table->unique(['empresa_id', 'contador_id']);
            });
        }

        if (!Schema::hasTable('categorias_financeiras')) {
            Schema::create('categorias_financeiras', function (Blueprint $table) {
                $table->id();
                $table->string('nome', 100);
                $table->string('tipo', 30)->default('ambos');
                $table->string('descricao')->nullable();
                $table->timestamps();
                $table->unique(['nome', 'tipo']);
            });
        }

        if (!Schema::hasTable('lancamentos_financeiros')) {
            Schema::create('lancamentos_financeiros', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cliente_id')
                    ->constrained('clientes')->cascadeOnDelete();
                $table->foreignId('empresa_id')->nullable()
                    ->constrained('empresas')->nullOnDelete();
                $table->foreignId('categoria_id')
                    ->constrained('categorias_financeiras')->restrictOnDelete();
                $table->string('descricao');
                $table->decimal('valor', 15, 2);
                $table->string('tipo', 30);
                $table->date('data_lancamento');
                $table->date('data_vencimento')->nullable();
                $table->date('data_pagamento')->nullable();
                $table->string('status', 30)->default('ativo');
                $table->text('observacao')->nullable();
                $table->timestamps();
                $table->index(['cliente_id', 'data_lancamento']);
                $table->index(['cliente_id', 'tipo']);
            });
        }

        if (!Schema::hasTable('documentos')) {
            Schema::create('documentos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cliente_id')
                    ->constrained('clientes')->cascadeOnDelete();
                $table->foreignId('empresa_id')->nullable()
                    ->constrained('empresas')->nullOnDelete();
                $table->foreignId('lancamento_financeiro_id')->nullable()
                    ->constrained('lancamentos_financeiros')->nullOnDelete();
                $table->foreignId('enviado_por')
                    ->constrained('users')->cascadeOnDelete();
                $table->foreignId('enviado_para')->nullable()
                    ->constrained('users')->nullOnDelete();
                $table->string('nome_original');
                $table->string('nome_arquivo');
                $table->string('caminho');
                $table->string('tipo_mime', 120)->nullable();
                $table->unsignedBigInteger('tamanho')->default(0);
                $table->string('status', 30)->default('ativo');
                $table->timestamps();
                $table->index(['cliente_id', 'created_at']);
            });
        }

        if (!Schema::hasTable('servicos')) {
            Schema::create('servicos', function (Blueprint $table) {
                $table->id();
                $table->string('nome');
                $table->text('descricao')->nullable();
                $table->string('tipo_cliente', 30);
                $table->decimal('preco', 12, 2)->nullable();
                $table->string('status', 30)->default('ativo');
                $table->timestamps();
                $table->unique(['nome', 'tipo_cliente']);
                $table->index(['tipo_cliente', 'status']);
            });
        }

        if (!Schema::hasTable('solicitacoes')) {
            Schema::create('solicitacoes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cliente_id')
                    ->constrained('clientes')->cascadeOnDelete();
                $table->foreignId('contador_id')->nullable()
                    ->constrained('contadores')->nullOnDelete();
                $table->foreignId('empresa_id')->nullable()
                    ->constrained('empresas')->nullOnDelete();
                $table->foreignId('servico_id')
                    ->constrained('servicos')->restrictOnDelete();
                $table->text('descricao')->nullable();
                $table->decimal('valor_orcamento', 12, 2)->nullable();
                $table->string('status', 30)->default('pendente');
                $table->timestamp('data_solicitacao')->useCurrent();
                $table->timestamp('data_resposta')->nullable();
                $table->timestamps();
                $table->index(['cliente_id', 'status']);
                $table->index(['contador_id', 'status']);
            });
        }
    }

    /**
     * Não remove tabelas neste migration de compatibilidade.
     * Isso evita apagar dados de bases que já existiam antes dele.
     */
    public function down(): void
    {
        // Rollback intencionalmente não destrutivo.
    }
};
