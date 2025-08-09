import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import About from "./pages/About";
import Dashboard from "./pages/dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PlaceholderPage from "./pages/PlaceholderPage";

import Header from "./components/Header";
import Sidebar from "./components/app-sidebar";
import ImageEditor from "./pages/image-editor";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 left-0 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:left-16" : "lg:left-64"
        }`}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/accounts/emailsignup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AppLayout>
                <About />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/image-editor"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ImageEditor />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Strategy Generator"
                  description="Create comprehensive marketing strategies with AI assistance"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-book"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Brand Book Creator"
                  description="Design and generate professional brand guidelines"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Campaign Generator"
                  description="Create powerful marketing campaigns with AI"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Content Generator"
                  description="Generate engaging content for all your marketing needs"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-post"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Social Post Creator"
                  description="Design stunning social media posts"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ad-campaigns"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Ad Campaigns"
                  description="Manage and optimize your advertising campaigns"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-calendar"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Content Calendar"
                  description="Plan and schedule your content strategy"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Analytics"
                  description="Track performance and gain insights"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlaceholderPage
                  title="Settings"
                  description="Customize your MARQAIT experience"
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
