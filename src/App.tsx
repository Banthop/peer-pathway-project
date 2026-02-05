import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CoachProfile from "./pages/CoachProfile";
import NotFound from "./pages/NotFound";
 import BecomeACoach from "./pages/BecomeACoach";
 import Login from "./pages/Login";
 import Signup from "./pages/Signup";
 import ForgotPassword from "./pages/ForgotPassword";
 import CoachSignup from "./pages/CoachSignup";
 import DashboardLayout from "./components/dashboard/DashboardLayout";
 import DashboardOverview from "./pages/dashboard/DashboardOverview";
 import DashboardBookings from "./pages/dashboard/DashboardBookings";
 import DashboardSaved from "./pages/dashboard/DashboardSaved";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/coach/:coachId" element={<CoachProfile />} />
           <Route path="/become-a-coach" element={<BecomeACoach />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/coach/signup" element={<CoachSignup />} />
           <Route path="/dashboard" element={<DashboardLayout />}>
             <Route index element={<DashboardOverview />} />
             <Route path="bookings" element={<DashboardBookings />} />
             <Route path="saved" element={<DashboardSaved />} />
           </Route>
           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
