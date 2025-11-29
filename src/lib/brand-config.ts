import type { Metadata } from 'next'

type LogoPaths = {
  light?: string
  dark?: string
}

type IconPaths = {
  favicon?: string
  apple?: string
  shortcut?: string
}

export type AnalyticsConfig = {
  gtmId?: string
  gaMeasurementId?: string
  facebookPixelId?: string
}

export const site = {
  name: 'Santo Dinheiro - Seu Dinheiro Administrado com Propósito',
  shortName: 'Santo Dinheiro',
  description:
    'Entradas, Saídas, Investimentos e Gastos Avulsos. De um Jeito tão simples que você vai amar!',
  url: (process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_APP_URL : `https://${process.env.NEXT_PUBLIC_APP_URL}`) || 'http://localhost:3000',
  author: 'Rvs Tecnologia',
  keywords: ['Mordomia Cristão', 'Orçamento Familiar', 'Jesus', 'Dinheiro', 'Investimento', 'Gestão Financeira', 'Gastos Avulsos', 'Entradas', 'Saídas', 'Investimentos', 'Prosperidade', 'Inteligência Financeira'],
  ogImage: '/og-image-share.png',
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  } as LogoPaths,
  icons: {
    favicon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.svg',
  } as IconPaths,
  socials: {
    twitter: '@santodinheiro',
  },
  support: {
    email: 'suporte@santodinheiro.com',
  },
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  } as AnalyticsConfig,
} as const

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.author }],
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: site.ogImage ? [{ url: site.ogImage }] : undefined,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
  icons: {
    icon: site.icons.favicon,
    apple: site.icons.apple,
    shortcut: site.icons.shortcut,
  },
}
