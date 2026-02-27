import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import MyApplications from "./pages/candidate/MyApplications";
import EmployerPostJob from "./pages/employer/EmployerPostJob";
import EmployerMyJobs from "./pages/employer/EmployerMyJobs";
import EmployerApplications from "./pages/employer/EmployerApplications";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token, ready } = useAuth();

  if (!ready) return null;

  return (
    <Routes>
      {/* Default: always go to login if not authenticated */}
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />

      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/employer/post"
  element={<ProtectedRoute><EmployerPostJob /></ProtectedRoute>}
/>
<Route
  path="/employer/jobs"
  element={<ProtectedRoute><EmployerMyJobs /></ProtectedRoute>}
/>
<Route
  path="/employer/apps/:jobId"
  element={<ProtectedRoute><EmployerApplications /></ProtectedRoute>}
/>
<Route
  path="/candidate/jobs"
  element={
    <ProtectedRoute roles={["candidate", "admin"]}>
      <CandidateJobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/candidate/apps"
  element={
    <ProtectedRoute roles={["candidate", "admin"]}>
      <MyApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/jobs"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminJobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/apps"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminApplications />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}