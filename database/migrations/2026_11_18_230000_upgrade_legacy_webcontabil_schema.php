<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Alinha bancos criados antes da adoção completa das migrations.
     *
     * Todas as operações são condicionais para preservar tabelas e dados
     * existentes. Esta migration pode ser utilizada tanto em uma base antiga
     * quanto em uma instalação nova do sistema.
     */
    public function up(): void
    {
        $this->criarTabelasDeSuporteDoLaravel();
        $this->completarTabelaDeUsuarios();
        $this->compatibilizarTabelaDeMensagens();
        $this->registrarMigrationsLegadasJaAtendidas();
    }

    /**
     * Cria apenas as tabelas auxiliares que ainda não existirem.
     */
    private function criarTabelasDeSuporteDoLaravel(): void
    {
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }

        if (!Schema::hasTable('cache')) {
            Schema::create('cache', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->mediumText('value');
                $table->bigInteger('expiration')->index();
            });
        }

        if (!Schema::hasTable('cache_locks')) {
            Schema::create('cache_locks', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->string('owner');
                $table->bigInteger('expiration')->index();
            });
        }

        if (!Schema::hasTable('jobs')) {
            Schema::create('jobs', function (Blueprint $table) {
                $table->id();
                $table->string('queue')->index();
                $table->longText('payload');
                $table->unsignedSmallInteger('attempts');
                $table->unsignedInteger('reserved_at')->nullable();
                $table->unsignedInteger('available_at');
                $table->unsignedInteger('created_at');
            });
        }

        if (!Schema::hasTable('job_batches')) {
            Schema::create('job_batches', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('name');
                $table->integer('total_jobs');
                $table->integer('pending_jobs');
                $table->integer('failed_jobs');
                $table->longText('failed_job_ids');
                $table->mediumText('options')->nullable();
                $table->integer('cancelled_at')->nullable();
                $table->integer('created_at');
                $table->integer('finished_at')->nullable();
            });
        }

        if (!Schema::hasTable('failed_jobs')) {
            Schema::create('failed_jobs', function (Blueprint $table) {
                $table->id();
                $table->string('uuid')->unique();
                $table->string('connection');
                $table->string('queue');
                $table->longText('payload');
                $table->longText('exception');
                $table->timestamp('failed_at')->useCurrent();
                $table->index(['connection', 'queue', 'failed_at']);
            });
        }
    }

    /**
     * Acrescenta somente os campos de usuário ausentes na base antiga.
     */
    private function completarTabelaDeUsuarios(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 20)->default('CLIENT')->index();
            });
        }

        if (!Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('status', 30)->default('ativo')->index();
            });
        }

        if (!Schema::hasColumn('users', 'razao_social')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('razao_social')->nullable();
            });
        }

        if (!Schema::hasColumn('users', 'cpf')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('cpf', 14)->nullable()->unique();
            });
        }

        if (!Schema::hasColumn('users', 'cnpj')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('cnpj', 18)->nullable()->unique();
            });
        }

        if (!Schema::hasColumn('users', 'crc')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('crc', 30)->nullable()->unique();
            });
        }

        if (!Schema::hasColumn('users', 'foto_perfil')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('foto_perfil')->nullable();
            });
        }
    }

    /**
     * Mantém as colunas antigas e adiciona as utilizadas pelo atendimento
     * vinculado a solicitações. As colunas legadas ficam opcionais para que
     * novas mensagens possam ser gravadas sem apagar o histórico anterior.
     */
    private function compatibilizarTabelaDeMensagens(): void
    {
        if (!Schema::hasTable('mensagens')) {
            return;
        }

        $adicionouSolicitacao = false;
        $adicionouRemetente = false;

        if (!Schema::hasColumn('mensagens', 'solicitacao_id')) {
            Schema::table('mensagens', function (Blueprint $table) {
                $table->unsignedBigInteger('solicitacao_id')
                    ->nullable()
                    ->after('id');
                $table->index(
                    ['solicitacao_id', 'created_at'],
                    'mensagens_solicitacao_created_at_index',
                );
            });

            $adicionouSolicitacao = true;
        }

        if (!Schema::hasColumn('mensagens', 'remetente_user_id')) {
            Schema::table('mensagens', function (Blueprint $table) {
                $table->unsignedBigInteger('remetente_user_id')
                    ->nullable()
                    ->after('solicitacao_id');
            });

            if (Schema::hasColumn('mensagens', 'remetente_id')) {
                DB::table('mensagens')->update([
                    'remetente_user_id' => DB::raw('remetente_id'),
                ]);
            }

            $adicionouRemetente = true;
        }

        if (Schema::hasColumn('mensagens', 'conversa_id')) {
            DB::statement(
                'ALTER TABLE `mensagens` MODIFY `conversa_id` BIGINT UNSIGNED NULL'
            );
        }

        if (Schema::hasColumn('mensagens', 'remetente_id')) {
            DB::statement(
                'ALTER TABLE `mensagens` MODIFY `remetente_id` BIGINT UNSIGNED NULL'
            );
        }

        if ($adicionouSolicitacao) {
            Schema::table('mensagens', function (Blueprint $table) {
                $table->foreign('solicitacao_id', 'mensagens_solicitacao_id_foreign')
                    ->references('id')
                    ->on('solicitacoes')
                    ->cascadeOnDelete();
            });
        }

        if ($adicionouRemetente) {
            Schema::table('mensagens', function (Blueprint $table) {
                $table->foreign(
                    'remetente_user_id',
                    'mensagens_remetente_user_id_foreign',
                )
                    ->references('id')
                    ->on('users')
                    ->cascadeOnDelete();
            });
        }
    }

    /**
     * Registra migrations antigas cujos efeitos foram aplicados de maneira
     * compatível acima. Isso impede tentativas de recriar tabelas existentes.
     */
    private function registrarMigrationsLegadasJaAtendidas(): void
    {
        if (!Schema::hasTable('migrations')) {
            return;
        }

        $migrations = [
            '0001_01_01_000000_create_users_table',
            '0001_01_01_000001_create_cache_table',
            '0001_01_01_000002_create_jobs_table',
            '2026_09_13_192032_add_profile_fields_to_users_table',
        ];

        $batch = ((int) DB::table('migrations')->max('batch')) + 1;

        foreach ($migrations as $migration) {
            $jaRegistrada = DB::table('migrations')
                ->where('migration', $migration)
                ->exists();

            if (!$jaRegistrada) {
                DB::table('migrations')->insert([
                    'migration' => $migration,
                    'batch' => $batch,
                ]);
            }
        }
    }

    /**
     * Rollback intencionalmente vazio para nunca remover dados legados.
     */
    public function down(): void
    {
        // Compatibilidade não destrutiva.
    }
};
