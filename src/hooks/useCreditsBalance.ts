import { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '@/api/services';
import type { CreditsBalance } from '@/api/types';

interface UseCreditsBalanceReturn {
  creditsBalance: CreditsBalance | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCreditsBalance(): UseCreditsBalanceReturn {
  const [creditsBalance, setCreditsBalance] = useState<CreditsBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const cacheRef = useRef<{ data: CreditsBalance; timestamp: number } | null>(null);
  
  // Cache duration: 2 minutes (credits change more frequently)
  const CACHE_DURATION = 2 * 60 * 1000;

  const fetchCreditsBalance = useCallback(async () => {
    try {
      setError(null);
      
      // Check cache first
      if (cacheRef.current) {
        const { data, timestamp } = cacheRef.current;
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCreditsBalance(data);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const data = await userService.getCreditsBalance();
      
      // Update cache
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };
      
      setCreditsBalance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch credits balance';
      setError(errorMessage);
      console.error('Failed to fetch credits balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // Clear cache for manual refetch
    cacheRef.current = null;
    await fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchCreditsBalance();
    }
  }, [fetchCreditsBalance]);

  return {
    creditsBalance,
    isLoading,
    error,
    refetch
  };
}