# WebContabil

Plataforma web desenvolvida como projeto de TCC para aproximar clientes e profissionais de contabilidade, centralizando serviços, documentos, comunicação e informações financeiras.

## Situação do projeto

O sistema está em desenvolvimento e passa atualmente pela integração completa entre as interfaces existentes, o backend Laravel e o banco de dados MySQL.

A autenticação e a sessão real já estão integradas. A estrutura das migrations ainda será reconciliada com o banco oficial do projeto.

> Não execute `migrate:fresh`, `migrate:refresh` ou `migrate:reset`. Esses comandos podem apagar dados locais. As migrations ainda serão revisadas em uma etapa específica.

## Funcionalidades atuais

- Páginas públicas institucionais;
- Cadastro e autenticação com sessão Laravel;
- Perfis de cliente, contador e administrador;
- Proteção das páginas internas por autenticação;
- Painel financeiro do cliente;
- Cadastro e exclusão de lançamentos financeiros;
- Upload e download protegido de comprovantes;
- Preferências de tema e notificações;
- Interface responsiva com temas claro e escuro;
- Páginas de privacidade e termos de uso.

## Funcionalidades planejadas

- Fluxo completo de contratação de serviços;
- Envio de orçamento pelo contador;
- Aceitação de orçamento pelo cliente;
- Gestão de documentos entre cliente e contador;
- Conversas internas;
- Agenda fiscal e notificações;
- Solicitação segura de exclusão de conta;
- Expansão dos painéis do contador e administrador.

## Tecnologias

### Backend

- PHP 8.3 ou superior;
- Laravel 13;
- MySQL;
- Composer.

### Frontend

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
- Recharts;
- Motion;
- Lucide React.

## Ambiente recomendado

O desenvolvimento local é realizado no Windows utilizando:

- Laragon;
- PHP 8.5.4 do Laragon;
- MySQL;
- Node.js e npm;
- Composer;
- Visual Studio Code.

## Instalação local

Clone o repositório:

```powershell
git clone https://github.com/webcontabil-2026/wcnewsistem.git
cd wcnewsistem
```

Instale as dependências PHP:

```powershell
composer install
```

Crie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env
```

Gere a chave da aplicação utilizando o PHP do Laragon:

```powershell
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan key:generate
```

Instale as dependências do frontend:

```powershell
npm.cmd install
```

## Configuração do banco

Configure o `.env` com os dados do MySQL local:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nome_do_banco_local
DB_USERNAME=root
DB_PASSWORD=
```

O arquivo `.env` contém configurações particulares de cada computador e não deve ser enviado ao Git.

Enquanto a reconciliação das migrations não estiver concluída, a estrutura oficial do banco deverá ser importada conforme as orientações internas da equipe.

## Execução

Com o Laragon iniciado, execute o frontend em modo de desenvolvimento:

```powershell
npm.cmd run dev
```

A aplicação poderá ser acessada pelo domínio local configurado no Laragon, normalmente:

```text
http://wcnewsistem.test
```

## Verificações de qualidade

TypeScript:

```powershell
npx.cmd tsc --noEmit
```

Build de produção:

```powershell
npm.cmd run build
```

Testes Laravel:

```powershell
& "C:\laragon\bin\php\php-8.5.4-nts-Win32-vs17-x64\php.exe" artisan test
```

Verificação de formatação do diff:

```powershell
git diff --check
```

## Estrutura principal

```text
app/
├── Http/Controllers/    Controllers do backend
└── Models/              Models do banco de dados

database/
├── migrations/          Estrutura versionada do banco
└── seeders/             Dados iniciais de desenvolvimento

resources/
├── css/                 Estilos globais e temas
├── js/                  Aplicação React e TypeScript
│   └── components/      Componentes separados por área
└── views/               Views Blade do Laravel

routes/
└── web.php              Rotas públicas, autenticadas e APIs internas

tests/
└── Feature/             Testes de comportamento da aplicação
```

## Fluxo de desenvolvimento

1. Atualizar a branch `main`;
2. Criar uma branch específica para a etapa;
3. Implementar e testar a etapa completa;
4. Criar um commit descritivo;
5. Publicar a branch;
6. Abrir uma pull request;
7. Revisar e integrar à `main`.

## Equipe

Projeto acadêmico desenvolvido pela equipe WebContabil como Trabalho de Conclusão de Curso.
