 import { Outlet } from "react-router-dom";
 import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
 import { DashboardSidebar } from "./DashboardSidebar";
 
 export default function DashboardLayout() {
   return (
     <SidebarProvider>
       <div className="flex min-h-screen w-full">
         <DashboardSidebar />
         <SidebarInset className="flex-1">
           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-6 md:hidden">
             <SidebarTrigger />
           </header>
           <main className="flex-1 bg-muted/40">
             <Outlet />
           </main>
         </SidebarInset>
       </div>
     </SidebarProvider>
   );
 }