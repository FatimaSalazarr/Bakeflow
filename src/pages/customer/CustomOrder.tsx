import { useState, useRef } from "react";
import { Cake, Palette, FileText, CheckCircle2, ImagePlus, X, Clock, Send, XCircle, DollarSign, Sparkles, CreditCard, Lock, ChevronRight, Check } from "lucide-react";

import type { SharedRequest, CustomRequestStatus } from "../../App";

const FLAVORS = ["Vainilla", "Chocolate", "Fresa", "Limón", "Red Velvet", "Moka", "Nuez", "Zanahoria"];
const FROSTINGS = ["Crema de mantequilla", "Ganache de chocolate", "Crema de queso", "Merengue", "Fondant", "Chantilly"];
const DECORATIONS = ["Flores comestibles", "Glitter comestible", "Figuras de fondant", "Macarons", "Chocolate artístico", "Perlas de azúcar", "Personajes kawaii"];

const STATUS_UI: Record<CustomRequestStatus, { label: string; class: string; Icon: React.ComponentType<{ size?: number }> }> = {
  pending:         { label: "Pendiente revisión", class: "badge-pending",   Icon: Clock },
  awaiting_client: { label: "Cotización recibida",class: "badge-progress",  Icon: DollarSign },
  confirmed:       { label: "Confirmado",          class: "badge-ready",    Icon: CheckCircle2 },
  rejected:        { label: "Rechazado",            class: "badge-cancelled", Icon: XCircle },
  declined:        { label: "Rechazaste",           class: "badge-cancelled", Icon: XCircle },
};

interface Props {
  customRequests: SharedRequest[];
  onUpdateRequests: (reqs: SharedRequest[]) => void;
}

export default function CustomOrder({ customRequests, onUpdateRequests }: Props) {
  const [tab, setTab] = useState<"new" | "my">("new");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    size: "", flavor: "", frosting: "", decorations: [] as string[],
    theme: "", message: "", persons: "", date: "", notes: "", budget: "",
    refImage: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [payingForId, setPayingForId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [payDone, setPayDone] = useState(false);

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }
  const cardValid = cardForm.number.replace(/\s/g, "").length === 16 && cardForm.name.trim().length > 1 && cardForm.expiry.length === 5 && cardForm.cvv.length >= 3;

  const pendingPriceCount = customRequests.filter(r => r.status === "awaiting_client").length;

  function handleRefImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, refImage: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  function toggleDeco(d: string) {
    setForm(p => ({ ...p, decorations: p.decorations.includes(d) ? p.decorations.filter(x => x !== d) : [...p.decorations, d] }));
  }

  function resetForm() {
    setSubmitted(false); setStep(1);
    setForm({ size: "", flavor: "", frosting: "", decorations: [], theme: "", message: "", persons: "", date: "", notes: "", budget: "", refImage: "" });
  }

  function clientDecide(id: string, accept: boolean) {
    if (accept) {
      setPayingForId(id);
      setCardForm({ number: "", name: "", expiry: "", cvv: "" });
      setPayDone(false);
    } else {
      onUpdateRequests(customRequests.map(r => r.id === id ? { ...r, status: "declined" } : r));
    }
  }

  function confirmPayment() {
    if (!payingForId) return;
    onUpdateRequests(customRequests.map(r => r.id === payingForId ? { ...r, status: "confirmed" } : r));
    setPayDone(true);
    setTimeout(() => { setPayingForId(null); setPayDone(false); }, 3000);
  }

  const STEP_LABELS = ["Diseño", "Detalles", "Confirmación"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:px-6">
      <div className="mb-5">
        <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
          <Sparkles size={26} className="text-pink-400" /> Pastel a tu gusto
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Diseña tu pastel especial o revisa tus solicitudes</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-2xl p-1 mb-6 border border-border">
        <button onClick={() => setTab("new")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${tab === "new" ? "bg-white text-pink-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <Cake size={14} /> Nueva solicitud
        </button>
        <button onClick={() => setTab("my")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 relative ${tab === "my" ? "bg-white text-pink-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <Send size={14} /> Mis solicitudes
          {pendingPriceCount > 0 && (
            <span className="w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{pendingPriceCount}</span>
          )}
        </button>
      </div>

      {/* ── MIS SOLICITUDES TAB ──────────────────── */}
      {tab === "my" && (
        <div className="space-y-3 animate-fade-up">
          {customRequests.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Sparkles size={40} className="mx-auto mb-3 text-pink-200" />
              <div className="font-medium">Aún no tienes solicitudes</div>
              <button onClick={() => setTab("new")} className="mt-4 px-4 py-2 bg-pink-500 text-white text-sm font-bold rounded-xl hover:bg-pink-600 transition-colors">Crear solicitud</button>
            </div>
          )}
          {customRequests.map((r) => {
            const ui = STATUS_UI[r.status];
            const StatusIcon = ui.Icon;
            return (
              <div key={r.id} className="bg-card rounded-3xl card-shadow border border-border p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-pink-500">{r.id}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${ui.class}`}>
                        <StatusIcon size={9} /> {ui.label}
                      </span>
                    </div>
                    <div className="font-display text-base font-semibold text-foreground">{r.theme}</div>
                    <div className="text-xs text-muted-foreground">{r.flavor} · {r.size} · {r.date}</div>
                  </div>
                  {r.quotedPrice && (
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground font-semibold">Cotización</div>
                      <div className="font-display text-xl font-bold text-pink-500">${r.quotedPrice}</div>
                    </div>
                  )}
                </div>

                {/* Price awaiting client decision */}
                {r.status === "awaiting_client" && r.quotedPrice && (
                  <div className="mt-3 bg-violet-50 border border-violet-100 rounded-2xl p-4">
                    <div className="text-sm font-bold text-violet-700 mb-1 flex items-center gap-2">
                      <DollarSign size={14} /> La pastelería cotizó tu pedido en <span className="text-pink-500">${r.quotedPrice}</span>
                    </div>
                    <p className="text-xs text-violet-600 font-medium mb-3">
                      {r.flavor} · {r.frosting} · {r.size} · {r.decorations}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => clientDecide(r.id, true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-pink-500 text-white font-bold rounded-xl text-sm hover:bg-pink-600 shadow-sm transition-all active:scale-95">
                        <CheckCircle2 size={13} /> Aceptar cotización
                      </button>
                      <button onClick={() => clientDecide(r.id, false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border-2 border-pink-400 text-pink-500 font-bold rounded-xl text-sm hover:bg-pink-50 transition-all active:scale-95">
                        <XCircle size={13} /> Rechazar
                      </button>
                    </div>
                  </div>
                )}

                {r.status === "confirmed" && (
                  <div className="mt-2 bg-pink-50 border border-pink-200 rounded-2xl p-3 text-sm text-pink-700 font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} /> Pedido confirmado. La pastelería ya está trabajando en él.
                  </div>
                )}
                {r.status === "rejected" && (
                  <div className="mt-2 bg-rose-50 border border-rose-100 rounded-2xl p-3 text-sm text-rose-600 font-medium flex items-center gap-2">
                    <XCircle size={14} /> La pastelería no puede realizar este pedido.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── NUEVA SOLICITUD TAB ──────────────────── */}
      {tab === "new" && submitted && (
        <div className="flex flex-col items-center justify-center py-16 animate-pop">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl flex items-center justify-center mb-4 animate-float shadow-lg">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Solicitud enviada</h2>
          <p className="text-muted-foreground text-center mb-6 font-medium">
            La pastelería revisará tu solicitud.<br />Te avisaremos cuando recibas una cotización.
          </p>
          <div className="flex gap-3">
            <button onClick={resetForm} className="px-5 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors text-sm">
              Nueva solicitud
            </button>
            <button onClick={() => { setTab("my"); setSubmitted(false); }}
              className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md text-sm flex items-center gap-2">
              <Send size={14} /> Ver mis solicitudes
            </button>
          </div>
        </div>
      )}

      {tab === "new" && !submitted && (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-6">
            {STEP_LABELS.map((label, i) => {
              const s = i + 1;
              const isDone = step > s;
              const isActive = step === s;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0
                      ${isDone ? "bg-pink-500 text-white" : isActive ? "bg-pink-500 text-white ring-4 ring-pink-100" : "bg-muted text-muted-foreground border-2 border-border"}`}>
                      {isDone ? <Check size={12} /> : s}
                    </div>
                    <span className={`text-sm font-bold hidden sm:inline transition-colors
                      ${isActive ? "text-pink-500" : isDone ? "text-pink-400" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                  {i < 2 && <ChevronRight size={14} className={`shrink-0 transition-colors ${step > s ? "text-pink-400" : "text-border"}`} />}
                </div>
              );
            })}
          </div>

          <div className="bg-card rounded-3xl card-shadow border border-border p-5 md:p-6 animate-fade-up">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Tamaño</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: "chico", label: "Chico", sub: "4-6 pers." },
                      { val: "mediano", label: "Mediano", sub: "8-12 pers." },
                      { val: "grande", label: "Grande", sub: "15-20 pers." },
                    ].map((s) => (
                      <button key={s.val} onClick={() => setForm({ ...form, size: s.val })}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${form.size === s.val ? "border-pink-400 bg-pink-50" : "border-border hover:border-pink-200"}`}>
                        <Cake size={22} className={form.size === s.val ? "text-pink-500" : "text-muted-foreground"} />
                        <span className="font-bold text-sm text-foreground">{s.label}</span>
                        <span className="text-xs text-muted-foreground">{s.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Sabor de la masa</label>
                  <div className="flex flex-wrap gap-2">
                    {FLAVORS.map(f => (
                      <button key={f} onClick={() => setForm({ ...form, flavor: f })}
                        className={`px-3 py-2 rounded-2xl text-sm font-bold border transition-all ${form.flavor === f ? "border-pink-400 bg-pink-50 text-pink-600" : "border-border text-muted-foreground hover:border-pink-200"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Betún o cobertura</label>
                  <div className="flex flex-wrap gap-2">
                    {FROSTINGS.map(f => (
                      <button key={f} onClick={() => setForm({ ...form, frosting: f })}
                        className={`px-3 py-2 rounded-2xl text-sm font-bold border transition-all ${form.frosting === f ? "border-violet-400 bg-violet-50 text-violet-600" : "border-border text-muted-foreground hover:border-violet-200"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Decoraciones (varias)</label>
                  <div className="flex flex-wrap gap-2">
                    {DECORATIONS.map(d => (
                      <button key={d} onClick={() => toggleDeco(d)}
                        className={`px-3 py-2 rounded-2xl text-sm font-bold border transition-all ${form.decorations.includes(d) ? "border-pink-400 bg-pink-50 text-pink-600" : "border-border text-muted-foreground hover:border-pink-200"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!form.size || !form.flavor || !form.frosting}
                  className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl disabled:opacity-50 shadow-md active:scale-95 transition-all">
                  Siguiente
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-2"><Palette size={13} className="text-pink-400" /> Temática o diseño</label>
                  <input type="text" value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}
                    placeholder="Ej: kawaii, unicornio, flores vintage..." className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-2"><FileText size={13} className="text-pink-400" /> Mensaje en el pastel</label>
                  <input type="text" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Ej: ¡Feliz cumpleaños Luna!" className="input-base" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Personas</label>
                    <input type="number" value={form.persons} onChange={e => setForm({ ...form, persons: e.target.value })} placeholder="15" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Fecha requerida</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Presupuesto aproximado</label>
                  <input type="text" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="Ej: $500 - $700" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Notas adicionales</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Alergias, indicaciones especiales..." rows={2}
                    className="input-base resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                    <ImagePlus size={13} className="text-pink-400" /> Imagen de referencia (opcional)
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleRefImage} />
                  {form.refImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-pink-200">
                      <img src={form.refImage} alt="Referencia" className="w-full h-36 object-cover" />
                      <button onClick={() => setForm({ ...form, refImage: "" })}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => fileRef.current?.click()}
                      className="w-full h-24 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center gap-1.5 text-pink-400">
                      <ImagePlus size={20} />
                      <span className="text-xs font-bold">Subir imagen de referencia</span>
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors">Atrás</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all">Revisar</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Resumen de tu pedido</h3>
                <div className="divide-y divide-border">
                  {[
                    { label: "Tamaño", value: form.size },
                    { label: "Sabor", value: form.flavor },
                    { label: "Betún", value: form.frosting },
                    { label: "Decoraciones", value: form.decorations.join(", ") || "Ninguna" },
                    { label: "Temática", value: form.theme || "Sin especificar" },
                    { label: "Mensaje", value: form.message || "Sin mensaje" },
                    { label: "Fecha", value: form.date || "Sin fecha" },
                    { label: "Presupuesto", value: form.budget || "Sin especificar" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-start py-2.5">
                      <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground text-right max-w-[55%] capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
                {form.refImage && (
                  <div>
                    <div className="text-sm font-bold text-muted-foreground mb-1.5">Imagen de referencia</div>
                    <img src={form.refImage} alt="Referencia" className="w-full h-32 object-cover rounded-2xl border border-border" />
                  </div>
                )}
                <div className="bg-pink-50 rounded-2xl p-3.5 text-xs text-pink-700 font-medium border border-pink-100">
                  La pastelería revisará tu solicitud y te enviará una cotización. Podrás aceptarla o rechazarla.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors">Atrás</button>
                  <button onClick={() => setSubmitted(true)} className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all">Enviar solicitud</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {/* ── CARD PAYMENT MODAL ─────────────────── */}
      {payingForId && (() => {
        const req = customRequests.find(r => r.id === payingForId);
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-card rounded-3xl card-shadow-xl w-full max-w-sm p-6 animate-fade-up">
              {payDone ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pop shadow-lg">
                    <CheckCircle2 size={30} className="text-white" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">Pago realizado</h3>
                  <p className="text-muted-foreground text-sm font-medium">Tu pedido especial ha sido confirmado.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1">
                      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                        <CreditCard size={20} className="text-pink-500" /> Pago con tarjeta
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Pedido especial {req?.id}</p>
                    </div>
                    <button onClick={() => setPayingForId(null)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="relative h-40 bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 rounded-2xl p-5 mb-5 overflow-hidden shadow-lg">
                    <div className="absolute top-3 right-3 opacity-30 w-20 h-20 rounded-full border-8 border-white" />
                    <div className="absolute top-8 right-10 opacity-20 w-16 h-16 rounded-full border-8 border-white" />
                    <div className="text-white/70 text-xs font-bold mb-3 tracking-widest">TARJETA DE CRÉDITO</div>
                    <div className="font-mono text-white text-lg font-bold tracking-widest mb-4">
                      {cardForm.number || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs">TITULAR</div>
                        <div className="text-white text-sm font-bold uppercase tracking-wide">{cardForm.name || "NOMBRE APELLIDO"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-xs">VENCE</div>
                        <div className="text-white text-sm font-bold">{cardForm.expiry || "MM/AA"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Número de tarjeta</label>
                      <div className="relative">
                        <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                          value={cardForm.number}
                          onChange={(e) => setCardForm({ ...cardForm, number: formatCard(e.target.value) })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-mono font-medium tracking-widest" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Nombre en la tarjeta</label>
                      <input type="text" placeholder="Como aparece en la tarjeta"
                        value={cardForm.name}
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium uppercase tracking-wide" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1.5">Vencimiento</label>
                        <input type="text" inputMode="numeric" placeholder="MM/AA"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-mono font-medium" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1.5">CVV</label>
                        <input type="password" inputMode="numeric" placeholder="•••"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-mono font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-2xl p-3 mb-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Total a pagar</span>
                    <span className="font-display text-lg font-semibold text-pink-500">${req?.quotedPrice}</span>
                  </div>

                  <button onClick={confirmPayment} disabled={!cardValid}
                    className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
                    <Lock size={15} /> Pagar ${req?.quotedPrice}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                    <Lock size={10} /> Pago seguro y encriptado
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
