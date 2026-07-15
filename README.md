# Taximota 🏍️

Conectando pessoas aos serviços locais de Chimoio, Moçambique.

O Taximota é um diretório inteligente de mobilidade: permite que qualquer pessoa encontre taxistas de qualquer bairro, ligue diretamente e combine a viagem — mesmo sem internet. Também conecta usuários a pequenas empresas de delivery e mantém uma área de alertas de segurança comunitária moderados.

## 📁 Estrutura do repositório

```
taximota/
├── docs/                        # Case study de UX/UI e documentação técnica
│   ├── 01-pesquisa-ux.md         # Personas, jornada, SWOT, benchmark, IA
│   ├── 02-design-system.md       # Cores, tipografia, componentes, wireframes
│   ├── 08-sistema-offline-pwa.md # Arquitetura offline-first
│   └── 10-https-e-responsividade.md
├── public/
│   ├── index.html                # HTML base (viewport, manifest, SW register)
│   ├── manifest.json             # Manifesto do PWA
│   ├── service-worker.js         # Cache + Background Sync
│   └── static/css/app.css        # CSS responsivo mobile-first
├── src/
│   ├── app/
│   │   └── TaximotaApp.jsx       # App do passageiro (Home, Bairros, Taxistas,
│   │                              #   Perfil, Avaliação, Favoritos, Histórico,
│   │                              #   Delivery, Segurança)
│   ├── admin/
│   │   └── TaximotaAdminPanel.jsx # Painel administrativo (desktop)
│   └── pwa/
│       ├── offline-db.js         # Camada IndexedDB
│       └── sync.js               # Sincronização automática (outbox)
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Como rodar localmente

Este repositório contém os componentes de UI e a camada offline/PWA prontos. Para rodar localmente como projeto React (Vite ou Create React App), ainda é preciso:

1. Iniciar um projeto React (`npm create vite@latest taximota -- --template react`).
2. Instalar as dependências usadas nos componentes:
   ```bash
   npm install lucide-react recharts
   ```
3. Copiar o conteúdo de `src/` e `public/` para dentro do projeto criado, mantendo os caminhos.
4. Rodar `npm run dev` para o app do passageiro, importando `src/app/TaximotaApp.jsx` na página inicial.

## 🔒 Publicação em produção

Consulte `docs/10-https-e-responsividade.md` — o Service Worker (offline) só funciona com **HTTPS** ativo, exceto em `localhost`. O documento traz duas opções: hospedagem gerenciada (Vercel/Netlify/Cloudflare Pages, com HTTPS automático) ou servidor próprio com Nginx + Certbot.

## 🗺️ Roadmap

- ✅ Versão 1 — Pesquisa por bairro, lista de taxistas, favoritos, offline
- ✅ Versão 2 — Delivery, empresas, categorias
- ✅ Versão 3 — Alertas de segurança, painel administrativo
- ⏳ Versão 4 — Corridas online
- ⏳ Versão 5 — Pagamentos
- ⏳ Versão 6 — Inteligência artificial (sugestões, previsão de procura)

## 📄 Licença

Defina a licença do projeto antes de tornar o repositório público (ex: MIT, ou proprietária caso não queira que o código seja reaproveitado livremente).
