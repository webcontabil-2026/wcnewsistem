<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    /**
     * Confirma que as páginas públicas principais estão acessíveis.
     */
    public function test_public_pages_are_available(): void
    {
        $publicPages = [
            '/',
            '/sobre',
            '/servicos',
            '/planos',
            '/contato',
            '/politica-de-privacidade',
            '/termos-de-uso',
            '/login',
            '/register',
        ];

        foreach ($publicPages as $page) {
            $this->get($page)->assertOk();
        }
    }

    /**
     * Impede o acesso ao painel quando não existe sessão autenticada.
     */
    public function test_dashboard_requires_authentication(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }
}