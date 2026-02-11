import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import Header from './components/common/Header';
import { DemoModeBanner } from './components/common/DemoModeBanner';
import CookieConsent from './components/common/CookieConsent';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageLoader } from './components/common/PageLoader';
import routes from './routes';

function AppContent() {
  const location = useLocation();
  const { isDemoMode } = useAuth();
  
  const hideHeader = location.pathname === '/' || 
                     location.pathname === '/login' || 
                     location.pathname === '/signup' ||
                     location.pathname === '/forgot-password' ||
                     location.pathname === '/reset-password' ||
                     location.pathname === '/admin/create-test-users' ||
                     location.pathname === '/admin/create-demo-user';

  return (
    <div className="flex flex-col min-h-screen">
      {isDemoMode && <DemoModeBanner />}
      {!hideHeader && <Header />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {routes.map((route, index) => {
              const { Component, protected: isProtected, requireAdmin } = route;
              const element = isProtected ? (
                <ProtectedRoute requireAdmin={requireAdmin}>
                  <Component />
                </ProtectedRoute>
              ) : (
                <Component />
              );
              
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={element}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <CookieConsent />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
