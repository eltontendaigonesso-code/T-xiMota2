# TAXIMOTA — Case Study UI/UX
## Módulo 01 — Pesquisa UX

---

### 1. Visão Geral do Projeto

**Taximota** é uma plataforma de mobilidade e serviços locais para Chimoio, Moçambique. Diferente de apps como Bolt/Yango, o foco inicial não é solicitar corridas automaticamente — é permitir que qualquer pessoa encontre taxistas por bairro, ligue diretamente e combine a viagem. Delivery de empresas locais e alertas de segurança comunitária completam o ecossistema. Tudo funciona offline como PWA.

---

### 2. Problema

- Pessoas chegam a bairros desconhecidos sem saber onde ficam as praças de taxi-mota.
- Não existe um diretório com contactos de taxistas por zona.
- Conexão de internet é instável em várias áreas da cidade.
- Muitos taxistas usam telefones simples (sem app), dependendo de indicação boca-a-boca.
- Passageiros e taxistas enfrentam riscos de segurança sem canal de alerta.
- Pequenos negócios de delivery têm pouca visibilidade digital.

---

### 3. Personas

#### 🧑 João Manuel — Passageiro
- **Idade:** 24 anos
- **Perfil:** Estudante universitário, usa smartphone Android básico, dados móveis limitados.
- **Objetivos:** Encontrar transporte rápido; chegar a destinos com segurança; não perder tempo perguntando na rua.
- **Frustrações:** Não conhece todos os bairros; não tem contactos de taxistas; internet instável quando mais precisa.
- **Necessidades:** Busca simples por bairro, ligação direta, funcionamento offline.

#### 🏍️ Manuel Mota — Taxista
- **Idade:** 36 anos
- **Perfil:** Pode ter smartphone ou telefone simples; trabalha numa praça fixa no bairro Centro.
- **Objetivos:** Conseguir mais clientes; construir boa reputação; sentir-se seguro durante o trabalho.
- **Frustrações:** Pouca visibilidade fora do seu círculo de clientes; risco de assaltos; dificuldade em provar confiabilidade a novos clientes.
- **Necessidades:** Perfil simples de gerir, avaliações visíveis, alertas de zonas de risco.

#### 🏪 Dina Tembe — Empresa de Delivery
- **Idade:** 29 anos (proprietária)
- **Perfil:** Dona de um pequeno restaurante/loja no bairro Vila Nova.
- **Objetivos:** Mais pedidos; aparecer para clientes de outros bairros; divulgar horário e área de entrega.
- **Frustrações:** Divulgação cara e limitada; concorrência de negócios maiores; comunicação manual via WhatsApp desorganizada.
- **Necessidades:** Perfil com fotos, categoria, contacto directo e área de cobertura clara.

---

### 4. Mapa de Empatia (Passageiro)

| Dimensão | Insight |
|---|---|
| **Diz** | "Não sei onde fica a praça daqui." |
| **Pensa** | "Espero que este taxista seja de confiança." |
| **Sente** | Insegurança em bairros desconhecidos; pressa. |
| **Faz** | Pergunta a estranhos na rua; espera na esquina torcendo para aparecer uma mota. |
| **Dores** | Perda de tempo, exposição a risco, dependência de sorte. |
| **Ganhos esperados** | Rapidez, previsibilidade, sensação de controlo e segurança. |

---

### 5. Análise SWOT

**Forças**
- Proposta de valor única (diretório por bairro, não só corrida automática)
- Funciona offline — diferencial forte para a realidade local
- Baixa barreira de entrada para taxistas sem smartphone avançado

**Fraquezas**
- Depende de cadastro manual inicial de bairros/taxistas/empresas
- Sem app próprio, taxistas dependem de terceiros para atualizar dados
- Confiança e segurança precisam de curadoria humana no início

**Oportunidades**
- Nenhum concorrente local com foco em bairros de Chimoio
- Potencial de expansão para outras cidades de Moçambique
- Caminho claro de evolução para corridas online e pagamentos

**Ameaças**
- Entrada futura de Bolt/Yango na região
- Resistência de taxistas informais a se cadastrar
- Dependência de conectividade para sincronização de dados novos

---

### 6. Benchmark

| App | Ponto forte observado | O que Taximota NÃO deve copiar |
|---|---|---|
| Bolt | Confiabilidade, rastreio em tempo real | Interface genérica sem identidade local |
| Yango | Preços dinâmicos, cobertura ampla | Dependência total de internet |
| Uber | Avaliação bilateral, histórico de viagens | Onboarding longo, foco só em corrida automática |

**Diferencial do Taximota:** diretório inteligente por bairro + funcionamento offline + segurança comunitária + delivery local, com evolução gradual para corridas online.

---

### 7. Arquitetura da Informação

```
Taximota
├── Home
│   ├── Pesquisa de bairro
│   ├── Bairros populares
│   ├── Ações rápidas
│   └── Alertas
├── Bairros
│   └── Lista de Taxistas
│       └── Perfil do Taxista
├── Delivery
│   ├── Categorias
│   └── Perfil da Empresa
├── Segurança
│   └── Alertas confirmados
├── Favoritos
├── Histórico
└── Perfil do Usuário
```

---

### 8. Fluxograma (Jornada do Passageiro)

```
Splash → Onboarding → Permissão de Localização → Home
   → Pesquisar Bairro → Lista de Bairros → Lista de Taxistas
   → Perfil do Taxista → Ligar / WhatsApp → Viagem
   → Avaliação → Favoritos / Histórico
```

**Jornada do Taxista:** Recebe ligação → Combina corrida → Realiza viagem → Recebe avaliação → Ganha visibilidade.

**Jornada da Empresa Delivery:** Cadastro → Perfil publicado → Recebe contacto → Cliente liga/WhatsApp → Pedido combinado.

---

### 9. Próximos Passos

Este módulo cobre a fase de **Pesquisa UX**, conforme o roteiro do projeto. Os próximos módulos, entregues um de cada vez, serão:

1. **Design System** (cores, tipografia, componentes, wireframes)
2. **Módulo Home + Pesquisa de Bairros** (UI de alta fidelidade + código front-end)
3. **Módulo Lista de Taxistas + Perfil** (UI + código)
4. Demais módulos, seguindo o roadmap (Delivery, Segurança, Offline, Painel Admin, Corridas Online)

