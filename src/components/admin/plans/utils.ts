import type { BillingPlan, PlanFeature, ClerkPlan } from './types';

export function mapFeaturesFromApi(features: unknown): PlanFeature[] {
    if (!features) return [];
    let featureArray: any[] = [];

    if (typeof features === 'string') {
        try {
            const parsed = JSON.parse(features);
            if (Array.isArray(parsed)) {
                featureArray = parsed;
            }
        } catch {
            return [];
        }
    } else if (Array.isArray(features)) {
        featureArray = features;
    }

    return featureArray.map((f) => ({
        name: f.name || f.text || '', // compatible with old 'text' property
        description: f.description || null,
        included: f.included !== false,
    }));
}

export function serializePlanForPersistence(plan: BillingPlan) {
    return {
        billingSource: plan.billingSource ?? 'clerk',
        name: plan.name,
        credits: plan.credits,
        active: plan.active ?? true,
        clerkName: plan.clerkName ?? null,
        currency: plan.currency ?? null,
        priceMonthlyCents: plan.priceMonthlyCents ?? null,
        priceYearlyCents: plan.priceYearlyCents ?? null,
        description: plan.description || null,
        features: plan.features && plan.features.length > 0 ? plan.features : null, // No longer stringified
        badge: plan.badge || null,
        highlight: plan.highlight ?? false,
        ctaType: plan.ctaType ?? 'checkout',
        ctaLabel: plan.ctaLabel || null,
        ctaUrl: plan.ctaUrl || null,
    };
}

export function findPlanKeyByClerkId(
    plans: Record<string, BillingPlan>,
    clerkId: string
): string | null {
    for (const [key, plan] of Object.entries(plans)) {
        if (plan.clerkId === clerkId) return key;
    }
    return null;
}

export function findPlanKeyByName(
    plans: Record<string, BillingPlan>,
    name: string
): string | null {
    const normalized = name.toLowerCase().trim();
    for (const [key, plan] of Object.entries(plans)) {
        if (plan.name.toLowerCase().trim() === normalized) return key;
    }
    return null;
}

export function resolveMonthlyAmount(plan: ClerkPlan): number | null {
    if (!plan.prices) return null;
    const monthlyPrice = plan.prices.find(
        (p) => p.recurring?.interval === 'month' && p.recurring?.interval_count === 1
    );
    return monthlyPrice?.unit_amount ?? null;
}

export function resolveYearlyAmount(plan: ClerkPlan): number | null {
    if (!plan.prices) return null;
    const yearlyPrice = plan.prices.find(
        (p) => p.recurring?.interval === 'year' && p.recurring?.interval_count === 1
    );
    return yearlyPrice?.unit_amount ?? null;
}

export function resolveCurrency(plan: ClerkPlan): string | null {
    if (!plan.prices || plan.prices.length === 0) return null;
    return plan.prices[0]?.currency ?? null;
}

export function createNewCustomPlan(): BillingPlan {
    return {
        clerkId: null,
        billingSource: 'manual',
        name: 'Novo Plano Customizado',
        credits: 0,
        active: true,
        clerkName: null,
        currency: 'brl',
        priceMonthlyCents: null,
        priceYearlyCents: null,
        description: '',
        features: [],
        badge: null,
        highlight: false,
        ctaType: 'contact',
        ctaLabel: 'Fale Conosco',
        ctaUrl: null,
        isNew: true,
    };
}

export function formatCurrency(cents: number | null, currency: string = 'brl'): string {
    if (cents === null) return '-';
    const amount = cents / 100;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount);
}
