import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Login/LoginPage";
import { DashboardPage } from "../pages/Resident/DashboardPage";
import { AdminDashboardPage } from "../pages/Admin/AdminDashboardPage";
import { UnauthorizedPage } from "../pages/Unauthorized/UnauthorizedPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="spinner" />
        <p>Carregando informações...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "ADMIN" ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Raiz - Redirecionamento Inteligente */}
      <Route path="/" element={<RootRedirect />} />

      {/* Rota Pública */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rotas Protegidas do Morador */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RESIDENT", "ADMIN"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Rotas Protegidas da Administração */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Rota Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
