import { prisma } from "@/lib/db";

/**
 * Script para limpar meses antigos do banco de dados
 * Mantém apenas o mês atual ou meses futuros
 */
async function cleanOldMonths() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log(`Limpando meses anteriores a ${currentMonth}/${currentYear}...`);

    // Delete months before current month/year
    const result = await prisma.month.deleteMany({
        where: {
            OR: [
                { year: { lt: currentYear } },
                {
                    year: currentYear,
                    month: { lt: currentMonth },
                },
            ],
        },
    });

    console.log(`✅ ${result.count} meses antigos foram removidos.`);

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
    remaining.forEach(m => {
        console.log(`  - ${m.month}/${m.year} (userId: ${m.userId})`);
    });
}

cleanOldMonths()
    .then(() => {
        console.log("\n✅ Limpeza concluída!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Erro ao limpar banco:", error);
        process.exit(1);
    });
