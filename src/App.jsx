import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PoemsPage from './pages/PoemsPage';

// Si el admin ya está logueado y visita /login, lo manda al inicio
function AdminLoginRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login solo para administradores */}
          <Route
            path="/login"
            element={<AdminLoginRoute><LoginPage /></AdminLoginRoute>}
          />
          {/* Página principal pública — cualquier usuario puede entrar */}
          <Route path="/" element={<PoemsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
