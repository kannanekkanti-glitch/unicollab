import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { RightSidebar } from './components/common/RightSidebar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { Modal } from './components/common/Modal';
import { PostCreator } from './components/feed/PostCreator';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerificationPage } from './pages/OtpVerificationPage';
import { HomeFeedPage } from './pages/HomeFeedPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { FindTeammatesPage } from './pages/FindTeammatesPage';
import { HackathonsPage } from './pages/HackathonsPage';
import { EventsPage } from './pages/EventsPage';
import { ClubsPage } from './pages/ClubsPage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Standard 3-column campus app layout
const AppLayout: React.FC<{ children: React.ReactNode; hideRightSidebar?: boolean }> = ({ 
  children, 
  hideRightSidebar = false 
}) => {
  const [showGlobalPostModal, setShowGlobalPostModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar onOpenCreatePost={() => setShowGlobalPostModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-8 flex gap-6">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
        {!hideRightSidebar && <RightSidebar />}
      </main>

      <MobileNavigation />

      {/* Global Quick Post Modal */}
      <Modal
        isOpen={showGlobalPostModal}
        onClose={() => setShowGlobalPostModal(false)}
        title="Publish Campus Post"
        maxWidth="lg"
      >
        <PostCreator
          onPostCreated={() => {
            setShowGlobalPostModal(false);
            window.location.href = '/feed';
          }}
          onCancel={() => setShowGlobalPostModal(false)}
        />
      </Modal>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-xs animate-pulse">
        Connecting to campus network...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={user ? <Navigate to="/feed" replace /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />

      {/* Campus Authenticated Routes */}
      <Route
        path="/feed"
        element={
          <AppLayout>
            <HomeFeedPage />
          </AppLayout>
        }
      />

      <Route
        path="/projects"
        element={
          <AppLayout hideRightSidebar>
            <ProjectsPage />
          </AppLayout>
        }
      />

      <Route
        path="/find-teammates"
        element={
          <AppLayout hideRightSidebar>
            <FindTeammatesPage />
          </AppLayout>
        }
      />

      <Route
        path="/hackathons"
        element={
          <AppLayout hideRightSidebar>
            <HackathonsPage />
          </AppLayout>
        }
      />

      <Route
        path="/events"
        element={
          <AppLayout hideRightSidebar>
            <EventsPage />
          </AppLayout>
        }
      />

      <Route
        path="/clubs"
        element={
          <AppLayout hideRightSidebar>
            <ClubsPage />
          </AppLayout>
        }
      />

      <Route
        path="/chat"
        element={
          <AppLayout hideRightSidebar>
            <ChatPage />
          </AppLayout>
        }
      />

      <Route
        path="/notifications"
        element={
          <AppLayout>
            <NotificationsPage />
          </AppLayout>
        }
      />

      <Route
        path="/search"
        element={
          <AppLayout>
            <SearchPage />
          </AppLayout>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <AppLayout>
            <StudentProfilePage />
          </AppLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />

      <Route
        path="/admin"
        element={
          <AppLayout hideRightSidebar>
            <AdminDashboardPage />
          </AppLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
