import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Heart,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  ShoppingBag,
  Clock,
  User,
  Home as HomeIcon,
  WifiOff,
  ChevronLeft,
  Navigation,
  CheckCircle2,
  Trash2,
  History as HistoryIcon,
  UtensilsCrossed,
  Pill,
  Carrot,
  Package,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
} from "lucide-react";

// ---- Design tokens (Módulo 02 — Design System) ----
const colors = {
  darkGreen: "#1F4C3A",
  lightGreen: "#2D7A59",
  gold: "#E0A336",
  gray: "#F0F0F0",
  textDark: "#1A1A1A",
  white: "#FFFFFF",
  alertRed: "#D64545",
};

const BAIRROS = [
  { id: "centro", name: "Centro", taxistas: 24, empresas: 12, gradient: ["#1F4C3A", "#2D7A59"] },
  { id: "7abril", name: "7 de Abril", taxistas: 22, empresas: 8, gradient: ["#2D7A59", "#1F4C3A"] },
  { id: "soalpo", name: "Soalpo", taxistas: 18, empresas: 6, gradient: ["#E0A336", "#1F4C3A"] },
  { id: "vilanova", name: "Vila Nova", taxistas: 16, empresas: 9, gradient: ["#1F4C3A", "#E0A336"] },
];

const TAXISTAS_BY_BAIRRO = {
  centro: [
    { id: 1, name: "Manuel Mota", phone: "84 123 4567", praca: "Praça Central", bairro: "Centro", rating: 4.6, reviews: 126, available: true, responseTime: "≈ 3 min", since: "Taxista há 6 anos", about: "Atende Centro, Soalpo e 7 de Abril.", comments: [{ id: "c1", author: "Joel M.", text: "Muito educado e pontual.", stars: 5 }] },
    { id: 2, name: "Abdul C.", phone: "84 987 6543", praca: "Praça do Mercado", bairro: "Centro", rating: 4.7, reviews: 89, available: true, responseTime: "≈ 5 min", since: "Taxista há 3 anos", about: "Trabalha principalmente no Centro.", comments: [] },
  ],
  "7abril": [
    { id: 5, name: "Joaquim S.", phone: "84 321 0099", praca: "Praça 7 de Abril", bairro: "7 de Abril", rating: 4.5, reviews: 61, available: true, responseTime: "≈ 6 min", since: "Taxista há 2 anos", about: "Boa referência no bairro.", comments: [] },
  ],
  soalpo: [
    { id: 7, name: "Carlos N.", phone: "84 900 1122", praca: "Praça Soalpo", bairro: "Soalpo", rating: 4.4, reviews: 40, available: true, responseTime: "≈ 7 min", since: "Taxista há 1 ano", about: "Atende Soalpo e arredores.", comments: [] },
  ],
  vilanova: [
    { id: 8, name: "Fátima J.", phone: "84 771 2233", praca: "Praça Vila Nova", bairro: "Vila Nova", rating: 4.6, reviews: 55, available: false, responseTime: "≈ 5 min", since: "Taxista há 4 anos", about: "Atende Vila Nova.", comments: [] },
  ],
};
const ALL_TAXISTAS = Object.values(TAXISTAS_BY_BAIRRO).flat();

const CATEGORIAS = [
  { id: "comida", label: "Comida", icon: UtensilsCrossed },
  { id: "mercearia", label: "Mercearia", icon: Carrot },
  { id: "farmacia", label: "Farmácia", icon: Pill },
  { id: "outros", label: "Outros", icon: Package },
];

const EMPRESAS = [
  { id: "e1", nome: "Restaurante Bom Sabor", categoria: "comida", telefone: "84 071 2032", whatsapp: "84 071 2032", horario: "08:00 – 21:00", bairro: "Centro", areaEntrega: ["Centro", "7 de Abril", "Soalpo"], avaliacao: 4.6 },
  { id: "e3", nome: "Mercado Popular", categoria: "mercearia", telefone: "82 550 7712", whatsapp: "82 550 7712", horario: "07:00 – 19:00", bairro: "7 de Abril", areaEntrega: ["7 de Abril", "Soalpo", "Centro"], avaliacao: 4.3 },
  { id: "e4", nome: "Farmácia Central", categoria: "farmacia", telefone: "84 322 9981", whatsapp: "84 322 9981", horario: "24 horas", bairro: "Centro", areaEntrega: ["Centro", "Vila Nova", "7 de Abril", "Soalpo"], avaliacao: 4.8 },
];

// ---- Mock: alertas de segurança já validados pela moderação ----
const ALERTAS = [
  { id: "a1", bairro: "7 de Abril", tipo: "Assalto relatado", time: "Hoje, 10:15", detalhe: "Redobre a atenção ao circular por esta zona à noite.", nivel: "alto" },
  { id: "a2", bairro: "Soalpo", tipo: "Assédio relatado", time: "Ontem, 19:40", detalhe: "Evite paragens isoladas fora da praça principal.", nivel: "medio" },
  { id: "a3", bairro: "Vila Nova", tipo: "Zona monitorada", time: "há 2 dias", detalhe: "Reforço de presença comunitária após relatos anteriores.", nivel: "baixo" },
];

function Avatar({ name, size = 48 }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="flex items-center justify-center rounded-full font-semibold shrink-0" style={{ width: size, height: size, backgroundColor: colors.gray, color: colors.darkGreen, fontSize: size / 2.4 }}>
      {initials}
    </div>
  );
}

function Badge({ available }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={available ? { backgroundColor: "#E7F3EC", color: colors.lightGreen } : { backgroundColor: colors.gray, color: "#8A8A8A" }}>
      {available ? "Disponível" : "Offline"}
    </span>
  );
}

function TaxistaCard({ taxista, isFav, onToggleFav, onOpenProfile, onContact }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
      <button onClick={() => onOpenProfile(taxista.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <Avatar name={taxista.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate" style={{ color: colors.textDark }}>{taxista.name}</p>
            <Badge available={taxista.available} />
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: "#6B6B6B" }}>
            <Star size={14} fill={colors.gold} color={colors.gold} />
            <span>{taxista.rating}</span>
            <span>({taxista.reviews})</span>
            <span className="mx-1">·</span>
            <span className="truncate">{taxista.praca}</span>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onToggleFav(taxista.id)} aria-label="Favoritar" className="p-2 rounded-full" style={{ backgroundColor: colors.gray }}>
          <Heart size={18} fill={isFav ? "#E0555A" : "none"} color={isFav ? "#E0555A" : "#8A8A8A"} />
        </button>
        <a href={`tel:${taxista.phone.replace(/\s/g, "")}`} onClick={() => onContact(taxista.name, "call")} aria-label="Ligar" className="p-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}>
          <Phone size={18} color={colors.white} />
        </a>
        <a href={`https://wa.me/258${taxista.phone.replace(/\s/g, "")}`} onClick={() => onContact(taxista.name, "whatsapp")} aria-label="WhatsApp" className="p-2 rounded-full" style={{ backgroundColor: colors.lightGreen }}>
          <MessageCircle size={18} color={colors.white} />
        </a>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 px-8 text-center">
      <div className="rounded-full p-4" style={{ backgroundColor: colors.gray }}>
        <Icon size={28} color="#9A9A9A" />
      </div>
      <p className="font-semibold" style={{ color: colors.textDark }}>{title}</p>
      <p className="text-sm" style={{ color: "#8A8A8A" }}>{subtitle}</p>
    </div>
  );
}

function EmpresaCard({ empresa, onOpen }) {
  const cat = CATEGORIAS.find((c) => c.id === empresa.categoria);
  const Icon = cat ? cat.icon : Package;
  return (
    <button onClick={() => onOpen(empresa.id)} className="flex items-center gap-3 bg-white rounded-2xl p-3 text-left w-full">
      <div className="rounded-xl p-3 shrink-0" style={{ backgroundColor: colors.gray }}>
        <Icon size={22} color={colors.darkGreen} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate" style={{ color: colors.textDark }}>{empresa.nome}</p>
        <div className="flex items-center gap-1 text-sm" style={{ color: "#6B6B6B" }}>
          <Star size={13} fill={colors.gold} color={colors.gold} />
          <span>{empresa.avaliacao}</span>
        </div>
      </div>
    </button>
  );
}

function nivelCor(nivel) {
  if (nivel === "alto") return colors.alertRed;
  if (nivel === "medio") return colors.gold;
  return colors.lightGreen;
}

function AlertaCard({ alerta }) {
  return (
    <div className="bg-white rounded-2xl p-3 border-l-4" style={{ borderColor: nivelCor(alerta.nivel) }}>
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} color={nivelCor(alerta.nivel)} />
        <p className="font-semibold text-sm" style={{ color: colors.textDark }}>{alerta.tipo}</p>
      </div>
      <p className="text-sm mt-1" style={{ color: "#4A4A4A" }}>{alerta.detalhe}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: "#8A8A8A" }}>{alerta.bairro}</span>
        <span className="text-xs" style={{ color: "#8A8A8A" }}>{alerta.time}</span>
      </div>
    </div>
  );
}

export default function TaximotaApp() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [selectedBairro, setSelectedBairro] = useState(null);
  const [selectedTaxistaId, setSelectedTaxistaId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [offline, setOffline] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([
    { id: "h1", type: "bairro", label: "Centro", time: "Hoje, 09:12" },
  ]);
  const [deliveryQuery, setDeliveryQuery] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

  // Segurança
  const [reportBairro, setReportBairro] = useState(BAIRROS[0].id);
  const [reportTipo, setReportTipo] = useState("suspeita");
  const [reportDetalhe, setReportDetalhe] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const filteredBairros = useMemo(() => (!query.trim() ? BAIRROS : BAIRROS.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))), [query]);
  const filteredEmpresas = useMemo(() => EMPRESAS.filter((e) => (categoriaAtiva === "todos" || e.categoria === categoriaAtiva) && (!deliveryQuery.trim() || e.nome.toLowerCase().includes(deliveryQuery.toLowerCase()))), [categoriaAtiva, deliveryQuery]);

  const toggleFav = (id) => setFavorites((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const addHistory = (type, label) => setHistory((prev) => [{ id: `h${Date.now()}`, type, label, time: "Agora" }, ...prev].slice(0, 20));
  const openBairro = (id) => { setSelectedBairro(id); setScreen("taxistas"); const b = BAIRROS.find((x) => x.id === id); if (b) addHistory("bairro", b.name); };
  const openProfile = (id) => { setSelectedTaxistaId(id); setScreen("perfil"); };
  const openEmpresa = (id) => { setSelectedEmpresaId(id); setScreen("empresa"); };
  const clearHistory = () => setHistory([]);

  const bairroAtual = BAIRROS.find((b) => b.id === selectedBairro);
  const taxistaAtual = ALL_TAXISTAS.find((t) => t.id === selectedTaxistaId);
  const favoriteTaxistas = ALL_TAXISTAS.filter((t) => favorites.has(t.id));
  const empresaAtual = EMPRESAS.find((e) => e.id === selectedEmpresaId);

  const submitRating = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setRatingValue(0); setComment(""); setScreen("perfil"); }, 1600);
  };

  const submitReport = () => {
    setReportSent(true);
    setTimeout(() => { setReportSent(false); setReportDetalhe(""); setScreen("seguranca"); }, 1800);
  };

  return (
    <div className="mx-auto flex flex-col" style={{ width: 390, height: 780, backgroundColor: colors.gray, fontFamily: "Inter, sans-serif", borderRadius: 32, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
      {offline && (
        <div className="flex items-center gap-2 px-4 py-2 text-sm" style={{ backgroundColor: "#3A3A3A", color: colors.white }}>
          <WifiOff size={16} />
          <span>Você está offline. Mostrando dados salvos localmente.</span>
        </div>
      )}

      {/* ---------------- HOME ---------------- */}
      {screen === "home" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-8" style={{ backgroundColor: colors.darkGreen }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm" style={{ color: "#BFE0D0" }}>Olá, João! 👋</p>
                <p className="text-xl font-semibold" style={{ color: colors.white, fontFamily: "Poppins, sans-serif" }}>Para onde vamos hoje?</p>
              </div>
              <button onClick={() => setOffline((o) => !o)} className="p-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} aria-label="Notificações (toque para simular offline)">
                <Bell size={20} color={colors.white} />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full px-4 py-3" style={{ backgroundColor: colors.white }}>
              <Search size={18} color="#8A8A8A" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setScreen("bairros")} placeholder="Pesquisar bairro..." className="flex-1 outline-none text-sm bg-transparent" style={{ color: colors.textDark }} />
            </div>
          </div>

          {ALERTAS.length > 0 && (
            <button onClick={() => setScreen("seguranca")} className="mx-5 mt-4 flex items-center gap-3 rounded-2xl p-3 text-left w-[calc(100%-40px)]" style={{ backgroundColor: "#FDECEC" }}>
              <AlertTriangle size={20} color={colors.alertRed} />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: colors.alertRed }}>{ALERTAS[0].tipo} · {ALERTAS[0].bairro}</p>
                <p className="text-xs" style={{ color: "#8A5A5A" }}>Toque para ver os alertas de segurança</p>
              </div>
            </button>
          )}

          <div className="px-5 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Bairros populares</p>
              <button onClick={() => setScreen("bairros")} className="text-sm font-medium" style={{ color: colors.lightGreen }}>Ver todos</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {BAIRROS.map((b) => (
                <button key={b.id} onClick={() => openBairro(b.id)} className="shrink-0 rounded-2xl p-3 text-left" style={{ width: 128, background: `linear-gradient(135deg, ${b.gradient[0]}, ${b.gradient[1]})` }}>
                  <MapPin size={18} color={colors.white} />
                  <p className="mt-4 font-semibold text-sm" style={{ color: colors.white }}>{b.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>{b.taxistas} taxistas</p>
                </button>
              ))}
            </div>

            <p className="font-semibold mt-6 mb-3" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Ações rápidas</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setScreen("seguranca")} className="bg-white rounded-2xl p-4 flex items-center gap-2 text-left">
                <ShieldCheck size={18} color={colors.darkGreen} />
                <span className="text-sm font-medium" style={{ color: colors.textDark }}>Segurança</span>
              </button>
              <button onClick={() => setScreen("favoritos")} className="bg-white rounded-2xl p-4 flex items-center gap-2 text-left">
                <Heart size={18} color="#E0555A" />
                <span className="text-sm font-medium" style={{ color: colors.textDark }}>Favoritos ({favorites.size})</span>
              </button>
            </div>
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- LISTA DE BAIRROS ---------------- */}
      {screen === "bairros" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("home")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Todos os bairros</p>
          </div>
          <div className="px-5 mb-3">
            <div className="flex items-center gap-2 rounded-full px-4 py-3 bg-white">
              <Search size={18} color="#8A8A8A" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar bairro..." className="flex-1 outline-none text-sm bg-transparent" style={{ color: colors.textDark }} />
            </div>
          </div>
          <div className="px-5 flex flex-col gap-3">
            {filteredBairros.map((b) => (
              <button key={b.id} onClick={() => openBairro(b.id)} className="flex items-center gap-3 bg-white rounded-2xl p-3 text-left">
                <div className="rounded-xl shrink-0" style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${b.gradient[0]}, ${b.gradient[1]})` }} />
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: colors.textDark }}>{b.name}</p>
                  <p className="text-xs" style={{ color: "#8A8A8A" }}>{b.taxistas} taxistas · {b.empresas} empresas</p>
                </div>
              </button>
            ))}
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- LISTA DE TAXISTAS ---------------- */}
      {screen === "taxistas" && bairroAtual && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("bairros")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>{bairroAtual.name}</p>
          </div>
          <div className="px-5 flex flex-col gap-3">
            {(TAXISTAS_BY_BAIRRO[bairroAtual.id] || []).map((t) => (
              <TaxistaCard key={t.id} taxista={t} isFav={favorites.has(t.id)} onToggleFav={toggleFav} onOpenProfile={openProfile} onContact={addHistory} />
            ))}
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- PERFIL DO TAXISTA ---------------- */}
      {screen === "perfil" && taxistaAtual && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("taxistas")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Perfil</p>
          </div>
          <div className="px-5 flex flex-col items-center text-center">
            <Avatar name={taxistaAtual.name} size={88} />
            <p className="mt-3 font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>{taxistaAtual.name}</p>
            <div className="flex items-center gap-1 text-sm mt-1" style={{ color: "#6B6B6B" }}>
              <Star size={14} fill={colors.gold} color={colors.gold} />
              <span>{taxistaAtual.rating}</span>
              <span>({taxistaAtual.reviews} avaliações)</span>
            </div>
            <p className="text-sm mt-1" style={{ color: "#6B6B6B" }}>{taxistaAtual.praca} · {taxistaAtual.bairro}</p>
            <div className="mt-2"><Badge available={taxistaAtual.available} /></div>
            <div className="flex gap-3 mt-5 w-full">
              <a href={`tel:${taxistaAtual.phone.replace(/\s/g, "")}`} onClick={() => addHistory("call", taxistaAtual.name)} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: colors.darkGreen, color: colors.white }}>
                <Phone size={16} /> Ligar
              </a>
              <a href={`https://wa.me/258${taxistaAtual.phone.replace(/\s/g, "")}`} onClick={() => addHistory("whatsapp", taxistaAtual.name)} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: colors.lightGreen, color: colors.white }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="px-5 mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Comentários</p>
              <button onClick={() => setScreen("avaliacao")} className="text-sm font-medium" style={{ color: colors.lightGreen }}>Avaliar</button>
            </div>
            {taxistaAtual.comments.length === 0 && <p className="text-sm text-center py-4" style={{ color: "#8A8A8A" }}>Ainda sem comentários.</p>}
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- AVALIAÇÃO ---------------- */}
      {screen === "avaliacao" && taxistaAtual && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("perfil")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Avaliar Taxista</p>
          </div>
          {!submitted ? (
            <div className="px-5 flex flex-col items-center mt-6 gap-6">
              <Avatar name={taxistaAtual.name} size={72} />
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRatingValue(n)} aria-label={`${n} estrelas`}>
                    <Star size={32} fill={n <= ratingValue ? colors.gold : "none"} color={colors.gold} />
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Deixe um comentário (opcional)" className="w-full rounded-2xl p-3 text-sm outline-none bg-white" style={{ color: colors.textDark, minHeight: 100 }} />
              <button onClick={submitRating} disabled={ratingValue === 0} className="w-full rounded-xl py-3 font-medium" style={{ backgroundColor: ratingValue === 0 ? "#B7C9C0" : colors.darkGreen, color: colors.white }}>
                Enviar Avaliação
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5">
              <CheckCircle2 size={48} color={colors.lightGreen} />
              <p className="font-semibold" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Avaliação enviada!</p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- FAVORITOS ---------------- */}
      {screen === "favoritos" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("home")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Meus Favoritos</p>
          </div>
          {favoriteTaxistas.length === 0 ? (
            <EmptyState icon={Heart} title="Nenhum taxista favoritado" subtitle="Toque no coração de um taxista para guardá-lo aqui." />
          ) : (
            <div className="px-5 flex flex-col gap-3">
              {favoriteTaxistas.map((t) => (
                <TaxistaCard key={t.id} taxista={t} isFav={true} onToggleFav={toggleFav} onOpenProfile={openProfile} onContact={addHistory} />
              ))}
            </div>
          )}
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- HISTÓRICO ---------------- */}
      {screen === "historico" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setScreen("home")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
              <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Histórico</p>
            </div>
            {history.length > 0 && (
              <button onClick={clearHistory} className="flex items-center gap-1 text-sm" style={{ color: "#E0555A" }}>
                <Trash2 size={14} /> Limpar
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <EmptyState icon={HistoryIcon} title="Sem histórico ainda" subtitle="Seus últimos bairros e contactos vão aparecer aqui." />
          ) : (
            <div className="px-5 flex flex-col gap-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-center gap-3 bg-white rounded-2xl p-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: colors.gray }}>
                    {h.type === "bairro" && <MapPin size={16} color={colors.darkGreen} />}
                    {h.type === "call" && <Phone size={16} color={colors.darkGreen} />}
                    {h.type === "whatsapp" && <MessageCircle size={16} color={colors.lightGreen} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: colors.textDark }}>
                      {h.type === "bairro" ? `Pesquisou o bairro ${h.label}` : h.type === "call" ? `Ligou para ${h.label}` : `WhatsApp com ${h.label}`}
                    </p>
                    <p className="text-xs" style={{ color: "#8A8A8A" }}>{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- DELIVERY ---------------- */}
      {screen === "delivery" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("home")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Delivery</p>
          </div>
          <div className="px-5 mb-3">
            <div className="flex items-center gap-2 rounded-full px-4 py-3 bg-white">
              <Search size={18} color="#8A8A8A" />
              <input value={deliveryQuery} onChange={(e) => setDeliveryQuery(e.target.value)} placeholder="Pesquisar empresa..." className="flex-1 outline-none text-sm bg-transparent" style={{ color: colors.textDark }} />
            </div>
          </div>
          <div className="px-5 flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setCategoriaAtiva("todos")} className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium" style={categoriaAtiva === "todos" ? { backgroundColor: colors.darkGreen, color: colors.white } : { backgroundColor: colors.white, color: colors.textDark }}>Todas</button>
            {CATEGORIAS.map((c) => (
              <button key={c.id} onClick={() => setCategoriaAtiva(c.id)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium" style={categoriaAtiva === c.id ? { backgroundColor: colors.darkGreen, color: colors.white } : { backgroundColor: colors.white, color: colors.textDark }}>
                <c.icon size={14} />{c.label}
              </button>
            ))}
          </div>
          <div className="px-5 mt-3 flex flex-col gap-3">
            {filteredEmpresas.map((e) => <EmpresaCard key={e.id} empresa={e} onOpen={openEmpresa} />)}
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- PERFIL DA EMPRESA ---------------- */}
      {screen === "empresa" && empresaAtual && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("delivery")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Perfil da Empresa</p>
          </div>
          <div className="px-5 flex flex-col items-center text-center">
            <p className="mt-3 font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>{empresaAtual.nome}</p>
            <div className="flex gap-3 mt-5 w-full">
              <a href={`tel:${empresaAtual.telefone.replace(/\s/g, "")}`} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: colors.darkGreen, color: colors.white }}>
                <Phone size={16} /> Ligar
              </a>
              <a href={`https://wa.me/258${empresaAtual.whatsapp.replace(/\s/g, "")}`} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: colors.lightGreen, color: colors.white }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- SEGURANÇA — LISTA DE ALERTAS ---------------- */}
      {screen === "seguranca" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("home")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Alertas de Segurança</p>
          </div>

          <div className="px-5 mb-4">
            <div className="flex items-start gap-2 rounded-2xl p-3" style={{ backgroundColor: "#EAF2EE" }}>
              <ShieldCheck size={18} color={colors.darkGreen} className="mt-0.5 shrink-0" />
              <p className="text-xs" style={{ color: "#3A5A4A" }}>
                Só publicamos alertas depois de confirmados pela nossa equipa de moderação. Nenhuma informação pessoal ou acusação é exibida sem verificação.
              </p>
            </div>
          </div>

          <div className="px-5 flex flex-col gap-3">
            {ALERTAS.length === 0 ? (
              <EmptyState icon={ShieldCheck} title="Nenhum alerta activo" subtitle="Nenhuma ocorrência confirmada nos bairros de Chimoio." />
            ) : (
              ALERTAS.map((a) => <AlertaCard key={a.id} alerta={a} />)
            )}
          </div>

          <div className="px-5 mt-6">
            <button onClick={() => setScreen("denuncia")} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: colors.darkGreen, color: colors.white }}>
              <ShieldAlert size={16} /> Fazer uma denúncia
            </button>
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* ---------------- SEGURANÇA — DENÚNCIA MODERADA ---------------- */}
      {screen === "denuncia" && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-5 pt-6 pb-4 flex items-center gap-3">
            <button onClick={() => setScreen("seguranca")} aria-label="Voltar"><ChevronLeft size={22} color={colors.textDark} /></button>
            <p className="font-semibold text-lg" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Fazer Denúncia</p>
          </div>

          {!reportSent ? (
            <div className="px-5 flex flex-col gap-4">
              <div className="flex items-start gap-2 rounded-2xl p-3" style={{ backgroundColor: "#FDF6E8" }}>
                <AlertTriangle size={18} color={colors.gold} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: "#7A5C1E" }}>
                  Sua denúncia é revista pela equipa antes de ser publicada. Não inclua acusações diretas contra pessoas — descreva apenas o que aconteceu e onde.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.textDark }}>Bairro</p>
                <select value={reportBairro} onChange={(e) => setReportBairro(e.target.value)} className="w-full rounded-xl p-3 text-sm bg-white" style={{ color: colors.textDark }}>
                  {BAIRROS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.textDark }}>Tipo de ocorrência</p>
                <div className="flex gap-2 flex-wrap">
                  {[{ id: "suspeita", label: "Atividade suspeita" }, { id: "assalto", label: "Assalto" }, { id: "outro", label: "Outro" }].map((t) => (
                    <button key={t.id} onClick={() => setReportTipo(t.id)} className="px-3 py-1.5 rounded-full text-sm font-medium" style={reportTipo === t.id ? { backgroundColor: colors.darkGreen, color: colors.white } : { backgroundColor: colors.white, color: colors.textDark }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.textDark }}>Descrição</p>
                <textarea value={reportDetalhe} onChange={(e) => setReportDetalhe(e.target.value)} placeholder="Descreva o que aconteceu, sem citar nomes..." className="w-full rounded-2xl p-3 text-sm outline-none bg-white" style={{ color: colors.textDark, minHeight: 110 }} />
              </div>

              <button onClick={submitReport} disabled={!reportDetalhe.trim()} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium" style={{ backgroundColor: !reportDetalhe.trim() ? "#B7C9C0" : colors.darkGreen, color: colors.white }}>
                <Send size={16} /> Enviar para Moderação
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5">
              <CheckCircle2 size={48} color={colors.lightGreen} />
              <p className="font-semibold" style={{ color: colors.textDark, fontFamily: "Poppins, sans-serif" }}>Denúncia enviada</p>
              <p className="text-sm text-center" style={{ color: "#8A8A8A" }}>A nossa equipa vai analisar antes de qualquer publicação.</p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- BOTTOM NAV ---------------- */}
      <div className="flex items-center justify-around py-3" style={{ backgroundColor: colors.white, borderTop: `1px solid ${colors.gray}` }}>
        {[
          { icon: HomeIcon, label: "Início", key: "home" },
          { icon: Heart, label: "Favoritos", key: "favoritos" },
          { icon: ShoppingBag, label: "Delivery", key: "delivery" },
          { icon: ShieldCheck, label: "Segurança", key: "seguranca" },
          { icon: Clock, label: "Histórico", key: "historico" },
        ].map(({ icon: Icon, label, key }) => {
          const activeGroup = {
            home: ["home", "bairros", "taxistas", "perfil", "avaliacao"],
            favoritos: ["favoritos"],
            historico: ["historico"],
            delivery: ["delivery", "empresa"],
            seguranca: ["seguranca", "denuncia"],
          };
          const active = (activeGroup[key] || []).includes(screen);
          return (
            <button key={key} onClick={() => setScreen(key)} className="flex flex-col items-center gap-1">
              <Icon size={20} color={active ? colors.darkGreen : "#9A9A9A"} />
              <span className="text-[10px]" style={{ color: active ? colors.darkGreen : "#9A9A9A" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
