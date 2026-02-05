import { Home, Search, Calendar, Heart, Settings, LogOut, ChevronRight } from "lucide-react";
 import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import student1 from "@/assets/student-1.jpg";
 
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
 
const userData = {
  name: "Alex Chen",
  email: "alex@example.com",
  photo: student1,
};

 export function DashboardSidebar() {
   const { state } = useSidebar();
   const isCollapsed = state === "collapsed";
 
   return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-background">
      <SidebarHeader className="p-5">
         <NavLink to="/" className="flex items-center gap-2">
          {isCollapsed ? (
            <span className="text-xl font-bold tracking-tight text-foreground">E</span>
          ) : (
            <span className="text-xl tracking-tight text-foreground">
              <span className="font-light">Early</span>
              <span className="font-bold">Edge</span>
            </span>
          )}
         </NavLink>
       </SidebarHeader>
 
       <SidebarContent>
        <SidebarGroup className="px-2">
           <SidebarGroupContent>
             <SidebarMenu>
               {mainNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild tooltip={item.title}>
                     <NavLink
                       to={item.url}
                       end={item.end}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                      activeClassName="bg-muted text-foreground font-medium shadow-sm"
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
        <SidebarSeparator className="mx-3" />
        
        {/* User Section */}
        <div className={`px-3 py-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <Avatar className="h-8 w-8 border border-border/40">
              <AvatarImage src={userData.photo} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
              <Avatar className="h-9 w-9 border border-border/40">
                <AvatarImage src={userData.photo} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userData.name}</p>
                <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <SidebarGroup className="px-2 pb-2">
           <SidebarGroupContent>
             <SidebarMenu>
               {footerNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild tooltip={item.title}>
                     <NavLink
                       to={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                      activeClassName="bg-muted text-foreground font-medium shadow-sm"
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