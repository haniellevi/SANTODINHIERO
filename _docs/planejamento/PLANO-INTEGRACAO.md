# Plano de Integração e Execução - Santo Dinheiro

Este documento define o roteiro para transformar o **Starter Kit SaaS** no aplicativo de finanças pessoais **Santo Dinheiro**.

## Fase 1: Limpeza e Preparação do Ambiente
**Objetivo:** Remover funcionalidades de exemplo do Starter Kit que não serão usadas no MVP financeiro, mantendo a infraestrutura essencial (Auth, Admin, UI).

1.  **Limpeza de Rotas:**
    *   Remover rotas de exemplo de IA (`/ai-chat`, `/api/ai/*`) se não forem usadas imediatamente. *Nota: Podemos manter os arquivos desativados ou movê-los para uma pasta `_archive` para referência futura, já que o usuário pediu para "excluir o que não formos usar".*
    *   Limpar o conteúdo da `src/app/(protected)/dashboard/page.tsx` para receber o novo dashboard financeiro.
    *   Remover itens de navegação do Sidebar (`src/components/ui/sidebar.tsx` ou configuração de navegação) que apontam para demos.

2.  **Configuração de UI:**
    *   Verificar `tailwind.config.ts` e garantir que as cores do PRD (Roxo, Verde, Vermelho) estejam configuradas como variáveis de tema ou estendidas.
    *   Instalar fontes necessárias (Manrope) se não estiverem presentes.

## Fase 2: Banco de Dados (Schema Migration)
**Objetivo:** Implementar as tabelas financeiras no banco de dados.

1.  **Atualizar Schema:**
    *   Editar `prisma/schema.prisma`.
    *   Adicionar os modelos: `Month`, `Income`, `Expense`, `Investment`, `MiscExpense`.
    *   Adicionar o relacionamento `months` no modelo `User` existente.
    *   Adicionar o enum `ExpenseType`.

2.  **Migração:**
    *   Executar `npm run db:migrate` (ou `db:push` para dev rápido) para criar as tabelas no Supabase.
    *   Gerar o Prisma Client atualizado (`npm run postinstall` ou `npx prisma generate`).

## Fase 3: Landing Page (Raiz)
**Objetivo:** Criar a página pública de apresentação do produto.

1.  **Estrutura:**
    *   Editar `src/app/(public)/page.tsx`.
    *   Substituir o conteúdo atual pela Landing Page do Mordomy.

2.  **Componentes (Magic UI / Shadcn):**
    *   **Hero Section:** Título impactante ("Controle total sobre suas finanças"), subtítulo, botão CTA ("Começar Agora") levando para `/sign-up`. Usar componentes visuais do kit (ex: `BlurFade`, `Particles` ou `GridPattern` se disponíveis).
    *   **Features:** Grid de cards mostrando "Gestão de Receitas", "Controle de Despesas", "Dízimo Automático".
    *   **Footer:** Links simples e copyright.

## Fase 4: Dashboard Financeiro (Core)
**Objetivo:** Implementar a lógica de negócio principal.

1.  **Server Actions & Queries (`src/lib/queries/finance.ts`):**
    *   Criar funções para buscar o mês atual do usuário.
    *   Criar funções para listar receitas, despesas, etc.
    *   Criar Server Actions para CRUD (Criar Mês, Adicionar Receita, Adicionar Despesa).

2.  **Componentes do Dashboard:**
    *   **Header do Mês:** Seletor de mês/ano (setas < >).
    *   **Resumo (Summary Cards):** Cards com Receita Total, Despesa Total, Saldo.
    *   **Tabelas/Listas:** Componentes para listar cada categoria (Receitas, Despesas Fixas, etc.).
    *   **Forms (Dialogs):** Modais para adicionar/editar itens.

3.  **Lógica de Negócio:**
    *   Implementar cálculo automático do Dízimo (10% das receitas) no backend ou frontend.
    *   Implementar agregação de Investimentos e Gastos Avulsos na tabela de Despesas.

## Fase 5: Refinamento e UI/UX
**Objetivo:** Polimento visual e interações.

1.  **Drag-and-Drop:**
    *   Implementar ordenação nas listas de despesas/receitas (usando `dnd-kit` ou similar, se compatível com o kit).

2.  **Feedback Visual:**
    *   Configurar Toasts para sucesso/erro nas operações.
    *   Adicionar "Empty States" (telas vazias) amigáveis quando não houver dados no mês.

## Fase 6: Testes e Deploy
1.  **Testes Manuais:** Verificar fluxo de cadastro -> dashboard -> criação de registros.
2.  **Deploy:** Push para `main` (que aciona deploy na Vercel).
