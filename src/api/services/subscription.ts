import axiosInstance from '@/lib/axios';
import type { SubscriptionStatus } from '../types';
import { handleApiError } from '../utils';

class SubscriptionService {
  private readonly baseUrl = '/api/v1/subscriptions';

  async getCurrentSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await axiosInstance.get<SubscriptionStatus>(
        `${this.baseUrl}/current`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const subscriptionService = new SubscriptionService();