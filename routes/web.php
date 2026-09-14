<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FinancialEntryController;
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
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:10,1');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:6,1');

    /*
     * Estas rotas exigem uma sessão autenticada.
     */
    Route::middleware('auth')->group(function () {
        Route::get('/current', [AuthController::class, 'current']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
/*
 * Rotas financeiras protegidas pela sessão do usuário.
 */
Route::middleware('auth')
    ->prefix('financial-entries')
    ->group(function () {
        Route::get(
            '/',
            [FinancialEntryController::class, 'index']
        );

        Route::post(
            '/',
            [FinancialEntryController::class, 'store']
        );

        Route::get(
            '/{financialEntry}/attachment',
            [FinancialEntryController::class, 'downloadAttachment']
        )->whereNumber('financialEntry');

        Route::delete(
            '/{financialEntry}',
            [FinancialEntryController::class, 'destroy']
        )->whereNumber('financialEntry');
    });