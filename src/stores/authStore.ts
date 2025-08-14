import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api';
import type { User, UserStats } from '../api/types';

interface AuthState {
  user: User | null;
  userStats: UserStats | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUserPlan: (plan: 'free' | 'professional' | 'enterprise') => void;
  refreshUserProfile: () => Promise<void>;
  refreshUserStats: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userStats: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await authService.signin({
            email_address: email,
            password: password
          });
          
          set({ 
            user: response.user, 
            userStats: response.userStats || null,
            isAuthenticated: true 
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logout: async () => {
        try {
          await authService.signout();
        } catch (error) {
          console.error('Signout failed:', error);
        } finally {
          set({ user: null, userStats: null, isAuthenticated: false });
        }
      },
      initialize: async () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        if (user && isAuthenticated) {
          set({ user, isAuthenticated: true });
          
          // Try to fetch fresh user profile and stats
          try {
            const [userProfile, userStats] = await Promise.all([
              authService.fetchUserProfile(),
              authService.fetchUserStats()
            ]);
            
            set((state) => ({ 
              ...state, 
              user: userProfile || state.user,
              userStats: userStats || state.userStats
            }));
          } catch (error) {
            console.warn('Failed to refresh user data on initialization:', error);
          }
        }
      },
      updateUserPlan: (plan: 'free' | 'professional' | 'enterprise') => {
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null
        }));
      },
      refreshUserProfile: async () => {
        try {
          const user = await authService.fetchUserProfile();
          if (user) {
            set((state) => ({ ...state, user }));
          }
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
        }
      },
      refreshUserStats: async () => {
        try {
          const userStats = await authService.fetchUserStats();
          if (userStats) {
            set((state) => ({ ...state, userStats }));
          }
        } catch (error) {
          console.error('Failed to refresh user stats:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);