import { site } from "@/lib/brand-config"
import { Mail, MessageSquare, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
    title: "Contato - Santo Dinheiro",
    description: "Entre em contato com a equipe do Santo Dinheiro.",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Fale Conosco
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Estamos aqui para ajudar. Escolha a melhor forma de entrar em contato.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
                            <Mail className="w-10 h-10 text-purple-600 mb-6" />
                            <h3 className="text-xl font-semibold mb-2">Suporte por Email</h3>
                            <p className="text-muted-foreground mb-6">
                                Para dúvidas gerais, suporte técnico ou parcerias.
                            </p>
                            <Button asChild className="w-full">
                                <Link href={site.support.email ? `mailto:${site.support.email}` : "#"}>
                                    Enviar Email
                                </Link>
                            </Button>
                        </div>

                        <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
                            <MessageSquare className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold mb-2">Redes Sociais</h3>
                            <p className="text-muted-foreground mb-6">
                                Siga-nos para dicas diárias e novidades sobre o app.
                            </p>
                            <div className="flex gap-4 justify-center">
                                {/* Links sociais podem ser adicionados aqui */}
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="#">Instagram</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
