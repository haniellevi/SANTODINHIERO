import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        const userCount = await prisma.user.count();
        const monthCount = await prisma.month.count();

        console.log('=== PRODUCTION DATABASE STATUS ===');
        console.log(`Users: ${userCount}`);
        console.log(`Months: ${monthCount}`);

        if (userCount > 0) {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    clerkId: true
                }
            });
            console.log('\nUsers in database:');
            console.log(JSON.stringify(users, null, 2));
        }
    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
