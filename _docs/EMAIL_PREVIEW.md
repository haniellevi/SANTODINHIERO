# 📧 Preview do Email de Convite de Colaborador

## Design e Copy

### ✨ Características do Email

**Visual:**
- 🎨 Gradiente roxo premium (Santo Dinheiro)
- 📱 Responsivo (mobile-friendly)
- 🎯 CTA destacado com sombra
- 📦 Box de permissão com borda colorida
- ✅ Footer profissional

**Copy:**
- Tom amigável e profissional
- Explica claramente o nível de acesso
- Lista benefícios da plataforma
- Inclui link alternativo para copiar/colar
- Informação de segurança no footer

---

## 📝 Estrutura do Email

### Header
```
🙏 Santo Dinheiro
Gestão Financeira com Propósito
```

### Título Principal
```
Você foi convidado! 🎉
```

### Mensagem Principal
```
Olá! [Nome do Dono] convidou você para colaborar na conta dele no Santo Dinheiro.

Com o Santo Dinheiro, você poderá gerenciar finanças de forma organizada, 
acompanhar receitas, despesas, investimentos e até calcular dízimos automaticamente.
```

### Box de Permissão
```
SEU NÍVEL DE ACESSO
[Visualizador / Editor / Administrador]

[Descrição do que pode fazer]
```

**Descrições por Nível:**
- **Visualizador:** Você poderá visualizar todas as informações financeiras.
- **Editor:** Você poderá visualizar e editar transações.
- **Administrador:** Você terá acesso total à conta, incluindo configurações.

### CTA (Call-to-Action)
```
[Botão Gradiente Roxo]
Aceitar Convite
```

### Benefícios
```
O que você pode fazer:
📊 Acompanhar receitas e despesas em tempo real
💰 Gerenciar investimentos e gastos diversos
🙏 Calcular e registrar dízimos automaticamente
📈 Visualizar relatórios e previsões financeiras
🔔 Receber alertas de planejamento personalizados
```

### Footer
```
Este convite foi enviado por [Nome do Dono]

Se você não esperava este convite, pode ignorar este email com segurança.

© 2025 Santo Dinheiro. Todos os direitos reservados.
```

---

## 🎨 Paleta de Cores

- **Gradiente Principal:** `#667eea` → `#764ba2`
- **Texto Principal:** `#1a1a1a`
- **Texto Secundário:** `#4a5568`
- **Texto Muted:** `#718096`
- **Background:** `#f5f5f5`
- **Card:** `#ffffff`
- **Destaque:** `#f7fafc`

---

## 🔗 Funcionalidades

1. **Link Principal:** Botão com gradiente e sombra
2. **Link Alternativo:** Texto copiável para casos de bloqueio de imagens
3. **Informação de Segurança:** Tranquiliza quem recebeu por engano
4. **Branding Consistente:** Mantém identidade visual do Santo Dinheiro

---

## 📱 Responsividade

- Largura máxima: 600px
- Padding adaptativo
- Fonte legível em mobile
- Botão com área de toque adequada

---

## 🚀 Como Testar

1. Configure `RESEND_API_KEY` no `.env`
2. Configure `NEXT_PUBLIC_APP_URL` no `.env`
3. Vá em `/dashboard/settings` → aba "Colaboradores"
4. Clique em "Convidar"
5. Preencha email e permissão
6. Clique em "Enviar Convite"
7. Verifique o email recebido

---

## 💡 Dicas de Produção

1. **Domínio Verificado:** Configure um domínio no Resend para evitar spam
2. **From Email:** Altere `noreply@santodinheiro.com` para seu domínio
3. **Testing:** Use emails de teste do Resend em desenvolvimento
4. **Monitoramento:** Acompanhe taxa de entrega no dashboard do Resend
