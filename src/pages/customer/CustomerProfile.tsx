import { useState } from "react";
import { Mail, Phone, MapPin, Cake, User, Pencil, Check, Package, Lock, Eye, EyeOff } from "lucide-react";

interface Props { userName: string; }

export default function CustomerProfile({ userName }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: userName, email: "luna@mail.com", phone: "+52 55 1234 5678",
    address: "Calle Rosa 42, Col. Las Flores, CDMX", birthday: "1998-03-15",
  });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.current !== "demo123") { setPwError("La contraseña actual es incorrecta."); return; }
    if (pwForm.next.length < 8) { setPwError("La nueva contraseña debe tener al menos 8 caracteres."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Las contraseñas no coinciden."); return; }
    setPwError("");
    setPwForm({ current: "", next: "", confirm: "" });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  function save() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const fields = [
    { key: "name", label: "Nombre completo", type: "text", Icon: User },
    { key: "email", label: "Correo electrónico", type: "email", Icon: Mail },
    { key: "phone", label: "Teléfono", type: "tel", Icon: Phone },
    { key: "address", label: "Dirección", type: "text", Icon: MapPin },
    { key: "birthday", label: "Fecha de nacimiento", type: "date", Icon: Cake },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Mi perfil</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Gestiona tu información personal</p>
      </div>

      {saved && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
          <Check size={16} /> Cambios guardados correctamente
        </div>
      )}

      <div className="bg-card rounded-3xl card-shadow border border-border p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl flex items-center justify-center text-3xl text-white font-bold shadow-md">
            {form.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-foreground">{form.name}</div>
            <div className="text-sm text-muted-foreground font-medium">{form.email}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-100 text-pink-600 text-xs font-bold rounded-full">
              <User size={11} /> Cliente
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl card-shadow border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-foreground">Información personal</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-pink-50 text-pink-500 border border-pink-200 font-bold text-sm rounded-2xl hover:bg-pink-100 transition-colors">
              <Pencil size={13} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 border border-border text-muted-foreground font-bold text-sm rounded-2xl hover:bg-muted">Cancelar</button>
              <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 text-white font-bold text-sm rounded-2xl hover:bg-pink-600">
                <Check size={13} /> Guardar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {fields.map(({ key, label, type, Icon }) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-1.5">
                <Icon size={13} className="text-pink-400" /> {label}
              </label>
              {editing ? (
                <input type={type} value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 transition-colors text-sm font-medium" />
              ) : (
                <div className="px-4 py-3 rounded-2xl bg-muted text-sm font-medium text-foreground">
                  {form[key as keyof typeof form]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-card rounded-3xl card-shadow border border-border p-6 mt-5">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Lock size={16} className="text-pink-400" /> Cambiar contraseña
        </h2>
        {pwSaved && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2">
            <Check size={14} /> Contraseña actualizada correctamente
          </div>
        )}
        <form onSubmit={changePassword} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">Contraseña actual</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={pwForm.current}
                onChange={e => { setPwForm(p => ({ ...p, current: e.target.value })); setPwError(""); }}
                placeholder="••••••••" className="input-base pr-12" />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">Nueva contraseña</label>
            <div className="relative">
              <input type={showNext ? "text" : "password"} value={pwForm.next}
                onChange={e => { setPwForm(p => ({ ...p, next: e.target.value })); setPwError(""); }}
                placeholder="Mínimo 8 caracteres" className="input-base pr-12" />
              <button type="button" onClick={() => setShowNext(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">Confirmar nueva contraseña</label>
            <input type="password" value={pwForm.confirm}
              onChange={e => { setPwForm(p => ({ ...p, confirm: e.target.value })); setPwError(""); }}
              placeholder="Repite la nueva contraseña" className="input-base" />
          </div>
          {pwError && (
            <div className="bg-pink-50 border border-pink-200 text-pink-600 text-xs font-semibold px-4 py-3 rounded-2xl">{pwError}</div>
          )}
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl text-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
            <Lock size={14} /> Actualizar contraseña
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        {[
          { label: "Pedidos totales", value: "12", Icon: Package },
          { label: "Pasteles ordenados", value: "18", Icon: Cake },
          { label: "Pastelería favorita", value: "Rosita", Icon: User },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-card rounded-3xl card-shadow border border-border p-4 text-center">
            <div className="flex justify-center mb-1">
              <Icon size={22} className="text-pink-400" />
            </div>
            <div className="font-display text-xl font-semibold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

