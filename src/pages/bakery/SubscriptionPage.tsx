import { useState } from "react";
import { Star, Crown, Flower2, Check, X, Zap } from "lucide-react";

const PLANS = [
  { id: "free", name: "Gratuito", price: 0, Icon: Flower2, color: "from-pink-200 to-rose-200", headerText: "text-pink-700", commission: "Sin comisión",
    features: [
      { text: "10 pedidos al mes", included: true },
      { text: "Calendario de pedidos", included: true },
      { text: "Gestión de clientes", included: true },
      { text: "Gestión básica de pedidos", included: true },
      { text: "Control financiero", included: false },
      { text: "Estadísticas", included: false },
      { text: "Pedidos ilimitados", included: false },
      { text: "Reportes avanzados", included: false },
    ],
  },
  { id: "pro", name: "Pro", price: 199, Icon: Star, color: "from-purple-400 to-pink-400", headerText: "text-white", commission: "Sin comisión", popular: true,
    features: [
      { text: "Pedidos ilimitados", included: true },
      { text: "Calendario de pedidos", included: true },
      { text: "Control financiero", included: true },
      { text: "Estadísticas", included: true },
      { text: "Gestión de clientes", included: true },
      { text: "Diseños y personalizados", included: true },
      { text: "Reportes avanzados", included: false },
      { text: "Automatizaciones", included: false },
    ],
  },
  { id: "premium", name: "Premium", price: 299, Icon: Crown, color: "from-amber-400 to-orange-400", headerText: "text-white", commission: "5% comisión sobre ventas",
    features: [
      { text: "Todo lo de Pro", included: true },
      { text: "Reportes avanzados", included: true },
      { text: "Estadísticas premium", included: true },
      { text: "Automatizaciones", included: true },
      { text: "Soporte prioritario", included: true },
      { text: "Personalización de marca", included: true },
      { text: "API de integración", included: true },
      { text: "Exportación de datos", included: true },
    ],
  },
];

export default function SubscriptionPage() {
  const [currentPlan] = useState("pro");
  const [confirmPlan, setConfirmPlan] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Mi plan</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Administra tu suscripción de BakeFlow</p>
      </div>

      <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
          <Star size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-foreground">Plan actual: <span className="text-purple-600">Pro</span></div>
          <div className="text-sm text-muted-foreground mt-0.5">Renovación el 30 de Septiembre 2026 · $199/mes</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-foreground text-sm">20 días restantes</div>
          <div className="text-xs text-muted-foreground">Renovación automática</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const PlanIcon = plan.Icon;
          return (
            <div key={plan.id} className={`relative rounded-3xl overflow-hidden border-2 transition-all ${plan.id === currentPlan ? "border-purple-400 shadow-lg shadow-purple-100" : "border-border card-shadow hover:border-pink-200"}`}>
              {"popular" in plan && plan.popular && (
                <div className="absolute top-4 right-4 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                  <Zap size={11} /> Popular
                </div>
              )}
              {plan.id === currentPlan && (
                <div className="absolute top-4 left-4 bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <Check size={11} /> Actual
                </div>
              )}

              <div className={`bg-gradient-to-br ${plan.color} p-6 pt-12`}>
                <PlanIcon size={32} className={plan.id === "free" ? "text-pink-600 mb-2" : "text-white mb-2"} />
                <div className={`font-display text-2xl font-bold ${plan.headerText}`}>{plan.name}</div>
                <div className={plan.headerText}>
                  {plan.price === 0
                    ? <span className="font-display text-3xl font-bold">Gratis</span>
                    : <><span className="font-display text-3xl font-bold">${plan.price}</span><span className="text-sm opacity-80">/mes</span></>
                  }
                </div>
              </div>

              <div className="bg-card p-5">
                <div className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <div key={f.text} className={`flex items-center gap-2 text-sm font-medium ${f.included ? "text-foreground" : "text-muted-foreground"}`}>
                      {f.included
                        ? <Check size={14} className="text-green-500 shrink-0" />
                        : <X size={14} className="text-muted-foreground shrink-0" />
                      }
                      <span className={!f.included ? "line-through" : ""}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-semibold mb-4 bg-muted rounded-xl px-3 py-2">
                  {plan.commission}
                </div>
                {plan.id !== currentPlan ? (
                  <button onClick={() => setConfirmPlan(plan.id)}
                    className={`w-full py-3 font-bold rounded-2xl text-sm transition-all active:scale-95 ${plan.id === "free" ? "border-2 border-border text-foreground hover:bg-muted" : "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md hover:shadow-lg"}`}>
                    Cambiar a {plan.name}
                  </button>
                ) : (
                  <button className="w-full py-3 bg-muted text-muted-foreground font-bold rounded-2xl text-sm cursor-default flex items-center justify-center gap-2">
                    <Check size={14} /> Plan actual
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {confirmPlan && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl card-shadow-lg p-6 border border-border animate-pop text-center">
            {(() => { const p = PLANS.find((x) => x.id === confirmPlan)!; const I = p.Icon; return (
              <>
                <div className={`w-16 h-16 bg-gradient-to-br ${p.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <I size={28} className={confirmPlan === "free" ? "text-pink-600" : "text-white"} />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">Cambiar a plan {p.name}</h2>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  {confirmPlan === "free" ? "Perderás acceso a funciones Pro al final de tu ciclo actual." : `Se realizará un cobro de $${p.price}/mes a partir de hoy.`}
                </p>
              </>
            ); })()}
            <div className="flex gap-3">
              <button onClick={() => setConfirmPlan(null)} className="flex-1 py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted">Cancelar</button>
              <button onClick={() => setConfirmPlan(null)} className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-md">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
