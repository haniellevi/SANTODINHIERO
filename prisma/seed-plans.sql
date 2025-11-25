-- Seed inicial de planos para Santo Dinheiro
-- Execute com: psql -U postgres -d saas_template -f seed-plans.sql

-- Plano Free
INSERT INTO "Plan" (
  id,
  "clerkId",
  "billingSource",
  name,
  "clerkName",
  currency,
  "priceMonthlyCents",
  "priceYearlyCents",
  description,
  features,
  badge,
  highlight,
  "ctaType",
  "ctaLabel",
  "ctaUrl",
  active,
  "createdAt",
  "updatedAt"
) VALUES (
  'plan_free_' || gen_random_uuid(),
  NULL,
  'manual',
  'Free',
  NULL,
  'brl',
  0,
  0,
  'Gestão financeira completa e ilimitada',
  '[
    {"name": "Entradas ilimitadas", "included": true},
    {"name": "Saídas ilimitadas", "included": true},
    {"name": "Investimentos ilimitados", "included": true},
    {"name": "Gastos avulsos ilimitados", "included": true},
    {"name": "Cálculo automático de dízimo", "included": true},
    {"name": "Planejamento mensal", "included": true},
    {"name": "Suporte via email", "included": true}
  ]'::text,
  NULL,
  false,
  'checkout',
  'Começar Grátis',
  '/sign-up',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Plano Premium
INSERT INTO "Plan" (
  id,
  "clerkId",
  "billingSource",
  name,
  "clerkName",
  currency,
  "priceMonthlyCents",
  "priceYearlyCents",
  description,
  features,
  badge,
  highlight,
  "ctaType",
  "ctaLabel",
  "ctaUrl",
  active,
  "createdAt",
  "updatedAt"
) VALUES (
  'plan_premium_' || gen_random_uuid(),
  NULL,
  'manual',
  'Premium',
  NULL,
  'brl',
  2990,
  NULL,
  'Secretária Financeira via WhatsApp + Todas as funcionalidades Free',
  '[
    {"name": "Tudo do plano Free", "included": true},
    {"name": "Secretária Financeira via WhatsApp", "included": true},
    {"name": "Lançamentos por áudio/mensagem", "included": true},
    {"name": "Notificações via WhatsApp", "included": true},
    {"name": "Suporte prioritário via WhatsApp", "included": true},
    {"name": "Relatórios personalizados", "included": true}
  ]'::text,
  'Em Breve',
  true,
  'contact',
  'Em Breve',
  NULL,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verificar planos criados
SELECT 
  name,
  "priceMonthlyCents" / 100.0 as "preco_mensal_reais",
  active,
  badge
FROM "Plan"
ORDER BY "priceMonthlyCents";
