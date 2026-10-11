import { useState } from "react";
import { Cake, Clock, ChefHat, CheckCircle2, Phone, User, AlertTriangle, Palette, MessageSquare, X, Lock, Store } from "lucide-react";

const TASKS = [
  { id: "#1043", cake: "Pastel de cumpleaños", client: "Carlos M.", phone: "+52 55 1111 2222", date: "12 Sep 2026", status: "progress", flavor: "Chocolate", frosting: "Ganache de chocolate", size: "Grande (15-20 personas)", message: "¡Feliz cumpleaños Diego!", decorations: "Figuras de fondant de fútbol, colores verde y blanco", notes: "Alergia a las nueces. El cliente recoge a las 5pm.", design: "Pelota de fútbol en 3D encima del pastel" },
  { id: "#1044", cake: "Cupcakes x24", client: "Andrea T.", phone: "+52 55 3333 4444", date: "11 Sep 2026", status: "progress", flavor: "Vainilla y chocolate", frosting: "Betún de colores pastel", size: "24 piezas", message: "", decorations: "Flores pequeñas de betún, perlas de azúcar", notes: "Entregar en caja individual cada cupcake", design: "Colores rosa, lila y menta" },
  { id: "#1048", cake: "Cupcakes rainbow", client: "Roberto A.", phone: "+52 55 7777 8888", date: "25 Sep 2026", status: "pending", flavor: "Arcoíris (masas de colores)", frosting: "Crema de mantequilla multicolor", size: "12 piezas", message: "¡Feliz cumpleaños Sofía!", decorations: "Glitter comestible, arcoíris de fondant", notes: "", design: "Tema arcoíris kawaii" },
];

const STATUS_OPTIONS = [
  { val: "pending",  label: "Pendiente",  Icon: Clock,        active: "bg-amber-50 text-amber-600 border-amber-200" },
  { val: "progress", label: "En proceso", Icon: ChefHat,      active: "bg-blue-50 text-blue-600 border-blue-200" },
  { val: "ready",    label: "Listo",      Icon: CheckCircle2, active: "bg-green-50 text-green-600 border-green-200" },
];

const STATUS_LABEL: Record<string, string> = { pending: "Pendiente", progress: "En proceso", ready: "Listo" };

const BAKERY_CREDENTIALS = { user: "dulceria@mail.com", password: "demo123" };

export default function EmployeeTasks() {
  const [selected, setSelected] = useState(TASKS[0].id);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(TASKS.map((t) => [t.id, t.status]))
  );
  const [authModal, setAuthModal] = useState<{ taskId: string; targetStatus: string } | null>(null);
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authError, setAuthError] = useState("");

  const sel = TASKS.find((t) => t.id === selected)!;
  const currentStatus = statuses[sel.id];

  function handleStatusClick(val: string) {
    if (val === currentStatus) return;
    setAuthModal({ taskId: sel.id, targetStatus: val });
    setAuthUser(""); setAuthPass(""); setAuthError("");
  }

  function confirmAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!authModal) return;
    if (authUser === BAKERY_CREDENTIALS.user && authPass === BAKERY_CREDENTIALS.password) {
      setStatuses(prev => ({ ...prev, [authModal.taskId]: authModal.targetStatus }));
      setAuthModal(null);
    } else {
      setAuthError("Usuario o contraseña incorrectos.");
    }
  }

  function getStatusBadge(s: string) {
    if (s === "progress") return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full badge-progress"><ChefHat size={10} /> En proceso</span>;
    if (s === "ready")    return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full badge-ready"><CheckCircle2 size={10} /> Listo</span>;
    return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full badge-pending"><Clock size={10} /> Pendiente</span>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Mis pedidos</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Pedidos asignados a ti</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Task list */}
        <div className="lg:col-span-2 space-y-3">
          {TASKS.map((task) => (
            <button key={task.id} onClick={() => setSelected(task.id)}
              className={`w-full text-left p-4 rounded-3xl border-2 transition-all ${selected === task.id ? "border-indigo-400 bg-indigo-50" : "border-border bg-card hover:border-indigo-200 card-shadow"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Cake size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">{task.cake}</div>
                  <div className="text-xs text-muted-foreground">{task.id} · {task.client} · {task.date}</div>
                </div>
                {getStatusBadge(statuses[task.id])}
              </div>
            </button>
          ))}
        </div>

        {/* Task detail */}
        <div className="lg:col-span-3 bg-card rounded-3xl card-shadow border border-border p-6 h-fit">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <Cake size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{sel.cake}</h2>
              <div className="text-sm text-muted-foreground">{sel.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Tamaño / Cantidad", value: sel.size },
              { label: "Fecha de entrega",  value: sel.date },
              { label: "Sabor",             value: sel.flavor },
              { label: "Betún / Cobertura", value: sel.frosting },
            ].map((f) => (
              <div key={f.label} className="bg-muted rounded-2xl p-3">
                <div className="text-xs text-muted-foreground font-semibold">{f.label}</div>
                <div className="font-bold text-sm text-foreground mt-0.5">{f.value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-5">
            <div className="bg-muted rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                <Palette size={12} className="text-pink-400" /> Diseño e indicaciones
              </div>
              <div className="text-sm font-medium text-foreground">{sel.design}</div>
            </div>
            <div className="bg-muted rounded-2xl p-3">
              <div className="text-xs text-muted-foreground font-semibold mb-1">Decoraciones</div>
              <div className="text-sm font-medium text-foreground">{sel.decorations}</div>
            </div>
            {sel.message && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-pink-600 font-semibold mb-1">
                  <MessageSquare size={12} /> Mensaje en el pastel
                </div>
                <div className="text-sm font-medium text-foreground italic">"{sel.message}"</div>
              </div>
            )}
            {sel.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-1">
                  <AlertTriangle size={12} /> Notas importantes
                </div>
                <div className="text-sm font-medium text-amber-800">{sel.notes}</div>
              </div>
            )}
          </div>

          <div className="bg-muted rounded-2xl p-3 mb-5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
              <User size={12} /> Cliente
            </div>
            <div className="font-bold text-sm text-foreground">{sel.client}</div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <Phone size={12} className="text-pink-400" /> {sel.phone}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Lock size={10} /> Actualizar estado (requiere usuario de pastelería)
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button key={s.val} onClick={() => handleStatusClick(s.val)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border-2 transition-all ${currentStatus === s.val ? s.active + " scale-105" : "border-border text-muted-foreground hover:border-indigo-200"}`}>
                  <s.Icon size={12} /> {s.label}
                  {currentStatus !== s.val && <Lock size={9} className="ml-0.5 opacity-50" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bakery auth modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-3xl card-shadow-xl w-full max-w-sm p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Store size={20} className="text-indigo-400" /> Confirmar cambio
              </h2>
              <button onClick={() => setAuthModal(null)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm font-semibold text-indigo-700">
                Cambiar estado a <strong>"{STATUS_LABEL[authModal.targetStatus]}"</strong> requiere el usuario de la pastelería.
              </p>
            </div>

            <form onSubmit={confirmAuth} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <User size={12} className="text-indigo-400" /> Usuario de la pastelería
                </label>
                <input type="email" value={authUser} onChange={e => { setAuthUser(e.target.value); setAuthError(""); }}
                  placeholder="correo@pasteleria.com" className="input-base" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <Lock size={12} className="text-indigo-400" /> Contraseña
                </label>
                <input type="password" value={authPass} onChange={e => { setAuthPass(e.target.value); setAuthError(""); }}
                  placeholder="••••••••" className="input-base" />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl">{authError}</div>
              )}

              <p className="text-[11px] text-muted-foreground">
                Demo: <span className="font-mono font-bold">dulceria@mail.com</span> / <span className="font-mono font-bold">demo123</span>
              </p>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setAuthModal(null)}
                  className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2">
                  <ChefHat size={14} /> Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
