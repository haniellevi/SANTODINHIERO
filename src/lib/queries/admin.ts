import { db } from "@/lib/db";

export async function getAdminMetrics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User Metrics
    const totalUsers = await db.user.count();
    const newUsers = await db.user.count({
        where: {
            createdAt: {
                gte: firstDayOfMonth
            }
        }
    });

    // Financial Metrics (Global)
    // Note: This might be heavy on a large DB, but fine for MVP.
    // Ideally we would have aggregate tables.

    const allIncomes = await db.income.aggregate({
        _sum: { amount: true }
    });

    const totalTTV = Number(allIncomes._sum.amount || 0);

    // Tithe Metrics (Incomes marked as tithe paid or just calculated?)
    // Let's count incomes where isTithePaid is true, but we don't store the tithe amount explicitly on income, 
    // we calculate it as 10%. Or we use the Month.tithePaidAmount?
    // The Month model has tithePaidAmount. Let's sum that.

    const allMonths = await db.month.aggregate({
        _sum: { tithePaidAmount: true }
    });

    const totalTitheVolume = Number(allMonths._sum.tithePaidAmount || 0);

    return {
        users: {
            total: totalUsers,
            newThisMonth: newUsers
        },
        finance: {
            ttv: totalTTV,
            titheVolume: totalTitheVolume
        }
    };
}

export async function getExpenseCategoryDistribution() {
    // Since we don't have categories in the schema yet (ExpenseType is limited),
    // we can group by ExpenseType or just show Standard vs Others.
    // Or we can group by description if we had AI categorization.
    // For now, let's group by ExpenseType from the Expense model.

    const distribution = await db.expense.groupBy({
        by: ['type'],
        _sum: {
            totalAmount: true
        }
    });

    return distribution.map(d => ({
        name: d.type,
        value: Number(d._sum.totalAmount || 0)
    }));
}

export async function getRecentFeedbacks() {
    return await db.feedback.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
}
