
import { prisma } from "@/lib/db";

async function main() {
    const userId = "cmidmi8ki00080fj4ess4xv8n"; // ID from logs
    console.log(`Checking months for user: ${userId}`);

    const months = await prisma.month.findMany({
        where: { userId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        select: { month: true, year: true, id: true }
    });

    console.log("Found months:", months);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
