import { create } from 'zustand';
import { userService } from '@/api/services';
import type { CreditsBalance } from '@/api/types';

interface CreditState {
  creditsBalance: CreditsBalance | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // Actions
  fetchCreditsBalance: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  clearError: () => void;
}

// Cache duration: 30 seconds for real-time updates
const CACHE_DURATION = 30 * 1000;

export const useCreditStore = create<CreditState>((set, get) => ({
  creditsBalance: null,
  isLoading: false,
  error: null,
  lastFetchTime: null,

  fetchCreditsBalance: async () => {
    const state = get();
    
    // Check if we have fresh data (within cache duration)
    if (
      state.creditsBalance && 
      state.lastFetchTime && 
      Date.now() - state.lastFetchTime < CACHE_DURATION
    ) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const creditsBalance = await userService.getCreditsBalance();
      set({ 
        creditsBalance, 
        isLoading: false, 
        lastFetchTime: Date.now() 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch credits balance';
      set({ error: errorMessage, isLoading: false });
      console.error('Failed to fetch credits balance:', error);
    }
  },


  refreshCredits: async () => {
    // Force refresh by clearing cache
    set({ lastFetchTime: null });
    await get().fetchCreditsBalance();
  },

  clearError: () => {
    set({ error: null });
  }
}));

