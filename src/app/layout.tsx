import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { siteMetadata } from "@/lib/brand-config";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900 dark:text-slate-50 bg-background`}
        >
          <QueryProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
