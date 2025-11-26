# Product Requirements Document (PRD) - Santo Dinheiro (Starter Kit Edition)

## 1. Visão Geral do Produto

**Santo Dinheiro** é uma aplicação de gestão financeira pessoal focada em simplicidade e eficiência ("mobile-first"). O objetivo é permitir que usuários controlem suas finanças mensais e anuais, rastreando receitas, despesas, investimentos e gastos avulsos de forma organizada. A aplicação se destaca pela automatização de cálculos (como dízimo) e pela facilidade de planejamento do mês seguinte.

### 1.1. Missão
Empoderar indivíduos a terem controle total sobre suas finanças através de uma ferramenta intuitiva que facilita o planejamento e o acompanhamento de gastos.

### 1.2. Público-Alvo
Pessoas que desejam organizar suas finanças pessoais, controlar gastos mensais, planejar investimentos e ter uma visão clara de sua saúde financeira, preferencialmente usando dispositivos móveis.

## 2. Funcionalidades Principais

### 2.1. Landing Page (Página Inicial)
- **Objetivo:** Apresentar o produto, destacar benefícios e converter visitantes em usuários.
- **Design:** Utilizar a identidade visual premium do Starter Kit (Magic UI, animações, tipografia moderna).
- **Seções:** Hero section com CTA claro, Features (funcionalidades), Depoimentos (social proof), Pricing (se houver planos futuros) e Footer.
- **Acesso:** Rota raiz `/` (pública).

### 2.2. Autenticação e Gestão de Usuários
- **Cadastro (Sign Up):** Usuários podem criar uma conta usando e-mail, senha ou social login (Google, etc.).
- **Login (Sign In):** Acesso seguro à conta.
- **Logout:** Encerramento seguro da sessão.
- **Perfil:** Gestão de conta via componente do Clerk.
- **Tecnologia:** **Clerk** (integrado ao Starter Kit).

### 2.3. Dashboard Financeiro (Área Protegida)
- **Visão Geral:** Resumo do mês atual com totais de receitas, despesas, investimentos e saldo restante.
- **Navegação Mensal:** Facilidade para alternar entre meses e anos.
- **Criação de Mês:** Funcionalidade para iniciar um novo mês, copiando dados recorrentes do mês anterior (opcional) ou iniciando do zero.

### 2.4. Gestão de Receitas (Incomes)
- **Adicionar Receita:** Inserir descrição, valor, dia do recebimento.
- **Listagem:** Visualizar todas as receitas do mês.
- **Edição/Exclusão:** Modificar ou remover receitas.
- **Ordenação:** Drag-and-drop para organizar a prioridade ou ordem de visualização.

### 2.5. Gestão de Despesas (Expenses)
- **Tipos de Despesa:**
    - **Padrão (Standard):** Contas fixas e variáveis (ex: aluguel, luz, mercado).
    - **Dízimo (Tithe):** Cálculo automático de 10% sobre o total de receitas (configurável como o primeiro item).
    - **Total de Investimentos:** Agregado automático da seção de investimentos.
    - **Total de Gastos Avulsos:** Agregado automático da seção de gastos avulsos.
- **Funcionalidades:**
    - **Adicionar Despesa:** Descrição, valor total, valor pago (para pagamentos parciais), dia de vencimento.
    - **Status de Pagamento:** Acompanhamento do quanto já foi pago vs. valor total.
    - **Saldo Restante:** Cálculo automático do valor que sobra após pagar as despesas listadas até o momento (efeito cascata).
    - **Ordenação:** Drag-and-drop para priorização de pagamentos.

### 2.6. Gestão de Investimentos
- **Adicionar Investimento:** Descrição, valor, dia.
- **Integração:** O total investido aparece automaticamente como uma despesa no quadro principal.

### 2.7. Gestão de Gastos Avulsos (Misc Expenses)
- **Adicionar Gasto Avulso:** Descrição, valor, dia.
- **Integração:** O total de gastos avulsos aparece automaticamente como uma despesa no quadro principal.

### 2.8. Planejamento e Alertas
- **Alerta de Novo Mês:** Notificação ou destaque visual quando o mês está acabando para incentivar o planejamento do próximo.
- **Duplicação de Mês:** Facilidade para clonar a estrutura de gastos fixos para o mês seguinte.

## 3. Requisitos Não-Funcionais

- **Mobile-First:** Interface otimizada para telas pequenas, com botões acessíveis e layouts responsivos.
- **Performance:** Carregamento rápido de dados (Server Components) e transições suaves.
- **Segurança:** Proteção de dados sensíveis, comunicação via HTTPS, autenticação robusta (Clerk).
- **Usabilidade:** Interface limpa, intuitiva e com feedback visual claro (Toasts, Skeletons).
- **Disponibilidade:** Aplicação hospedada em ambiente de alta disponibilidade (Vercel).

## 4. Stack Tecnológico (Baseado no Starter Kit)

- **Frontend:** Next.js 15 (App Router), React 19.
- **Estilização:** Tailwind CSS v4, Radix UI, Shadcn UI, Framer Motion, Lucide React.
- **Backend:** Server Actions, API Routes, Prisma ORM v6.
- **Banco de Dados:** PostgreSQL (via Prisma).
- **Autenticação:** Clerk.
- **Hospedagem:** Vercel.
- **Gerenciamento de Estado:** React Query (TanStack Query) para dados do cliente, Server Components para dados iniciais.

## 5. Design e UX

O design da aplicação deve seguir estritamente os protótipos fornecidos, garantindo fidelidade visual e consistência, mas adaptado para usar os componentes do sistema de design existente (Shadcn/Radix) para manter a coerência com o Starter Kit.

### 5.1. Referências de Design (Protótipos)
Os arquivos HTML a seguir contêm a definição exata de layout, cores, tipografia e componentes para cada seção:

- **Adicionar Entrada:** `designer/adicionar_entrada/entrada.html`
- **Adicionar Saída:** `designer/adicionar_saída/saida.html`
- **Dashboard Mensal:** `designer/dashboard_mensal/dashboard.html`
- **Gastos Avulsos:** `designer/gastos_avulsos/gastos_avulsos.html`
- **Investimentos:** `designer/investimentos/investimentos.html`
- **Registro de Entradas:** `designer/registro_de_entradas/registros_de_entradas.html`
- **Registro de Saídas:** `designer/registro_de_saídas/registro_de_saida.html`

### 5.2. Diretrizes Visuais (Design System)

- **Tipografia:**
  - Fonte Principal: **Manrope** (Google Fonts) ou **Inter** (Padrão do Kit) - *Decisão: Manter Manrope se essencial para a marca, ou migrar para Inter para consistência total.*
  - Pesos: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).

- **Ícones:**
  - Biblioteca: **Lucide React** (Padrão do Kit) - *Substituir Material Symbols onde possível para consistência, ou importar Material Symbols se o design exigir estritamente.*

- **Paleta de Cores (Tailwind CSS):**
  - **Modo Escuro (Dark Mode):** Suporte nativo via classe `.dark`.
  - **Cores Primárias:** Tons de Roxo (ex: `#7f13ec`, `#8A2BE2`, `#7C3AED`).
  - **Sucesso (Receitas/Entradas):** Tons de Verde (ex: `#0bda73`, `#22C55E`).
  - **Perigo/Destrutivo (Despesas/Saídas):** Tons de Vermelho (ex: `#FF4545`, `#E57373`, `#DC2626`).
  - **Backgrounds:**
    - Light: `#f7f6f8` / `#F7F2FF`
    - Dark: `#191022` / `#12101E` / `#0C0A12`

- **Componentes de UI:**
  - **Botões:** Cantos arredondados (`rounded-xl` ou `rounded-full`), altura generosa para toque (mobile-friendly).
  - **Inputs:** Estilo moderno, sem bordas agressivas, foco com anel colorido (`ring`).
  - **Cards:** Uso de sombras suaves e fundos contrastantes para agrupar informações.
  - **Listas:** Itens com ícones representativos à esquerda e valores à direita.

### 5.3. Navegação e Layout
- **Header:** Fixo ou sticky no topo, contendo título da seção e botão de voltar.
- **Footer:** Fixo na parte inferior para ações principais (ex: "Salvar", "Confirmar"), garantindo fácil acesso com o polegar.
- **Responsividade:** Layout fluido que se adapta a diferentes larguras de tela, priorizando a experiência em dispositivos móveis (largura total, elementos empilhados verticalmente).
