import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Cake, ImagePlus } from "lucide-react";

const INITIAL_ITEMS = [
  { id: 1, name: "Pastel de fresa", category: "Pasteles", price: 480, active: true, desc: "Esponjoso pastel con crema de fresa y fresas frescas", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
  { id: 2, name: "Red Velvet Kawaii", category: "Pasteles", price: 520, active: true, desc: "Clásico red velvet con crema de queso decoración kawaii", image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80" },
  { id: 3, name: "Cheesecake de maracuyá", category: "Cheesecakes", price: 380, active: true, desc: "Cremoso cheesecake con coulis de maracuyá", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=80" },
  { id: 4, name: "Cupcakes de vainilla", category: "Cupcakes", price: 240, active: false, desc: "Docena de cupcakes esponjosos con betún de vainilla", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80" },
  { id: 5, name: "Pastel Galaxy", category: "Especiales", price: 650, active: true, desc: "Impresionante pastel efecto galaxia con glitters comestibles", image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&q=80" },
];

const CATEGORIES = ["Pasteles", "Cupcakes", "Cheesecakes", "Especiales"];

type Item = typeof INITIAL_ITEMS[0];

export default function MenuManagement() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: "", category: "Pasteles", price: "", desc: "", image: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditItem(null);
    setForm({ name: "", category: "Pasteles", price: "", desc: "", image: "" });
    setShowModal(true);
  }
  function openEdit(item: Item) {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, price: String(item.price), desc: item.desc, image: item.image });
    setShowModal(true);
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  function save() {
    if (!form.name.trim()) return;
    if (editItem) {
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...form, price: Number(form.price) } : i));
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form, price: Number(form.price), active: true }]);
    }
    setShowModal(false);
  }

  function toggle(id: number) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, active: !i.active } : i)); }
  function remove(id: number) { setItems((prev) => prev.filter((i) => i.id !== id)); }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Mi Menú</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">{items.filter((i) => i.active).length} productos activos</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-sm">
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`bg-card rounded-3xl card-shadow border transition-all flex flex-col ${item.active ? "border-border" : "border-dashed border-border opacity-60"}`}>
            <div className="h-36 rounded-t-3xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center shrink-0">
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <Cake size={48} className="text-pink-300" />}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-bold text-sm text-foreground">{item.name}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${item.active ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {item.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
              <div className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{item.desc}</div>
              <div className="font-display text-lg font-semibold text-pink-500 mb-3 mt-auto">${item.price}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-pink-50 text-pink-500 text-xs font-bold rounded-xl hover:bg-pink-100 transition-colors">
                  <Pencil size={12} /> Editar
                </button>
                <button onClick={() => toggle(item.id)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${item.active ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                  {item.active ? "Pausar" : "Activar"}
                </button>
                <button onClick={() => remove(item.id)} className="w-9 py-2 bg-red-50 text-red-400 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl card-shadow p-6 border border-border animate-pop max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold">{editItem ? "Editar producto" : "Nuevo producto"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Imagen del producto</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                {form.image ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <ImagePlus size={16} /> Cambiar imagen
                    </div>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full h-28 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center gap-2 text-pink-400">
                    <ImagePlus size={24} />
                    <span className="text-xs font-bold">Subir imagen</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Nombre</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre del producto"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Precio ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Descripción</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={2} placeholder="Describe tu delicia..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-border bg-muted focus:outline-none focus:border-pink-400 text-sm font-medium resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted">Cancelar</button>
                <button onClick={save} disabled={!form.name.trim()}
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md disabled:opacity-40">
                  {editItem ? "Guardar" : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
