import { FAQ } from "@/components/marketing/faq"

export const metadata = {
    title: "Perguntas Frequentes - Santo Dinheiro",
    description: "Respostas para as dúvidas mais comuns sobre o Santo Dinheiro.",
}

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-20 pb-16">
            <FAQ />
        </div>
    )
}
