import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-50">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Icon className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground/60 max-w-xs">{description}</p>
        </div>
    );
}
