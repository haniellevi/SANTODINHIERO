import { SUBSCRIPTION_PLANS } from '@/lib/clerk/subscription-utils';

/**
 * Get credits for a specific plan
 * @param planId - The plan ID (free, starter, professional, enterprise)
 * @returns The number of credits for the plan
 */
export async function getPlanCredits(planId: string): Promise<number> {
    const plan = SUBSCRIPTION_PLANS[planId];

    if (!plan) {
        throw new Error(`Invalid plan ID: ${planId}`);
    }

    return plan.credits;
}
