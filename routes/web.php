<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutenticacaoController;
use App\Http\Controllers\LancamentoFinanceiroController;

Route::view('/', 'landing');
Route::view('/sobre', 'sobre');
Route::view('/servicos', 'servicos');
Route::view('/planos', 'planos');
Route::view('/contato', 'contato');
Route::view('/politica-de-privacidade', 'privacidade');
Route::view('/termos-de-uso', 'termos');
Route::view('/login', 'login');
Route::view('/register', 'register');
Route::view('/dashboard', 'dashboard');

/*
 * Rotas públicas de cadastro e autenticação.
 * O limitador reduz tentativas automatizadas de acesso.
 */
Route::prefix('auth')->group(function () {
    Route::post(
        '/register',
        [AutenticacaoController::class, 'register']
    )->middleware('throttle:10,1');

    Route::post(
        '/login',
        [AutenticacaoController::class, 'login']
    )->middleware('throttle:6,1');

    /*
     * Estas rotas exigem uma sessão autenticada.
     */
    Route::middleware('auth')->group(function () {
        Route::get(
            '/current',
            [AutenticacaoController::class, 'current']
        );

        Route::post(
            '/logout',
            [AutenticacaoController::class, 'logout']
        );
    });
});

/*
 * Rotas financeiras protegidas pela sessão do usuário.
 */
Route::middleware('auth')
    ->prefix('financial-entries')
    ->group(function () {
        /*
         * Lista os lançamentos financeiros do cliente.
         */
        Route::get(
            '/',
            [LancamentoFinanceiroController::class, 'index']
        );

        /*
         * Cria um novo lançamento financeiro.
         */
        Route::post(
            '/',
            [LancamentoFinanceiroController::class, 'store']
        );

        /*
         * Exclui um lançamento financeiro.
         */
        Route::delete(
            '/{financialEntry}',
            [LancamentoFinanceiroController::class, 'destroy']
        )->whereNumber('financialEntry');
    });