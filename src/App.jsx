import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Register } from './pages/Register';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { MinderDashboard } from './pages/MinderDashboard';
import { TrackSessionPage } from './pages/TrackSessionPage';
import { SearchCaregiversPage } from './pages/SearchCaregiversPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import PetProfilePage from './pages/PetProfilePage';
import { Dog, CalendarCheck, CheckSquare } from 'lucide-react';
import { CarePlanEditor } from './pages/CarePlanEditor';

// A simple wrapper to route to the proper dashboard depending on state
function DashboardRouter() {
  const { isAuthenticated, isOwner } = useAuth();
  
  if (!isAuthenticated) return <LandingPage />;
  if (isOwner) return <OwnerDashboard />;
  return <MinderDashboard />;
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardRouter />} />
        
        {/* Protected Routes */}
        <Route path="/session" element={
          <ProtectedRoute>
            <TrackSessionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchCaregiversPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Care Plan routes — key forces re-mount when switching between new/edit */}
        <Route path="/care-plans/new" element={
          <ProtectedRoute>
            <CarePlanEditor key="new" />
          </ProtectedRoute>
        } />

        {/* Placeholder routes — prevents 404 crashes from nav links */}
        <Route path="/pets/:id" element={
          <ProtectedRoute>
            <PetProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute>
            <ComingSoonPage 
              title="Bookings" 
              description="The booking management system is being developed. You'll be able to view, create, and manage all your care bookings here."
              icon={CalendarCheck}
            />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <ComingSoonPage 
              title="My Tasks" 
              description="The full task management view is being developed. View your today's tasks on the dashboard in the meantime."
              icon={CheckSquare}
            />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
