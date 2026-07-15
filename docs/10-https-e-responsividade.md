# TAXIMOTA — Case Study UI/UX
## Módulo 10 — Responsividade Mobile + HTTPS para Publicação

---

### 1. Arquivos entregues

| Arquivo | Função |
|---|---|
| `taximota-modulo-10-index.html` | HTML base com viewport responsivo, manifest, ícones e registo do Service Worker |
| `taximota-modulo-10-app.css` | CSS mobile-first com breakpoints, modo escuro, alto contraste e redução de movimento |
| `taximota-modulo-08-manifest.json` | (já entregue no Módulo 8) — manifesto do PWA |
| `taximota-modulo-08-service-worker.js` | (já entregue no Módulo 8) — cache e sincronização offline |

---

### 2. Por que HTTPS é obrigatório

- **Service Workers só funcionam em HTTPS** (exceto em `localhost` durante desenvolvimento). Sem HTTPS, todo o Módulo 8 (offline/PWA) simplesmente não ativa em produção.
- O prompt "Adicionar à tela inicial" e a instalação como app só aparecem em contextos seguros.
- Geolocalização (usada para "bairro mais próximo") também exige HTTPS nos navegadores modernos.
- Protege dados sensíveis: telefones de taxistas, denúncias de segurança e avaliações trafegam entre app e API.

---

### 3. Opção A — Hospedagem gerenciada (mais simples)

Serviços como **Vercel**, **Netlify** ou **Cloudflare Pages** emitem e renovam certificados HTTPS automaticamente ao publicar o projeto — não é preciso configurar nada manualmente. Recomendado para lançar o Taximota rapidamente:

1. Subir o código para um repositório Git (GitHub/GitLab).
2. Conectar o repositório à plataforma escolhida.
3. Configurar o domínio próprio (ex: `taximota.co.mz`) nas definições de DNS da plataforma.
4. O certificado HTTPS é emitido automaticamente (Let's Encrypt por trás dos panos).

---

### 4. Opção B — Servidor próprio (Nginx + Let's Encrypt / Certbot)

Se o Taximota for hospedado em um VPS próprio (ex: para manter o back-end e banco de dados no mesmo servidor em Moçambique):

```bash
# 1. Instalar Certbot (Ubuntu/Debian)
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 2. Emitir certificado para o domínio
sudo certbot --nginx -d taximota.co.mz -d www.taximota.co.mz

# 3. Renovação automática (Certbot já agenda via systemd timer)
sudo certbot renew --dry-run
```

Exemplo de configuração Nginx com redirecionamento forçado para HTTPS:

```nginx
server {
    listen 80;
    server_name taximota.co.mz www.taximota.co.mz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taximota.co.mz www.taximota.co.mz;

    ssl_certificate     /etc/letsencrypt/live/taximota.co.mz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taximota.co.mz/privkey.pem;

    root /var/www/taximota/build;
    index index.html;

    # Service Worker precisa ser servido sem cache agressivo
    location = /service-worker.js {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri /index.html;
    }
}
```

---

### 5. Checklist de responsividade mobile

- [x] `<meta name="viewport" content="width=device-width, initial-scale=1">` presente no HTML.
- [x] Layout mobile-first: estilos base pensados para telas pequenas (~375–430px), com breakpoints progressivos (`640px`, `1024px`).
- [x] Fontes de input em 16px para evitar zoom automático no iOS.
- [x] Áreas de toque mínimas de 44×44px em botões e links.
- [x] `env(safe-area-inset-bottom)` na bottom navigation, para respeitar a barra de gestos em iPhones recentes.
- [x] `100dvh` (dynamic viewport height) em vez de `100vh`, evitando cortes quando a barra de endereço do navegador aparece/desaparece.
- [x] Suporte a `prefers-color-scheme` (modo escuro), `prefers-contrast` (alto contraste) e `prefers-reduced-motion`, conforme os requisitos de acessibilidade do Módulo 2.
- [x] Painel Administrativo (Módulo 9) usa breakpoint próprio (`≥1024px`) já que é pensado para uso em desktop pelos administradores.

---

### 6. Teste antes de publicar

Antes de colocar em produção, validar com o **Lighthouse** do Chrome DevTools (aba "Lighthouse" → categoria "PWA" e "Performance"):

- Instalabilidade do PWA (manifest + service worker detectados).
- HTTPS ativo e sem conteúdo misto (`http://` dentro de página `https://`).
- Responsividade em diferentes tamanhos de tela (usar o modo de dispositivo do DevTools: iPhone SE, iPhone 14, Galaxy S20, iPad).

---

### 7. Próximos Passos

Módulo 10 concluído: site responsivo, PWA instalável e pronto para publicação segura em HTTPS. Os módulos restantes do roadmap (Corridas Online, Pagamentos, IA) ficam para as Versões 4, 5 e 6, quando desejar avançar.
