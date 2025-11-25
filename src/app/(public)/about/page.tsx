import { site } from "@/lib/brand-config"
import Image from "next/image"

export const metadata = {
    title: "Sobre Nós - Santo Dinheiro",
    description: "Conheça a missão e os valores por trás do Santo Dinheiro.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                        Sobre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Santo Dinheiro</span>
                    </h1>

                    <div className="prose dark:prose-invert prose-lg">
                        <p className="lead text-xl text-muted-foreground mb-8">
                            Nossa missão é simplificar o controle financeiro para que você possa focar no que realmente importa: viver com propósito.
                        </p>

                        <h2 className="text-2xl font-semibold mt-12 mb-4">Nossa História</h2>
                        <p className="mb-6">
                            O Santo Dinheiro nasceu da necessidade de ter uma ferramenta de controle financeiro que fosse ao mesmo tempo poderosa e simples de usar.
                            Acreditamos que cuidar do seu dinheiro não deveria ser uma tarefa árdua, mas sim um passo fundamental para alcançar a liberdade.
                        </p>

                        <h2 className="text-2xl font-semibold mt-12 mb-4">Nossos Valores</h2>
                        <ul className="space-y-4 mb-8 list-disc pl-6">
                            <li><strong>Simplicidade:</strong> Menos é mais. Focamos no essencial.</li>
                            <li><strong>Transparência:</strong> Você no controle total dos seus dados.</li>
                            <li><strong>Propósito:</strong> O dinheiro é um meio, não o fim.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold mt-12 mb-4">Junte-se a Nós</h2>
                        <p>
                            Estamos apenas começando. Junte-se a milhares de pessoas que já estão transformando sua relação com o dinheiro.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
