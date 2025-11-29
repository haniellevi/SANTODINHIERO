import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const plans = [
        {
            name: 'Fiel',
            priceMonthlyCents: 0,
            priceYearlyCents: 0,
            description: 'Para quem está começando a organizar a casa.',
            features: JSON.stringify([
                'Gestão de Dízimos',
                'Controle de Entradas e Saídas',
                'Dashboard Básico',
                '1 Carteira'
            ]),
            highlight: false,
            ctaLabel: 'Começar Grátis',
            ctaUrl: '/dashboard',
            active: true,
        },
        {
            name: 'Mordomo',
            priceMonthlyCents: 2990,
            priceYearlyCents: 29900,
            description: 'Gestão completa para quem quer prosperar.',
            features: JSON.stringify([
                'Tudo do plano Fiel',
                'Múltiplas Carteiras',
                'Metas de Economia',
                'Relatórios Avançados',
                'Suporte Prioritário'
            ]),
            highlight: true,
            ctaLabel: 'Assinar Agora',
            ctaUrl: '/dashboard/upgrade',
            active: true,
        },
        {
            name: 'Visionário',
            priceMonthlyCents: 4990,
            priceYearlyCents: 49900,
            description: 'Para famílias e pequenos empreendedores.',
            features: JSON.stringify([
                'Tudo do plano Mordomo',
                'Gestão de Investimentos',
                'Acesso para Cônjuge',
                'Consultoria Mensal (IA)',
                'Exportação de Dados'
            ]),
            highlight: false,
            ctaLabel: 'Assinar Agora',
            ctaUrl: '/dashboard/upgrade',
            active: true,
        },
    ];

    // Delete existing plans first to avoid conflicts
    await prisma.plan.deleteMany({});
    console.log('Deleted existing plans');

    // Create new plans
    for (const plan of plans) {
        await prisma.plan.create({
            data: plan,
        });
        console.log(`Created plan: ${plan.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
