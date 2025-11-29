"use client";

import { PageHeader } from "@/components/app/page-header";
import { useSetPageMetadata } from "@/contexts/page-metadata";

export default function AdminOnboardingPage() {
    useSetPageMetadata({
        title: "Onboarding",
        description: "Configure o fluxo de entrada de novos usuários.",
    });
    
    return (
        <div className="space-y-6">
            <PageHeader />

            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                    Configurações de onboarding em desenvolvimento.
                </p>
            </div>
        </div>
    )
}
