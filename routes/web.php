<?php

use App\Http\Controllers\AutenticacaoController;
use App\Http\Controllers\LancamentoFinanceiroController;
use App\Http\Controllers\PreferenciaUsuarioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas públicas da aplicação
|--------------------------------------------------------------------------
|
| Estas rotas carregam as principais páginas públicas do sistema.
|
*/

Route::view('/', 'landing');
Route::view('/sobre', 'sobre');
Route::view('/servicos', 'servicos');
Route::view('/planos', 'planos');
Route::view('/contato', 'contato');
Route::view('/politica-de-privacidade', 'privacidade');
Route::view('/termos-de-uso', 'termos');
/*
 * Páginas de autenticação.
 *
 * O nome "login" é utilizado pelo middleware de autenticação para
 * redirecionar usuários que tentarem acessar uma área protegida.
 */
Route::view('/login', 'login')
    ->name('login');

Route::view('/register', 'register')
    ->name('register');

/*
 * O dashboard somente pode ser carregado por usuários que possuam
 * uma sessão autenticada no Laravel.
 */
Route::view('/dashboard', 'dashboard')
    ->middleware('auth')
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Rotas de autenticação
|--------------------------------------------------------------------------
|
| Cadastro e login são públicos.
| Consulta do usuário autenticado e logout exigem sessão ativa.
|
*/

Route::prefix('auth')->group(function () {
    /*
     * Cadastro de novos clientes e contadores.
     * O throttle reduz tentativas automatizadas em excesso.
     */
    Route::post(
        '/register',
        [AutenticacaoController::class, 'register']
    )->middleware('throttle:10,1');

    /*
     * Realiza a autenticação do usuário.
     */
    Route::post(
        '/login',
        [AutenticacaoController::class, 'login']
    )->middleware('throttle:6,1');

    /*
     * Rotas disponíveis somente para usuários autenticados.
     */
    Route::middleware('auth')->group(function () {
        /*
         * Retorna os dados do usuário da sessão atual.
         */
        Route::get(
            '/current',
            [AutenticacaoController::class, 'current']
        );

        /*
         * Encerra a sessão atual.
         */
        Route::post(
            '/logout',
            [AutenticacaoController::class, 'logout']
        );
    });
});

/*
|--------------------------------------------------------------------------
| Preferências do usuário
|--------------------------------------------------------------------------
|
| Permite consultar e atualizar as preferências do usuário autenticado.
|
*/

Route::middleware('auth')->group(function () {
    /*
     * Retorna as preferências salvas do usuário autenticado.
     */
    Route::get(
        '/preferencias',
        [PreferenciaUsuarioController::class, 'show']
    );

    /*
     * Atualiza tema e preferências de notificações.
     */
    Route::put(
        '/preferencias',
        [PreferenciaUsuarioController::class, 'update']
    );
});

/*
|--------------------------------------------------------------------------
| Rotas financeiras
|--------------------------------------------------------------------------
|
| Todas as rotas deste grupo exigem autenticação.
| O controller garante que cada cliente acesse somente os próprios
| lançamentos e documentos.
|
*/

Route::middleware('auth')
    ->prefix('financial-entries')
    ->group(function () {
        /*
         * Lista os lançamentos financeiros do cliente autenticado.
         */
        Route::get(
            '/',
            [LancamentoFinanceiroController::class, 'index']
        );

        /*
         * Cria um novo lançamento financeiro.
         *
         * Também pode receber um comprovante através do campo
         * "attachment", que será armazenado de forma privada.
         */
        Route::post(
            '/',
            [LancamentoFinanceiroController::class, 'store']
        );

        /*
         * Faz o download protegido do comprovante relacionado
         * a um lançamento financeiro.
         */
        Route::get(
            '/{financialEntry}/attachment',
            [LancamentoFinanceiroController::class, 'downloadAttachment']
        )->whereNumber('financialEntry');

        /*
         * Exclui um lançamento financeiro do cliente autenticado.
         *
         * Caso existam documentos vinculados, o controller também
         * remove os registros e arquivos físicos correspondentes.
         */
        Route::delete(
            '/{financialEntry}',
            [LancamentoFinanceiroController::class, 'destroy']
        )->whereNumber('financialEntry');
    });