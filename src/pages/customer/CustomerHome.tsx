import { Cake, Sparkles, Package, User, ArrowRight, Star, ShoppingCart, Gift, Percent, Trophy } from "lucide-react";

interface Props {
  userName: string;
  onNavigate: (page: string) => void;
}

const FEATURED = [
  { name: "Pastel de fresa", price: "$320", rating: 4.9, img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
  { name: "Red Velvet Kawaii", price: "$480", rating: 5.0, img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80" },
  { name: "Cheesecake de maracuyá", price: "$380", rating: 4.8, img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=80" },
];

export default function CustomerHome({ userName, onNavigate }: Props) {
  const first = userName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 space-y-8">

      {/* ── HERO BANNER ─────────────────────────── */}
      <div className="relative bg-gradient-to-br from-pink-500 via-rose-400 to-violet-500 rounded-3xl overflow-hidden p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-12 w-32 h-32 bg-violet-400/30 rounded-full translate-y-1/3" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-semibold">{greeting},</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-0.5">{first}!</h1>
            <p className="text-white/80 text-sm mt-2 font-medium">¿Qué delicia quieres ordenar hoy?</p>
          </div>
          <button onClick={() => onNavigate("menu")}
            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl border border-white/30 transition-all text-sm backdrop-blur-sm">
            <ShoppingCart size={16} /> Ver menú
          </button>
        </div>
      </div>

      {/* ── QUICK ACTIONS ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { Icon: Cake,     label: "Ver menú",       page: "menu",         color: "bg-pink-500" },
          { Icon: Sparkles, label: "Pastel especial", page: "custom-order", color: "bg-violet-500" },
          { Icon: Package,  label: "Mis pedidos",     page: "my-orders",    color: "bg-indigo-500" },
          { Icon: User,     label: "Mi perfil",       page: "profile",      color: "bg-pink-400" },
        ].map(({ Icon, label, page, color }) => (
          <button key={page} onClick={() => onNavigate(page)}
            className="bg-card rounded-3xl card-shadow border border-border p-4 md:p-5 flex flex-col items-center gap-3 hover:scale-[1.03] hover:card-shadow-lg transition-all group">
            <div className={`w-12 h-12 md:w-14 md:h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
              <Icon size={22} className="text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold text-foreground text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* ── FEATURED CAKES ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Más populares</h2>
          <button onClick={() => onNavigate("menu")} className="flex items-center gap-1 text-sm text-pink-500 font-bold hover:text-pink-600 transition-colors">
            Ver todos <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED.map((cake) => (
            <div key={cake.name} className="bg-card rounded-3xl card-shadow border border-border overflow-hidden hover:scale-[1.02] transition-transform group">
              <div className="h-36 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-100">
                <img src={cake.img} alt={cake.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div className="p-4">
                <div className="font-bold text-sm text-foreground mb-1">{cake.name}</div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className={i < Math.floor(cake.rating) ? "text-amber-400 fill-amber-400" : "text-border fill-border"} />
                  ))}
                  <span className="text-xs text-muted-foreground font-medium ml-1">{cake.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-semibold text-pink-500">{cake.price}</span>
                  <button onClick={() => onNavigate("menu")}
                    className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1">
                    <ShoppingCart size={11} /> Ordenar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROMO BANNER ────────────────────────── */}
      <div className="relative bg-gradient-to-br from-violet-500 via-violet-400 to-pink-400 rounded-3xl overflow-hidden p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-6 w-24 h-24 bg-pink-300/20 rounded-full translate-y-1/2" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Percent size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-display text-xl font-bold leading-tight">20% de descuento</div>
              <div className="text-white/80 text-sm font-medium">En tu primer pastel personalizado esta semana</div>
            </div>
          </div>
          <button onClick={() => onNavigate("custom-order")}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-violet-600 font-bold rounded-2xl text-sm hover:bg-violet-50 transition-colors shadow-md">
            Pedir ahora <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── LOYALTY + REFER ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Loyalty points */}
        <div className="bg-card rounded-3xl card-shadow border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-foreground text-sm">Mis BakePoints</div>
              <div className="text-xs text-muted-foreground">Programa de recompensas</div>
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-amber-500 mb-1">320 pts</div>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div className="bg-amber-400 h-2 rounded-full" style={{ width: "64%" }} />
          </div>
          <div className="text-xs text-muted-foreground font-medium">180 pts más para tu próxima recompensa</div>
          <button onClick={() => onNavigate("menu")}
            className="mt-3 w-full py-2 bg-amber-100 text-amber-600 font-bold text-xs rounded-xl hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5">
            <ShoppingCart size={12} /> Ganar más puntos
          </button>
        </div>

        {/* Referral program */}
        <div className="bg-card rounded-3xl card-shadow border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center shrink-0">
              <Gift size={18} className="text-pink-500" />
            </div>
            <div>
              <div className="font-bold text-foreground text-sm">Recomienda BakeFlow</div>
              <div className="text-xs text-muted-foreground">Tú y tu amigo ganan</div>
            </div>
          </div>
          <div className="text-sm text-foreground font-medium mb-1">Comparte tu código y ambos reciben</div>
          <div className="font-display text-2xl font-bold text-pink-500 mb-3">$50 de crédito</div>
          <div className="bg-muted rounded-2xl px-4 py-2.5 flex items-center justify-between mb-3">
            <span className="font-mono text-sm font-bold text-foreground tracking-widest">LUNA2026</span>
            <button className="text-xs text-pink-500 font-bold hover:text-pink-600 transition-colors">Copiar</button>
          </div>
          <div className="text-xs text-muted-foreground font-medium">3 amigos referidos este mes</div>
        </div>
      </div>
    </div>
  );
}
