"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function AdminChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const getBreadcrumbs = () => {
        const segments = pathname.split('/').filter(Boolean)
        const breadcrumbs = segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/')
            const label = segment.charAt(0).toUpperCase() + segment.slice(1)
            return { href, label }
        })
        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs()

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center gap-2">
                                {index > 0 && <BreadcrumbSeparator />}
                                <BreadcrumbItem>
                                    {index === breadcrumbs.length - 1 ? (
                                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 pt-6">
                {children}
            </main>
        </>
    )
}
