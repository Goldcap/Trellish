import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import BoardPage from './pages/BoardPage.jsx';
import MessageLogPage from './pages/MessageLogPage.jsx';
import CrewSettingsPage from './pages/CrewSettingsPage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessageLogPage /></ProtectedRoute>} />
      <Route path="/crew" element={<ProtectedRoute><CrewSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
