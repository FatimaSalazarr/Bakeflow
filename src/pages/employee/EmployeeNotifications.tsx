import { useState } from "react";
import { Package, AlertTriangle, CheckCircle2, Star } from "lucide-react";

const NOTIFS = [
  { id: 1, Icon: Package, title: "Nuevo pedido asignado", desc: "Se te asignó el pedido #1048 - Cupcakes rainbow para el 25 Sep.", time: "Hace 30 min", read: false },
  { id: 2, Icon: AlertTriangle, title: "Pedido urgente", desc: "El pedido #1044 vence mañana. Por favor confirma que está en progreso.", time: "Hace 2 horas", read: false },
  { id: 3, Icon: CheckCircle2, title: "Pedido marcado como entregado", desc: "El pedido #1038 fue marcado como entregado por la pastelería.", time: "Hace 1 día", read: true },
  { id: 4, Icon: Star, title: "Buen trabajo", desc: "Completaste 5 pedidos esta semana. ¡Sigue así!", time: "Hace 3 días", read: true },
];

export default function EmployeeNotifications() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Notificaciones</h1>
          {unread > 0 && <p className="text-muted-foreground text-sm mt-1 font-medium">{unread} sin leer</p>}
        </div>
        {unread > 0 && (
          <button onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="text-sm text-indigo-500 font-bold">Marcar todas como leídas</button>
        )}
      </div>
      <div className="space-y-3">
        {notifs.map((n) => (
          <div key={n.id} onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-4 p-4 rounded-3xl border cursor-pointer transition-all hover:scale-[1.01] ${!n.read ? "bg-indigo-50 border-indigo-200 card-shadow" : "bg-card border-border"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!n.read ? "bg-white shadow-sm" : "bg-muted"}`}>
              <n.Icon size={20} className={!n.read ? "text-indigo-500" : "text-muted-foreground"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{n.time}</div>
            </div>
            {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
