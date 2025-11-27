# Plano de Implementação: Configurações, Colaboração e BI

## 1. Visão Geral
Este documento detalha a implementação de três grandes módulos:
1.  **Configurações de Conta**: Preferências do usuário e gestão de colaboradores.
2.  **Sistema de Suporte**: Canal direto para reportar erros e sugestões.
3.  **Business Intelligence (BI)**: Painel administrativo para análise de dados da plataforma.

---

## 2. Banco de Dados (Schema Prisma)

Precisaremos expandir o schema atual para suportar essas funcionalidades.

### 2.1. Configurações do Usuário (`User`)
Adicionaremos campos ao `User` para configurações e controle de acesso.

```prisma
model User {
  // ... campos existentes
  
  // Configurações
  isTitheEnabled      Boolean @default(true) // Ativa/Desativa Dízimo Automático
  planningAlertDays   Int     @default(5)    // Dias antes do fim do mês para alerta
  
  // Relacionamentos
  collaborators       Collaborator[] @relation("OwnerCollaborators")
  collaborations      Collaborator[] @relation("MemberCollaborations")
  feedbacks           Feedback[]
  
  role                UserRole @default(USER) // USER, ADMIN
}

enum UserRole {
  USER
  ADMIN
}
```

### 2.2. Planos (`Plan`)
Adicionar limite de colaboradores ao modelo de planos.

```prisma
model Plan {
  // ... campos existentes
  maxCollaborators Int @default(0) // Limite de colaboradores por plano
}
```

### 2.3. Colaboradores (`Collaborator`)
Permite que outros usuários acessem a conta do proprietário com permissões específicas.
**Regra de Negócio:** A quantidade de colaboradores é limitada pelo plano de assinatura (`Plan.maxCollaborators`).

```prisma
model Collaborator {
  id          String   @id @default(cuid())
  
  ownerId     String
  owner       User     @relation("OwnerCollaborators", fields: [ownerId], references: [id])
  
  email       String   // Email do convidado
  userId      String?  // ID do usuário convidado (se já tiver conta)
  user        User?    @relation("MemberCollaborations", fields: [userId], references: [id])
  
  status      InviteStatus @default(PENDING)
  permission  Permission   @default(VIEWER)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([ownerId, email])
}

enum InviteStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum Permission {
  VIEWER // Apenas visualiza
  EDITOR // Pode editar, mas não deletar/configurar
  ADMIN  // Acesso total à conta (exceto deletar a conta principal)
}
```

### 2.4. Suporte e Feedback (`Feedback`)

```prisma
model Feedback {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  type        FeedbackType
  message     String   @db.Text
  status      FeedbackStatus @default(OPEN)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum FeedbackType {
  BUG
  FEATURE_REQUEST
  OTHER
}

enum FeedbackStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

---

## 3. Funcionalidades e Design

**Diretriz de Design:** Todas as novas telas devem seguir rigorosamente o Design System do projeto (Shadcn UI, Tailwind, Lucide Icons). O visual deve ser **premium, limpo e responsivo**.

### 3.1. Configurações do Usuário (`/dashboard/settings`)
**Layout:** Sidebar lateral ou Tabs superiores (estilo "Apple Settings").
*   **Geral:** 
    *   Toggle Dízimo (Switch com ícone de coroa dourada).
    *   Alerta de Planejamento (Slider ou Input estilizado).
*   **Colaboradores:**
    *   **Card de Plano:** Mostra uso atual (ex: "1 de 3 colaboradores") com barra de progresso.
    *   **Lista:** Tabela elegante com avatares e status (Pendente/Aceito).
    *   **Botão Convidar:** Desabilitado visualmente se atingir o limite, com tooltip sugerindo upgrade.
*   **Assinatura:** Detalhes do plano atual e botão de upgrade.

### 3.2. Sistema de Suporte
**Integração Visual:**
*   Botão flutuante discreto ou item no menu "Ajuda".
*   Modal (Dialog) elegante para envio de feedback, sem sair do contexto.

### 3.3. BI (Business Intelligence) - Super Admin (`/admin`)
**Acesso:** Restrito estritamente a usuários com `role = ADMIN`. Middleware deve bloquear qualquer outro acesso.

**Visual:**
*   Dashboard com "Glassmorphism" (efeito vidro).
*   Gráficos interativos (Recharts) com paleta de cores do tema (Dourado, Verde, Vermelho, Azul).
*   Tabelas com filtros avançados e paginação.

**KPIs e Métricas:**
1.  **Usuários:** Total, Novos (último mês), Ativos (logaram em 7 dias).
2.  **Financeiro (Plataforma):**
    *   TTV (Total Transaction Volume): Soma de todas as entradas registradas.
    *   Volume de Dízimos: Total marcado como dízimo.
3.  **Comportamento:**
    *   Categorias de Gastos Avulsos mais comuns (Word Cloud ou Gráfico de Barras).
    *   Tipos de Investimentos mais comuns.

**Gestão de Suporte:**
*   Tabela com todos os tickets de suporte.
*   Ação para mudar status (Em análise, Resolvido).

---

## 4. Plano de Execução

### Fase 1: Backend e Banco de Dados
1.  Atualizar `schema.prisma` com os novos modelos e campos.
2.  Rodar migração (`db:push`).
3.  Criar Server Actions para:
    *   Atualizar configurações.
    *   Convidar/Gerenciar colaboradores.
    *   Enviar feedback.
    *   Queries de BI (agregadas e otimizadas).

### Fase 2: Interface de Configurações
1.  Criar página `/settings`.
2.  Implementar abas: "Geral", "Colaboradores", "Suporte".
3.  Implementar lógica de UI para ocultar Dízimo se desativado.

### Fase 3: Interface Admin (BI)
1.  Definir seu usuário como `ADMIN` manualmente no banco.
2.  Criar layout `/admin`.
3.  Implementar gráficos usando `recharts`.
4.  Implementar tabela de gestão de tickets.

### Fase 4: Notificações (Opcional/Futuro)
1.  Configurar Job (Cron) para verificar alertas de planejamento e enviar e-mails.

---

## 5. Próximos Passos Imediatos
1.  Aprovar este plano.
2.  Executar **Fase 1** (Schema Update).
