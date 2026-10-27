import { useState } from "react";
import Layout from "../../components/Layout";
import BakeryHome from "./BakeryHome";
import MenuManagement from "./MenuManagement";
import OrdersCalendar from "./OrdersCalendar";
import OrdersManagement from "./OrdersManagement";
import CustomRequests from "./CustomRequests";
import EmployeeManagement from "./EmployeeManagement";
import Finances from "./Finances";
import SubscriptionPage from "./SubscriptionPage";
import BakeryIncidents from "./BakeryIncidents";
import BakeryProfile from "./BakeryProfile";
import BakeryCategories from "../admin/AdminCategories";
import BakeryPOS from "./BakeryPOS";
import type { SharedRequest } from "../../App";

interface Props {
  userName: string;
  onLogout: () => void;
  customRequests: SharedRequest[];
  onUpdateRequests: (reqs: SharedRequest[]) => void;
}

export default function BakeryApp({ userName, onLogout, customRequests, onUpdateRequests }: Props) {
  const [page, setPage] = useState("home");

  const pages: Record<string, React.ReactNode> = {
    home: <BakeryHome userName={userName} onNavigate={setPage} />,
    pos: <BakeryPOS />,
    "menu-mgmt": <MenuManagement />,
    "orders-cal": <OrdersCalendar />,
    "orders-mgmt": <OrdersManagement />,
    "custom-requests": <CustomRequests customRequests={customRequests} onUpdateRequests={onUpdateRequests} />,
    employees: <EmployeeManagement />,
    finances: <Finances />,
    subscription: <SubscriptionPage />,
    incidents: <BakeryIncidents />,
    categories: <BakeryCategories />,
    profile: <BakeryProfile userName={userName} onNavigate={setPage} />,
  };

  const pendingCount = customRequests.filter(r => r.status === "pending").length;

  return (
    <Layout role="bakery" userName={userName} activePage={page} onNavigate={setPage} onLogout={onLogout} notifications={pendingCount}>
      {pages[page] ?? pages["home"]}
    </Layout>
  );
}