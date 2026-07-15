# TAXIMOTA — Case Study UI/UX
## Módulo 02 — Design System & Wireframes

---

### 1. Direção Visual

Premium, minimalista, "liquid glass": muito espaço em branco, cards elegantes com leve glassmorphism, microinterações discretas, sem imitar Bolt/Yango/Uber. Inspiração em Apple HIG (clareza, profundidade sutil) e Material Design 3 (tokens, elevação), mas com paleta e voz próprias de Chimoio.

---

### 2. Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `verde-escuro` | `#1F4C3A` | Fundo primário, headers, botão principal |
| `verde-claro` | `#2D7A59` | Acentos, ícones ativos, gradientes |
| `dourado` | `#E0A336` | Destaques, avaliações (estrelas), badges premium |
| `branco` | `#FFFFFF` | Superfícies, cards, texto sobre fundo escuro |
| `cinza-neutro` | `#F0F0F0` | Fundo de telas claras, divisores, skeleton |
| `texto-escuro` | `#1A1A1A` | Texto principal sobre fundo claro |

**Modo escuro:** inverte a hierarquia — fundo `#12241C` (verde quase preto), superfícies em `#1F4C3A` com opacidade, texto `#F0F0F0`.

**Alto contraste:** substitui `verde-claro` por `verde-escuro` sólido e aumenta espessura de bordas em 1px.

---

### 3. Tipografia

| Papel | Fonte | Peso/Tamanho |
|---|---|---|
| Display (títulos de tela) | Poppins Bold | 24–28px |
| Subtítulo / Nome de card | Poppins SemiBold | 16–18px |
| Corpo de texto | Inter Regular | 14–15px |
| Texto de apoio / legendas | Inter Regular | 12–13px |
| Números de destaque (estatísticas, avaliação) | Poppins Medium | 18–20px |

Escala com base 4px (4/8/12/16/24/32/48) para espaçamento e ritmo vertical consistente.

---

### 4. Iconografia

Estilo de linha (outline), traço 1.5px, cantos arredondados, tamanho base 24px. Ícones-chave: localização, telefone, WhatsApp, coração (favoritar), estrela (avaliação), escudo (segurança), wifi-cortado (offline), moto (categoria taxista), sacola (delivery).

---

### 5. Componentes

**Botões**
- Primário: fundo `verde-escuro`, texto branco, cantos 12px, altura 48px.
- Secundário: contorno `verde-escuro`, fundo transparente.
- Texto: sem fundo, usado em ações terciárias ("Ver todos").

**Card de Bairro** — foto de topo, nome, contagem de taxistas/empresas, cantos 16px, sombra suave.

**Card de Taxista** — avatar circular, nome, estrela + nota, praça, botões rápidos Ligar/WhatsApp, coração de favorito no canto.

**Barra de Pesquisa** — campo arredondado (24px), ícone de lupa, placeholder "Pesquisar bairro...", fundo `cinza-neutro`.

**Bottom Navigation** — 5 itens (Início, Favoritos, Delivery, Histórico, Perfil), ícone + label, item ativo em `verde-escuro`.

**Bottom Sheet / Modais** — usados para filtros, confirmação de avaliação e detalhes rápidos sem sair da tela.

**Badges** — "Disponível" (verde), "Offline" (cinza), "Verificado" (dourado).

**Alertas de Segurança** — card com borda esquerda vermelha, ícone de escudo, bairro + horário.

**Chips** — categorias de delivery (Comida, Mercearia, Farmácia...).

**Estados vazios** — ilustração simples + texto direto ("Nenhum taxista favoritado ainda") + ação sugerida.

**Estado Offline** — faixa superior "Você está offline. Mostrando dados salvos." com ícone de wifi cortado.

**Skeleton Loading** — blocos cinza pulsantes no formato dos cards, usados durante sincronização.

---

### 6. Acessibilidade

- Contraste mínimo AA (4.5:1) em todos os textos sobre fundo colorido.
- Texto ajustável (suporte a Dynamic Type / rem escalável).
- Áreas de toque mínimas de 44x44px.
- Ícones sempre acompanhados de label textual (nunca só ícone em ações críticas como "Ligar").

---

### 7. Wireframes (baixa fidelidade)

**Home**
```
┌─────────────────────────┐
│ Olá, João!        🔔    │
│ Para onde vamos hoje?   │
│ ┌─────────────────────┐ │
│ │ 🔍 Pesquisar bairro  │ │
│ └─────────────────────┘ │
│ Bairros populares  Ver +│
│ [img][img][img][img]    │
│ Ações rápidas            │
│ [Bairro próximo][❤ Fav] │
├─────────────────────────┤
│ 🏠   ❤   🛵   🕑   👤   │
└─────────────────────────┘
```

**Lista de Bairros**
```
┌─────────────────────────┐
│ ← Todos os bairros       │
│ 🔍 Buscar bairro...      │
│ [img] Centro     24 tax. │
│ [img] 7 de Abril 22 tax. │
│ [img] Soalpo     18 tax. │
│ [img] Vila Nova  16 tax. │
└─────────────────────────┘
```

**Lista de Taxistas (bairro selecionado)**
```
┌─────────────────────────┐
│ ← Centro                 │
│ 👤 Manuel Mota ★4.6 📞💬│
│ 👤 Abdul C.    ★4.7 📞💬│
│ 👤 Salomão     ★4.6 📞💬│
└─────────────────────────┘
```

**Perfil do Taxista**
```
┌─────────────────────────┐
│ ← Perfil                 │
│      [foto grande]       │
│   Manuel Mota  ★4.6(126) │
│   Praça Central · Centro │
│   Disponível              │
│ [ Ligar ]   [ WhatsApp ] │
│ Sobre / Histórico         │
│ Comentários                │
└─────────────────────────┘
```

**Avaliação**
```
┌─────────────────────────┐
│ Avaliar Taxista           │
│  ★ ★ ★ ★ ★                │
│ [ caixa de comentário ]  │
│ [ Enviar Avaliação ]     │
└─────────────────────────┘
```

---

### 8. Próximos Passos

Módulo 2 concluído (Design System + Wireframes). Aguardo confirmação para avançar ao **Módulo 3 — Home + Pesquisa de Bairros**, com UI de alta fidelidade e código front-end funcional (React).
