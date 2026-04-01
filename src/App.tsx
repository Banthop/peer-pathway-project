import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BuyerAuthProvider } from "@/contexts/BuyerAuthContext";

// Layout components -- kept as regular imports (needed synchronously for route structure)
import AdminLayout from "./components/admin/AdminLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import CoachDashboardLayout from "./components/coach-dashboard/CoachDashboardLayout";
import PortalLayout from "./components/portal/PortalLayout";
import SpringWeekPortalLayout from "./components/spring-week-portal/SpringWeekPortalLayout";
import ErrorBoundary from "./components/ErrorBoundary";

// Small / immediately-needed pages -- kept as regular imports
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Webinar from "./pages/Webinar";
import NotFound from "./pages/NotFound";
import StripeConnect from "./pages/coach-dashboard/StripeConnect";

// Portal pages kept as regular imports (small, inside auth-gated layout)
import PortalRecording from "./pages/portal/PortalRecording";
import PortalResources from "./pages/portal/PortalResources";
import BookUthman from "./pages/portal/BookUthman";
import PortalColdEmailGuide from "./pages/portal/ColdEmailGuide";

// Heavier pages -- loaded lazily to reduce initial bundle size
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const BecomeACoach = lazy(() => import("./pages/BecomeACoach"));
const CoachSignup = lazy(() => import("./pages/CoachSignup"));
const Guarantee = lazy(() => import("./pages/Guarantee"));
const PublicEvents = lazy(() => import("./pages/PublicEvents"));
const PublicResources = lazy(() => import("./pages/PublicResources"));
const ColdEmailGuide = lazy(() => import("./pages/ColdEmailGuide"));
const ColdEmailChecklist = lazy(() => import("./pages/ColdEmailChecklist"));
const SpringWeekWebinar = lazy(() => import("./pages/SpringWeekWebinar"));
const SpringWeekPlaybook = lazy(() => import("./pages/SpringWeekPlaybook"));
const SpringWeekCoaching = lazy(() => import("./pages/SpringWeekCoaching"));
const SpringWeekPortal = lazy(() => import("./pages/SpringWeekPortal"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCoaches = lazy(() => import("./pages/admin/AdminCoaches"));
const AdminOutreach = lazy(() => import("./pages/admin/AdminOutreach"));
const AdminLinkedIn = lazy(() => import("./pages/admin/AdminLinkedIn"));

// Coach dashboard pages
const CoachOverview = lazy(() => import("./pages/coach-dashboard/CoachOverview"));
const CoachSessions = lazy(() => import("./pages/coach-dashboard/CoachSessions"));
const CoachEarnings = lazy(() => import("./pages/coach-dashboard/CoachEarnings"));
const CoachReviews = lazy(() => import("./pages/coach-dashboard/CoachReviews"));
const CoachEditProfile = lazy(() => import("./pages/coach-dashboard/CoachEditProfile"));
const CoachAnalytics = lazy(() => import("./pages/coach-dashboard/CoachAnalytics"));
const CoachMessages = lazy(() => import("./pages/coach-dashboard/CoachMessages"));
const CoachEvents = lazy(() => import("./pages/coach-dashboard/CoachEvents"));
const CoachResources = lazy(() => import("./pages/coach-dashboard/CoachResources"));
const CoachOnboarding = lazy(() => import("./pages/coach-dashboard/CoachOnboarding"));

// Student dashboard pages
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardBookings = lazy(() => import("./pages/dashboard/DashboardBookings"));
const DashboardBrowse = lazy(() => import("./pages/dashboard/DashboardBrowse"));
const DashboardMessages = lazy(() => import("./pages/dashboard/DashboardMessages"));
const DashboardEvents = lazy(() => import("./pages/dashboard/DashboardEvents"));
const DashboardResources = lazy(() => import("./pages/dashboard/DashboardResources"));


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
    const dest = userType === "coach" ? "/coach-dashboard" : "/dashboard";
    return <Navigate to={dest} replace />;
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
        <Route path="/spring-week" element={<ErrorBoundary><SpringWeekWebinar /></ErrorBoundary>} />
        <Route path="/resources/cold-email-guide" element={<ColdEmailGuide />} />
        <Route path="/resources/cold-email-checklist" element={<ColdEmailChecklist />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalRecording />} />
          <Route path="resources" element={<PortalResources />} />
          <Route path="book-uthman" element={<BookUthman />} />
          <Route path="cold-email-guide" element={<PortalColdEmailGuide />} />
        </Route>
        <Route path="/spring-week-portal" element={<ErrorBoundary><SpringWeekPortalLayout /></ErrorBoundary>}>
          <Route index element={<SpringWeekPortal />} />
        </Route>
        <Route path="/spring-week-playbook" element={<ErrorBoundary><SpringWeekPlaybook /></ErrorBoundary>} />
        <Route path="/spring-week-coaching" element={<SpringWeekCoaching />} />
        <Route path="*" element={<Navigate to="/webinar" replace />} />
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
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/coach/signup" element={<CoachSignup />} />
      <Route path="/dashboard" element={<ErrorBoundary><StudentRoute><DashboardLayout /></StudentRoute></ErrorBoundary>}>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="browse" element={<DashboardBrowse />} />
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="events" element={<DashboardEvents />} />
        <Route path="resources" element={<DashboardResources />} />
      </Route>
      <Route path="/coach-onboarding" element={<ErrorBoundary><CoachRoute><CoachOnboarding /></CoachRoute></ErrorBoundary>} />
      <Route path="/coach-dashboard" element={<ErrorBoundary><CoachRoute><CoachDashboardLayout /></CoachRoute></ErrorBoundary>}>
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
      <Route path="/spring-week" element={<ErrorBoundary><SpringWeekWebinar /></ErrorBoundary>} />
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalRecording />} />
        <Route path="resources" element={<PortalResources />} />
        <Route path="book-uthman" element={<BookUthman />} />
          <Route path="cold-email-guide" element={<PortalColdEmailGuide />} />
      </Route>
      <Route path="/spring-week-portal" element={<ErrorBoundary><SpringWeekPortalLayout /></ErrorBoundary>}>
        <Route index element={<SpringWeekPortal />} />
      </Route>
      <Route path="/spring-week-playbook" element={<ErrorBoundary><SpringWeekPlaybook /></ErrorBoundary>} />
      <Route path="/spring-week-coaching" element={<SpringWeekCoaching />} />
      <Route path="/admin" element={<ErrorBoundary><AdminRoute><AdminLayout /></AdminRoute></ErrorBoundary>}>
        <Route index element={<AdminDashboard />} />
        <Route path="coaches" element={<AdminCoaches />} />
        <Route path="outreach" element={<AdminOutreach />} />
        <Route path="linkedin" element={<AdminLinkedIn />} />
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
            <Suspense fallback={<AuthLoading />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </BuyerAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
