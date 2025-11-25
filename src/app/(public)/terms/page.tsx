import { site } from "@/lib/brand-config"

export const metadata = {
    title: "Termos de Uso - Santo Dinheiro",
    description: "Termos e condições de uso do Santo Dinheiro.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto prose dark:prose-invert">
                    <h1>Termos de Uso</h1>
                    <p className="lead">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e usar o {site.name} ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso.
                        Se você não concordar com qualquer parte destes termos, você não deve usar nosso serviço.
                    </p>

                    <h2>2. Uso do Serviço</h2>
                    <p>
                        O {site.name} é uma ferramenta de gestão financeira pessoal. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
                        Você é responsável por manter a confidencialidade da sua conta e senha.
                    </p>

                    <h2>3. Propriedade Intelectual</h2>
                    <p>
                        O serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão de propriedade exclusiva do {site.name} e seus licenciadores.
                    </p>

                    <h2>4. Limitação de Responsabilidade</h2>
                    <p>
                        Em nenhum caso o {site.name}, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes do seu acesso ou uso ou incapacidade de acessar ou usar o serviço.
                    </p>

                    <h2>5. Alterações</h2>
                    <p>
                        Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento.
                        Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.
                    </p>

                    <h2>6. Contato</h2>
                    <p>
                        Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail: {site.support.email || "suporte@santodinheiro.com.br"}.
                    </p>
                </div>
            </div>
        </div>
    )
}
