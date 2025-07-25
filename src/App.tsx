import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import { EventProvider } from "./contexts/EventContext";
import { TicketProvider } from "./contexts/TicketContext";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import MyEvents from "./pages/MyEvents";
import Events from "./pages/Events";
import Influencers from "./pages/Influencers";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import EventDashboard from "./pages/EventDashboard";
import EventDetail from "./pages/EventDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import MobileGuard from "./components/MobileGuard";
import Tickets from "./pages/Tickets";
import ScannerPage from "./pages/ScannerPage";
import BookingFlow from "./components/BookingFlow";
import PurchasePage from "./pages/PurchasePage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredUserType }: { children: JSX.Element, requiredUserType?: 'user' | 'organizer' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredUserType && user?.userType !== requiredUserType) {
    return <Navigate to="/app" replace />;
  }
  
  return children;
};

// Scanner route - accessible by organizers or with valid access code
const ScannerRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useAuth();
  const isOrganizer = user?.userType === 'organizer';
  
  // If there's an access code in the URL, we'll let the scanner component handle verification
  const hasAccessCode = window.location.hash.includes('code=');
  
  if (!isAuthenticated && !hasAccessCode) {
    return <Navigate to="/signin" replace />;
  }
  
  if (!isOrganizer && !hasAccessCode) {
    return <Navigate to="/app" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute requiredUserType="organizer">
          <Events />
        </ProtectedRoute>
      } />
      <Route path="/influencers" element={
        <ProtectedRoute requiredUserType="organizer">
          <Influencers />
        </ProtectedRoute>
      } />
      <Route path="/tickets" element={
        <ProtectedRoute>
          <Tickets />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/create-event" element={
        <ProtectedRoute requiredUserType="organizer">
          <CreateEvent />
        </ProtectedRoute>
      } />
      <Route path="/create-event/:id" element={
        <ProtectedRoute requiredUserType="organizer">
          <CreateEvent />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute requiredUserType="organizer">
          <EventDashboard />
        </ProtectedRoute>
      } />
      <Route path="/events/:id" element={
        <ProtectedRoute>
          <EventDetail />
        </ProtectedRoute>
      } />
      <Route path="/scan/:eventId" element={
        <ScannerRoute>
          <ScannerPage />
        </ScannerRoute>
      } />
      <Route path="/scan/key/:eventKey" element={
        <ScannerRoute>
          <ScannerPage />
        </ScannerRoute>
      } />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/purchase/:eventKey" element={
        <ProtectedRoute>
          <PurchasePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MobileGuard>
        <HashRouter>
          <AuthProvider>
            <EventProvider>
              <TicketProvider>
                <BookingProvider>
                  <div className="relative">
                    <AppRoutes />
                    <BottomNavigation />
                  </div>
                </BookingProvider>
              </TicketProvider>
            </EventProvider>
          </AuthProvider>
        </HashRouter>
      </MobileGuard>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;