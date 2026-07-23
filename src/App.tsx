/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Home } from '@/pages/Home';
import { Scan } from '@/pages/Scan';
import { Pass } from '@/pages/Pass';
import { Rewards } from '@/pages/Rewards';
import { Profile } from '@/pages/Profile';
import { Login } from '@/pages/Login';
import { Locations } from '@/pages/Locations';
import { isFirebaseConfigured } from '@/lib/firebase';
import React, { useEffect } from 'react';
import { TenantProvider, useTenant } from '@/context/TenantContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useTenant();
  
  if (loading) {
    return <div className="min-h-screen bg-coffee-50 flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="login" replace />;
  }
  return <>{children}</>;
}

function CafeNotFound() {
  const { error } = useTenant();
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-coffee-200 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">☕</span>
      </div>
      <h1 className="type-page-title text-coffee-800 mb-3">Cafe Not Found</h1>
      <p className="type-body text-coffee-600 mb-8 max-w-xs">{error}</p>
      <a 
        href="/perkly" 
        className="type-button bg-coffee-700 text-white px-8 py-3 rounded-full shadow-sm hover:bg-coffee-800 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}

function TenantAppContent() {
  const { error, loading } = useTenant();
  
  if (loading) {
    return <div className="min-h-screen bg-coffee-50 flex items-center justify-center text-coffee-600 font-medium">Loading...</div>;
  }

  if (error) {
    return <CafeNotFound />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-canvas shadow-2xl overflow-hidden">
      <Routes>
        <Route path="login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Outlet />
            <BottomNav />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="pass" element={<Pass />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="locations" element={<Locations />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

function TenantApp() {
  return (
    <TenantProvider>
      <TenantAppContent />
    </TenantProvider>
  );
}

export default function App() {
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase is not fully configured.");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/perkly" replace />} />
        <Route path="/:cafeSlug/*" element={<TenantApp />} />
      </Routes>
    </BrowserRouter>
  );
}
