import { Store, Users, Star, DollarSign, BarChart2, CreditCard, ArrowRight, TrendingUp } from "lucide-react";

interface Props { onNavigate: (page: string) => void; }

const REVENUE_DATA = [
  { month: "Abr", value: 31200 },
  { month: "May", value: 35800 },
  { month: "Jun", value: 38100 },
  { month: "Jul", value: 36500 },
  { month: "Ago", value: 40900 },
  { month: "Sep", value: 42180 },
];

const SUBS_DATA = [
  { label: "Premium", count: 78, color: "bg-amber-400" },
  { label: "Pro", count: 111, color: "bg-violet-400" },
  { label: "Gratuito", count: 59, color: "bg-pink-300" },
];

const BAKERY_GROWTH = [
  { month: "Abr", value: 210 },
  { month: "May", value: 218 },
  { month: "Jun", value: 224 },
  { month: "Jul", value: 231 },
  { month: "Ago", value: 239 },
  { month: "Sep", value: 248 },
];

const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));
const maxBakeries = Math.max(...BAKERY_GROWTH.map((d) => d.value));
const minBakeries = Math.min(...BAKERY_GROWTH.map((d) => d.value));
const subsTotal = SUBS_DATA.reduce((s, d) => s + d.count, 0);

export default function AdminHome({ onNavigate }: Props) {
  const stats = [
    { label: "Pastelerías registradas", value: "248", sub: "+12 este mes", Icon: Store, color: "bg-pink-500" },
    { label: "Usuarios totales", value: "4,821", sub: "+89 esta semana", Icon: Users, color: "bg-violet-500" },
    { label: "Suscripciones activas", value: "189", sub: "76% Pro o Premium", Icon: Star, color: "bg-amber-400" },
    { label: "Ingresos mensuales", value: "$42,180", sub: "+18% vs agosto", Icon: DollarSign, color: "bg-indigo-500" },
  ];

  const recent = [
    { name: "Dulcería Rosita", plan: "Pro", status: "active", location: "CDMX", date: "8 Sep" },
    { name: "Pastelería Luna", plan: "Premium", status: "active", location: "Guadalajara", date: "6 Sep" },
    { name: "Sweet Dreams", plan: "Gratuito", status: "suspended", location: "Monterrey", date: "4 Sep" },
    { name: "Cakes & More", plan: "Pro", status: "active", location: "Puebla", date: "3 Sep" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Panel BakeFlow</h1>
        <p className="text-muted-foreground mt-1 font-medium">Resumen general de la plataforma — Septiembre 2026</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, Icon, color }) => (
          <div key={label} className="bg-card rounded-3xl card-shadow border border-border p-5">
            <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs font-bold text-foreground mt-0.5">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { Icon: Store, label: "Pastelerías", page: "bakeries" },
          { Icon: Star, label: "Suscripciones", page: "subscriptions" },
          { Icon: CreditCard, label: "Transacciones", page: "transactions" },
          { Icon: BarChart2, label: "Estadísticas", page: "stats" },
        ].map(({ Icon, label, page }) => (
          <button key={page} onClick={() => onNavigate(page)}
            className="bg-card rounded-3xl border border-border card-shadow p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center">
              <Icon size={20} className="text-pink-400" />
            </div>
            <span className="text-xs font-bold text-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-card rounded-3xl card-shadow border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Ingresos mensuales</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1.5 rounded-xl">
              <TrendingUp size={12} /> +18% este mes
            </div>
          </div>
          <div className="flex items-end gap-3 h-36">
            {REVENUE_DATA.map((d) => {
              const pct = (d.value / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground">${(d.value / 1000).toFixed(0)}k</span>
                  <div className="w-full flex flex-col justify-end bg-muted rounded-xl overflow-hidden" style={{ height: "96px" }}>
                    <div className="w-full bg-pink-500 rounded-t-xl" style={{ height: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription breakdown */}
        <div className="bg-card rounded-3xl card-shadow border border-border p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-1">Suscripciones</h2>
          <p className="text-xs text-muted-foreground font-medium mb-5">Distribución por plan</p>
          <div className="space-y-4">
            {SUBS_DATA.map((s) => {
              const pct = Math.round((s.count / subsTotal) * 100);
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-xs font-bold text-foreground">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{s.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground font-medium">Total activas</div>
            <div className="font-display text-2xl font-bold text-foreground">{subsTotal}</div>
          </div>
        </div>
      </div>

      {/* Bakeries growth */}
      <div className="bg-card rounded-3xl card-shadow border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Crecimiento de pastelerías</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Pastelerías registradas por mes</p>
          </div>
          <button onClick={() => onNavigate("bakeries")} className="flex items-center gap-1 text-sm text-pink-500 font-bold hover:text-pink-600">
            Ver todas <ArrowRight size={14} />
          </button>
        </div>
        <div className="flex items-end gap-3 h-24">
          {BAKERY_GROWTH.map((d) => {
            const range = maxBakeries - minBakeries || 1;
            const pct = ((d.value - minBakeries) / range) * 70 + 30;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground">{d.value}</span>
                <div className="w-full flex flex-col justify-end bg-muted rounded-xl overflow-hidden" style={{ height: "60px" }}>
                  <div className="w-full bg-violet-500 rounded-t-xl" style={{ height: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent bakeries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Pastelerías recientes</h2>
          <button onClick={() => onNavigate("bakeries")} className="flex items-center gap-1 text-sm text-pink-500 font-bold hover:text-pink-600">
            Ver todas <ArrowRight size={14} />
          </button>
        </div>
        <div className="bg-card rounded-3xl card-shadow border border-border overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-muted text-xs font-bold text-muted-foreground">
            <span className="col-span-2">Pastelería</span><span>Plan</span><span>Estado</span><span>Registro</span>
          </div>
          {recent.map((b, i) => (
            <div key={b.name} className={`grid grid-cols-5 gap-4 px-5 py-4 items-center ${i < recent.length - 1 ? "border-b border-border" : ""}`}>
              <div className="col-span-2">
                <div className="font-bold text-sm text-foreground">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.location}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${b.plan === "Premium" ? "bg-amber-50 text-amber-700" : b.plan === "Pro" ? "bg-purple-50 text-purple-700" : "bg-muted text-muted-foreground"}`}>
                {b.plan}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${b.status === "active" ? "badge-ready" : "badge-cancelled"}`}>
                {b.status === "active" ? "Activa" : "Suspendida"}
              </span>
              <span className="text-sm text-muted-foreground">{b.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
