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
- **Dízimo Vinculado:** Cada receita pode ter seu dízimo individual marcado como pago/pendente.

### 2.3. Gestão de Despesas (Expenses)
- **Categorização Inteligente:**
    - **Despesas Fixas:** Contas recorrentes (aluguel, internet, etc.).
    - **Dízimo Dinâmico:** Cards especiais com destaque dourado ("Golden Aesthetic"), gerados automaticamente a partir das receitas (10%), com toggle individual de pagamento e feedback visual rico.
    - **Saída Total:** O card de "Despesas" no dashboard exibe o somatório total de Despesas Fixas + Dízimo + Investimentos + Gastos Avulsos, oferecendo uma visão real de tudo que sai da conta.
- **Lista Limpa:** A lista de despesas exibe os itens cadastrados como despesa e os Dízimos (se habilitados). Investimentos e Gastos Avulsos não aparecem como linhas agregadas para evitar poluição visual, mas seus valores compõem o total.
- **Cards Compactos (Mobile):** Layout otimizado para exibir múltiplas despesas em uma única tela sem rolagem excessiva.
- **Botões de Ação Visíveis:** Botões de editar e excluir sempre visíveis no desktop para melhor usabilidade.
- **Cálculo em Cascata:** Visualização do "Saldo Restante" após cada despesa, permitindo priorização de pagamentos.

### 2.4. Gestão de Investimentos
- **Aportes Mensais:** Registro de investimentos com meta e valor realizado.
- **Integração de Fluxo:** O valor total dos investimentos é automaticamente deduzido do orçamento mensal como uma "despesa" de construção de patrimônio.
- **Status de Aporte:** Controle de efetivação do investimento com botão de check premium.

### 2.5. Gestão de Gastos Avulsos (Misc Expenses)
- **Controle de Variáveis:** Registro de gastos não planejados ou variáveis.
- **Impacto no Orçamento:** Visualização clara de como os gastos supérfluos impactam o saldo final.
- **Status de Pagamento:** Toggle visual para marcar gastos como pagos.

### 2.6. Configurações de Conta (`/dashboard/settings`)
- **Configurações Gerais:**
    - **Toggle de Dízimo Automático:** Ative ou desative a exibição e cálculo automático de dízimos nas listas de despesas (padrão: ativado).
    - **Alertas de Planejamento:** Configure quantos dias antes do fim do mês você deseja receber lembretes para planejar o próximo período (padrão: 5 dias).
- **Gestão de Colaboradores:**
    - **Convites por E-mail:** Adicione colaboradores à sua conta com diferentes níveis de permissão:
        - **Visualizador:** Apenas visualiza dados.
        - **Editor:** Pode editar transações, mas não deletar ou configurar.
        - **Admin:** Acesso total à conta (exceto deletar a conta principal).
    - **Limites por Plano:** O número máximo de colaboradores é definido pelo campo `maxCollaborators` do seu plano de assinatura.
    - **Controle de Acesso:** Visualize status de convites (Pendente, Aceito, Rejeitado) e gerencie permissões.
    - **Barra de Progresso:** Indicador visual do uso de colaboradores em relação ao limite do plano.
- **Sistema de Suporte:**
    - **Feedback Integrado:** Reporte bugs, sugira melhorias ou envie outras solicitações diretamente do dashboard.
    - **Categorização:** Escolha entre Bug, Sugestão de Melhoria ou Outro.
    - **Rastreamento:** Todos os feedbacks são armazenados com status (Aberto, Em Progresso, Resolvido, Fechado).

### 2.7. Dashboard Administrativo (BI) (`/admin`)
- **Acesso Restrito:** Disponível apenas para Super Admins, definidos via:
    - Variáveis de ambiente `ADMIN_USER_IDS` ou `ADMIN_EMAILS` no `.env`
    - Role `ADMIN` no banco de dados (atualizada automaticamente se o usuário estiver nas variáveis de ambiente)
- **KPIs Principais:**
    - **Total de Usuários:** Quantidade total de usuários cadastrados na plataforma.
    - **Novos Usuários:** Usuários que se cadastraram no mês atual.
    - **TTV (Total Transaction Volume):** Volume total de receitas registradas por todos os usuários.
    - **Volume de Dízimos:** Total de dízimos pagos por todos os usuários (soma de `Month.tithePaidAmount`).
- **Visualizações:**
    - **Gráfico de Distribuição:** PieChart (Recharts) mostrando a distribuição de despesas por tipo (`ExpenseType`).
    - **Feedbacks Recentes:** Lista dos últimos 5 feedbacks enviados pelos usuários, com tipo, status e informações do usuário.
- **Design Premium:** Interface com glassmorphism, cards com backdrop-blur e estética consistente com o restante da aplicação.

### 2.8. Planejamento e UX Avançada
- **Optimistic UI:** Atualizações instantâneas na interface antes mesmo da confirmação do servidor, garantindo sensação de rapidez extrema.
- **Feedback Visual:** Toasts (Sonner) e animações sutis para confirmar ações (salvar, excluir, pagar).
- **Design Responsivo:** Adaptação perfeita para mobile, com elementos de toque (touch targets) otimizados.
- **Drag and Drop:** Reordenação de itens em listas usando `@hello-pangea/dnd`.

## 3. Requisitos Não-Funcionais

- **Mobile-First & Touch-Friendly:** Interface desenhada primariamente para uso em smartphones, com gestos e layouts ergonômicos.
- **Performance:** Carregamento instantâneo utilizando React Server Components e estratégias de cache do Next.js 15.
- **Segurança:** 
    - Autenticação robusta via Clerk
    - Proteção de rotas com middleware
    - Validação de dados com Zod
    - Controle de acesso baseado em roles (User, Admin)
- **Estética Premium:** Uso de sombras suaves, gradientes, glassmorphism e uma paleta de cores refinada (Roxo Profundo, Dourado, Verde Esmeralda).

## 4. Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript.
- **Estilização:** Tailwind CSS v4, Shadcn UI, Framer Motion (animações), Lucide React (ícones).
- **Backend:** Server Actions, Prisma ORM v6.
- **Banco de Dados:** PostgreSQL (Docker local / Supabase).
- **Autenticação:** Clerk.
- **Gráficos:** Recharts v2.
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
- **Badges:** Indicadores de status (Pago, Pendente, Recebido, Aceito, etc.).
- **Progress Bars:** Visualização de metas e limites de gastos/colaboradores.
- **Tabs:** Navegação entre seções (ex: Configurações).
- **Dialogs:** Modais para ações críticas (convites, confirmações).
- **Charts:** Gráficos interativos com Recharts (PieChart, BarChart).

## 6. Roadmap Futuro

- **Notificações por E-mail:** Alertas de planejamento e convites de colaboradores via Resend.
- **Categorização Automática:** IA para categorizar gastos avulsos automaticamente.
- **Relatórios Exportáveis:** PDF/Excel com resumos mensais e anuais.
- **Multi-moeda:** Suporte para múltiplas moedas e conversão automática.
- **Metas Financeiras:** Definição de objetivos e acompanhamento de progresso.