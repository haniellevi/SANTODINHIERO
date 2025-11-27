"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Settings,
    Database,
    CreditCard,
    UserPlus,
    FileText,
    MessageSquare
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Usuários",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Configurações",
        url: "/admin/settings",
        icon: Settings,
    },
    {
        title: "Storage",
        url: "/admin/storage",
        icon: Database,
    },
    {
        title: "Créditos",
        url: "/admin/credits",
        icon: CreditCard,
    },

    {
        title: "Uso",
        url: "/admin/usage",
        icon: FileText,
    },
    {
        title: "Suporte",
        url: "/admin/support",
        icon: MessageSquare,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border px-6 py-4">
                <Link href="/admin" className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">Santo Dinheiro</span>
                    <span className="text-xs text-muted-foreground">Admin</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
