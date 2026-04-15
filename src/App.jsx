import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Register } from './pages/Register';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { MinderDashboard } from './pages/MinderDashboard';
import ActiveSession from './pages/ActiveSession';
import { SearchCaregiversPage } from './pages/SearchCaregiversPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import PetProfilePage from './pages/PetProfilePage';
import TrackCaregiverPage from './pages/TrackCaregiverPage';
import { CheckSquare } from 'lucide-react';
import { CarePlanEditor } from './pages/CarePlanEditor';
import { BookingsPage } from './pages/BookingsPage';
import AddPetPage from './pages/AddPetPage';
import EditPetPage from './pages/EditPetPage';
import PetsListPage from './pages/PetsListPage';
import AdminDashboard from './pages/AdminDashboard.jsx';
import VerificationQueue from './pages/VerificationQueue.jsx';
import ComplaintManager from './pages/ComplaintManager.jsx';
import { EmergencyHandler } from './pages/EmergencyHandler';

function DashboardRouter() {
  const { isAuthenticated, isOwner } = useAuth();

  if (!isAuthenticated) return <LandingPage />;
  if (isOwner) return <OwnerDashboard />;
  return <MinderDashboard />;
}

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

        <Route path="/session/:bookingId?" element={
          <ProtectedRoute>
            <ActiveSession />
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

        <Route path="/pets" element={
          <ProtectedRoute>
            <PetsListPage />
          </ProtectedRoute>
        } />

        <Route path="/pets/add" element={
          <ProtectedRoute>
            <AddPetPage />
          </ProtectedRoute>
        } />

        <Route path="/pets/:id/edit" element={
          <ProtectedRoute>
            <EditPetPage />
          </ProtectedRoute>
        } />

        <Route path="/track-caregiver/:sessionId" element={
          <ProtectedRoute>
            <TrackCaregiverPage />
          </ProtectedRoute>
        } />

        <Route path="/care-plans/new" element={
          <ProtectedRoute>
            <CarePlanEditor key="new" />
          </ProtectedRoute>
        } />

        <Route path="/pets/:id" element={
          <ProtectedRoute>
            <PetProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        } />
        <Route path="/emergency" element={
          <ProtectedRoute>
            <EmergencyHandler />
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

        {/* UC7 Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/verifications" element={<VerificationQueue />} />
        <Route path="/admin/complaints" element={<ComplaintManager />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
