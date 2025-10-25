import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import FAQs from './pages/FAQs';
import Pricing from './pages/Pricing';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/faqs" element={
              <ProtectedRoute>
                <Layout>
                  <FAQs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={
              <ProtectedRoute>
                <Layout>
                  <Pricing />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;