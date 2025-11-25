"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Entradas",
        href: "/dashboard/incomes",
        icon: ArrowUpCircle,
        activeColor: "text-accent-green",
        inactiveColor: "text-accent-green/50",
    },
    {
        label: "Saídas",
        href: "/dashboard/expenses",
        icon: ArrowDownCircle,
        activeColor: "text-accent-red",
        inactiveColor: "text-accent-red/50",
    },
    {
        label: "Investimentos",
        href: "/dashboard/investments",
        icon: TrendingUp,
        activeColor: "text-blue-400",
        inactiveColor: "text-blue-400/50",
    },
    {
        label: "Gastos Avulsos",
        href: "/dashboard/misc-expenses",
        icon: Receipt,
        activeColor: "text-yellow-400",
        inactiveColor: "text-yellow-400/50",
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dark border-t border-border/50">
            <div className="flex items-center justify-around h-20 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all",
                                "min-w-[70px]"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive ? item.activeColor : item.inactiveColor)} />
                            <span
                                className={cn(
                                    "text-[10px] font-medium text-center leading-tight",
                                    isActive ? item.activeColor : item.inactiveColor
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
