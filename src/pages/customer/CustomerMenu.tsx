import { useState } from "react";
import { ShoppingCart, X, Cake, CreditCard, Lock, ChevronLeft, CheckCircle2, Star, SlidersHorizontal, ChevronDown } from "lucide-react";

const CATEGORIES = ["Todos", "Pasteles", "Cupcakes", "Cheesecakes", "Especiales"];

const MENU_ITEMS = [
  { id: 1, name: "Pastel de fresa", category: "Pasteles", price: 480, desc: "Esponjoso pastel con crema de fresa y fresas frescas", rating: 4.9, sizes: ["Chico", "Mediano", "Grande"], image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
  { id: 2, name: "Red Velvet Kawaii", category: "Pasteles", price: 520, desc: "Clásico red velvet con crema de queso decoración kawaii", rating: 5.0, sizes: ["Mediano", "Grande"], image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80" },
  { id: 3, name: "Pastel de 3 leches", category: "Pasteles", price: 320, desc: "Tradicional pastel de 3 leches con crema batida", rating: 4.8, sizes: ["Chico", "Mediano", "Grande"], image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
  { id: 4, name: "Cheesecake de maracuyá", category: "Cheesecakes", price: 380, desc: "Cremoso cheesecake con coulis de maracuyá", rating: 4.8, sizes: ["Chico", "Mediano"], image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=80" },
  { id: 5, name: "Cheesecake NY", category: "Cheesecakes", price: 420, desc: "Auténtico cheesecake estilo Nueva York", rating: 4.7, sizes: ["Chico", "Mediano", "Grande"], image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80" },
  { id: 6, name: "Cupcakes de vainilla", category: "Cupcakes", price: 240, desc: "Docena de cupcakes esponjosos con betún de vainilla", rating: 4.9, sizes: ["Pack 6", "Pack 12"], image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80" },
  { id: 7, name: "Cupcakes Arcoíris", category: "Cupcakes", price: 280, desc: "Cupcakes multicolor con betún de colores pastel", rating: 5.0, sizes: ["Pack 6", "Pack 12"], image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80" },
  { id: 8, name: "Pastel Galaxy", category: "Especiales", price: 650, desc: "Impresionante pastel efecto galaxia con glitters comestibles", rating: 5.0, sizes: ["Mediano", "Grande"], image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&q=80" },
  { id: 9, name: "Pastel Floral", category: "Especiales", price: 580, desc: "Decorado con flores comestibles de temporada", rating: 4.9, sizes: ["Mediano", "Grande"], image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" },
];

function formatCard(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

interface Props {
  cart: { id: number; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ id: number; qty: number }[]>>;
  showCart: boolean;
  setShowCart: (v: boolean) => void;
}

export default function CustomerMenu({ cart, setCart, showCart, setShowCart }: Props) {
  const [category, setCategory] = useState("Todos");
  const [selectedSize, setSelectedSize] = useState<Record<number, string>>({});
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "done">("cart");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const filtered = MENU_ITEMS.filter((i) => {
    const catMatch = category === "Todos" || category === "Otros" || i.category === category;
    const minOk = !priceMin || i.price >= Number(priceMin);
    const maxOk = !priceMax || i.price <= Number(priceMax);
    return catMatch && (category !== "Otros" || (minOk && maxOk));
  });
  const cartTotal = cart.reduce((sum, c) => {
    const item = MENU_ITEMS.find((i) => i.id === c.id);
    return sum + (item?.price || 0) * c.qty;
  }, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(id: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
  }

  function openCart() { setCheckoutStep("cart"); setShowCart(true); }
  function applyPriceFilter() { setShowPriceFilter(false); }
  function clearPriceFilter() { setPriceMin(""); setPriceMax(""); setShowPriceFilter(false); setCategory("Todos"); }

  function placeOrder() {
    setCheckoutStep("done");
    setTimeout(() => {
      setCart([]);
      setCardForm({ number: "", name: "", expiry: "", cvv: "" });
      setShowCart(false);
      setCheckoutStep("cart");
    }, 3000);
  }

  const cardValid = cardForm.number.replace(/\s/g, "").length === 16 && cardForm.name.trim().length > 2 && cardForm.expiry.length === 5 && cardForm.cvv.length >= 3;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Nuestro Menú</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Elige tu pastel favorito</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => { setCategory(c); setShowPriceFilter(false); }}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${category === c ? "bg-pink-500 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:border-pink-200 hover:text-foreground"}`}>
            {c}
          </button>
        ))}
        <button onClick={() => { setCategory("Otros"); setShowPriceFilter(v => !v); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${category === "Otros" ? "bg-pink-500 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:border-pink-200 hover:text-foreground"}`}>
          <SlidersHorizontal size={13} /> Otros
          <ChevronDown size={12} className={`transition-transform ${showPriceFilter ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Price filter panel */}
      {showPriceFilter && (
        <div className="mb-5 bg-pink-50 border border-pink-200 rounded-2xl p-4 animate-fade-up">
          <div className="text-xs font-bold text-pink-600 mb-3 flex items-center gap-1.5">
            <SlidersHorizontal size={12} /> Filtrar por precio
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Mín $</label>
              <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0"
                className="w-24 px-3 py-2 rounded-xl border-2 border-pink-200 bg-white text-sm font-medium focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Máx $</label>
              <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="1000"
                className="w-24 px-3 py-2 rounded-xl border-2 border-pink-200 bg-white text-sm font-medium focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
            <button onClick={applyPriceFilter}
              className="px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-xl hover:bg-pink-600 transition-colors">
              Aplicar
            </button>
            <button onClick={clearPriceFilter}
              className="px-4 py-2 border border-pink-300 text-pink-500 text-xs font-bold rounded-xl hover:bg-pink-50 transition-colors">
              Limpiar
            </button>
          </div>
        </div>
      )}
      {!showPriceFilter && <div className="mb-4" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-card rounded-3xl card-shadow border border-border overflow-hidden flex flex-col">
            <div className="h-40 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center shrink-0">
              {!imgErrors[item.id]
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    onError={() => setImgErrors((e) => ({ ...e, [item.id]: true }))} />
                : <Cake size={56} className="text-pink-300" />}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="font-bold text-foreground">{item.name}</div>
              <div className="text-xs text-muted-foreground mt-1 mb-2 leading-relaxed line-clamp-2">{item.desc}</div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-foreground">{item.rating}</span>
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {item.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize((prev) => ({ ...prev, [item.id]: s }))}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${selectedSize[item.id] === s ? "border-pink-400 bg-pink-50 text-pink-600" : "border-border text-muted-foreground hover:border-pink-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto mb-3">
                <span className="font-display text-xl font-semibold text-pink-500">${item.price}</span>
              </div>
              <button onClick={() => addToCart(item.id)}
                className="w-full py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-sm font-bold rounded-2xl hover:from-pink-500 hover:to-pink-600 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                <ShoppingCart size={14} />
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart / Checkout modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl card-shadow p-6 border border-border animate-pop max-h-[90vh] overflow-y-auto">

            {/* STEP: cart */}
            {checkoutStep === "cart" && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <ShoppingCart size={20} className="text-pink-500" /> Tu carrito
                  </h2>
                  <button onClick={() => setShowCart(false)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <ShoppingCart size={40} className="mx-auto mb-3 text-pink-200" />
                    <div className="font-medium">Tu carrito está vacío</div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-5 max-h-56 overflow-y-auto">
                      {cart.map((c) => {
                        const item = MENU_ITEMS.find((i) => i.id === c.id)!;
                        return (
                          <div key={c.id} className="flex items-center gap-3 p-3 bg-muted rounded-2xl">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-100 flex items-center justify-center shrink-0">
                              {!imgErrors[item.id]
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={() => setImgErrors((e) => ({ ...e, [item.id]: true }))} />
                                : <Cake size={20} className="text-pink-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-foreground truncate">{item.name}</div>
                              <div className="text-xs text-muted-foreground">x{c.qty} · ${item.price * c.qty}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setCart((prev) => prev.map((ci) => ci.id === c.id ? { ...ci, qty: Math.max(1, ci.qty - 1) } : ci))}
                                className="w-6 h-6 rounded-lg bg-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-pink-100">−</button>
                              <span className="w-5 text-center text-xs font-bold">{c.qty}</span>
                              <button onClick={() => setCart((prev) => prev.map((ci) => ci.id === c.id ? { ...ci, qty: ci.qty + 1 } : ci))}
                                className="w-6 h-6 rounded-lg bg-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-pink-100">+</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-border pt-4 mb-4 flex justify-between items-center">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-display text-xl font-semibold text-pink-500">${cartTotal.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setCheckoutStep("payment")}
                      className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                      <CreditCard size={16} /> Proceder al pago
                    </button>
                  </>
                )}
              </>
            )}

            {/* STEP: payment */}
            {checkoutStep === "payment" && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setCheckoutStep("cart")} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <ChevronLeft size={16} />
                  </button>
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2 flex-1">
                    <CreditCard size={20} className="text-pink-500" /> Pago con tarjeta
                  </h2>
                  <button onClick={() => setShowCart(false)} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>

                {/* Card visual */}
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
                  <span className="font-display text-lg font-semibold text-pink-500">${cartTotal.toLocaleString()}</span>
                </div>

                <button onClick={placeOrder} disabled={!cardValid}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
                  <Lock size={15} /> Pagar ${cartTotal.toLocaleString()}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <Lock size={10} /> Pago seguro y encriptado
                </p>
              </>
            )}

            {/* STEP: done */}
            {checkoutStep === "done" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">¡Pago exitoso!</h2>
                <p className="text-muted-foreground text-sm font-medium">Tu pedido fue confirmado. Te notificaremos cuando esté listo.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
