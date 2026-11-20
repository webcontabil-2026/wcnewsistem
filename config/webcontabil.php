<?php

return [
    /*
     * Segunda credencial exigida exclusivamente na rota /admin/login.
     * Deve ser uma chave longa e diferente das senhas dos usuários.
     */
    'admin_access_key' => env('ADMIN_ACCESS_KEY', ''),
];
