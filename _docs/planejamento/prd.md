# Product Requirements Document (PRD) - Santo Dinheiro (Starter Kit Edition)

## 1. Visão Geral do Produto

**Santo Dinheiro** é uma aplicação de gestão financeira pessoal de alta performance, projetada com uma filosofia "mobile-first" e estética premium. O sistema oferece controle total sobre finanças mensais e anuais, integrando receitas, despesas, investimentos e gastos variáveis em uma interface fluida e intuitiva. O diferencial reside na experiência do usuário (UX) refinada, com automações inteligentes (como o cálculo de dízimo) e ferramentas de planejamento financeiro avançado.

### 1.1. Missão
Capacitar indivíduos a alcançarem a liberdade financeira através de uma ferramenta elegante e poderosa, que transforma a gestão de gastos em uma experiência simples e visualmente gratificante.

### 1.2. Público-Alvo
Usuários exigentes que buscam mais do que uma planilha: desejam uma aplicação moderna, responsiva e esteticamente agradável para gerenciar seu patrimônio, controlar o fluxo de caixa mensal e planejar o futuro financeiro diretamente de seus dispositivos móveis.

## 2. Funcionalidades Principais (Implementadas)

### 2.1. Dashboard Financeiro (Área Protegida)
- **Visão Geral Financeira:** Cards de resumo com totais de Receitas, Despesas, Investimentos e Saldo Atual.
- **Previsão de Saldo:** Cálculo inteligente do saldo previsto para o dia atual ("Saldo do Dia"), considerando todas as transações (receitas, despesas, investimentos, gastos avulsos) agendadas para hoje ou antes, independentemente do status de pagamento.
- **Navegação Temporal:** Seletor de mês/ano intuitivo para transição rápida entre períodos financeiros.
- **Ações Rápidas:** Botões de acesso imediato para adicionar transações.

### 2.2. Gestão de Receitas (Incomes)
- **Registro Detalhado:** Inclusão de receitas com descrição, valor e data prevista.
- **Status de Recebimento:** Checkbox interativo para marcar receitas como "Recebidas", atualizando o saldo em tempo real.
- **Interface Visual:** Listagem clara com indicadores visuais de status (verde para recebido).

### 2.3. Gestão de Despesas (Expenses)
- **Categorização Inteligente:**
    - **Despesas Fixas:** Contas recorrentes (aluguel, internet, etc.).
    - **Dízimo Premium:** Card especial com destaque dourado ("Golden Aesthetic"), cálculo automático de 10% sobre as receitas e toggle de pagamento com feedback visual rico.
    - **Saída Total:** O card de "Despesas" no dashboard exibe o somatório total de Despesas Fixas + Dízimo + Investimentos + Gastos Avulsos, oferecendo uma visão real de tudo que sai da conta.
- **Lista Limpa:** A lista de despesas exibe apenas os itens cadastrados como despesa e o Dízimo. Investimentos e Gastos Avulsos não aparecem como linhas agregadas para evitar poluição visual, mas seus valores compõem o total.
- **Cards Compactos (Mobile):** Layout otimizado para exibir múltiplas despesas em uma única tela sem rolagem excessiva.
- **Slide-to-Pay:** Botão deslizante para confirmar pagamentos, prevenindo toques acidentais e adicionando satisfação tátil.
- **Cálculo em Cascata:** Visualização do "Saldo Restante" após cada despesa, permitindo priorização de pagamentos.

### 2.4. Gestão de Investimentos
- **Aportes Mensais:** Registro de investimentos com meta e valor realizado.
- **Integração de Fluxo:** O valor total dos investimentos é automaticamente deduzido do orçamento mensal como uma "despesa" de construção de patrimônio.
- **Status de Aporte:** Controle de efetivação do investimento.

### 2.5. Gestão de Gastos Avulsos (Misc Expenses)
- **Controle de Variáveis:** Registro de gastos não planejados ou variáveis.
- **Impacto no Orçamento:** Visualização clara de como os gastos supérfluos impactam o saldo final.

### 2.6. Planejamento e UX Avançada
- **Optimistic UI:** Atualizações instantâneas na interface antes mesmo da confirmação do servidor, garantindo sensação de rapidez extrema.
- **Feedback Visual:** Toasts e animações sutis para confirmar ações (salvar, excluir, pagar).
- **Design Responsivo:** Adaptação perfeita para mobile, com elementos de toque (touch targets) otimizados.

## 3. Requisitos Não-Funcionais

- **Mobile-First & Touch-Friendly:** Interface desenhada primariamente para uso em smartphones, com gestos e layouts ergonômicos.
- **Performance:** Carregamento instantâneo utilizando React Server Components e estratégias de cache do Next.js 15.
- **Segurança:** Autenticação robusta via Clerk, proteção de rotas e validação de dados com Zod.
- **Estética Premium:** Uso de sombras suaves, gradientes, glassmorphism e uma paleta de cores refinada (Roxo Profundo, Dourado, Verde Esmeralda).

## 4. Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript.
- **Estilização:** Tailwind CSS v4, Shadcn UI, Framer Motion (animações), Lucide React (ícones).
- **Backend:** Server Actions, Prisma ORM v6.
- **Banco de Dados:** PostgreSQL (Supabase).
- **Autenticação:** Clerk.
- **Deploy:** Vercel.

## 5. Design System

### 5.1. Diretrizes Visuais
- **Tipografia:** **Manrope** para títulos e corpo, garantindo legibilidade e modernidade.
- **Cores:**
  - **Primária:** Roxo (#7c3aed) para ações principais e branding.
  - **Destaque (Dízimo):** Dourado/Amarelo (#fbbf24) para diferenciar a contribuição.
  - **Sucesso:** Verde (#22c55e) para receitas e pagamentos efetuados.
  - **Alerta/Erro:** Vermelho (#ef4444) para despesas pendentes ou atrasadas.
  - **Background:** Modos Claro e Escuro totalmente suportados, com preferência para o Dark Mode para elegância.

### 5.2. Componentes Chave
- **Cards:** Container principal para informações, com bordas sutis e sombras de elevação.
- **Badges:** Indicadores de status (Pago, Pendente, Recebido).
- **Progress Bars:** Visualização de metas e limites de gastos.