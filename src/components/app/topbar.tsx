"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { site } from "@/lib/brand-config";

export function Topbar() {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90"
      )}
      role="banner"
    >
      <div className="glow-separator w-full" aria-hidden="true" />
      <div className="flex h-16 items-center gap-2 px-3 md:px-4">

        {/* Brand with Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 rounded-full bg-primary p-2 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all flex items-center justify-center">
            <Image
              src="/logo-coroa.svg"
              alt={site.shortName}
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-primary via-primary-light to-accent-green bg-clip-text text-transparent">
              Santo Dinheiro
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider">Finanças Protegidas</span>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <SignedIn>
            <UserButton />
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
