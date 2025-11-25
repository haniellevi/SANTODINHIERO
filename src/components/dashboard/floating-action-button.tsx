"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FloatingActionButton() {
    return (
        <div className="fixed bottom-28 right-6 z-[60]">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg shadow-purple-primary/40 bg-gradient-to-br from-purple-primary to-purple-light hover:shadow-xl hover:shadow-purple-primary/50 hover:scale-105 transition-all duration-200 border-0"
                    >
                        <Plus className="h-7 w-7 text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mb-2 w-48">
                    <DropdownMenuItem className="cursor-pointer">Nova Entrada</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Nova Saída</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Novo Investimento</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Gasto Avulso</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
