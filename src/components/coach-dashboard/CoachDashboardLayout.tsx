import { Outlet } from "react-router-dom";
import { CoachDashboardSidebar } from "./CoachDashboardSidebar";

export default function CoachDashboardLayout() {
    return (
        <div className="flex min-h-screen w-full bg-muted/30">
            <CoachDashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
