import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await authService.signin({
            email_address: email,
            password: password
          });
          
          set({ 
            user: response.user, 
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
          set({ user: null, isAuthenticated: false });
        }
      },
      initialize: () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        if (user && isAuthenticated) {
          set({ user, isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);