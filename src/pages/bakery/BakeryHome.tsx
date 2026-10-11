import { Package, DollarSign, Clock, Users, Cake, Calendar, Sparkles, BarChart2, ArrowRight, Star, TrendingUp } from "lucide-react";

interface Props {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function BakeryHome({ userName, onNavigate }: Props) {
  const stats = [
    { label: "Pedidos este mes",   value: "34",     sub: "+8 vs agosto",    Icon: Package,    color: "bg-pink-500",   trend: "+31%" },
    { label: "Ingresos del mes",   value: "$18,240", sub: "+12% vs agosto", Icon: DollarSign, color: "bg-violet-500", trend: "+12%" },
    { label: "Pedidos pendientes", value: "7",       sub: "Requieren atención", Icon: Clock,  color: "bg-amber-400",  trend: null },
    { label: "Clientes activos",   value: "23",      sub: "Este mes",        Icon: Users,      color: "bg-indigo-500", trend: "+5" },
  ];

  const quickActions = [
    { Icon: Cake,     label: "Gestionar menú",    page: "menu-mgmt",       desc: "Agrega o edita productos" },
    { Icon: Calendar, label: "Ver calendario",    page: "orders-cal",       desc: "Pedidos programados" },
    { Icon: Sparkles, label: "Pedidos especiales", page: "custom-requests", desc: "Solicitudes personalizadas" },
    { Icon: BarChart2, label: "Finanzas",          page: "finances",         desc: "Ingresos y gastos" },
  ];

  const pending = [
    { id: "#1045", client: "Valentina Ruiz",  cake: "Pastel de bodas",    date: "15 Sep", employee: "Sin asignar" },
    { id: "#1043", client: "Carlos Mendoza",  cake: "Pastel de cumpleaños", date: "12 Sep", employee: "Sofía L." },
    { id: "#1044", client: "Andrea Torres",   cake: "Cupcakes x24",       date: "11 Sep", employee: "Mia R." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 space-y-8">

      {/* ── HERO ────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-violet-600 via-pink-500 to-rose-400 rounded-3xl overflow-hidden p-6 md:p-8">
        <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-16 w-36 h-36 bg-pink-300/20 rounded-full translate-y-1/3" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-semibold">Panel de gestión</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-0.5">
              Hola, {userName.split(" ")[0]}!
            </h1>
            <p className="text-white/80 text-sm mt-2 font-medium">Resumen de tu pastelería — Septiembre 2026</p>
          </div>
          <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/20 border border-white/30 rounded-2xl backdrop-blur-sm">
            <Star size={14} className="text-amber-300 fill-amber-300" />
            <span className="text-white text-sm font-bold">Plan Pro</span>
            <button onClick={() => onNavigate("subscription")} className="text-white/70 hover:text-white text-xs underline ml-1 transition-colors">Gestionar</button>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ label, value, sub, Icon, color, trend }) => (
          <div key={label} className="bg-card rounded-3xl card-shadow border border-border p-4 md:p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 md:w-11 md:h-11 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon size={18} className="text-white" />
              </div>
              {trend && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  <TrendingUp size={9} /> {trend}
                </span>
              )}
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs font-bold text-foreground mt-0.5 leading-snug">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ───────────────────────── */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ Icon, label, page, desc }) => (
            <button key={page} onClick={() => onNavigate(page)}
              className="bg-card rounded-3xl border border-border card-shadow p-4 md:p-5 text-left hover:scale-[1.03] hover:border-pink-200 transition-all group">
              <div className="w-11 h-11 bg-pink-50 border border-border rounded-2xl flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
                <Icon size={20} className="text-pink-400" />
              </div>
              <div className="font-bold text-sm text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── PENDING ORDERS ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Próximas entregas</h2>
          <button onClick={() => onNavigate("orders-mgmt")} className="flex items-center gap-1 text-sm text-pink-500 font-bold hover:text-pink-600 transition-colors">
            Ver todos <ArrowRight size={14} />
          </button>
        </div>
        <div className="bg-card rounded-3xl card-shadow border border-border overflow-hidden">
          <div className="grid grid-cols-5 gap-3 px-5 py-3 bg-muted text-xs font-bold text-muted-foreground">
            <span>Pedido</span><span className="col-span-2">Cliente / Descripción</span><span>Fecha</span><span>Empleado</span>
          </div>
          {pending.map((o, i) => (
            <div key={o.id} className={`grid grid-cols-5 gap-3 px-5 py-4 items-center ${i < pending.length - 1 ? "border-b border-border" : ""}`}>
              <span className="font-bold text-sm text-pink-500">{o.id}</span>
              <div className="col-span-2 min-w-0">
                <div className="font-bold text-sm text-foreground">{o.client}</div>
                <div className="text-xs text-muted-foreground truncate">{o.cake}</div>
              </div>
              <span className="text-sm text-muted-foreground">{o.date}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${o.employee === "Sin asignar" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                {o.employee}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
