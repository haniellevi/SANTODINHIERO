import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding plans...');

    // Verificar se plano Free já existe
    const existingFree = await prisma.plan.findFirst({
        where: { name: 'Free' },
    });

    let freePlan;
    if (!existingFree) {
        freePlan = await prisma.plan.create({
            data: {
                billingSource: 'manual',
                name: 'Free',
                currency: 'brl',
                priceMonthlyCents: 0,
                priceYearlyCents: 0,
                description: 'Gestão financeira completa e ilimitada',
                features: JSON.stringify([
                    { name: 'Entradas ilimitadas', included: true },
                    { name: 'Saídas ilimitadas', included: true },
                    { name: 'Investimentos ilimitados', included: true },
                    { name: 'Gastos avulsos ilimitados', included: true },
                    { name: 'Cálculo automático de dízimo', included: true },
                    { name: 'Planejamento mensal', included: true },
                    { name: 'Suporte via email', included: true },
                ]),
                highlight: false,
                ctaType: 'checkout',
                ctaLabel: 'Começar Grátis',
                ctaUrl: '/sign-up',
                active: true,
            },
        });
        console.log('✅ Plano Free criado:', freePlan.name);
    } else {
        console.log('ℹ️  Plano Free já existe');
    }

    // Verificar se plano Premium já existe
    const existingPremium = await prisma.plan.findFirst({
        where: { name: 'Premium' },
    });

    let premiumPlan;
    if (!existingPremium) {
        premiumPlan = await prisma.plan.create({
            data: {
                billingSource: 'manual',
                name: 'Premium',
                currency: 'brl',
                priceMonthlyCents: 2990, // R$ 29,90
                priceYearlyCents: null,
                description: 'Secretária Financeira via WhatsApp + Todas as funcionalidades Free',
                features: JSON.stringify([
                    { name: 'Tudo do plano Free', included: true },
                    { name: 'Secretária Financeira via WhatsApp', included: true },
                    { name: 'Lançamentos por áudio/mensagem', included: true },
                    { name: 'Notificações via WhatsApp', included: true },
                    { name: 'Suporte prioritário via WhatsApp', included: true },
                    { name: 'Relatórios personalizados', included: true },
                ]),
                badge: 'Em Breve',
                highlight: true,
                ctaType: 'contact',
                ctaLabel: 'Em Breve',
                ctaUrl: null,
                active: false, // Inativo até bot WhatsApp estar pronto
            },
        });
        console.log('✅ Plano Premium criado:', premiumPlan.name);
    } else {
        console.log('ℹ️  Plano Premium já existe');
    }

    // Listar planos criados
    const allPlans = await prisma.plan.findMany({
        orderBy: { priceMonthlyCents: 'asc' },
    });

    console.log('\n📊 Planos no banco:');
    allPlans.forEach((plan) => {
        const price = plan.priceMonthlyCents
            ? `R$ ${(plan.priceMonthlyCents / 100).toFixed(2)}`
            : 'Grátis';
        console.log(`  - ${plan.name}: ${price} (${plan.active ? 'Ativo' : 'Inativo'})`);
    });
}

main()
    .catch((e) => {
        console.error('❌ Erro ao fazer seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
