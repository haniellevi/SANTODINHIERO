import { PageHeader } from "@/components/app/page-header"

export default function AdminOnboardingPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Onboarding"
                description="Configure o fluxo de entrada de novos usuários."
            />

            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                    Configurações de onboarding em desenvolvimento.
                </p>
            </div>
        </div>
    )
}
