import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMobileHeader } from "./DashboardMobileHeader";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardMobileHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
