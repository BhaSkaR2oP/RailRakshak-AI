import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AIInspection from './pages/AIInspection';
import AIProcessing from './pages/AIProcessing';
import DetectionResults from './pages/DetectionResults';
import Defects from './pages/Defects';
import DefectDetail from './pages/DefectDetail';
import RailwayMap from './pages/RailwayMap';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import DatasetAnalysis from './pages/DatasetAnalysis';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Sign-In */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application Routes (Requires Authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inspect" element={<AIInspection />} />
              <Route path="/analyze" element={<DatasetAnalysis />} />
              <Route path="/inspect/processing" element={<AIProcessing />} />
              <Route path="/inspect/results/:id" element={<DetectionResults />} />
              <Route path="/defects" element={<Defects />} />
              <Route path="/defects/:id" element={<DefectDetail />} />
              <Route path="/map" element={<RailwayMap />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
