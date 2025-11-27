# Changelog - Santo Dinheiro

## [v1.2.0] - 2025-11-27

### ✨ Novas Funcionalidades

#### 📧 Sistema de Email (Resend)
- **Convites de Colaboradores Automatizados**
  - Template HTML premium e responsivo
  - Copy persuasiva em português
  - Design com gradiente roxo e glassmorphism
  - Informações claras sobre níveis de permissão
  - Fallback seguro (convites criados mesmo se email falhar)

#### ⚙️ Configurações de Conta (`/dashboard/settings`)
- **Aba Geral:**
  - Toggle de dízimo automático (padrão: ativado)
  - Configuração de alertas de planejamento (padrão: 5 dias)
- **Aba Colaboradores:**
  - Sistema de convites com 3 níveis de permissão (Visualizador, Editor, Admin)
  - Limite configurável por plano (padrão: 3)
  - Barra de progresso de uso
  - Gestão completa de convites (pendentes, aceitos, rejeitados)
- **Aba Suporte:**
  - Formulário de feedback integrado
  - Categorias: Bug, Sugestão, Outro
  - Rastreamento de status

#### 📊 Dashboard Admin Melhorado (`/admin`)
- **Métricas de BI Adicionadas:**
  - Novos usuários no mês
  - TTV (Total Transaction Volume)
  - Volume de dízimos pagos
  - Distribuição de despesas (PieChart)
- **Nova Página `/admin/support`:**
  - Listagem completa de feedbacks
  - Filtros por tipo e status
  - Informações detalhadas do usuário
- **Melhorias de UI/UX:**
  - Gráficos com margens otimizadas
  - Legendas compactas e responsivas
  - Layout sem sobreposição de elementos

### 🐛 Correções

- **Erro 404 em `/admin/usage`:** Criada rota API mockada
- **Toggle de Dízimo:** Adicionada revalidação explícita do cache
- **Colaboradores:** Corrigido fallback de `maxCollaborators` para 3
- **Tipagens:** Corrigidas queries para incluir relações necessárias
- **Gráficos Admin:** Ajustadas margens e estilos para melhor visualização

### 🔧 Melhorias Técnicas

- **Revalidação de Cache:** Paths explícitos para `/dashboard/expenses`
- **Server Actions:** Adicionada diretiva `"use server"` em `settings.ts`
- **Email Service:** Criado `src/lib/email.ts` com Resend
- **Documentação:** Adicionados `ENV_SETUP.md` e `EMAIL_PREVIEW.md`

### 📦 Dependências

- **Adicionado:** `resend` (v4.x)

### 🗄️ Banco de Dados

- **Novos Campos em `User`:**
  - `isTitheEnabled` (Boolean, padrão: true)
  - `planningAlertDays` (Int, padrão: 5)
  - `role` (UserRole, padrão: USER)

- **Novos Modelos:**
  - `Collaborator` (convites e permissões)
  - `Feedback` (suporte e bugs)

- **Novos Enums:**
  - `UserRole` (USER, ADMIN)
  - `InviteStatus` (PENDING, ACCEPTED, REJECTED)
  - `Permission` (VIEWER, EDITOR, ADMIN)
  - `FeedbackType` (BUG, FEATURE_REQUEST, OTHER)
  - `FeedbackStatus` (OPEN, IN_PROGRESS, RESOLVED, CLOSED)

### 📝 Variáveis de Ambiente Necessárias

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxx

# App URL (para links em emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Access
ADMIN_EMAILS=admin@seudominio.com
ADMIN_USER_IDS=user_xxxxx
```

### 🚀 Build Status

✅ Build de produção concluído com sucesso
✅ 39 páginas geradas
✅ Lint aprovado (apenas warnings de variáveis não usadas)
✅ TypeScript sem erros críticos

---

## Como Atualizar

1. **Pull das mudanças:**
   ```bash
   git pull origin master
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Atualizar banco de dados:**
   ```bash
   npm run db:push
   ```

4. **Configurar variáveis de ambiente:**
   - Adicione `RESEND_API_KEY` ao `.env`
   - Configure `NEXT_PUBLIC_APP_URL`

5. **Testar:**
   ```bash
   npm run dev
   ```

---

## Próximos Passos

- [ ] Implementar alertas de planejamento por email
- [ ] Adicionar notificações push (PWA)
- [ ] Integração com Open Banking
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Categorização automática com IA
