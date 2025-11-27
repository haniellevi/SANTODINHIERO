import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendCollaboratorInviteParams {
    to: string;
    ownerName: string;
    inviteLink: string;
    permission: 'VIEWER' | 'EDITOR' | 'ADMIN';
}

const permissionLabels = {
    VIEWER: 'Visualizador',
    EDITOR: 'Editor',
    ADMIN: 'Administrador'
};

const permissionDescriptions = {
    VIEWER: 'Você poderá visualizar todas as informações financeiras.',
    EDITOR: 'Você poderá visualizar e editar transações.',
    ADMIN: 'Você terá acesso total à conta, incluindo configurações.'
};

export async function sendCollaboratorInvite({
    to,
    ownerName,
    inviteLink,
    permission
}: SendCollaboratorInviteParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Santo Dinheiro <noreply@santodinheiro.com>',
            to: [to],
            subject: `${ownerName} convidou você para colaborar no Santo Dinheiro`,
            html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convite de Colaboração</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header com gradiente -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🙏 Santo Dinheiro
                            </h1>
                            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                Gestão Financeira com Propósito
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Conteúdo Principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                                Você foi convidado! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 16px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Olá! <strong>${ownerName}</strong> convidou você para colaborar na conta dele no <strong>Santo Dinheiro</strong>.
                            </p>
                            
                            <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Com o Santo Dinheiro, você poderá gerenciar finanças de forma organizada, 
                                acompanhar receitas, despesas, investimentos e até calcular dízimos automaticamente.
                            </p>
                            
                            <!-- Box de Permissão -->
                            <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px; border-radius: 6px;">
                                <p style="margin: 0 0 8px; color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Seu Nível de Acesso
                                </p>
                                <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 700;">
                                    ${permissionLabels[permission]}
                                </p>
                                <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
                                    ${permissionDescriptions[permission]}
                                </p>
                            </div>
                            
                            <!-- Botão CTA -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px;">
                                        <a href="${inviteLink}" 
                                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                                            Aceitar Convite
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px; color: #718096; font-size: 14px; line-height: 1.6;">
                                Ou copie e cole este link no seu navegador:
                            </p>
                            <p style="margin: 0 0 30px; padding: 12px; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; color: #4a5568; font-size: 13px; word-break: break-all; font-family: 'Courier New', monospace;">
                                ${inviteLink}
                            </p>
                            
                            <!-- Benefícios -->
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
                                <p style="margin: 0 0 16px; color: #2d3748; font-size: 16px; font-weight: 600;">
                                    O que você pode fazer:
                                </p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                                    <li>📊 Acompanhar receitas e despesas em tempo real</li>
                                    <li>💰 Gerenciar investimentos e gastos diversos</li>
                                    <li>🙏 Calcular e registrar dízimos automaticamente</li>
                                    <li>📈 Visualizar relatórios e previsões financeiras</li>
                                    <li>🔔 Receber alertas de planejamento personalizados</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                                Este convite foi enviado por <strong>${ownerName}</strong>
                            </p>
                            <p style="margin: 0 0 16px; color: #a0aec0; font-size: 12px;">
                                Se você não esperava este convite, pode ignorar este email com segurança.
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © ${new Date().getFullYear()} Santo Dinheiro. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Error sending collaborator invite email:', error);
            throw new Error('Failed to send invite email');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in sendCollaboratorInvite:', error);
        throw error;
    }
}
