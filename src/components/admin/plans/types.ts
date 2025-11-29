import type { ClerkPlan } from '@/hooks/use-admin-plans';

export type { ClerkPlan };


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
    name: string;
    description?: string | null;
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
