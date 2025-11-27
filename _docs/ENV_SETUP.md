# Variáveis de Ambiente - Santo Dinheiro

## 📧 Email (Resend)

### RESEND_API_KEY
**Obrigatório para:** Envio de emails (convites de colaboradores, notificações)

**Como obter:**
1. Acesse https://resend.com
2. Crie uma conta ou faça login
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie e adicione ao `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### NEXT_PUBLIC_APP_URL
**Obrigatório para:** Links em emails

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: https://seudominio.com
```

## 🔐 Admin

### ADMIN_EMAILS
Lista de emails com acesso admin (separados por vírgula)

```env
ADMIN_EMAILS=admin@seudominio.com,ops@seudominio.com
```

### ADMIN_USER_IDS
Lista de IDs de usuário Clerk com acesso admin (separados por vírgula)

```env
ADMIN_USER_IDS=user_xxxxxxxxxxxxx,user_yyyyyyyyyyyyy
```

## 📝 Notas

- O envio de email é **opcional** - se `RESEND_API_KEY` não estiver configurada, os convites ainda serão criados no banco, mas o email não será enviado
- Em desenvolvimento, você pode usar o domínio de teste do Resend
- Em produção, configure um domínio verificado no Resend
