# Database Schema Documentation - Mordomy

## 1. Visão Geral

O banco de dados utiliza **PostgreSQL**, hospedado no **Supabase** (ou outro provedor Postgres). O gerenciamento do esquema e as migrações são feitos através do **Prisma ORM**.

Esta documentação descreve as tabelas específicas do domínio financeiro do Mordomy. Estas tabelas devem ser integradas ao `schema.prisma` existente do Starter Kit, conectando-se à tabela `User` já definida.

## 2. Modelos de Dados (Models)

### 2.1. Month (Mês)
Representa um mês financeiro para um usuário específico. É a entidade central que agrupa todas as transações.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único do mês (CUID ou UUID). |
| `userId` | String | Chave estrangeira para `User.id` (do Starter Kit). |
| `month` | Int | Número do mês (1-12). |
| `year` | Int | Ano (ex: 2024). |
| `isOpen` | Boolean | Indica se o mês está aberto para edições (padrão: true). |
| `createdAt` | DateTime | Data de criação do registro. |
| `updatedAt` | DateTime | Data da última atualização. |

**Relacionamentos:**
- `user`: N-1 com `User` (Starter Kit).
- `incomes`: 1-N com `Income`.
- `expenses`: 1-N com `Expense`.
- `investments`: 1-N com `Investment`.
- `miscExpenses`: 1-N com `MiscExpense`.

**Restrições:**
- Chave única composta: `[userId, month, year]` (Um usuário não pode ter dois registros para o mesmo mês/ano).

---

### 2.2. Income (Receita)
Representa uma entrada de dinheiro.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único. |
| `monthId` | String | Chave estrangeira para `Month`. |
| `description` | String | Descrição da receita (ex: "Salário"). |
| `amount` | Decimal (10,2) | Valor da receita. |
| `dayOfMonth` | Int? | Dia do recebimento (1-31). Opcional. |
| `order` | Int | Ordem de exibição na lista (padrão: 0). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

---

### 2.3. Expense (Despesa)
Representa uma saída de dinheiro ou obrigação financeira.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único. |
| `monthId` | String | Chave estrangeira para `Month`. |
| `description` | String | Descrição da despesa. |
| `totalAmount` | Decimal (10,2) | Valor total da despesa. |
| `paidAmount` | Decimal (10,2) | Valor já pago (padrão: 0). |
| `dayOfMonth` | Int? | Dia de vencimento (1-31). Opcional. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `type` | ExpenseType | Tipo da despesa (Enum). Padrão: `STANDARD`. |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

---

### 2.4. Investment (Investimento)
Representa um aporte financeiro.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único. |
| `monthId` | String | Chave estrangeira para `Month`. |
| `description` | String | Descrição do investimento. |
| `amount` | Decimal (10,2) | Valor investido. |
| `dayOfMonth` | Int? | Dia do aporte (1-31). Opcional. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

---

### 2.5. MiscExpense (Gasto Avulso)
Representa despesas variáveis ou não planejadas.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único. |
| `monthId` | String | Chave estrangeira para `Month`. |
| `description` | String | Descrição do gasto. |
| `amount` | Decimal (10,2) | Valor do gasto. |
| `dayOfMonth` | Int? | Dia do gasto (1-31). Opcional. |
| `order` | Int | Ordem de exibição (padrão: 0). |
| `createdAt` | DateTime | Data de criação. |
| `updatedAt` | DateTime | Data de atualização. |

## 3. Enums

### 3.1. ExpenseType
Define o tipo especial de uma despesa para lógica de negócios.

- `STANDARD`: Despesa comum.
- `TITHE`: Dízimo (geralmente calculado como 10% das receitas).
- `INVESTMENT_TOTAL`: Representa o somatório dos investimentos no quadro de despesas.
- `MISC_TOTAL`: Representa o somatório dos gastos avulsos no quadro de despesas.

## 4. Diagrama de Relacionamentos (Texto)

```
User (Starter Kit Model)
  |
  | (1:N)
  v
Month
  |
  +--- (1:N) ---> Income
  |
  +--- (1:N) ---> Expense
  |
  +--- (1:N) ---> Investment
  |
  +--- (1:N) ---> MiscExpense
```

## 5. Prisma Schema (Snippet para Integração)

Adicione este conteúdo ao `schema.prisma` existente, mantendo os modelos do Starter Kit.

```prisma
// Adicionar ao model User existente:
// months Month[]

model Month {
  id        String   @id @default(cuid())
  userId    String
  month     Int
  year      Int
  isOpen    Boolean  @default(true)
  
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
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  month       Month    @relation(fields: [monthId], references: [id], onDelete: Cascade)

  @@index([monthId])
}

enum ExpenseType {
  STANDARD
  TITHE
  INVESTMENT_TOTAL
  MISC_TOTAL
}
```
