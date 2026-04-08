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
import AdminLayout from "./components/admin/AdminLayout";
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
import AdminLinkedIn from "./pages/admin/AdminLinkedIn";
import AdminCRM from "./pages/admin/AdminCRM";
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
import CoachOnboarding from "./pages/coach-dashboard/CoachOnboarding";
import Guarantee from "./pages/Guarantee";
import PublicEvents from "./pages/PublicEvents";
import PublicResources from "./pages/PublicResources";
import Webinar from "./pages/Webinar";
import ColdEmailGuide from "./pages/ColdEmailGuide";
import ColdEmailChecklist from "./pages/ColdEmailChecklist";
import { BuyerAuthProvider } from "@/contexts/BuyerAuthContext";
import PortalLayout from "./components/portal/PortalLayout";
import PortalRecording from "./pages/portal/PortalRecording";
import PortalResources from "./pages/portal/PortalResources";
import BookUthman from "./pages/portal/BookUthman";
import PortalColdEmailGuide from "./pages/portal/ColdEmailGuide";
import GeneralPortalLayout from "./components/portal/GeneralPortalLayout";
import GeneralRecording from "./pages/portal/GeneralRecording";
import GeneralResources from "./pages/portal/GeneralResources";
import BookAndrew from "./pages/portal/BookAndrew";
import BookMohammad from "./pages/portal/BookMohammad";
import Upgrade from "./pages/portal/Upgrade";
import DaWebinar from "./pages/DaWebinar";
import SpringWeekWebinar from "./pages/SpringWeekWebinar";
import SlidesPage from "./pages/portal/SlidesPage";
import SpringWeekPortalLayout from "./components/spring-week-portal/SpringWeekPortalLayout";
import SpringWeekDashboard from "./pages/spring-week-portal/SpringWeekDashboard";
import SpringWeekRecording from "./pages/spring-week-portal/SpringWeekRecording";
import SpringWeekHandbook from "./pages/spring-week-portal/SpringWeekHandbook";
import SpringWeekMatchmaking from "./pages/spring-week-portal/SpringWeekMatchmaking";
import SpringWeekBooking from "./pages/spring-week-portal/SpringWeekBooking";
import SpringWeekUpgrade from "./pages/spring-week-portal/SpringWeekUpgrade";

const queryClient = new QueryClient();

// When true, ONLY the /webinar route is accessible (for production subdomain deploy)
const WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

/** Simple centered spinner shown while auth state loads */
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

/**
 * Wraps a route that requires authentication.
 * Redirects to /login when user is not signed in.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * Only allows students. Coaches get redirected to /coach-dashboard.
 */
function StudentRoute({ children }: { children: React.ReactNode }) {
  const { user, userType, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (userType === "coach") return <Navigate to="/coach-dashboard" replace />;
  return <>{children}</>;
}

/**
 * Only allows coaches. Students get redirected to /dashboard.
 */
function CoachRoute({ children }: { children: React.ReactNode }) {
  const { user, userType, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (userType !== "coach") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/**
 * Redirects authenticated users away from auth pages (login/signup).
 * Students → /dashboard, Coaches → /coach-dashboard.
 */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, userType, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (user) {
    return <Navigate to="/portal" replace />;
  }
  return <>{children}</>;
}

/**
 * Access to admin dashboard. Hardcoded emails for security.
 */
const ADMIN_EMAILS = [
  "donawotwi@gmail.com",
  "dylan@yourearlyedge.co.uk",
  "uthman@yourearlyedge.co.uk"
];

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  
  if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

const AppRoutes = () => {
  if (WEBINAR_ONLY) {
    return (
      <Routes>
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/da-webinar" element={<DaWebinar />} />
        <Route path="/spring-week" element={<SpringWeekWebinar />} />
        <Route path="/resources/cold-email-guide" element={<ColdEmailGuide />} />
        <Route path="/resources/cold-email-checklist" element={<ColdEmailChecklist />} />
        <Route path="/portal/slides" element={<SlidesPage />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalRecording />} />
          <Route path="resources" element={<PortalResources />} />
          <Route path="book-uthman" element={<BookUthman />} />
          <Route path="cold-email-guide" element={<PortalColdEmailGuide />} />
          <Route path="upgrade" element={<Upgrade />} />
        </Route>
        <Route path="/general-portal" element={<GeneralPortalLayout />}>
          <Route index element={<GeneralRecording />} />
          <Route path="resources" element={<GeneralResources />} />
          <Route path="book-andrew" element={<BookAndrew />} />
          <Route path="book-mohammad" element={<BookMohammad />} />
        </Route>
        <Route path="/spring-week-portal" element={<SpringWeekPortalLayout />}>
          <Route index element={<SpringWeekDashboard />} />
          <Route path="recording" element={<SpringWeekRecording />} />
          <Route path="handbook" element={<SpringWeekHandbook />} />
          <Route path="matchmaking" element={<SpringWeekMatchmaking />} />
          <Route path="coaching" element={<SpringWeekBooking />} />
          <Route path="upgrade" element={<SpringWeekUpgrade />} />
        </Route>
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/coach/:coachId" element={<CoachProfile />} />
      <Route path="/become-a-coach" element={<BecomeACoach />} />
      <Route path="/browse" element={<DashboardBrowse />} />
      <Route path="/events" element={<PublicEvents />} />
      <Route path="/resources" element={<PublicResources />} />
      <Route path="/resources/cold-email-guide" element={<ColdEmailGuide />} />
      <Route path="/resources/cold-email-checklist" element={<ColdEmailChecklist />} />
      <Route path="/portal/slides" element={<SlidesPage />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/coach/signup" element={<CoachSignup />} />
      <Route path="/dashboard" element={<StudentRoute><DashboardLayout /></StudentRoute>}>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="browse" element={<DashboardBrowse />} />
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="events" element={<DashboardEvents />} />
        <Route path="resources" element={<DashboardResources />} />
      </Route>
      <Route path="/coach-onboarding" element={<CoachRoute><CoachOnboarding /></CoachRoute>} />
      <Route path="/coach-dashboard" element={<CoachRoute><CoachDashboardLayout /></CoachRoute>}>
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
      <Route path="/webinar" element={<Webinar />} />
      <Route path="/da-webinar" element={<DaWebinar />} />
      <Route path="/spring-week" element={<SpringWeekWebinar />} />
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalRecording />} />
        <Route path="resources" element={<PortalResources />} />
        <Route path="book-uthman" element={<BookUthman />} />
        <Route path="cold-email-guide" element={<PortalColdEmailGuide />} />
        <Route path="upgrade" element={<Upgrade />} />
      </Route>
      <Route path="/general-portal" element={<GeneralPortalLayout />}>
        <Route index element={<GeneralRecording />} />
        <Route path="resources" element={<GeneralResources />} />
        <Route path="book-andrew" element={<BookAndrew />} />
        <Route path="book-mohammad" element={<BookMohammad />} />
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="coaches" element={<AdminCoaches />} />
        <Route path="outreach" element={<AdminOutreach />} />
        <Route path="linkedin" element={<AdminLinkedIn />} />
        <Route path="crm" element={<AdminCRM />} />
      </Route>
      <Route path="/spring-week-portal" element={<SpringWeekPortalLayout />}>
        <Route index element={<SpringWeekDashboard />} />
        <Route path="recording" element={<SpringWeekRecording />} />
        <Route path="handbook" element={<SpringWeekHandbook />} />
        <Route path="matchmaking" element={<SpringWeekMatchmaking />} />
        <Route path="coaching" element={<SpringWeekBooking />} />
        <Route path="upgrade" element={<SpringWeekUpgrade />} />
      </Route>
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BuyerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </BuyerAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
