export interface BillingPlan {
    planId?: string;
    clerkId: string | null;
    billingSource?: 'clerk' | 'manual';
    name: string;
    credits: number;
    active?: boolean;
    clerkName?: string | null;
    currency?: string | null;
    priceMonthlyCents?: number | null;
    priceYearlyCents?: number | null;
    description?: string;
    features?: PlanFeature[];
    badge?: string | null;
    highlight?: boolean;
    ctaType?: 'checkout' | 'contact' | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    isNew?: boolean;
}

export interface PlanFeature {
    text: string;
    included: boolean;
}

export interface SyncPreviewItem {
    plan: ClerkPlan;
    exists: boolean;
    matchKey?: string;
}

export interface SyncPreview {
    plans: ClerkPlan[];
    previewItems: SyncPreviewItem[];
    missing: Array<{ id: string; name: string }>;
}

export interface ClerkPlan {
    id: string;
    name?: string;
    slug?: string;
    prices?: Array<{
        id: string;
        unit_amount?: number;
        currency?: string;
        recurring?: {
            interval?: string;
            interval_count?: number;
        };
    }>;
}
