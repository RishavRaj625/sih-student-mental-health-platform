// App.jsx - COMPLETE VERSION WITH ALL FEATURES
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import AIChatFeature from "./components/feature-files/ai-chat-feature";
import BookingFeature from "./components/feature-files/booking-feature";
import ResourcesFeature from "./components/feature-files/resources-feature";
import PeerSupportFeature from "./components/feature-files/peer-support-feature";
import WellnessCheckFeature from "./components/feature-files/wellness-check-feature";
import CrisisHelpFeature from "./components/feature-files/crisis-help-feature";
import FindingNearestDoctorFeature from "./components/feature-files/finding-nearest-doctor-feature";
import AdminDashboardFeature from "./components/feature-files/admin-dashboard-feature";
import Navbar from "./components/Navbar";
import "./App.css";

// Protected Route Component for regular users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log("ProtectedRoute check:", {
    isAuthenticated: isAuthenticated(),
    loading,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component specifically for Admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log("AdminProtectedRoute check:", {
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    loading,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to admin login");
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin()) {
    console.log("Not admin, redirecting to user dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Debug Component to show current auth state (remove in production)
const AuthDebug = () => {
  const { user, admin, token, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="bg-gray-100 p-4 text-xs font-mono border-b">
      <strong>🔍 Auth Debug:</strong>
      <span className="ml-2">User: {user ? user.name : "None"}</span> |
      <span className="ml-2">Admin: {admin ? admin.name : "None"}</span> |
      <span className="ml-2">Token: {token ? "✅ Present" : "❌ None"}</span> |
      <span className="ml-2">
        Authenticated: {isAuthenticated() ? "✅" : "❌"}
      </span>{" "}
      |<span className="ml-2">IsAdmin: {isAdmin() ? "✅" : "❌"}</span>
    </div>
  );
};

// Login Route Component - handles redirects if already logged in
const LoginRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    if (isAdmin()) {
      console.log("Already logged in as admin, redirecting to admin dashboard");
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      console.log("Already logged in as user, redirecting to user dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Login />;
};

// Admin Login Route Component - handles redirects if already logged in
const AdminLoginRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    if (isAdmin()) {
      console.log("Already logged in as admin, redirecting to admin dashboard");
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      console.log(
        "Already logged in as regular user, redirecting to user dashboard"
      );
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <AdminLogin />;
};

// Signup Route Component - handles redirects if already logged in
const SignupRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    if (isAdmin()) {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Signup />;
};

function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log("AppContent render:", {
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    loading,
  });

  // Show loading screen while initializing auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navbar removed from here - will be handled by individual components */}

      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/admin-login" element={<AdminLoginRoute />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Feature Routes - All Protected for Regular Users */}
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChatFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <ResourcesFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/peer-support"
          element={
            <ProtectedRoute>
              <PeerSupportFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wellness-check"
          element={
            <ProtectedRoute>
              <WellnessCheckFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-doctor"
          element={
            <ProtectedRoute>
              <FindingNearestDoctorFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crisis-help"
          element={
            <ProtectedRoute>
              <CrisisHelpFeature />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardFeature />
            </AdminProtectedRoute>
          }
        />

        {/* Default Route - Smart Redirect */}
        <Route
          path="/"
          element={(() => {
            if (!isAuthenticated()) {
              console.log(
                "Root route: Not authenticated, redirecting to login"
              );
              return <Navigate to="/login" replace />;
            } else if (isAdmin()) {
              console.log(
                "Root route: Admin user, redirecting to admin dashboard"
              );
              return <Navigate to="/admin-dashboard" replace />;
            } else {
              console.log("Root route: Regular user, redirecting to dashboard");
              return <Navigate to="/dashboard" replace />;
            }
          })()}
        />

        {/* Catch all route - redirect to appropriate dashboard */}
        <Route
          path="*"
          element={(() => {
            if (!isAuthenticated()) {
              return <Navigate to="/login" replace />;
            } else if (isAdmin()) {
              return <Navigate to="/admin-dashboard" replace />;
            } else {
              return <Navigate to="/dashboard" replace />;
            }
          })()}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
