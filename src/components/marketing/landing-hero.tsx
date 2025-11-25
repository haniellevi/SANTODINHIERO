"use client";
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
} as const

export function LandingHero() {
    return (
        <section className="relative overflow-hidden pt-24 md:pt-36 pb-16 md:pb-32">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-background.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Overlay gradient para manter legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background dark:from-background/90 dark:via-background/70 dark:to-background" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                    <AnimatedGroup variants={transitionVariants}>
                        <Link
                            href="/sign-up"
                            className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                            <span className="text-foreground text-sm">Novo: Controle Financeiro Inteligente</span>
                            <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                            <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                    <span className="flex size-6">
                                        <ArrowRight className="m-auto size-3" />
                                    </span>
                                    <span className="flex size-6">
                                        <ArrowRight className="m-auto size-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <h1
                            className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold tracking-tight">
                            Seu Dinheiro Administrado com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Propósito</span>
                        </h1>
                        <p
                            className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                            Entradas, Saídas, Investimentos e Gastos Avulsos.
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">É tão simples que você vai amar!</span>
                        </p>
                    </AnimatedGroup>

                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                        className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                        <div
                            key={1}
                            className="bg-foreground/10 rounded-[14px] border p-0.5">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-xl px-8 text-base bg-purple-600 hover:bg-purple-700 text-white">
                                <Link href="/sign-up">
                                    <span className="text-nowrap">Começar Agora</span>
                                </Link>
                            </Button>
                        </div>
                        <Button
                            key={2}
                            asChild
                            size="lg"
                            variant="ghost"
                            className="h-10.5 rounded-xl px-5">
                            <Link href="#features">
                                <span className="text-nowrap">Saiba mais</span>
                            </Link>
                        </Button>
                    </AnimatedGroup>
                </div>
            </div>

            <AnimatedGroup
                variants={{
                    container: {
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.75,
                            },
                        },
                    },
                    ...transitionVariants,
                }}>
                <div className="relative mt-16 mx-auto max-w-5xl px-6">
                    <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto overflow-hidden rounded-2xl border p-2 shadow-2xl shadow-purple-500/20 ring-1">
                        <div className="relative rounded-xl bg-muted/50 border border-dashed border-muted-foreground/20 overflow-hidden">
                            <Image
                                src="/preview-dashboard.svg"
                                alt="Preview do Dashboard Santo Dinheiro"
                                width={1200}
                                height={675}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </AnimatedGroup>
        </section>
    )
}
