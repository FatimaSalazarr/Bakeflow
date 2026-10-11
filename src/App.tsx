import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import CustomerApp from "./pages/customer/CustomerApp";
import BakeryApp from "./pages/bakery/BakeryApp";
import EmployeeApp from "./pages/employee/EmployeeApp";
import AdminApp from "./pages/admin/AdminApp";

type Role = "customer" | "bakery" | "employee" | "admin";

interface Session { role: Role; name: string; }

export type CustomRequestStatus = "pending" | "awaiting_client" | "confirmed" | "rejected" | "declined";

export interface SharedRequest {
  id: string; client: string; theme: string; size: string; flavor: string;
  frosting: string; decorations: string; message: string; date: string;
  persons: string; budget: string; notes: string; refImage?: string;
  status: CustomRequestStatus; quotedPrice?: string;
}

const INITIAL_REQUESTS: SharedRequest[] = [
  {
    id: "#C021", client: "Luna García", theme: "Unicornio kawaii", size: "Grande",
    flavor: "Red Velvet", frosting: "Crema de queso",
    decorations: "Figuras de fondant, Glitter comestible",
    message: "¡Feliz quinceañera Valentina!", date: "20 Sep 2026",
    persons: "30", budget: "$800 - $1,000",
    notes: "Sin nuez. Color base blanco con detalles morados.",
    status: "pending",
  },
  {
    id: "#C020", client: "Luna García", theme: "Fútbol", size: "Mediano",
    flavor: "Chocolate", frosting: "Ganache de chocolate",
    decorations: "Figuras de fondant", message: "¡Cumpleaños feliz Diego!",
    date: "14 Sep 2026", persons: "15", budget: "$500 - $650",
    notes: "Colores: verde y blanco",
    status: "awaiting_client", quotedPrice: "620",
  },
  {
    id: "#C019", client: "Luna García", theme: "Jardín de flores", size: "Mediano",
    flavor: "Vainilla", frosting: "Crema de mantequilla",
    decorations: "Flores comestibles, Perlas de azúcar",
    message: "Con amor, para mamá", date: "8 Sep 2026",
    persons: "12", budget: "$450", notes: "",
    status: "confirmed", quotedPrice: "450",
  },
];

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sharedRequests, setSharedRequests] = useState<SharedRequest[]>(INITIAL_REQUESTS);

  function handleLogin(role: Role, name: string) { setSession({ role, name }); }
  function handleLogout() { setSession(null); }

  if (!session) return <AuthPage onLogin={handleLogin} />;

  if (session.role === "customer")
    return <CustomerApp userName={session.name} onLogout={handleLogout}
      customRequests={sharedRequests} onUpdateRequests={setSharedRequests} />;

  if (session.role === "bakery")
    return <BakeryApp userName={session.name} onLogout={handleLogout}
      customRequests={sharedRequests} onUpdateRequests={setSharedRequests} />;

  if (session.role === "employee")
    return <EmployeeApp userName={session.name} onLogout={handleLogout} />;

  if (session.role === "admin")
    return <AdminApp userName={session.name} onLogout={handleLogout} />;

  return null;
}
