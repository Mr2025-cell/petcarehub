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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
