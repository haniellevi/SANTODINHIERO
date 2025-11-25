"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Calendar, Lock } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export function LandingFeatures() {
    return (
        <section id="features" className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Tudo que você precisa para organizar suas contas</h2>
                <p className="mt-3 text-muted-foreground">Funcionalidades essenciais para quem quer paz financeira.</p>
            </div>

            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-3 md:grid-rows-2 lg:gap-4">
                <GridItem
                    area="md:[grid-area:1/1/2/2]"
                    icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                    title="Gestão de Entradas"
                    description="Registre todas as suas entradas e saiba exatamente quanto ganha."
                />
                <GridItem
                    area="md:[grid-area:1/2/2/3]"
                    icon={<TrendingDown className="h-4 w-4 text-red-500" />}
                    title="Controle de Saídas"
                    description="Acompanhe seus gastos fixos e variáveis. Nada escapa."
                />
                <GridItem
                    area="md:[grid-area:1/3/2/4]"
                    icon={<Lock className="h-4 w-4 text-purple-500" />}
                    title="Dízimo Automático"
                    description="Cálculo automático de 10% sobre suas entradas para facilitar sua organização."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/2]"
                    icon={<PiggyBank className="h-4 w-4 text-blue-500" />}
                    title="Investimentos"
                    description="Acompanhe seus aportes mensais e veja seu patrimônio crescer."
                />
                <GridItem
                    area="md:[grid-area:2/2/3/3]"
                    icon={<Wallet className="h-4 w-4 text-orange-500" />}
                    title="Gastos Avulsos"
                    description="Controle aqueles gastos não planejados do dia a dia."
                />
                <GridItem
                    area="md:[grid-area:2/3/3/4]"
                    icon={<Calendar className="h-4 w-4 text-teal-500" />}
                    title="Planejamento Mensal"
                    description="Inicie cada mês com clareza e previsibilidade."
                />
            </ul>
        </section>
    )
}

interface GridItemProps {
    area: string
    icon: React.ReactNode
    title: string
    description: React.ReactNode
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}
