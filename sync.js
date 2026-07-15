// sync.js — Sincronização automática do Taximota
// Roda no contexto da aplicação (não no service worker).
// Escuta eventos de conexão e mensagens do service worker
// para descarregar a "outbox" assim que a internet voltar.

import { offlineDB } from "./offline-db.js";

const API_BASE = "/api";

async function sendAction(action) {
  const endpoints = {
    avaliacao: `${API_BASE}/avaliacoes`,
    denuncia: `${API_BASE}/alertas/denuncias`,
    favorito: `${API_BASE}/favoritos`,
  };

  const url = endpoints[action.type];
  if (!url) return { ok: false, reason: "tipo_desconhecido" };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(action.payload),
  });

  return { ok: response.ok, status: response.status };
}

export async function processOutbox() {
  const pending = await offlineDB.getPendingActions();
  const results = [];

  for (const action of pending) {
    try {
      const result = await sendAction(action);
      if (result.ok) {
        await offlineDB.removeAction(action.id);
        results.push({ id: action.id, status: "sincronizado" });
      } else {
        results.push({ id: action.id, status: "falhou", detail: result.status });
      }
    } catch (err) {
      // Sem internet ainda — mantém na fila para tentar depois
      results.push({ id: action.id, status: "sem_conexao" });
      break; // evita martelar tentativas sequenciais sem rede
    }
  }

  return results;
}

export async function refreshCoreData() {
  // Atualiza dados "mestre" (bairros, taxistas, empresas, alertas)
  // e regrava no IndexedDB para uso offline.
  const resources = [
    { store: "bairros", url: `${API_BASE}/bairros` },
    { store: "taxistas", url: `${API_BASE}/taxistas` },
    { store: "empresas", url: `${API_BASE}/empresas` },
  ];

  for (const { store, url } of resources) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        await offlineDB.bulkPut(store, data);
      }
    } catch (err) {
      // Offline: mantém os dados já guardados localmente sem interromper o fluxo
      continue;
    }
  }
}

export function initSync() {
  // 1) Ao reconectar: processa fila e atualiza dados mestre
  window.addEventListener("online", async () => {
    await processOutbox();
    await refreshCoreData();
  });

  // 2) Mensagens vindas do service worker (Background Sync API)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", async (event) => {
      if (event.data?.type === "SYNC_OUTBOX_TRIGGER") {
        await processOutbox();
      }
    });
  }

  // 3) Registo do Background Sync (quando suportado pelo browser)
  navigator.serviceWorker?.ready.then((registration) => {
    if ("sync" in registration) {
      registration.sync.register("taximota-sync-outbox").catch(() => {
        // Fallback silencioso: navegadores sem suporte usam apenas o evento "online"
      });
    }
  });
}

// Função utilitária para as telas chamarem ao criar uma ação offline
// (ex: enviar avaliação, denúncia ou favoritar sem internet)
export async function saveActionOffline(type, payload) {
  const action = await offlineDB.queueAction(type, payload);
  if (navigator.onLine) {
    // Tenta sincronizar imediatamente se já houver rede
    await processOutbox();
  }
  return action;
}
