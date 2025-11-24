---
description: Guia de instalação e configuração dos CLIs (Clerk, Vercel, Supabase, MCP)
---

# 🛠️ Configuração dos CLIs para o Projeto SANTODINHEIRO

Este guia mostra como instalar e configurar todos os CLIs necessários para o projeto.

## ✅ Status Atual

- **Vercel CLI**: ✅ Instalado (v48.10.10)
- **Supabase CLI**: ❌ Precisa instalar
- **Clerk**: ✅ Configurado via SDK (não tem CLI dedicado)
- **MCP Supabase**: ✅ Configurado
- **MCP TestSprite**: ✅ Configurado

---

## 📦 1. Vercel CLI (JÁ INSTALADO)

### Verificar instalação:
```bash
vercel --version
```

### Login:
```bash
vercel login
```

### Comandos úteis:
```bash
# Fazer deploy
vercel

# Fazer deploy para produção
vercel --prod

# Puxar variáveis de ambiente
vercel env pull .env.local

# Listar projetos
vercel list

# Ver logs
vercel logs
```

---

## 🗄️ 2. Supabase CLI

### Opção A: Instalação via Scoop (Recomendado para Windows)

1. **Instalar Scoop** (se ainda não tiver):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

2. **Instalar Supabase CLI**:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Opção B: Download Direto

1. Baixe o executável do Supabase CLI:
   - Acesse: https://github.com/supabase/cli/releases
   - Baixe o arquivo `.exe` para Windows
   - Adicione ao PATH do sistema

### Opção C: Via NPX (Sem instalação global)

```bash
npx supabase --version
```

### Login e Configuração:
```bash
# Login no Supabase
supabase login

# Inicializar projeto (se necessário)
supabase init

# Link com projeto existente
supabase link --project-ref SEU_PROJECT_ID

# Ver status
supabase status

# Gerar tipos TypeScript
supabase gen types typescript --local > src/types/supabase.ts
```

### Comandos úteis:
```bash
# Iniciar Supabase local
supabase start

# Parar Supabase local
supabase stop

# Criar migration
supabase migration new nome_da_migration

# Aplicar migrations
supabase db push

# Reset database
supabase db reset

# Ver logs
supabase logs
```

---

## 🔐 3. Clerk (SDK - Não tem CLI dedicado)

O Clerk não possui um CLI oficial separado. A integração é feita via:

### SDK já instalado:
```json
{
  "@clerk/nextjs": "6.32.2",
  "@clerk/backend": "^2.15.0"
}
```

### Configuração via Dashboard:
1. Acesse: https://dashboard.clerk.com
2. Configure suas aplicações
3. Copie as chaves de API para `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Comandos úteis via npx:
```bash
# Sincronizar usuários (se houver webhook)
npx @clerk/backend sync
```

---

## 🤖 4. MCP Supabase (JÁ CONFIGURADO)

O MCP Supabase já está configurado e disponível através do sistema MCP.

### Verificar configuração:
Verifique se está no arquivo de configuração do MCP (geralmente em `.gemini/mcp.json` ou similar).

### Comandos disponíveis via MCP:
- `mcp0_list_projects` - Listar projetos
- `mcp0_execute_sql` - Executar SQL
- `mcp0_apply_migration` - Aplicar migrations
- E muitos outros...

---

## 🧪 5. MCP TestSprite (JÁ CONFIGURADO)

Configurado na conversa anterior com:
- **Command**: `npx`
- **Args**: `@testsprite/testsprite-mcp@latest`
- **Env**: API_KEY configurada

---

## 🚀 Workflow Completo de Desenvolvimento

### 1. Desenvolvimento Local:
```bash
# Iniciar banco de dados local (Supabase)
supabase start

# Iniciar servidor de desenvolvimento
npm run dev

# Em outro terminal, testar com Vercel
vercel dev
```

### 2. Deploy:
```bash
# Deploy para preview
vercel

# Deploy para produção
vercel --prod
```

### 3. Gerenciar Banco de Dados:
```bash
# Criar migration
supabase migration new add_new_table

# Aplicar migrations localmente
supabase db push

# Aplicar migrations em produção (via MCP ou dashboard)
# Use o MCP Supabase para aplicar migrations
```

### 4. Sincronizar Ambiente:
```bash
# Puxar variáveis de ambiente da Vercel
vercel env pull .env.local

# Gerar tipos do Supabase
supabase gen types typescript --linked > src/types/supabase.ts
```

---

## 📝 Variáveis de Ambiente Necessárias

Crie/atualize seu `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel (automaticamente configurado no deploy)
VERCEL_URL=auto
VERCEL_ENV=development

# Database (Prisma)
DATABASE_URL=postgresql://...

# TestSprite MCP
TESTSPRITE_API_KEY=sua_api_key
```

---

## 🔧 Troubleshooting

### Problema: Supabase CLI não instala via npm
**Solução**: Use Scoop (Windows) ou download direto, ou use via npx

### Problema: Vercel não reconhece o projeto
**Solução**: Execute `vercel link` para conectar ao projeto

### Problema: Clerk não autentica
**Solução**: Verifique se as chaves estão corretas em `.env.local`

### Problema: MCP não funciona
**Solução**: Verifique a configuração no arquivo MCP e reinicie o editor

---

## 📚 Documentação Oficial

- **Vercel CLI**: https://vercel.com/docs/cli
- **Supabase CLI**: https://supabase.com/docs/guides/cli
- **Clerk**: https://clerk.com/docs
- **MCP**: https://modelcontextprotocol.io/

---

## ✨ Próximos Passos

1. ✅ Instalar Supabase CLI (escolha uma das opções acima)
2. ✅ Fazer login em todos os serviços
3. ✅ Configurar variáveis de ambiente
4. ✅ Testar cada CLI individualmente
5. ✅ Integrar no workflow de desenvolvimento
