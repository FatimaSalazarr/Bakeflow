import { useState } from "react";
import { Package, CheckCircle2, PartyPopper, Tag, Bell } from "lucide-react";

const NOTIFS = [
  { id: 1, Icon: Package, title: "Tu pastel está en preparación", desc: "El pedido #1042 comenzó a prepararse.", time: "Hace 2 horas", read: false, type: "order" },
  { id: 2, Icon: CheckCircle2, title: "Pedido listo para recoger", desc: "Tu pedido #1038 está listo. Pasa a recogerlo.", time: "Hace 1 día", read: false, type: "order" },
  { id: 3, Icon: PartyPopper, title: "Pedido entregado", desc: "Los cupcakes #1031 fueron entregados con éxito.", time: "Hace 7 días", read: true, type: "order" },
  { id: 4, Icon: Tag, title: "Oferta especial para ti", desc: "10% de descuento en tu próximo pastel personalizado.", time: "Hace 2 días", read: false, type: "promo" },
  { id: 5, Icon: Bell, title: "Nuevo menú disponible", desc: "Dulcería Rosita agregó pasteles de temporada de otoño.", time: "Hace 3 días", read: true, type: "news" },
];

export default function CustomerNotifications() {
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
            className="text-sm text-pink-500 font-bold hover:text-pink-600">
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div key={n.id} onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-4 p-4 rounded-3xl border cursor-pointer transition-all hover:scale-[1.01] ${!n.read ? "bg-pink-50 border-pink-200 card-shadow" : "bg-card border-border"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!n.read ? "bg-white shadow-sm" : "bg-muted"}`}>
              <n.Icon size={20} className={!n.read ? "text-pink-500" : "text-muted-foreground"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{n.time}</div>
            </div>
            {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
