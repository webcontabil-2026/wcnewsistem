<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AutenticacaoController;
use App\Http\Controllers\LancamentoFinanceiroController;
use App\Http\Controllers\MensagemController;
use App\Http\Controllers\PreferenciaUsuarioController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\SolicitacaoController;
use App\Http\Controllers\ContaController;
use App\Http\Controllers\ContatoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Páginas públicas
|--------------------------------------------------------------------------
*/

Route::view('/', 'landing');
Route::view('/sobre', 'sobre');
Route::view('/servicos', 'servicos');
Route::view('/planos', 'planos');
Route::view('/contato', 'contato');
Route::post(
    '/contato',
    [ContatoController::class, 'enviar'],
)->middleware('throttle:5,10');
Route::view('/politica-de-privacidade', 'privacidade');
Route::view('/termos-de-uso', 'termos');

Route::view('/login', 'login')->name('login');
Route::view('/register', 'register')->name('register');
Route::view('/dashboard', 'dashboard')
    ->middleware('auth')
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Autenticação
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post(
        '/register',
        [AutenticacaoController::class, 'register'],
    )->middleware('throttle:10,1');

    Route::post(
        '/login',
        [AutenticacaoController::class, 'login'],
    )->middleware('throttle:6,1');

    Route::middleware('auth')->group(function () {
        Route::get(
            '/current',
            [AutenticacaoController::class, 'current'],
        );

        Route::post(
            '/logout',
            [AutenticacaoController::class, 'logout'],
        );
    });
});

/*
|--------------------------------------------------------------------------
| Preferências e finanças do usuário autenticado
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get(
        '/preferencias',
        [PreferenciaUsuarioController::class, 'show'],
    );

    Route::put(
        '/preferencias',
        [PreferenciaUsuarioController::class, 'update'],
    );

    Route::post(
        '/conta/perfil',
        [ContaController::class, 'atualizarPerfil'],
    );

    Route::put(
        '/conta/senha',
        [ContaController::class, 'alterarSenha'],
    )->middleware('throttle:6,1');

    Route::post(
        '/conta/desativacao/solicitar',
        [ContaController::class, 'solicitarDesativacao'],
    )->middleware('throttle:3,10');

    Route::post(
        '/conta/desativacao/confirmar',
        [ContaController::class, 'confirmarDesativacao'],
    )->middleware('throttle:3,10');

    Route::prefix('financial-entries')->group(function () {
        Route::get(
            '/',
            [LancamentoFinanceiroController::class, 'index'],
        );

        Route::post(
            '/',
            [LancamentoFinanceiroController::class, 'store'],
        );

        Route::get(
            '/{financialEntry}/attachment',
            [LancamentoFinanceiroController::class, 'downloadAttachment'],
        )->whereNumber('financialEntry');

        Route::delete(
            '/{financialEntry}',
            [LancamentoFinanceiroController::class, 'destroy'],
        )->whereNumber('financialEntry');
    });
});

/*
|--------------------------------------------------------------------------
| API do painel
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->prefix('api')
    ->group(function () {
        Route::get(
            '/servicos',
            [ServicoController::class, 'listar'],
        );

        Route::get(
            '/solicitacoes',
            [SolicitacaoController::class, 'listar'],
        );

        Route::post(
            '/solicitacoes',
            [SolicitacaoController::class, 'criar'],
        )->middleware('throttle:10,1');

        Route::patch(
            '/solicitacoes/{solicitacao}/orcamento',
            [SolicitacaoController::class, 'enviarOrcamento'],
        )
            ->whereNumber('solicitacao')
            ->middleware('throttle:10,1');

        Route::patch(
            '/solicitacoes/{solicitacao}/resposta',
            [SolicitacaoController::class, 'responderOrcamento'],
        )
            ->whereNumber('solicitacao')
            ->middleware('throttle:10,1');

        Route::patch(
            '/solicitacoes/{solicitacao}/status',
            [SolicitacaoController::class, 'atualizarStatus'],
        )
            ->whereNumber('solicitacao')
            ->middleware('throttle:20,1');

        Route::get(
            '/solicitacoes/{solicitacao}/mensagens',
            [MensagemController::class, 'listar'],
        )->whereNumber('solicitacao');

        Route::post(
            '/solicitacoes/{solicitacao}/mensagens',
            [MensagemController::class, 'enviar'],
        )
            ->whereNumber('solicitacao')
            ->middleware('throttle:30,1');

        Route::get(
            '/admin/resumo',
            [AdminController::class, 'resumo'],
        );
    });
