import { site } from "@/lib/brand-config"

export const metadata = {
    title: "Política de Privacidade - Santo Dinheiro",
    description: "Como coletamos, usamos e protegemos seus dados.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto prose dark:prose-invert">
                    <h1>Política de Privacidade</h1>
                    <p className="lead">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <p>
                        Sua privacidade é importante para nós. É política do {site.name} respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site {site.name}, e outros sites que possuímos e operamos.
                    </p>

                    <h2>1. Informações que Coletamos</h2>
                    <p>
                        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                    </p>

                    <h2>2. Uso das Informações</h2>
                    <p>
                        Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                    </p>

                    <h2>3. Compartilhamento de Dados</h2>
                    <p>
                        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                    </p>

                    <h2>4. Seus Direitos (LGPD)</h2>
                    <p>
                        Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, corrigir, portar e excluir seus dados pessoais.
                    </p>

                    <h2>5. Compromisso do Usuário</h2>
                    <p>
                        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o {site.name} oferece no site e com caráter enunciativo, mas não limitativo:
                    </p>
                    <ul>
                        <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                        <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                        <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do {site.name}, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
                    </ul>

                    <h2>6. Contato</h2>
                    <p>
                        Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato conosco pelo e-mail: {site.support.email || "privacidade@santodinheiro.com.br"}.
                    </p>
                </div>
            </div>
        </div>
    )
}
