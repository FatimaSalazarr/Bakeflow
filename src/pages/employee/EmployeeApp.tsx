import { useState } from "react";
import Layout from "../../components/Layout";
import EmployeeHome from "./EmployeeHome";
import EmployeeTasks from "./EmployeeTasks";
import EmployeeCalendar from "./EmployeeCalendar";
import EmployeeNotifications from "./EmployeeNotifications";
import EmployeeProfile from "./EmployeeProfile";

interface Props {
  userName: string;
  onLogout: () => void;
}

export default function EmployeeApp({ userName, onLogout }: Props) {
  const [page, setPage] = useState("calendar");

  const pages: Record<string, React.ReactNode> = {
    home: <EmployeeHome userName={userName} onNavigate={setPage} />,
    "my-tasks": <EmployeeTasks />,
    calendar: <EmployeeCalendar onNavigate={setPage} />,
    notifications: <EmployeeNotifications />,
    profile: <EmployeeProfile userName={userName} />,
  };

  return (
    <Layout role="employee" userName={userName} activePage={page} onNavigate={setPage} onLogout={onLogout} notifications={2}>
      {pages[page] || pages["calendar"]}
    </Layout>
  );
}
