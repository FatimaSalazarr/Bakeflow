import { useState } from "react";
import { Tag, Plus, Cake, Cookie, Coffee, Star, Gift, Heart } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cake, Cookie, Coffee, Star, Gift, Heart, Tag,
};

const INITIAL_CATEGORIES = [
  { id: 1, name: "Pasteles", icon: "Cake", products: 145, active: true },
  { id: 2, name: "Cupcakes", icon: "Cookie", products: 89, active: true },
  { id: 3, name: "Cheesecakes", icon: "Coffee", products: 52, active: true },
  { id: 4, name: "Pasteles especiales", icon: "Star", products: 38, active: true },
  { id: 5, name: "Repostería tradicional", icon: "Gift", products: 21, active: false },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("Cake");

  function add() {
    if (!newName) return;
    setCategories((prev) => [...prev, { id: Date.now(), name: newName, icon: newIcon, products: 0, active: true }]);
    setNewName(""); setNewIcon("Cake");
  }

  function toggle(id: number) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
          <Tag size={28} className="text-pink-400" /> Categorías
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Gestiona las categorías de productos de la plataforma</p>
      </div>

      <div className="bg-card rounded-3xl card-shadow border border-border p-5 mb-6">
        <h2 className="font-bold text-foreground mb-4">Nueva categoría</h2>
        <div className="flex gap-3 items-center">
          <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border-2 border-border bg-muted text-sm font-medium focus:outline-none focus:border-pink-400">
            {Object.keys(ICON_MAP).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-sm text-sm">
            <Plus size={14} /> Agregar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((c) => {
          const IconComp = ICON_MAP[c.icon] ?? Cake;
          return (
            <div key={c.id} className={`bg-card rounded-3xl card-shadow border p-4 flex items-center gap-4 ${c.active ? "border-border" : "border-dashed border-border opacity-60"}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                <IconComp size={22} className="text-pink-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground font-medium">{c.products} productos</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.active ? "badge-ready" : "bg-muted text-muted-foreground"}`}>
                {c.active ? "Activa" : "Inactiva"}
              </span>
              <button onClick={() => toggle(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${c.active ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                {c.active ? "Pausar" : "Activar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
