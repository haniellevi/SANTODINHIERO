# Database Schema Documentation - Santo Dinheiro

## 1. Visão Geral

O banco de dados utiliza **PostgreSQL**, hospedado localmente via Docker ou no **Supabase** em produção. O gerenciamento do esquema e as migrações são feitos através do **Prisma ORM v6**.

Esta documentação descreve a estrutura atual do banco de dados, incluindo tabelas, relacionamentos e tipos de dados.

## 2. Modelos de Dados (Models)

### 2.1. User (Usuário)
Tabela central de usuários, integrada com o Clerk para autenticação.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `clerkId` | String | ID do usuário no Clerk (Unique). |
| `email` | String? | E-mail do usuário (Unique). |
| `name` | String? | Nome do usuário. |
| `isActive` | Boolean | Status da conta (padrão: true). |
| `isTitheEnabled` | Boolean | Se o dízimo automático está ativado (padrão: true). |
| `planningAlertDays` | Int | Dias antes do fim do mês para alerta de planejamento (padrão: 5). |
| `role` | UserRole | Role do usuário: USER ou ADMIN (padrão: USER). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `months`: Lista de meses financeiros do usuário.
- `collaborators`: Colaboradores que o usuário convidou (owner).
- `collaborations`: Convites que o usuário recebeu (member).
- `feedbacks`: Feedbacks enviados pelo usuário.

### 2.2. Month (Mês Financeiro)
Agrupa todas as transações de um mês específico para um usuário.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `userId` | String | FK para User. |
| `month` | Int | Mês (1-12). |
| `year` | Int | Ano (ex: 2024). |
| `isOpen` | Boolean | Se o mês está aberto para edições. |
| `isTithePaid` | Boolean | Se o dízimo do mês foi pago (legado, mantido para compatibilidade). |
| `tithePaidAmount` | Decimal | Valor pago do dízimo (usado para métricas de BI). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `user`: Usuário dono do mês.
- `incomes`: Receitas do mês.
- `expenses`: Despesas do mês.
- `investments`: Investimentos do mês.
- `miscExpenses`: Gastos avulsos do mês.

### 2.3. Income (Receita)
Entradas financeiras.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `amount` | Decimal | Valor previsto. |
| `dayOfMonth` | Int? | Dia do mês previsto. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `isReceived` | Boolean | Se o valor já foi recebido. |
| `isTithePaid` | Boolean | Se o dízimo desta receita foi pago (padrão: false). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `month`: Mês ao qual a receita pertence.

### 2.4. Expense (Despesa)
Saídas financeiras e obrigações.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `totalAmount` | Decimal | Valor total. |
| `paidAmount` | Decimal | Valor pago (padrão: 0). |
| `dayOfMonth` | Int? | Dia do mês previsto. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `type` | ExpenseType | Tipo (STANDARD, TITHE, INVESTMENT_TOTAL, MISC_TOTAL). |
| `isPaid` | Boolean | Status de pagamento total. |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `month`: Mês ao qual a despesa pertence.

### 2.5. Investment (Investimento)
Aportes financeiros.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `amount` | Decimal | Valor do aporte. |
| `dayOfMonth` | Int? | Dia do mês previsto. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `isPaid` | Boolean | Se o aporte foi realizado. |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `month`: Mês ao qual o investimento pertence.

### 2.6. MiscExpense (Gasto Avulso)
Gastos variáveis não planejados.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `amount` | Decimal | Valor do gasto. |
| `dayOfMonth` | Int? | Dia do mês previsto. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `isPaid` | Boolean | Se o gasto foi realizado. |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `month`: Mês ao qual o gasto pertence.

### 2.7. Plan (Plano de Assinatura)
Definições de planos de assinatura.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `clerkId` | String? | ID do plano no Clerk (Unique). |
| `billingSource` | String | Fonte de cobrança: 'clerk' ou 'manual' (padrão: 'clerk'). |
| `name` | String | Nome do plano. |
| `clerkName` | String? | Nome do plano no Clerk. |
| `currency` | String? | Moeda (padrão: 'brl'). |
| `priceMonthlyCents` | Int? | Preço mensal em centavos. |
| `priceYearlyCents` | Int? | Preço anual em centavos. |
| `description` | String? | Descrição do plano. |
| `features` | String? | Features em formato JSON. |
| `maxCollaborators` | Int | Limite de colaboradores (padrão: 0). |
| `badge` | String? | Badge do plano. |
| `highlight` | Boolean | Se o plano deve ser destacado (padrão: false). |
| `ctaType` | String? | Tipo de CTA: 'checkout' ou 'contact' (padrão: 'checkout'). |
| `ctaLabel` | String? | Label do CTA. |
| `ctaUrl` | String? | URL do CTA. |
| `active` | Boolean | Se o plano está ativo (padrão: true). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

### 2.8. Collaborator (Colaborador)
Convites e permissões de acesso à conta de outro usuário.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `ownerId` | String | FK para User (dono da conta). |
| `email` | String | E-mail do convidado. |
| `userId` | String? | FK para User (se o convidado já tiver conta). |
| `status` | InviteStatus | Status do convite: PENDING, ACCEPTED, REJECTED (padrão: PENDING). |
| `permission` | Permission | Nível de permissão: VIEWER, EDITOR, ADMIN (padrão: VIEWER). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `owner`: Usuário que enviou o convite.
- `user`: Usuário convidado (se já tiver conta).

**Constraint:**
- `@@unique([ownerId, email])`: Um e-mail só pode ser convidado uma vez por dono.

### 2.9. Feedback (Suporte e Feedback)
Solicitações de suporte e sugestões dos usuários.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `userId` | String | FK para User. |
| `type` | FeedbackType | Tipo: BUG, FEATURE_REQUEST, OTHER. |
| `message` | String (Text) | Mensagem do feedback. |
| `status` | FeedbackStatus | Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED (padrão: OPEN). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

**Relacionamentos:**
- `user`: Usuário que enviou o feedback.

### 2.10. StorageObject (Armazenamento)
Objetos armazenados (Vercel Blob ou Replit Storage).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `clerkUserId` | String | ID do usuário no Clerk. |
| `pathname` | String | Caminho do arquivo. |
| `url` | String | URL do arquivo. |
| `contentType` | String? | Tipo de conteúdo. |
| `size` | Int? | Tamanho em bytes. |
| `name` | String? | Nome do arquivo. |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

## 3. Enums

### 3.1. ExpenseType
```prisma
enum ExpenseType {
  STANDARD          // Despesa padrão
  TITHE             // Dízimo (legado, não mais usado)
  INVESTMENT_TOTAL  // Total de investimentos (agregado)
  MISC_TOTAL        // Total de gastos avulsos (agregado)
}
```

### 3.2. UserRole
```prisma
enum UserRole {
  USER   // Usuário padrão
  ADMIN  // Administrador (acesso ao /admin)
}
```

### 3.3. InviteStatus
```prisma
enum InviteStatus {
  PENDING   // Convite pendente
  ACCEPTED  // Convite aceito
  REJECTED  // Convite rejeitado
}
```

### 3.4. Permission
```prisma
enum Permission {
  VIEWER  // Apenas visualiza
  EDITOR  // Pode editar, mas não deletar/configurar
  ADMIN   // Acesso total à conta (exceto deletar a conta principal)
}
```

### 3.5. FeedbackType
```prisma
enum FeedbackType {
  BUG              // Reportar erro
  FEATURE_REQUEST  // Sugestão de melhoria
  OTHER            // Outro
}
```

### 3.6. FeedbackStatus
```prisma
enum FeedbackStatus {
  OPEN         // Aberto
  IN_PROGRESS  // Em progresso
  RESOLVED     // Resolvido
  CLOSED       // Fechado
}
```

## 4. Lógica de Negócios e Cálculos

- **Saída Total (Dashboard):** Soma de `Expense.totalAmount` (incluindo Dízimo) + `Investment.amount` + `MiscExpense.amount`.
- **Saldo Previsto (Dashboard):** Soma de todas as `Income` agendadas para o dia atual ou anterior, menos todas as saídas (`Expense`, `Investment`, `MiscExpense`) agendadas para o dia atual ou anterior. O campo `dayOfMonth` é usado como referência.
- **Saldo do Mês:** `Total Income` - `Total Outflow` (todas as saídas).
- **Dízimos Dinâmicos:** Gerados em tempo real a partir das `Income` (10% de cada), exibidos apenas se `User.isTitheEnabled` for `true`. O status de pagamento é armazenado em `Income.isTithePaid`.
- **Limite de Colaboradores:** Verificado contra `Plan.maxCollaborators` antes de permitir novos convites.

## 5. Prisma Schema (Atual)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String?  @unique
  name      String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Configurações
  isTitheEnabled      Boolean @default(true)
  planningAlertDays   Int     @default(5)
  role                UserRole @default(USER)

  // Relacionamentos
  months             Month[]
  collaborators      Collaborator[] @relation("OwnerCollaborators")
  collaborations     Collaborator[] @relation("MemberCollaborations")
  feedbacks          Feedback[]

  @@index([email])
  @@index([name])
  @@index([createdAt])
  @@index([isActive])
}

model Month {
  id        String   @id @default(cuid())
  userId    String
  month     Int
  year      Int
  isOpen    Boolean  @default(true)
  isTithePaid Boolean @default(false)
  tithePaidAmount Decimal @default(0) @db.Decimal(10, 2)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  incomes      Income[]
  expenses     Expense[]
  investments  Investment[]
  miscExpenses MiscExpense[]

  @@unique([userId, month, year])
  @@index([userId])
}

model Income {
  id          String   @id @default(cuid())
  monthId     String
  description String
  amount      Decimal  @db.Decimal(10, 2)
  dayOfMonth  Int?
  order       Int      @default(0)
  isReceived  Boolean  @default(false)
  isTithePaid Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  month       Month    @relation(fields: [monthId], references: [id], onDelete: Cascade)

  @@index([monthId])
}

model Expense {
  id          String      @id @default(cuid())
  monthId     String
  description String
  totalAmount Decimal     @db.Decimal(10, 2)
  paidAmount  Decimal     @db.Decimal(10, 2) @default(0)
  dayOfMonth  Int?
  order       Int         @default(0)
  type        ExpenseType @default(STANDARD)
  isPaid      Boolean     @default(false)
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  month       Month       @relation(fields: [monthId], references: [id], onDelete: Cascade)

  @@index([monthId])
}

model Investment {
  id          String   @id @default(cuid())
  monthId     String
  description String
  amount      Decimal  @db.Decimal(10, 2)
  dayOfMonth  Int?
  order       Int      @default(0)
  isPaid      Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  month       Month    @relation(fields: [monthId], references: [id], onDelete: Cascade)

  @@index([monthId])
}

model MiscExpense {
  id          String   @id @default(cuid())
  monthId     String
  description String
  amount      Decimal  @db.Decimal(10, 2)
  dayOfMonth  Int?
  order       Int      @default(0)
  isPaid      Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  month       Month    @relation(fields: [monthId], references: [id], onDelete: Cascade)

  @@index([monthId])
}

model Plan {
  id                  String   @id @default(cuid())
  clerkId             String?  @unique
  billingSource       String   @default("clerk")
  name                String
  clerkName           String?
  currency            String?  @default("brl")
  priceMonthlyCents   Int?
  priceYearlyCents    Int?
  description         String?  @db.Text
  features            String?  @db.Text
  maxCollaborators    Int      @default(0)
  badge               String?
  highlight           Boolean  @default(false)
  ctaType             String?  @default("checkout")
  ctaLabel            String?
  ctaUrl              String?
  active              Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([clerkId])
  @@index([active])
}

model Collaborator {
  id          String   @id @default(cuid())
  
  ownerId     String
  owner       User     @relation("OwnerCollaborators", fields: [ownerId], references: [id])
  
  email       String
  userId      String?
  user        User?    @relation("MemberCollaborations", fields: [userId], references: [id])
  
  status      InviteStatus @default(PENDING)
  permission  Permission   @default(VIEWER)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([ownerId, email])
}

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

model StorageObject {
  id          String   @id @default(cuid())
  clerkUserId String
  pathname    String
  url         String
  contentType String?
  size        Int?
  name        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([clerkUserId])
  @@index([createdAt])
}

enum ExpenseType {
  STANDARD
  TITHE
  INVESTMENT_TOTAL
  MISC_TOTAL
}

enum UserRole {
  USER
  ADMIN
}

enum InviteStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum Permission {
  VIEWER
  EDITOR
  ADMIN
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

## 6. Diagrama de Relacionamentos (ER)

```
User (1) ──── (N) Month
User (1) ──── (N) Collaborator [as owner]
User (1) ──── (N) Collaborator [as member]
User (1) ──── (N) Feedback

Month (1) ──── (N) Income
Month (1) ──── (N) Expense
Month (1) ──── (N) Investment
Month (1) ──── (N) MiscExpense
```

## 7. Índices e Performance

- **User**: Índices em `email`, `name`, `createdAt`, `isActive` para buscas rápidas.
- **Month**: Índice em `userId` e constraint único em `[userId, month, year]` para evitar duplicatas.
- **Transações (Income, Expense, Investment, MiscExpense)**: Índices em `monthId` para queries eficientes.
- **Plan**: Índices em `clerkId` e `active`.
- **Collaborator**: Constraint único em `[ownerId, email]` para evitar convites duplicados.
- **StorageObject**: Índices em `clerkUserId` e `createdAt`.

## 8. Migrações e Versionamento

- **Ferramenta**: Prisma Migrate (`npx prisma migrate dev`).
- **Ambiente de Desenvolvimento**: `npx prisma db push` para prototipagem rápida.
- **Produção**: Migrações versionadas e aplicadas via CI/CD.
- **Backup**: Backups automáticos antes de alterações críticas via script Docker (`docker exec -t [container] pg_dumpall`).
