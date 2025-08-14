import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'free' | 'professional' | 'enterprise';
}

const ProtectedRoute = ({ children, requiredPlan }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific plan is required, check if user has access
  if (requiredPlan) {
    const userPlan = user?.plan || 'free'; // Default to free if no plan specified
    
    // Define plan hierarchy: free < professional < enterprise
    const planHierarchy = { free: 0, professional: 1, enterprise: 2 };
    const requiredLevel = planHierarchy[requiredPlan];
    const userLevel = planHierarchy[userPlan];
    
    // If user's plan level is less than required, redirect to dashboard
    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;