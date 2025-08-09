import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DUMMY_CREDENTIALS = {
  email: 'anas@marqait.com',
  password: 'Anassabah@123'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
              const user = { email, name: 'Anas Sabah' };
              set({ user, isAuthenticated: true });
              resolve(true);
            } else {
              resolve(false);
            }
          }, 1000);
        });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);