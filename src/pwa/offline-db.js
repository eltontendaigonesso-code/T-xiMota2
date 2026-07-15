// offline-db.js — Camada de persistência local (IndexedDB) do Taximota
// Guarda bairros, taxistas, empresas, favoritos, histórico e uma "outbox"
// de ações pendentes (avaliações e denúncias feitas offline).

const DB_NAME = "taximota-db";
const DB_VERSION = 1;

const STORES = {
  bairros: "id",
  taxistas: "id",
  empresas: "id",
  favoritos: "id",
  historico: "id",
  outbox: "id", // fila de sincronização: { id, type, payload, createdAt }
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      Object.entries(STORES).forEach(([storeName, keyPath]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath });
        }
      });
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function withStore(storeName, mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = callback(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = (event) => reject(event.target.error);
  });
}

export const offlineDB = {
  // ---- Leitura/escrita genérica ----
  async getAll(storeName) {
    return withStore(storeName, "readonly", (store) => {
      return new Promise((resolve) => {
        const items = [];
        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            items.push(cursor.value);
            cursor.continue();
          } else {
            resolve(items);
          }
        };
      });
    }).then((p) => p); // resolve encadeado (Promise dentro de Promise)
  },

  async put(storeName, item) {
    return withStore(storeName, "readwrite", (store) => store.put(item));
  },

  async bulkPut(storeName, items) {
    return withStore(storeName, "readwrite", (store) => {
      items.forEach((item) => store.put(item));
    });
  },

  async delete(storeName, id) {
    return withStore(storeName, "readwrite", (store) => store.delete(id));
  },

  async clear(storeName) {
    return withStore(storeName, "readwrite", (store) => store.clear());
  },

  // ---- Outbox: ações feitas offline aguardando sincronização ----
  async queueAction(type, payload) {
    const action = {
      id: `outbox_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type, // "avaliacao" | "denuncia" | "favorito"
      payload,
      createdAt: new Date().toISOString(),
    };
    await this.put("outbox", action);
    return action;
  },

  async getPendingActions() {
    return this.getAll("outbox");
  },

  async removeAction(id) {
    return this.delete("outbox", id);
  },
};
