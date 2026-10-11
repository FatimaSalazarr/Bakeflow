import { useState } from "react";
import { TrendingUp, Lock, DollarSign, Star, Flower2, Crown, Filter } from "lucide-react";

const ALL_DATA: Record<string, { month: string; revenue: number; orders: number; bakeries: number }[]> = {
  "2025": [
    { month: "Jul", revenue: 18000, orders: 1420, bakeries: 98 },
    { month: "Ago", revenue: 21000, orders: 1580, bakeries: 110 },
    { month: "Sep", revenue: 23500, orders: 1720, bakeries: 125 },
    { month: "Oct", revenue: 25000, orders: 1900, bakeries: 140 },
    { month: "Nov", revenue: 27000, orders: 2100, bakeries: 158 },
    { month: "Dic", revenue: 31000, orders: 2500, bakeries: 172 },
  ],
  "2026": [
    { month: "Abr", revenue: 28000, orders: 2180, bakeries: 194 },
    { month: "May", revenue: 31000, orders: 2420, bakeries: 210 },
    { month: "Jun", revenue: 35000, orders: 2680, bakeries: 228 },
    { month: "Jul", revenue: 38000, orders: 2930, bakeries: 242 },
    { month: "Ago", revenue: 39500, orders: 3100, bakeries: 248 },
    { month: "Sep", revenue: 42180, orders: 3340, bakeries: 258 },
  ],
};

const METRIC_OPTIONS = [
  { key: "revenue", label: "Ingresos", prefix: "$", format: (v: number) => `${(v / 1000).toFixed(0)}k` },
  { key: "orders",  label: "Pedidos",  prefix: "",  format: (v: number) => `${(v / 1000).toFixed(1)}k` },
  { key: "bakeries",label: "Pastelerías", prefix: "", format: (v: number) => String(v) },
];

export default function AdminStats() {
  const [year, setYear] = useState("2026");
  const [metric, setMetric] = useState("revenue");

  const data = ALL_DATA[year];
  const m = METRIC_OPTIONS.find(o => o.key === metric)!;
  const values = data.map(d => d[metric as keyof typeof d] as number);
  const maxVal = Math.max(...values);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Estadísticas</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Tendencias de crecimiento de BakeFlow</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tasa de conversión", value: "24%",  sub: "Gratuito → Pro", Icon: TrendingUp },
          { label: "Retención mensual",  value: "92%",  sub: "Suscripciones",  Icon: Lock },
          { label: "Ticket promedio",    value: "$248", sub: "Por pedido",      Icon: DollarSign },
          { label: "NPS Score",          value: "78",   sub: "Muy bueno",       Icon: Star },
        ].map(({ label, value, sub, Icon }) => (
          <div key={label} className="bg-card rounded-3xl card-shadow border border-border p-5">
            <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center mb-2">
              <Icon size={18} className="text-pink-400" />
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs font-bold text-foreground mt-0.5">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl card-shadow border border-border p-6 mb-6">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign size={18} className="text-pink-400" /> Tendencia mensual
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Filter size={12} /> Filtros:
            </div>
            {/* Year filter */}
            <div className="flex bg-muted rounded-xl p-0.5 gap-0.5">
              {["2025", "2026"].map(y => (
                <button key={y} onClick={() => setYear(y)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${year === y ? "bg-pink-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {y}
                </button>
              ))}
            </div>
            {/* Metric filter */}
            <div className="flex bg-muted rounded-xl p-0.5 gap-0.5">
              {METRIC_OPTIONS.map(o => (
                <button key={o.key} onClick={() => setMetric(o.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${metric === o.key ? "bg-pink-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3 h-48">
          {data.map((d, i) => {
            const val = values[i];
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-muted-foreground">{m.prefix}{m.format(val)}</div>
                <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                  <div className="w-full bg-pink-500 hover:bg-pink-600 rounded-t-xl transition-all"
                    style={{ height: `${(val / maxVal) * 100}%` }} />
                </div>
                <div className="text-xs font-bold text-foreground">{d.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { plan: "Gratuito", count: 59, pct: 24, color: "bg-pink-300", Icon: Flower2 },
          { plan: "Pro",      count: 131, pct: 53, color: "bg-violet-400", Icon: Star },
          { plan: "Premium",  count: 58, pct: 23, color: "bg-amber-400", Icon: Crown },
        ].map(({ plan, count, pct, color, Icon }) => (
          <div key={plan} className="bg-card rounded-3xl card-shadow border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-muted-foreground" />
                <span className="font-bold text-foreground">{plan}</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="text-sm text-muted-foreground font-medium">{count} pastelerías</div>
          </div>
        ))}
      </div>
    </div>
  );
}
