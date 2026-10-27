import { useState } from "react";
import { Clock, CheckCircle2, XCircle, Sparkles, AlertTriangle, DollarSign, Send } from "lucide-react";
import type { SharedRequest, CustomRequestStatus } from "../../App";

const STATUS_MAP: Record<CustomRequestStatus, { label: string; class: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pending:        { label: "Pendiente",        class: "badge-pending",   Icon: Clock },
  awaiting_client:{ label: "Esperando cliente",class: "badge-progress",  Icon: Send },
  confirmed:      { label: "Confirmado",       class: "badge-ready",     Icon: CheckCircle2 },
  rejected:       { label: "Rechazado",        class: "badge-cancelled", Icon: XCircle },
  declined:       { label: "Cliente rechazó",   class: "badge-cancelled", Icon: XCircle },
};

interface Props {
  customRequests: SharedRequest[];
  onUpdateRequests: (reqs: SharedRequest[]) => void;
}

export default function CustomRequests({ customRequests, onUpdateRequests }: Props) {
  const [selected, setSelected] = useState(customRequests[0]?.id ?? "");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [showPriceInput, setShowPriceInput] = useState(false);

  const sel = customRequests.find((r) => r.id === selected) ?? customRequests[0];
  if (!sel) return null;

  const SelIcon = STATUS_MAP[sel.status].Icon;

  function update(id: string, patch: Partial<SharedRequest>) {
    onUpdateRequests(customRequests.map((r) => r.id === id ? { ...r, ...patch } : r));
  }

  function sendQuote() {
    if (!priceInput.trim()) return;
    update(sel.id, { status: "awaiting_client", quotedPrice: priceInput.trim() });
    setPriceInput(""); setShowPriceInput(false);
  }

  function reject() {
    update(sel.id, { status: "rejected" });
    setShowRejectInput(false); setRejectNote("");
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
          <Sparkles size={28} className="text-pink-400" /> Pedidos especiales
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          {customRequests.filter(r => r.status === "pending").length} solicitudes pendientes de revisión
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2.5">
          {customRequests.map((r) => {
            const s = STATUS_MAP[r.status];
            return (
              <button key={r.id} onClick={() => { setSelected(r.id); setShowRejectInput(false); setShowPriceInput(false); }}
                className={`w-full text-left p-4 rounded-3xl border-2 transition-all ${selected === r.id ? "border-pink-400 bg-pink-50" : "border-border bg-card hover:border-pink-200 card-shadow"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-pink-500">{r.id}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.class}`}>
                        <s.Icon size={9} /> {s.label}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-foreground truncate">{r.theme}</div>
                    <div className="text-xs text-muted-foreground">{r.client} · {r.date}</div>
                    {r.quotedPrice && (
                      <div className="text-xs font-bold text-pink-500 mt-1">Cotización: ${r.quotedPrice}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-card rounded-3xl card-shadow border border-border p-5 md:p-6 flex flex-col justify-between min-h-[780px]">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-lg font-semibold text-foreground">{sel.theme}</h2>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_MAP[sel.status].class}`}>
                    <SelIcon size={10} /> {STATUS_MAP[sel.status].label}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-0.5">{sel.id} · {sel.client}</div>
              </div>
              <div className="text-right">
                {sel.quotedPrice ? (
                  <>
                    <div className="text-xs text-muted-foreground font-semibold">Cotización enviada</div>
                    <div className="font-display text-xl font-bold text-pink-500">${sel.quotedPrice}</div>
                  </>
                ) : (
                  <div className="invisible select-none">
                    <div className="text-xs font-semibold">Cotización enviada</div>
                    <div className="font-display text-xl font-bold">$0</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { label: "Tamaño", value: sel.size },
                { label: "Personas", value: sel.persons },
                { label: "Sabor", value: sel.flavor },
                { label: "Betún", value: sel.frosting },
                { label: "Fecha", value: sel.date },
                { label: "Presupuesto cliente", value: sel.budget },
              ].map((f) => (
                <div key={f.label} className="bg-muted rounded-2xl p-3">
                  <div className="text-xs text-muted-foreground font-semibold">{f.label}</div>
                  <div className="font-bold text-sm text-foreground mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="bg-muted rounded-2xl p-3">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Decoraciones</div>
                <div className="text-sm font-medium text-foreground">{sel.decorations}</div>
              </div>
              {sel.message && (
                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-3">
                  <div className="text-xs text-pink-600 font-semibold mb-1">Mensaje en el pastel</div>
                  <div className="text-sm font-medium text-foreground italic">"{sel.message}"</div>
                </div>
              )}
              {sel.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-1">
                    <AlertTriangle size={11} /> Notas especiales
                  </div>
                  <div className="text-sm font-medium text-amber-800">{sel.notes}</div>
                </div>
              )}
              {sel.refImage && (
                <div>
                  <div className="text-xs text-muted-foreground font-semibold mb-1.5">Imagen de referencia</div>
                  <img src={sel.refImage} alt="Referencia" className="w-full h-36 object-cover rounded-2xl border border-border" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-2">
            {/* Actions */}
            {sel.status === "pending" && (
              <div className="space-y-3">
                {showPriceInput ? (
                  <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 space-y-3">
                    <div className="text-sm font-bold text-pink-700 flex items-center gap-2">
                      <DollarSign size={15} /> Establecer precio de cotización
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">$</span>
                      <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)}
                        placeholder="0.00" className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-pink-200 bg-white focus:outline-none focus:border-pink-400 text-sm font-bold" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowPriceInput(false)} className="flex-1 py-2.5 border-2 border-border text-muted-foreground font-bold rounded-xl text-sm hover:bg-muted transition-colors">Cancelar</button>
                      <button onClick={sendQuote} disabled={!priceInput.trim()}
                        className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                        <Send size={13} /> Enviar cotización
                      </button>
                    </div>
                  </div>
                ) : showRejectInput ? (
                  <div className="space-y-2">
                    <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Motivo del rechazo (opcional)..." rows={2}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowRejectInput(false)} className="flex-1 py-2.5 border-2 border-border text-foreground font-bold rounded-2xl text-sm">Cancelar</button>
                      <button onClick={reject} className="flex-1 py-2.5 bg-white border-2 border-pink-400 text-pink-500 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors">
                        <XCircle size={14} /> Confirmar rechazo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <button onClick={() => setShowPriceInput(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 text-sm">
                      <DollarSign size={15} /> Cotizar y aprobar
                    </button>
                    <button onClick={() => setShowRejectInput(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-pink-400 text-pink-500 font-bold rounded-2xl transition-all active:scale-95 text-sm hover:bg-pink-50">
                      <XCircle size={15} /> Rechazar
                    </button>
                  </div>
                )}
              </div>
            )}

            {sel.status === "awaiting_client" && (
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-sm text-violet-700 font-medium flex items-center gap-2">
                <Send size={14} /> Cotización enviada al cliente. Esperando su respuesta.
              </div>
            )}

            {sel.status === "confirmed" && (
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-sm text-pink-700 font-bold flex items-center gap-2">
                <CheckCircle2 size={14} /> El cliente aceptó la cotización. Pedido confirmado.
              </div>
            )}

            {sel.status === "declined" && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 font-medium flex items-center gap-2">
                <XCircle size={14} /> El cliente rechazó la cotización.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}