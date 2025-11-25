import { site } from "@/lib/brand-config"

export const metadata = {
    title: "Política de Cookies - Santo Dinheiro",
    description: "Como usamos cookies para melhorar sua experiência.",
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto prose dark:prose-invert">
                    <h1>Política de Cookies</h1>
                    <p className="lead">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h2>1. O que são cookies?</h2>
                    <p>
                        Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou 'quebrar' certos elementos da funcionalidade do site.
                    </p>

                    <h2>2. Como usamos os cookies?</h2>
                    <p>
                        Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados ​​para fornecer um serviço que você usa.
                    </p>

                    <h2>3. Desativar cookies</h2>
                    <p>
                        Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação de determinadas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies.
                    </p>

                    <h2>4. Cookies que definimos</h2>
                    <ul>
                        <li>
                            <strong>Cookies relacionados à conta:</strong> Se você criar uma conta conosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente serão excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair.
                        </li>
                        <li>
                            <strong>Cookies relacionados ao login:</strong> Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você efetua logout para garantir que você possa acessar apenas a recursos e áreas restritas ao efetuar login.
                        </li>
                    </ul>

                    <h2>5. Cookies de Terceiros</h2>
                    <p>
                        Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.
                    </p>
                    <ul>
                        <li>
                            Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.
                        </li>
                    </ul>

                    <h2>6. Mais informações</h2>
                    <p>
                        Esperamos que isso tenha esclarecido as coisas para você e, como foi mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
                    </p>
                </div>
            </div>
        </div>
    )
}
