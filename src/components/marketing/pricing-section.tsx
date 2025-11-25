'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Plan {
    id: string
    clerkId: string | null
    name: string
    currency: string | null
    priceMonthlyCents: number | null
    priceYearlyCents: number | null
    description: string | null
    features: string | null
    badge: string | null
    highlight: boolean | null
    ctaType: string | null
    ctaLabel: string | null
    ctaUrl: string | null
    billingSource: string | null
}

interface PlansResponse {
    plans: Plan[]
}

function formatPrice(cents: number | null, currency: string = 'BRL'): string {
    if (cents === null) return 'Grátis'

    const value = cents / 100
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
    }).format(value)
}

function parseFeatures(featuresJson: string | null): string[] {
    if (!featuresJson) return []

    try {
        const parsed = JSON.parse(featuresJson)
        if (!Array.isArray(parsed)) return []

        // Suporta tanto array de strings quanto array de objetos {name, included}
        return parsed
            .filter(item => {
                // Se for objeto, verifica se está incluído
                if (typeof item === 'object' && item !== null) {
                    return item.included !== false
                }
                // Se for string, sempre inclui
                return true
            })
            .map(item => {
                // Se for objeto, extrai o nome
                if (typeof item === 'object' && item !== null) {
                    return item.name || String(item)
                }
                // Se for string, retorna direto
                return String(item)
            })
    } catch {
        return []
    }
}

function PlanCard({ plan }: { plan: Plan }) {
    const features = parseFeatures(plan.features)
    const isHighlight = plan.highlight ?? false
    const currency = plan.currency || 'BRL'

    return (
        <Card
            className={`relative flex flex-col h-full transition-all duration-300 hover:scale-105 ${isHighlight
                ? 'border-primary shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/5 to-transparent'
                : 'hover:shadow-lg'
                }`}
        >
            {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant={isHighlight ? 'default' : 'secondary'} className="px-4 py-1">
                        {isHighlight && <Sparkles className="w-3 h-3 mr-1" />}
                        {plan.badge}
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                {plan.description && (
                    <CardDescription className="text-sm mt-2">
                        {plan.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
                <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">
                            {formatPrice(plan.priceMonthlyCents, currency)}
                        </span>
                        {plan.priceMonthlyCents !== null && (
                            <span className="text-muted-foreground">/mês</span>
                        )}
                    </div>

                    {plan.priceYearlyCents !== null && plan.priceMonthlyCents !== null && (
                        <p className="text-sm text-muted-foreground mt-2">
                            ou {formatPrice(plan.priceYearlyCents, currency)}/ano
                        </p>
                    )}
                </div>

                {features.length > 0 && (
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>

            <CardFooter className="pt-4">
                {plan.ctaType === 'contact' ? (
                    <Button
                        asChild
                        variant={isHighlight ? 'default' : 'outline'}
                        className="w-full"
                        size="lg"
                    >
                        <Link href={plan.ctaUrl || '/contact'}>
                            {plan.ctaLabel || 'Entre em Contato'}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        asChild
                        variant={isHighlight ? 'default' : 'outline'}
                        className="w-full"
                        size="lg"
                    >
                        <Link href={plan.ctaUrl || '/sign-up'}>
                            {plan.ctaLabel || 'Começar Agora'}
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export function PricingSection() {
    const { data, isLoading, error } = useQuery<PlansResponse>({
        queryKey: ['public-plans'],
        queryFn: async () => {
            const response = await fetch('/api/public/plans')
            if (!response.ok) {
                throw new Error('Failed to fetch plans')
            }
            return response.json()
        },
    })

    if (isLoading) {
        return (
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Escolha seu Plano
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Carregando planos disponíveis...
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    if (error || !data?.plans || data.plans.length === 0) {
        return null // Não exibe a seção se não houver planos
    }

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Escolha seu Plano
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Selecione o plano ideal para suas necessidades e comece a transformar suas finanças hoje mesmo
                    </p>
                </div>

                <div className={`grid gap-8 ${data.plans.length === 1
                    ? 'max-w-md mx-auto'
                    : data.plans.length === 2
                        ? 'md:grid-cols-2 max-w-4xl mx-auto'
                        : 'md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {data.plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    )
}
