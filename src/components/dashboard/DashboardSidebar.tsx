 import { Home, Search, Calendar, Heart, Settings, LogOut } from "lucide-react";
 import { NavLink } from "@/components/NavLink";
 import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
   useSidebar,
 } from "@/components/ui/sidebar";
 
 const mainNavItems = [
   { title: "Overview", url: "/dashboard", icon: Home, end: true },
   { title: "Browse Coaches", url: "/", icon: Search, end: false },
   { title: "My Bookings", url: "/dashboard/bookings", icon: Calendar, end: false },
   { title: "Saved Coaches", url: "/dashboard/saved", icon: Heart, end: false },
 ];
 
 const footerNavItems = [
   { title: "Settings", url: "/dashboard/settings", icon: Settings },
   { title: "Log out", url: "/login", icon: LogOut },
 ];
 
 export function DashboardSidebar() {
   const { state } = useSidebar();
   const isCollapsed = state === "collapsed";
 
   return (
     <Sidebar collapsible="icon" className="border-r border-border/40">
       <SidebarHeader className="p-4">
         <NavLink to="/" className="flex items-center gap-2">
           <span className="text-xl font-light tracking-tight text-foreground">
             {isCollapsed ? "E" : "EarlyEdge"}
           </span>
         </NavLink>
       </SidebarHeader>
 
       <SidebarContent>
         <SidebarGroup>
           <SidebarGroupContent>
             <SidebarMenu>
               {mainNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild tooltip={item.title}>
                     <NavLink
                       to={item.url}
                       end={item.end}
                       className="flex items-center gap-3 px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                       activeClassName="bg-muted text-foreground font-medium"
                     >
                       <item.icon className="h-4 w-4 shrink-0" />
                       {!isCollapsed && <span>{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>
 
       <SidebarFooter>
         <SidebarSeparator />
         <SidebarGroup>
           <SidebarGroupContent>
             <SidebarMenu>
               {footerNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild tooltip={item.title}>
                     <NavLink
                       to={item.url}
                       className="flex items-center gap-3 px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                       activeClassName="bg-muted text-foreground font-medium"
                     >
                       <item.icon className="h-4 w-4 shrink-0" />
                       {!isCollapsed && <span>{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarFooter>
     </Sidebar>
   );
 }