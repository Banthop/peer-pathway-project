import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BuyerAuthProvider } from "@/contexts/BuyerAuthContext";
import { lazy, Suspense } from "react";

// Eagerly loaded: tiny pages that are always needed or near-instant
import NotFound from "./pages/NotFound";

// Lazy-loaded pages - code split per route group
const Index = lazy(() => import("./pages/Index"));
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const BecomeACoach = lazy(() => import("./pages/BecomeACoach"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const CoachSignup = lazy(() => import("./pages/CoachSignup"));
const Guarantee = lazy(() => import("./pages/Guarantee"));
const PublicEvents = lazy(() => import("./pages/PublicEvents"));
const PublicResources = lazy(() => import("./pages/PublicResources"));
const ColdEmailGuide = lazy(() => import("./pages/ColdEmailGuide"));
const ColdEmailChecklist = lazy(() => import("./pages/ColdEmailChecklist"));

// Webinar pages - separate chunk
const Webinar = lazy(() => import("./pages/Webinar"));
const DaWebinar = lazy(() => import("./pages/DaWebinar"));
const SpringWeekWebinar = lazy(() => import("./pages/SpringWeekWebinar"));
const SpringWeekPrep = lazy(() => import("./pages/SpringWeekPrep"));

// Admin section - separate chunk, rarely visited
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminCoaches = lazy(() => import("./pages/admin/AdminCoaches"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOutreach = lazy(() => import("./pages/admin/AdminOutreach"));
const AdminLinkedIn = lazy(() => import("./pages/admin/AdminLinkedIn"));
const AdminCRM = lazy(() => import("./pages/admin/AdminCRM"));

// Student dashboard section
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardBookings = lazy(() => import("./pages/dashboard/DashboardBookings"));
const DashboardBrowse = lazy(() => import("./pages/dashboard/DashboardBrowse"));
const DashboardMessages = lazy(() => import("./pages/dashboard/DashboardMessages"));
const DashboardEvents = lazy(() => import("./pages/dashboard/DashboardEvents"));
const DashboardResources = lazy(() => import("./pages/dashboard/DashboardResources"));

// Coach dashboard section - separate chunk
const CoachDashboardLayout = lazy(() => import("./components/coach-dashboard/CoachDashboardLayout"));
const CoachOverview = lazy(() => import("./pages/coach-dashboard/CoachOverview"));
const CoachSessions = lazy(() => import("./pages/coach-dashboard/CoachSessions"));
const CoachEarnings = lazy(() => import("./pages/coach-dashboard/CoachEarnings"));
const CoachReviews = lazy(() => import("./pages/coach-dashboard/CoachReviews"));
const CoachEditProfile = lazy(() => import("./pages/coach-dashboard/CoachEditProfile"));
const CoachAnalytics = lazy(() => import("./pages/coach-dashboard/CoachAnalytics"));
const CoachMessages = lazy(() => import("./pages/coach-dashboard/CoachMessages"));
const StripeConnect = lazy(() => import("./pages/coach-dashboard/StripeConnect"));
const CoachEvents = lazy(() => import("./pages/coach-dashboard/CoachEvents"));
const CoachResources = lazy(() => import("./pages/coach-dashboard/CoachResources"));
const CoachOnboarding = lazy(() => import("./pages/coach-dashboard/CoachOnboarding"));

// Cold email portal section
const PortalLayout = lazy(() => import("./components/portal/PortalLayout"));
const PortalRecording = lazy(() => import("./pages/portal/PortalRecording"));
const PortalResources = lazy(() => import("./pages/portal/PortalResources"));
const BookUthman = lazy(() => import("./pages/portal/BookUthman"));
const PortalColdEmailGuide = lazy(() => import("./pages/portal/ColdEmailGuide"));
const Upgrade = lazy(() => import("./pages/portal/Upgrade"));
const SlidesPage = lazy(() => import("./pages/portal/SlidesPage"));

// General portal section
const GeneralPortalLayout = lazy(() => import("./components/portal/GeneralPortalLayout"));
const GeneralRecording = lazy(() => import("./pages/portal/GeneralRecording"));
const GeneralResources = lazy(() => import("./pages/portal/GeneralResources"));
const BookAndrew = lazy(() => import("./pages/portal/BookAndrew"));
const BookMohammad = lazy(() => import("./pages/portal/BookMohammad"));

// Spring week portal section - separate chunk
const SpringWeekPortalLayout = lazy(() => import("./components/spring-week-portal/SpringWeekPortalLayout"));
const SpringWeekDashboard = lazy(() => import("./pages/spring-week-portal/SpringWeekDashboard"));
const SpringWeekRecording = lazy(() => import("./pages/spring-week-portal/SpringWeekRecording"));
const SpringWeekHandbook = lazy(() => import("./pages/spring-week-portal/SpringWeekHandbook"));
const SpringWeekMatchmaking = lazy(() => import("./pages/spring-week-portal/SpringWeekMatchmaking"));
const SpringWeekBooking = lazy(() => import("./pages/spring-week-portal/SpringWeekBooking"));
const SpringWeekUpgrade = lazy(() => import("./pages/spring-week-portal/SpringWeekUpgrade"));

const queryClient = new QueryClient();

// When true, ONLY the /webinar route is accessible (for production subdomain deploy)
const WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

/** Simple centered spinner shown while a lazy page loads */
function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

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
 * Students go to /dashboard, Coaches go to /coach-dashboard.
 */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, userType, loading } = useAuth();
  const [params] = useSearchParams();
  if (loading) return <AuthLoading />;
  if (user) {
    const redirect = params.get("redirect") || "/portal";
    return <Navigate to={redirect} replace />;
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
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/da-webinar" element={<DaWebinar />} />
          <Route path="/spring-week" element={<SpringWeekWebinar />} />
          <Route path="/spring-week-prep" element={<SpringWeekPrep />} />
          <Route path="/register" element={<Navigate to="/spring-week-prep" replace />} />
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
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoading />}>
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
        <Route path="/spring-week-prep" element={<SpringWeekPrep />} />
        <Route path="/register" element={<Navigate to="/spring-week-prep" replace />} />
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
    </Suspense>
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
