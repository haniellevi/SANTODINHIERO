# Database Schema Documentation - Santo Dinheiro

## 1. Visão Geral

O banco de dados utiliza **PostgreSQL**, hospedado no **Supabase**. O gerenciamento do esquema e as migrações são feitos através do **Prisma ORM**.

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
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

### 2.2. Month (Mês Financeiro)
Agrupa todas as transações de um mês específico para um usuário.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `userId` | String | FK para User. |
| `month` | Int | Mês (1-12). |
| `year` | Int | Ano (ex: 2024). |
| `isOpen` | Boolean | Se o mês está aberto para edições. |
| `isTithePaid` | Boolean | Se o dízimo do mês foi pago. |
| `tithePaidAmount` | Decimal | Valor pago do dízimo. |

### 2.3. Income (Receita)
Entradas financeiras.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `amount` | Decimal | Valor previsto. |
| `isReceived` | Boolean | Se o valor já foi recebido. |

### 2.4. Expense (Despesa)
Saídas financeiras e obrigações.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `description` | String | Descrição. |
| `totalAmount` | Decimal | Valor total. |
| `paidAmount` | Decimal | Valor pago. |
| `isPaid` | Boolean | Status de pagamento total. |
| `type` | ExpenseType | Tipo (STANDARD, TITHE, etc). |

### 2.5. Investment (Investimento)
Aportes financeiros.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `amount` | Decimal | Valor do aporte. |
| `isPaid` | Boolean | Se o aporte foi realizado. |

### 2.6. MiscExpense (Gasto Avulso)
Gastos variáveis não planejados.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (CUID) | Identificador único. |
| `monthId` | String | FK para Month. |
| `amount` | Decimal | Valor do gasto. |
| `isPaid` | Boolean | Se o gasto foi realizado. |

### 2.7. Lógica de Negócios e Cálculos
- **Saída Total (Dashboard):** É a soma de `Expense.totalAmount` (incluindo Dízimo) + `Investment.amount` + `MiscExpense.amount`.
- **Saldo Previsto (Dashboard):** Calculado somando todas as `Income` agendadas para o dia atual ou anterior, e subtraindo todas as saídas (`Expense`, `Investment`, `MiscExpense`) agendadas para o dia atual ou anterior. O campo `dayOfMonth` é usado como referência.
- **Saldo do Mês:** `Total Income` - `Total Outflow` (todas as saídas).

## 3. Prisma Schema (Atual)

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

  months             Month[]

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
```

## 4. SQL Schema (DDL) para Replicação

Use este script SQL para recriar a estrutura do banco de dados em qualquer instância PostgreSQL.

```sql
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('STANDARD', 'TITHE', 'INVESTMENT_TOTAL', 'MISC_TOTAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Month" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isTithePaid" BOOLEAN NOT NULL DEFAULT false,
    "tithePaidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "ExpenseType" NOT NULL DEFAULT 'STANDARD',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiscExpense" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiscExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "billingSource" TEXT NOT NULL DEFAULT 'clerk',
    "name" TEXT NOT NULL,
    "clerkName" TEXT,
    "currency" TEXT DEFAULT 'brl',
    "priceMonthlyCents" INTEGER,
    "priceYearlyCents" INTEGER,
    "description" TEXT,
    "features" TEXT,
    "badge" TEXT,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "ctaType" TEXT DEFAULT 'checkout',
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageObject" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_name_idx" ON "User"("name");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "Month_userId_idx" ON "Month"("userId");
CREATE UNIQUE INDEX "Month_userId_month_year_key" ON "Month"("userId", "month", "year");

-- CreateIndex
CREATE INDEX "Income_monthId_idx" ON "Income"("monthId");

-- CreateIndex
CREATE INDEX "Expense_monthId_idx" ON "Expense"("monthId");

-- CreateIndex
CREATE INDEX "Investment_monthId_idx" ON "Investment"("monthId");

-- CreateIndex
CREATE INDEX "MiscExpense_monthId_idx" ON "MiscExpense"("monthId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_clerkId_key" ON "Plan"("clerkId");
CREATE INDEX "Plan_clerkId_idx" ON "Plan"("clerkId");
CREATE INDEX "Plan_active_idx" ON "Plan"("active");

-- CreateIndex
CREATE INDEX "StorageObject_clerkUserId_idx" ON "StorageObject"("clerkUserId");
CREATE INDEX "StorageObject_createdAt_idx" ON "StorageObject"("createdAt");

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiscExpense" ADD CONSTRAINT "MiscExpense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```
