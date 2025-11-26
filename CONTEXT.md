# Contexto do Projeto: Santo Dinheiro

## Visão Geral
Este é um projeto SaaS built-in Next.js, focado em gestão financeira (Santo Dinheiro).
Baseado no template "Next.js SaaS Template" da AI Coders Academy.

## Stack Tecnológica
- **Framework**: Next.js (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Radix UI
- **Banco de Dados**: PostgreSQL (via Docker em dev)
- **ORM**: Prisma
- **Autenticação**: Clerk
- **Pagamentos/Billing**: Integração com Clerk e Webhooks
- **AI**: Vercel AI SDK (OpenRouter)

## Infraestrutura Local
- **Docker**: Utilizado para rodar o banco de dados PostgreSQL.
  - Container padrão: `saas-postgres` (verificar nome real via `docker ps`)
  - Volume: `saas_postgres_data`

## Estrutura de Diretórios Importante
- `src/app`: Rotas da aplicação (Public e Protected).
- `src/lib`: Utilitários, configurações de banco (`db.ts`), e queries.
- `prisma/`: Schema do banco de dados e migrações.
- `public/`: Arquivos estáticos.
- `.env`: Variáveis de ambiente (NÃO COMITAR).

## Comandos Úteis
- `npm run dev`: Iniciar servidor de desenvolvimento.
- `npm run db:push`: Sincronizar schema com banco (dev).
- `npm run db:migrate`: Criar migrações.
- `docker exec -t [CONTAINER] pg_dumpall ...`: Backup do banco (ver AG_PROTOCOLS.md).

## Regras Específicas
- **AG_PROTOCOLS.md**: LEIA ESTE ARQUIVO. Contém as regras de ouro de segurança (Proteção da Main e Backups).
