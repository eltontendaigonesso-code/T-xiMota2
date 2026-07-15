# TAXIMOTA — Case Study UI/UX
## Módulo 08 — Sistema Offline (PWA)

---

### 1. Objetivo

Garantir que pesquisa de bairros, taxistas, empresas, favoritos e histórico funcionem **completamente sem internet**, sincronizando automaticamente assim que a conexão voltar — conforme o Módulo 13 do prompt mestre.

---

### 2. Arquitetura

```
┌────────────────────────┐
│      Aplicação (UI)     │
│  React / PWA front-end  │
└───────────┬─────────────┘
            │ lê/escreve
            ▼
┌────────────────────────┐        registra/instala
│   IndexedDB (offline-db) │◄────────────────┐
│  bairros · taxistas       │                │
│  empresas · favoritos     │        ┌───────┴────────┐
│  histórico · outbox       │        │ Service Worker  │
└───────────┬────────────┘        │  cache + sync    │
            │ sincroniza          └───────┬────────┘
            ▼                             │ intercepta fetch
┌────────────────────────┐                ▼
│        API REST          │◄───── Network First / Cache First
│  /api/bairros, /taxistas  │
│  /empresas, /avaliacoes   │
│  /alertas/denuncias        │
└────────────────────────┘
```

---

### 3. Arquivos entregues neste módulo

| Arquivo | Função |
|---|---|
| `taximota-modulo-08-manifest.json` | Manifesto do PWA (ícones, cores, atalhos) |
| `taximota-modulo-08-service-worker.js` | Cache de App Shell + estratégia Network First para API + Background Sync |
| `taximota-modulo-08-offline-db.js` | Camada IndexedDB (bairros, taxistas, empresas, favoritos, histórico, outbox) |
| `taximota-modulo-08-sync.js` | Sincronização automática ao reconectar + fila de ações pendentes |

---

### 4. Estratégias de cache

- **App Shell (HTML/CSS/JS/ícones):** Cache First — carrega instantaneamente, mesmo offline.
- **Dados de API (bairros, taxistas, empresas, alertas):** Network First com fallback para cache — sempre tenta dados atualizados, mas nunca deixa a tela vazia sem internet.
- **Ações do usuário offline (avaliação, denúncia, favoritar):** guardadas numa fila local ("outbox") e enviadas automaticamente quando a internet volta, via evento `online` e Background Sync API.

---

### 5. Fluxo de sincronização

1. Usuário avalia um taxista sem internet → ação guardada em `outbox` (IndexedDB).
2. Interface mostra confirmação local imediata ("Avaliação guardada, será enviada quando houver internet").
3. Quando a conexão volta: evento `online` ou `sync` do service worker dispara `processOutbox()`.
4. Cada ação pendente é enviada à API; em caso de sucesso, é removida da fila.
5. `refreshCoreData()` atualiza bairros, taxistas e empresas com os dados mais recentes do servidor.

---

### 6. Considerações de produto

- Todas as telas já construídas (Home, Bairros, Taxistas, Perfil, Favoritos, Histórico, Delivery, Segurança) devem ler primeiro do IndexedDB e só then complementar com rede — garantindo carregamento instantâneo mesmo com internet lenta.
- O banner "Você está offline" (já presente nos módulos anteriores) deve ligar-se ao evento `navigator.onLine` em produção, em vez do botão de simulação usado nos protótipos.
- Denúncias e avaliações enviadas offline **não** aparecem publicamente até passarem pela mesma validação de moderação descrita no Módulo 7 — a fila de sincronização não pula esse passo.

---

### 7. Próximos Passos

Módulo 8 concluído. Aguardo confirmação para avançar ao **Módulo 9 — Painel Administrativo** (cadastro de bairros, praças, empresas, taxistas, aprovação de usuários, gestão de avaliações e alertas).
