import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import DashboardResources from "./pages/dashboard/DashboardResources";
import AdminCoaches from "./pages/admin/AdminCoaches";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOutreach from "./pages/admin/AdminOutreach";
import CoachDashboardLayout from "./components/coach-dashboard/CoachDashboardLayout";
import CoachOverview from "./pages/coach-dashboard/CoachOverview";
import CoachSessions from "./pages/coach-dashboard/CoachSessions";
import CoachEarnings from "./pages/coach-dashboard/CoachEarnings";
import CoachReviews from "./pages/coach-dashboard/CoachReviews";
import CoachEditProfile from "./pages/coach-dashboard/CoachEditProfile";
import CoachAnalytics from "./pages/coach-dashboard/CoachAnalytics";
import CoachMessages from "./pages/coach-dashboard/CoachMessages";
import StripeConnect from "./pages/coach-dashboard/StripeConnect";
import CoachEvents from "./pages/coach-dashboard/CoachEvents";
import CoachResources from "./pages/coach-dashboard/CoachResources";
import Guarantee from "./pages/Guarantee";

const queryClient = new QueryClient();

/**
 * Wraps a route that requires authentication.
 * Redirects to /login when user is not signed in.
 * While auth state is loading, shows nothing (avoids flash).
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null; // auth still initialising
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * Redirects authenticated users away from auth pages (login/signup).
 * Students → /dashboard, Coaches → /coach-dashboard.
 */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, userType, loading } = useAuth();
  if (loading) return null;
  if (user) {
    const dest = userType === "coach" ? "/coach-dashboard" : "/dashboard";
    return <Navigate to={dest} replace />;
  }
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/coach/:coachId" element={<CoachProfile />} />
    <Route path="/become-a-coach" element={<BecomeACoach />} />
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/coach/signup" element={<GuestRoute><CoachSignup /></GuestRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<DashboardOverview />} />
      <Route path="bookings" element={<DashboardBookings />} />
      <Route path="browse" element={<DashboardBrowse />} />
      <Route path="messages" element={<DashboardMessages />} />
      <Route path="events" element={<DashboardEvents />} />
      <Route path="resources" element={<DashboardResources />} />
    </Route>
    <Route path="/coach-dashboard" element={<ProtectedRoute><CoachDashboardLayout /></ProtectedRoute>}>
      <Route index element={<CoachOverview />} />
      <Route path="sessions" element={<CoachSessions />} />
      <Route path="messages" element={<CoachMessages />} />
      <Route path="earnings" element={<CoachEarnings />} />
      <Route path="reviews" element={<CoachReviews />} />
      <Route path="edit-profile" element={<CoachEditProfile />} />
      <Route path="analytics" element={<CoachAnalytics />} />
      <Route path="payouts" element={<StripeConnect />} />
      <Route path="events" element={<CoachEvents />} />
      <Route path="resources" element={<CoachResources />} />
    </Route>
    <Route path="/guarantee" element={<Guarantee />} />
    <Route path="/admin/coaches" element={<AdminCoaches />} />
    <Route path="/admin/outreach" element={<AdminOutreach />} />
    <Route path="/admin" element={<AdminDashboard />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
