import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/brand-config"
import { Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] text-zinc-400">
      <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={site.logo.light || '/logo-light.svg'}
                alt={site.shortName}
                width={160}
                height={50}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src={site.logo.dark || '/logo-dark.svg'}
                alt={site.shortName}
                width={160}
                height={50}
                className="hidden h-10 w-auto dark:block"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {site.description}
            </p>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Produto</h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/#features" className="hover:text-purple-400 transition-colors">Funcionalidades</Link>
              <Link href="/#pricing" className="hover:text-purple-400 transition-colors">Preços</Link>
              <Link href="/faq" className="hover:text-purple-400 transition-colors">Perguntas Frequentes</Link>
              <Link href="/sign-in" className="hover:text-purple-400 transition-colors">Entrar</Link>
            </nav>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Empresa</h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/about" className="hover:text-purple-400 transition-colors">Sobre Nós</Link>
              <Link href="/contact" className="hover:text-purple-400 transition-colors">Contato</Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Legal</h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/terms" className="hover:text-purple-400 transition-colors">Termos de Uso</Link>
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacidade</Link>
              <Link href="/cookies" className="hover:text-purple-400 transition-colors">Cookies</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {site.author}. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
