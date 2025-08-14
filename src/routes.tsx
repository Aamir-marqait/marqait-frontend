import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import About from "./pages/About";
import Dashboard from "./pages/dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import OtpVerification from "./pages/auth/OtpVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PlaceholderPage from "./pages/PlaceholderPage";
import ImageEditor from "./pages/image-editor";
import ProtectedRoute from "./components/ProtectedRoute";
import UpgradeCredit from "./pages/account/UpgradeCredit";
import LogoGenerator from "./pages/LogoGenerator";
import SocialMediaPostGenerator from "./pages/SocialMediaPostGenerator";

export const createRoutes = (
  isAuthenticated: boolean,
  AppLayout: ({ children }: { children: React.ReactNode }) => React.ReactElement
): RouteObject[] => [
  {
    path: "/",
    element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />,
  },
  {
    path: "/accounts/emailsignup",
    element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />,
  },
  {
    path: "/accounts/emailsignup/otp-verification",
    element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <OtpVerification />,
  },
  {
    path: "/accounts/password/reset/",
    element: isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <ForgotPassword />
    ),
  },
  {
    path: "/accounts/password/reset/confirm/",
    element: isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <ResetPassword />
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <About />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/image-editor",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <ImageEditor />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/strategy",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Strategy Generator"
            description="Create comprehensive marketing strategies with AI assistance"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/brand-book",
    element: (
      <ProtectedRoute requiredPlan="free">
        <AppLayout>
          <PlaceholderPage
            title="Brand Book Creator"
            description="Design and generate professional brand guidelines"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/logo-generator",
    element: (
      <ProtectedRoute requiredPlan="free">
        <AppLayout>
          <LogoGenerator />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/campaign",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Campaign Generator"
            description="Create powerful marketing campaigns with AI"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/content",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Content Generator"
            description="Generate engaging content for all your marketing needs"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/social-post",
    element: (
      <ProtectedRoute requiredPlan="free">
        <AppLayout>
          <PlaceholderPage
            title="Social Post Creator"
            description="Design stunning social media posts"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/social-media-post-generator",
    element: (
      <ProtectedRoute requiredPlan="free">
        <AppLayout>
          <SocialMediaPostGenerator />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ad-campaigns",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Ad Campaigns"
            description="Manage and optimize your advertising campaigns"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/content-calendar",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Content Calendar"
            description="Plan and schedule your content strategy"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Analytics"
            description="Track performance and gain insights"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute requiredPlan="professional">
        <AppLayout>
          <PlaceholderPage
            title="Settings"
            description="Customize your MARQAIT experience"
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/account/upgrade/credit",
    element: (
      <ProtectedRoute>
        <UpgradeCredit />
      </ProtectedRoute>
    ),
  },
];