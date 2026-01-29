# Conecta Obras & Reparos

Frontend do MVP da plataforma de classificados de serviços. Stack: Next.js (App Router) + TypeScript + Tailwind CSS.

## Requisitos
- Node.js 18+
- Docker Desktop (para o banco local)

## Configuração segura de variáveis
1. Copie o arquivo de exemplo:
   - `cp .env.example .env.local`
2. Preencha os valores necessários.

> **Importante:** `.env.local` e `.env` são ignorados pelo git.

## Banco de dados local (Docker)
Suba o PostgreSQL com:

- `docker compose up -d`

As credenciais usam as variáveis definidas em `.env.local`.

## Rodar o frontend
- `npm install`
- `npm run dev`

Acesse: http://localhost:3000

## Segurança básica aplicada
- Headers de segurança no Next.js.
- Variáveis sensíveis fora do controle de versão.

## Próximos passos sugeridos
- Integrar Supabase (auth, storage, database).
- Implementar fluxo de cadastro assistido e ponte para WhatsApp.
- Configurar analytics e eventos de lead.
