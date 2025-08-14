import { useState, useEffect, useCallback, useRef } from 'react';
import { subscriptionService } from '@/api/services';
import type { SubscriptionStatus } from '@/api/types';

interface UseSubscriptionReturn {
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const cacheRef = useRef<{ data: SubscriptionStatus; timestamp: number } | null>(null);
  
  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setError(null);
      
      // Check cache first
      if (cacheRef.current) {
        const { data, timestamp } = cacheRef.current;
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setSubscriptionStatus(data);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const data = await subscriptionService.getCurrentSubscriptionStatus();
      
      // Update cache
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };
      
      setSubscriptionStatus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription status';
      setError(errorMessage);
      console.error('Failed to fetch subscription status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // Clear cache for manual refetch
    cacheRef.current = null;
    await fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchSubscriptionStatus();
    }
  }, [fetchSubscriptionStatus]);

  return {
    subscriptionStatus,
    isLoading,
    error,
    refetch
  };
}