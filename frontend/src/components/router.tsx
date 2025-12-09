// src/components/router.tsx - FIXED VERSION
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import Layout from './layout/Layout';

// Lazy load components - CORRECT based on your folder structure
const Dashboard = lazy(() => import('./Dashboard'));
const Groups = lazy(() => import('./Groups'));
const Expenses = lazy(() => import('./Expenses'));
const Settlements = lazy(() => import('./Settlements'));
const Analytics = lazy(() => import('./Analytics'));
const LoginForm = lazy(() => import('./LoginForm')); // LoginForm handles both login/register
const VerificationPending = lazy(() => import('./VerificationPending'));
const EmailVerificationPage = lazy(() => import('./EmailVerificationPage'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const ChangePassword = lazy(() => import('./ChangePassword'));
const Sessions = lazy(() => import('./Sessions'));
const UserProfile = lazy(() => import('./UserProfile')); // ADD THIS LINE

const AppRoutes = () => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your session..." />;
  }

  const isAuthenticated = !!user;
  const isVerified = user?.isVerified;

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to={isVerified ? "/dashboard" : "/verify-pending"} /> : 
            <LoginForm defaultTab="login" />
        } />
        <Route path="/register" element={
          isAuthenticated ? 
            <Navigate to={isVerified ? "/dashboard" : "/verify-pending"} /> : 
            <LoginForm defaultTab="register" />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        
        {/* Protected Unverified Routes */}
        <Route path="/verify-pending" element={
          isAuthenticated && !isVerified ? <VerificationPending /> : <Navigate to="/login" />
        } />
        
        {/* Protected Verified Routes with Layout */}
        <Route element={isAuthenticated && isVerified ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<Groups />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/:groupId" element={<Expenses />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/settlements/:groupId" element={<Settlements />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/sessions" element={<Sessions />} />
        </Route>
        
        {/* Root Redirect */}
        <Route path="/" element={
          <Navigate to={isAuthenticated ? (isVerified ? "/dashboard" : "/verify-pending") : "/login"} />
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;