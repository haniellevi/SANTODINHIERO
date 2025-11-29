"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export function Topbar() {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full border-b transition-colors duration-300",
        "bg-white/80 border-slate-200 supports-[backdrop-filter]:bg-white/60", // Light Mode
        "dark:bg-dark/95 dark:border-white/5 dark:supports-[backdrop-filter]:bg-dark/90" // Dark Mode
      )}
      role="banner"
    >
      <div className="glow-separator w-full opacity-0 dark:opacity-100 transition-opacity" aria-hidden="true" />
      <div className="flex h-16 items-center gap-2 px-3 md:px-4">

        {/* Brand with Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 flex items-center justify-center">
            <Logo className="w-10 h-10" variant="icon" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold whitespace-nowrap transition-colors text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-gold">
              Santo Dinheiro
            </span>
            <span className="text-[10px] tracking-wider whitespace-nowrap uppercase font-medium text-slate-500 dark:text-slate-400">
              Gestão com Fidelidade
            </span>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Configurações"
                  labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>}
                  href="/dashboard/settings"
                />
                <UserButton.Link
                  label="Suporte"
                  labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>}
                  href="/dashboard/settings?tab=support"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">
                Inscrever-se
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
