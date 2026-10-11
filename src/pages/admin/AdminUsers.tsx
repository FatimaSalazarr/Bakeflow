import { useState } from "react";
import { Search, ShoppingBag, Store, Users, User, ShieldOff, ShieldCheck, Plus, X, Mail, Phone, Lock } from "lucide-react";

const INITIAL_USERS = [
  { id: 1, name: "Luna García",      email: "luna@mail.com",          role: "customer",  bakery: "-",               status: "active",  date: "5 Sep" },
  { id: 2, name: "Rosa Martínez",    email: "dulceria@rosita.com",    role: "bakery",    bakery: "Dulcería Rosita",  status: "active",  date: "8 Sep" },
  { id: 3, name: "Sofía López",      email: "sofia@rosita.com",       role: "employee",  bakery: "Dulcería Rosita",  status: "active",  date: "2 Sep" },
  { id: 4, name: "Carlos Mendoza",   email: "carlos@mail.com",        role: "customer",  bakery: "-",               status: "active",  date: "3 Sep" },
  { id: 5, name: "Valentina Ríos",   email: "luna@pasteles.com",      role: "bakery",    bakery: "Pastelería Luna",  status: "active",  date: "6 Sep" },
  { id: 6, name: "Andrea Torres",    email: "andrea@mail.com",        role: "customer",  bakery: "-",               status: "blocked", date: "1 Sep" },
  { id: 7, name: "Admin Principal",  email: "admin@bakeflow.com",     role: "admin",     bakery: "-",               status: "active",  date: "1 Ene" },
  { id: 8, name: "Mia Ramírez",      email: "mia@rosita.com",         role: "employee",  bakery: "Dulcería Rosita",  status: "active",  date: "5 Sep" },
];

const ROLE_META: Record<string, { label: string; class: string; Icon: React.ComponentType<{ size?: number }> }> = {
  customer: { label: "Cliente",    class: "bg-pink-50 text-pink-600",    Icon: ShoppingBag },
  bakery:   { label: "Pastelería", class: "bg-violet-50 text-violet-600", Icon: Store },
  employee: { label: "Empleado",   class: "bg-indigo-50 text-indigo-600", Icon: User },
  admin:    { label: "Admin",      class: "bg-rose-50 text-rose-600",     Icon: Users },
};

const BLANK = { name: "", email: "", phone: "", role: "admin", bakery: "", password: "" };

type TabType = "admins" | "clients";

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<TabType>("admins");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");

  const adminUsers = users.filter((u) => u.role === "admin");
  const clientUsers = users.filter((u) => u.role !== "admin");

  const baseList = activeTab === "admins" ? adminUsers : clientUsers;

  const filtered = baseList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function toggleBlock(id: number) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u));
  }

  function setF(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setFormError("Nombre, correo y contraseña son obligatorios."); return; }
    const today = new Date();
    const dateStr = `${today.getDate()} ${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][today.getMonth()]}`;
    setUsers((prev) => [...prev, { id: Date.now(), name: form.name, email: form.email, role: form.role, bakery: form.bakery || "-", status: "active", date: dateStr }]);
    setForm(BLANK);
    setFormError("");
    setShowModal(false);
  }

  const clientRoleOptions = [["all", "Todos"], ["bakery", "Pastelerías"], ["employee", "Empleados"], ["customer", "Clientes"]];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
            <Users size={28} className="text-pink-400" /> Usuarios
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">{users.length} usuarios en la plataforma</p>
        </div>
        <button onClick={() => { setShowModal(true); setFormError(""); setForm({ ...BLANK, role: activeTab === "admins" ? "admin" : "bakery" }); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-sm transition-all text-sm">
          <Plus size={15} /> Crear usuario
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => { setActiveTab("admins"); setRoleFilter("all"); setSearch(""); }}
          className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${activeTab === "admins" ? "bg-pink-500 text-white" : "bg-card border border-border text-muted-foreground hover:border-pink-200"}`}>
          Usuarios ({adminUsers.length})
        </button>
        <button onClick={() => { setActiveTab("clients"); setRoleFilter("all"); setSearch(""); }}
          className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${activeTab === "clients" ? "bg-pink-500 text-white" : "bg-card border border-border text-muted-foreground hover:border-pink-200"}`}>
          Clientes ({clientUsers.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-border bg-card focus:outline-none focus:border-pink-400 text-sm font-medium" />
        </div>
        {activeTab === "clients" && (
          <div className="flex gap-2 flex-wrap">
            {clientRoleOptions.map(([val, label]) => (
              <button key={val} onClick={() => setRoleFilter(val)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all ${roleFilter === val ? "bg-pink-500 text-white" : "bg-card border border-border text-muted-foreground hover:border-pink-200"}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-3xl card-shadow border border-border overflow-hidden">
        <div className="grid grid-cols-6 gap-3 px-5 py-3 bg-muted text-xs font-bold text-muted-foreground">
          <span className="col-span-2">Usuario</span><span>Rol</span><span>Empresa</span><span>Estado</span><span>Acción</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">Sin usuarios en esta categoría</div>
          ) : filtered.map((u) => {
            const meta = ROLE_META[u.role];
            const MetaIcon = meta.Icon;
            return (
              <div key={u.id} className="grid grid-cols-6 gap-3 px-5 py-4 items-center">
                <div className="col-span-2">
                  <div className="font-bold text-sm text-foreground">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full w-fit ${meta.class}`}>
                  <MetaIcon size={10} /> {meta.label}
                </span>
                <span className="text-xs text-muted-foreground font-medium truncate">{u.bakery}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${u.status === "active" ? "badge-ready" : "badge-cancelled"}`}>
                  {u.status === "active" ? "Activo" : "Bloqueado"}
                </span>
                <button onClick={() => toggleBlock(u.id)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${u.status === "active" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                  {u.status === "active" ? <><ShieldOff size={11} /> Bloquear</> : <><ShieldCheck size={11} /> Desbloquear</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-3xl card-shadow-xl w-full max-w-md p-6 animate-pop">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Users size={20} className="text-pink-400" /> Crear usuario
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={createUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <User size={12} className="text-pink-400" /> Nombre completo *
                </label>
                <input type="text" value={form.name} onChange={(e) => setF("name", e.target.value)}
                  placeholder="Nombre del usuario" className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-pink-400" /> Correo electrónico *
                </label>
                <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)}
                  placeholder="correo@ejemplo.com" className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <Phone size={12} className="text-pink-400" /> Teléfono
                </label>
                <input type="tel" value={form.phone} onChange={(e) => setF("phone", e.target.value)}
                  placeholder="+52 55 1234 5678" className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "admin", label: "Admin" },
                    { value: "bakery", label: "Pastelería" },
                    { value: "employee", label: "Empleado" },
                    { value: "customer", label: "Cliente" },
                  ].map(({ value, label }) => (
                    <button key={value} type="button" onClick={() => setF("role", value)}
                      className={`py-2 rounded-2xl text-xs font-bold border transition-all ${form.role === value ? "border-pink-400 bg-pink-50 text-pink-600" : "border-border text-muted-foreground hover:border-pink-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {(form.role === "bakery" || form.role === "employee") && (
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                    <Store size={12} className="text-pink-400" /> {form.role === "bakery" ? "Nombre de la pastelería" : "Pastelería"}
                  </label>
                  <input type="text" value={form.bakery} onChange={(e) => setF("bakery", e.target.value)}
                    placeholder="Nombre de la pastelería" className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 flex items-center gap-1.5">
                  <Lock size={12} className="text-pink-400" /> Contraseña *
                </label>
                <input type="password" value={form.password} onChange={(e) => setF("password", e.target.value)}
                  placeholder="Contraseña temporal" className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
              </div>

              {formError && (
                <div className="bg-pink-50 border border-pink-200 text-pink-600 text-xs font-semibold px-4 py-3 rounded-2xl">{formError}</div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
                  <Plus size={14} /> Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
