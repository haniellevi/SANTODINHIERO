import { prisma } from "@/lib/db";

/**
 * Script para manter APENAS o mês atual
 * Remove todos os meses anteriores E posteriores ao mês atual
 */
async function keepOnlyCurrentMonth() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log(`Mantendo apenas ${currentMonth}/${currentYear}...`);

    // Delete all months except current
    const result = await prisma.month.deleteMany({
        where: {
            OR: [
                { year: { lt: currentYear } },
                { year: { gt: currentYear } },
                {
                    year: currentYear,
                    month: { not: currentMonth },
                },
            ],
        },
    });

    console.log(`✅ ${result.count} meses foram removidos.`);

    // List remaining months
    const remaining = await prisma.month.findMany({
        select: {
            month: true,
            year: true,
            userId: true,
        },
        orderBy: [
            { year: "asc" },
            { month: "asc" },
        ],
    });

    console.log(`\n📅 Meses restantes no banco:`);
    if (remaining.length === 0) {
        console.log(`  (nenhum mês no banco)`);
    } else {
        remaining.forEach(m => {
            console.log(`  - ${m.month}/${m.year} (userId: ${m.userId})`);
        });
    }
}

keepOnlyCurrentMonth()
    .then(() => {
        console.log("\n✅ Limpeza concluída! Apenas o mês atual permanece.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Erro ao limpar banco:", error);
        process.exit(1);
    });
