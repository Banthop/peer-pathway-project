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
import DashboardBrowse from "./pages/dashboard/DashboardBrowse";
import DashboardMessages from "./pages/dashboard/DashboardMessages";
import DashboardEvents from "./pages/dashboard/DashboardEvents";
import AdminCoaches from "./pages/admin/AdminCoaches";
import CoachDashboardLayout from "./components/coach-dashboard/CoachDashboardLayout";
import CoachOverview from "./pages/coach-dashboard/CoachOverview";
import CoachSessions from "./pages/coach-dashboard/CoachSessions";
import CoachEarnings from "./pages/coach-dashboard/CoachEarnings";
import CoachReviews from "./pages/coach-dashboard/CoachReviews";
import CoachEditProfile from "./pages/coach-dashboard/CoachEditProfile";
import CoachAnalytics from "./pages/coach-dashboard/CoachAnalytics";

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
            <Route path="browse" element={<DashboardBrowse />} />
            <Route path="messages" element={<DashboardMessages />} />
            <Route path="events" element={<DashboardEvents />} />
          </Route>
          <Route path="/coach-dashboard" element={<CoachDashboardLayout />}>
            <Route index element={<CoachOverview />} />
            <Route path="sessions" element={<CoachSessions />} />
            <Route path="earnings" element={<CoachEarnings />} />
            <Route path="reviews" element={<CoachReviews />} />
            <Route path="edit-profile" element={<CoachEditProfile />} />
            <Route path="analytics" element={<CoachAnalytics />} />
          </Route>
          <Route path="/admin/coaches" element={<AdminCoaches />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
