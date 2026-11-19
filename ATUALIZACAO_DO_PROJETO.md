# Atualização final do WebContabil

Esta versão preserva os arquivos e configurações recebidos no ZIP original e
acrescenta as correções de banco, funcionalidades e interface descritas abaixo.

## O que foi concluído

- tema claro e escuro com a mesma paleta azul da marca, superfícies sólidas,
  contraste entre fundo, cards e campos e sem brilho azul permanente;
- layouts responsivos para cliente, contador, administração e autenticação;
- catálogo real de serviços com criação de solicitações;
- fluxo cliente ↔ contador com orçamento, aceite/recusa, andamento e conclusão;
- conversas vinculadas a uma solicitação e protegidas por participante;
- financeiro com categorias oficiais, anexos protegidos, documentos e PDF;
- perfil com foto, nome, e-mail, telefone e CPF persistidos no servidor;
- alteração de senha com validação da senha atual;
- desativação de conta com senha, aceite LGPD e código por e-mail;
- formulário público de contato gravado no banco;
- painel administrativo com indicadores reais, sem dados simulados;
- migrations compatíveis com instalações existentes, sem exclusão automática
  das tabelas ou registros antigos.

## Comandos obrigatórios no Windows/Laragon

Abra o terminal do VS Code dentro da pasta do projeto e execute, nesta ordem:

```powershell
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan migrate --force
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan db:seed --force
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan storage:link
npm.cmd install
npx.cmd tsc --noEmit
npm.cmd run build
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan optimize:clear
```

Se o `storage:link` informar que o link já existe, prossiga normalmente.

## Validação rápida

```powershell
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan route:list
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan test
git diff --check
```

Para testar o código de desativação em ambiente local, o Laravel utiliza o
mailer definido no `.env`. Com `MAIL_MAILER=log`, o e-mail fica registrado em
`storage/logs/laravel.log` e o código também é apresentado na própria tela
somente quando `APP_ENV=local`.
