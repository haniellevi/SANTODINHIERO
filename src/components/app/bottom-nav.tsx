"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Receipt, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Início",
        href: "/dashboard",
        icon: Home,
        activeColor: "text-primary",
        inactiveColor: "text-primary/70",
    },
    {
        label: "Entradas",
        href: "/dashboard/incomes",
        icon: ArrowUpCircle,
        activeColor: "text-emerald-500",
        inactiveColor: "text-emerald-500/70",
    },
    {
        label: "Saídas",
        href: "/dashboard/expenses",
        icon: ArrowDownCircle,
        activeColor: "text-rose-500",
        inactiveColor: "text-rose-500/70",
    },
    {
        label: "Investimentos",
        href: "/dashboard/investments",
        icon: TrendingUp,
        activeColor: "text-blue-400",
        inactiveColor: "text-blue-400/70",
    },
    {
        label: "Gastos Avulsos",
        href: "/dashboard/misc-expenses",
        icon: Receipt,
        activeColor: "text-yellow-400",
        inactiveColor: "text-yellow-400/70",
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around h-16 px-2 pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300",
                                "min-w-[70px] group",
                                isActive
                                    ? "bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                                    : "hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300",
                                isActive && "opacity-100"
                            )} />

                            <Icon className={cn(
                                "h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                                isActive ? item.activeColor : item.inactiveColor,
                                isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            )} />

                            <span
                                className={cn(
                                    "text-[10px] font-medium text-center leading-tight relative z-10",
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
