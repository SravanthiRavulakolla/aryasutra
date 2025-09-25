import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageLoader } from './components/Loader';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientBooking from './pages/PatientBooking';
import Ritucharya from './pages/Ritucharya';
import AdminDashboard from './pages/AdminDashboard';
import DetailedReport from './pages/DetailedReport';
import PractitionerDashboard from './pages/PractitionerDashboard';
import ProgressDashboardAyursutra from './pages/ProgressDashboardAyursutra';
import TestCredentials from './pages/TestCredentials';
import Centers from './pages/Centers';
import Practitioners from './pages/Practitioners';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children, isHomePage = false }) => {
  return (
    <div className={`min-h-screen flex flex-col ${
      isHomePage ? '' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <Layout isHomePage={true}>
                  <Home />
                </Layout>
              } />
              
              <Route path="/login" element={
                <Layout>
                  <Login />
                </Layout>
              } />
              
              <Route path="/signup" element={
                <Layout>
                  <Signup />
                </Layout>
              } />
              
              <Route path="/ritucharya" element={
                <Layout>
                  <Ritucharya />
                </Layout>
              } />
              
              <Route path="/test-credentials" element={
                <Layout>
                  <TestCredentials />
                </Layout>
              } />

              {/* Protected Routes */}
              <Route path="/patient/booking" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientBooking />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/centers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Centers />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/practitioners" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Practitioners />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/practitioner/dashboard" element={
                <ProtectedRoute allowedRoles={['practitioner']}>
                  <Layout>
                    <PractitionerDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/patient/progress" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <ProgressDashboardAyursutra />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="/admin/report" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <DetailedReport />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;