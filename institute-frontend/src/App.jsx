import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/student/Students';
import Faculty from './pages/faculty/Faculty';
import Classes from './pages/class/Classes';
import Batches from './pages/batch/Batches';
import Enrollment from './pages/enrollment/Enrollment';
import Attendance from './pages/attendance/Attendance';
import Fees from './pages/fees/Fees';
import GenAI from './pages/genai/GenAI';
import Profile from './pages/profile/Profile';
import Approvals from './pages/approvals/Approvals';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><Students /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><Faculty /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute>
                <Layout><Classes /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/batches" element={
              <ProtectedRoute>
                <Layout><Batches /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/enrollment" element={
              <ProtectedRoute>
                <Layout><Enrollment /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/fees" element={
              <ProtectedRoute>
                <Layout><Fees /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/genai" element={
              <ProtectedRoute>
                <Layout><GenAI /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/approvals" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><Approvals /></Layout>
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
          toastStyle={{ borderRadius: '12px', fontSize: '14px' }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
