import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SitesPage } from '../pages/SitesPage';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* PÚBLICAS */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PRIVADAS (CORRIGIDO COM OUTLET PATTERN) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          {/* Dashboard */}
          <Route path="/app" element={<DashboardPage />} />

          {/* Outras páginas */}
          <Route path="/app/reports" element={<ReportsPage />} />
          <Route path="/app/sites" element={<SitesPage />} />
        </Route>
      </Route>

      {/* REDIRECTS */}
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
      <Route path="/sites" element={<Navigate to="/app/sites" replace />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}