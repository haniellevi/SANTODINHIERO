# Plano de Refatoração - Santo Dinheiro
## Análise e Remoção de Funcionalidades Herdadas do Starter-Kit

> [!IMPORTANT]
> Este documento identifica todas as funcionalidades herdadas do starter-kit SaaS que **não fazem sentido** para o projeto Santo Dinheiro e propõe um plano de refatoração completo para alinhar o projeto ao PRD.

---

## 📊 Resumo Executivo

O projeto Santo Dinheiro foi iniciado a partir de um starter-kit SaaS genérico que inclui funcionalidades como:
- Sistema de créditos e cobrança
- Chat com IA
- Planos de assinatura
- Upload de arquivos
- Analytics e admin dashboard

**Problema:** Essas funcionalidades não se aplicam ao escopo do Santo Dinheiro, que é uma aplicação de gestão financeira pessoal simples e focada.

**Solução:** Remover/refatorar componentes desnecessários e criar uma navegação e interface alinhadas ao PRD e aos layouts de referência.

---

## 🎯 Análise: O que Herdamos vs O que Precisamos

### ❌ Funcionalidades a REMOVER (Herdadas do Starter-Kit)

#### 1. **Sistema de Créditos**
- **Localização:**
  - Models: `CreditBalance`, `UsageHistory`, `OperationType` (schema.prisma)
  - Componentes: `src/components/credits/`
  - API: Rotas relacionadas a créditos
  - UI: Botão "Comprar Créditos" no header

- **Justificativa:** Santo Dinheiro não é um SaaS com modelo de créditos. É uma aplicação de uso ilimitado para gestão financeira pessoal.

#### 2. **Chat com IA**
- **Localização:**
  - Página: `src/app/(protected)/ai-chat/`
  - Componentes: `src/components/ai-chat/`
  - Navegação: Item "Chat com IA" no sidebar

- **Justificativa:** Não está no PRD. O foco é gestão financeira manual, sem assistente de IA.

#### 3. **Sistema de Cobrança/Billing Complexo**
- **Localização:**
  - Página: `src/app/(protected)/billing/`
  - Componentes: `src/components/billing/`
  - Models: `Plan`, `SubscriptionEvent` (schema.prisma)
  - Navegação: Item "Cobrança" no sidebar

- **Justificativa:** Santo Dinheiro será gratuito ou terá modelo de assinatura simples via Clerk. Não precisa de página de billing no menu lateral.

#### 4. **Admin Dashboard Complexo**
- **Localização:**
  - Página: `src/app/admin/`
  - Componentes: `src/components/admin/`
  - Models: `AdminSettings`, `Feature`, `StorageObject`

- **Justificativa:** Não há necessidade de painel admin complexo para gerenciar usuários, features, storage, etc. Santo Dinheiro é uma aplicação pessoal.

#### 5. **Sistema de Upload de Arquivos**
- **Localização:**
  - Model: `StorageObject` (schema.prisma)
  - Componentes relacionados a upload

- **Justificativa:** Não há funcionalidade de upload de arquivos no PRD.

#### 6. **Analytics e Métricas de SaaS**
- **Localização:**
  - Componentes: `src/components/analytics/`
  - Dashboards de métricas de negócio

- **Justificativa:** Não é necessário para uma aplicação de finanças pessoais.

---

### ✅ Funcionalidades a MANTER/ADAPTAR

#### 1. **Autenticação (Clerk)**
- **Status:** MANTER
- **Adaptação:** Simplificar para apenas login/logout/perfil

#### 2. **Database (Prisma + PostgreSQL)**
- **Status:** MANTER
- **Adaptação:** Limpar models desnecessários, manter apenas:
  - `User`
  - `Month`
  - `Income`
  - `Expense`
  - `Investment`
  - `MiscExpense`
  - `ExpenseType` (enum)

#### 3. **Landing Page**
- **Status:** ADAPTAR
- **Ação:** Redesenhar para refletir Santo Dinheiro (não SaaS Template)
- **Referência:** Manter estética premium, mas com foco em gestão financeira

#### 4. **Dashboard**
- **Status:** REFATORAR COMPLETAMENTE
- **Ação:** Alinhar ao layout de referência (`designer/dashboard_mensal/dashboard.html`)

---

## 🎨 Análise de Layout: Atual vs Desejado

### Layout Atual (Herdado)
```
┌─────────────────────────────────────┐
│ Topbar (SaaS Template)              │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │  Dashboard Grid          │
│          │  - Receitas              │
│ - Painel │  - Despesas              │
│ - Chat IA│  - Investimentos         │
│ - Billing│  - Gastos Avulsos        │
│          │                          │
└──────────┴──────────────────────────┘
```

### Layout Desejado (Referência)
```
┌─────────────────────────────────────┐
│ Header: ← Outubro 2023 →            │
├─────────────────────────────────────┤
│        R$ 1.850,50                  │
│        Saldo do Mês                 │
├─────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐            │
│ │Entradas │  │ Saídas  │            │
│ │R$ 5.400 │  │R$ 3.549 │            │
│ └─────────┘  └─────────┘            │
├─────────────────────────────────────┤
│ [Alerta: Faltam 5 dias]             │
│ [Duplicar Mês] [Começar do Zero]    │
├─────────────────────────────────────┤
│ Transações Recentes                 │
│ - Supermercado    -R$ 250,75        │
│ - Salário         +R$ 5.400,00      │
│ - Jantar          -R$ 120,00        │
└─────────────────────────────────────┘
         [+] FAB (Floating Action)
```

**Diferenças Críticas:**
1. ❌ **Atual:** Sidebar desktop com navegação complexa
2. ✅ **Desejado:** Mobile-first, sem sidebar, navegação por header
3. ❌ **Atual:** Grid de cards separados
4. ✅ **Desejado:** Fluxo vertical, cards de resumo, lista de transações
5. ❌ **Atual:** Tema genérico
6. ✅ **Desejado:** Cores específicas (Roxo primário, Verde/Vermelho para entradas/saídas)

---

## 🗺️ Plano de Refatoração Detalhado

### Fase 1: Limpeza do Database Schema

#### Ações:
1. **Remover Models Desnecessários:**
   ```prisma
   // REMOVER:
   - CreditBalance
   - UsageHistory
   - OperationType (enum)
   - AdminSettings
   - Plan
   - StorageObject
   - SubscriptionEvent
   - Feature
   ```

2. **Simplificar Model User:**
   ```prisma
   model User {
     id        String   @id @default(cuid())
     clerkId   String   @unique
     email     String?  @unique
     name      String?
     isActive  Boolean  @default(true)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     // REMOVER relações:
     // creditBalance, usageHistory, storageObjects, subscriptionEvents
     
     // MANTER:
     months    Month[]
   }
   ```

3. **Executar Migration:**
   - Criar migration para remover tabelas
   - Atualizar Prisma Client

---

### Fase 2: Refatoração da Navegação

#### 2.1. Remover Sidebar Desktop

**Arquivos a Modificar:**
- `src/components/app/sidebar.tsx` - DELETAR ou REFATORAR
- `src/app/(protected)/layout.tsx` - Remover `<Sidebar>`

**Nova Navegação:**
- **Mobile-First:** Sem sidebar
- **Header:** Navegação mensal (← Mês/Ano →)
- **Bottom Navigation (Opcional):** Links rápidos para seções

#### 2.2. Atualizar navigationItems

**Atual:**
```typescript
// src/components/app/sidebar.tsx
export const navigationItems = [
  { name: "Painel", href: "/dashboard", icon: Home },
  { name: "Chat com IA", href: "/ai-chat", icon: Bot },      // ❌ REMOVER
  { name: "Cobrança", href: "/billing", icon: CreditCard },  // ❌ REMOVER
];
```

**Novo (se mantiver alguma navegação):**
```typescript
export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Entradas", href: "/dashboard?view=income", icon: ArrowUp },
  { name: "Saídas", href: "/dashboard?view=expenses", icon: ArrowDown },
  { name: "Investimentos", href: "/dashboard?view=investments", icon: TrendingUp },
  { name: "Gastos Avulsos", href: "/dashboard?view=misc", icon: Receipt },
];
```

---

### Fase 3: Refatoração do Dashboard

#### 3.1. Criar Novo Layout Mobile-First

**Arquivo:** `src/app/(protected)/dashboard/page.tsx`

**Estrutura Desejada:**
```tsx
<div className="min-h-screen bg-background-dark font-display">
  {/* Header com Navegação Mensal */}
  <MonthNavigationHeader />
  
  {/* Saldo Principal */}
  <div className="text-center py-6">
    <h1 className="text-4xl font-bold">R$ {balance}</h1>
    <p className="text-primary-light">Saldo do Mês</p>
  </div>
  
  {/* Cards de Resumo */}
  <div className="grid grid-cols-2 gap-4 px-4">
    <IncomeCard total={totalIncome} />
    <ExpenseCard total={totalExpense} />
  </div>
  
  {/* Alerta de Planejamento */}
  <MonthPlanningAlert />
  
  {/* Transações Recentes */}
  <RecentTransactionsList />
  
  {/* FAB */}
  <FloatingActionButton />
</div>
```

#### 3.2. Componentes a Criar

1. **MonthNavigationHeader**
   - Botões ← → para navegar entre meses
   - Display do mês/ano atual
   - Referência: `designer/dashboard_mensal/dashboard.html` (linhas 65-73)

2. **IncomeCard / ExpenseCard**
   - Cards coloridos (verde/vermelho)
   - Ícones de seta
   - Valores totais
   - Referência: linhas 76-95 do HTML

3. **MonthPlanningAlert**
   - Banner com alerta de fim de mês
   - Botões "Duplicar Mês" e "Começar do Zero"
   - Referência: linhas 96-111 do HTML

4. **RecentTransactionsList**
   - Lista de últimas transações
   - Ícones por categoria
   - Valores coloridos
   - Referência: linhas 112-146 do HTML

5. **FloatingActionButton**
   - Botão + fixo no canto inferior direito
   - Abre menu para adicionar entrada/saída/investimento/gasto
   - Referência: linhas 147-151 do HTML

---

### Fase 4: Remover Páginas Desnecessárias

#### Páginas a DELETAR:
```
src/app/(protected)/ai-chat/          ❌
src/app/(protected)/billing/          ❌
src/app/admin/                        ❌
src/app/subscribe/                    ❌ (se não for usar planos)
```

#### Componentes a DELETAR:
```
src/components/ai-chat/               ❌
src/components/billing/               ❌
src/components/admin/                 ❌
src/components/credits/               ❌
src/components/analytics/             ❌
src/components/plans/                 ❌
```

#### APIs a DELETAR:
```
src/app/api/ai/                       ❌
src/app/api/credits/                  ❌
src/app/api/admin/                    ❌
src/app/api/storage/                  ❌
src/app/api/subscriptions/            ❌
```

---

### Fase 5: Atualizar Landing Page

#### Arquivo: `src/components/marketing/landing-hero.tsx`

**Mudanças:**
1. Trocar "SaaS Template" por "Santo Dinheiro"
2. Atualizar headline:
   ```tsx
   // ANTES:
   Controle total sobre suas <span>finanças</span>
   
   // DEPOIS:
   Seu Dinheiro Gerido com <span>Propósito</span>
   ```

3. Atualizar descrição para refletir funcionalidades reais
4. Remover menção a créditos, IA, etc.

#### Arquivo: `src/components/marketing/landing-features.tsx`

**Features a Destacar:**
- ✅ Gestão de Receitas e Despesas
- ✅ Controle de Investimentos
- ✅ Gastos Avulsos
- ✅ Cálculo Automático de Dízimo
- ✅ Planejamento Mensal
- ✅ Alertas de Fim de Mês
- ❌ Chat com IA
- ❌ Sistema de Créditos

---

### Fase 6: Atualizar Design System

#### Cores (Tailwind Config)

**Atual (Starter-Kit):** Genérico
**Desejado (Referência):**

```javascript
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: "#7B34FF",      // Roxo principal
    light: "#C1A2FF"         // Roxo claro
  },
  "background-dark": "#16131D",
  "surface-dark": "#211D2A",
  "accent-green": "#22C55E",   // Entradas
  "accent-red": "#EF4444"      // Saídas
}
```

#### Tipografia

**Manter ou Trocar:**
- Referência usa **Manrope**
- Starter-kit usa **Inter**
- **Decisão:** Migrar para Manrope para fidelidade ao design

---

## 📋 Checklist de Implementação

### Database
- [ ] Remover models: `CreditBalance`, `UsageHistory`, `OperationType`, `AdminSettings`, `Plan`, `StorageObject`, `SubscriptionEvent`, `Feature`
- [ ] Simplificar model `User`
- [ ] Executar `prisma db push` ou criar migration
- [ ] Regenerar Prisma Client

### Navegação
- [ ] Remover/refatorar `Sidebar` component
- [ ] Atualizar `(protected)/layout.tsx` para remover sidebar
- [ ] Criar `MonthNavigationHeader` component
- [ ] (Opcional) Criar bottom navigation mobile

### Dashboard
- [ ] Refatorar `dashboard/page.tsx` para layout mobile-first
- [ ] Criar `IncomeCard` e `ExpenseCard` components
- [ ] Criar `MonthPlanningAlert` component
- [ ] Criar `RecentTransactionsList` component
- [ ] Criar `FloatingActionButton` component
- [ ] Implementar navegação entre meses

### Limpeza de Código
- [ ] Deletar pasta `src/app/(protected)/ai-chat/`
- [ ] Deletar pasta `src/app/(protected)/billing/`
- [ ] Deletar pasta `src/app/admin/`
- [ ] Deletar pasta `src/components/ai-chat/`
- [ ] Deletar pasta `src/components/billing/`
- [ ] Deletar pasta `src/components/admin/`
- [ ] Deletar pasta `src/components/credits/`
- [ ] Deletar APIs relacionadas a créditos, IA, admin
- [ ] Remover botão "Comprar Créditos" do topbar

### Landing Page
- [ ] Atualizar `landing-hero.tsx` com branding Santo Dinheiro
- [ ] Atualizar `landing-features.tsx` com features reais
- [ ] Remover menções a SaaS, créditos, IA

### Design System
- [ ] Atualizar `tailwind.config.ts` com paleta de cores do design
- [ ] (Opcional) Migrar fonte para Manrope
- [ ] Atualizar `globals.css` se necessário

### Topbar
- [ ] Remover botão "Comprar Créditos"
- [ ] Simplificar para apenas: Logo + User Menu (Perfil/Logout)

---

## 🎨 Referências de Design

### Paleta de Cores (do HTML de Referência)
```css
--primary: #7B34FF
--primary-light: #C1A2FF
--background-dark: #16131D
--surface-dark: #211D2A
--accent-green: #22C55E
--accent-red: #EF4444
```

### Tipografia
- **Fonte:** Manrope (Google Fonts)
- **Pesos:** 400, 500, 700, 800

### Ícones
- **Biblioteca:** Material Symbols Outlined (no design de referência)
- **Atual:** Lucide React (no starter-kit)
- **Decisão:** Manter Lucide (compatível) ou migrar para Material Symbols

---

## ⚠️ Riscos e Considerações

### 1. **Migração de Dados**
- Se já existem usuários com dados de créditos/billing, precisamos de estratégia de migração
- **Mitigação:** Fazer backup antes de remover models

### 2. **Autenticação e Assinatura**
- Se removermos sistema de planos, como controlar acesso?
- **Opções:**
  - A) Aplicação totalmente gratuita
  - B) Assinatura simples via Clerk (sem página de billing complexa)
- **Decisão Necessária:** Definir modelo de negócio

### 3. **Compatibilidade com Clerk**
- Starter-kit usa metadata do Clerk para créditos
- **Ação:** Limpar metadata desnecessário

### 4. **Responsividade**
- Design de referência é mobile-first
- **Ação:** Garantir que desktop também funcione bem (não apenas mobile)

---

## 🚀 Próximos Passos

1. **Revisar este plano** com o usuário
2. **Priorizar fases** (sugestão: Fase 4 → Fase 2 → Fase 3 → Fase 1 → Fase 5 → Fase 6)
3. **Criar branches** para cada fase (se usar Git)
4. **Implementar incrementalmente**
5. **Testar após cada fase**

---

## 📸 Comparação Visual

### Imagens de Referência

![Layout Atual - Sidebar com funcionalidades SaaS](C:/Users/hanie/.gemini/antigravity/brain/2718e912-b9d8-4ad9-b2c7-48d7e77e6744/uploaded_image_0_1764019906260.png)

*Problema: Sidebar com "Chat com IA" e "Cobrança" que não fazem sentido para Santo Dinheiro*

![Botão Comprar Créditos](C:/Users/hanie/.gemini/antigravity/brain/2718e912-b9d8-4ad9-b2c7-48d7e77e6744/uploaded_image_1_1764019906260.png)

*Problema: Sistema de créditos não se aplica ao projeto*

---

## 📝 Notas Finais

Este plano visa transformar o starter-kit SaaS genérico em uma aplicação focada e alinhada ao PRD do Santo Dinheiro. A refatoração removerá aproximadamente **40-50% do código herdado** que não é relevante, resultando em:

- ✅ Código mais limpo e mantível
- ✅ Interface alinhada ao design de referência
- ✅ Foco nas funcionalidades essenciais
- ✅ Melhor experiência mobile-first
- ✅ Identidade visual própria (não genérica)

**Estimativa de Esforço:** 3-5 dias de desenvolvimento (dependendo da priorização)
