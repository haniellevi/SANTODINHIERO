"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Topbar } from "@/components/app/topbar";
import { BottomNav } from "@/components/app/bottom-nav";
import { PageMetadataProvider } from "@/contexts/page-metadata";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Authenticated layout without sidebar
  return (
    <PageMetadataProvider>
      <div className="min-h-dvh w-full text-foreground flex flex-col bg-background-dark">
        <Topbar />
        <main className="w-full flex-1">
          {children}
        </main>
        <BottomNav />
      </div>
    </PageMetadataProvider>
  );
}
