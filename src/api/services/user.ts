/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type { User, UserStats, CreditsBalance } from '../types';
import { handleApiError } from '../utils';

class UserService {
  private readonly baseUrl = '/api/v1/users';

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(
        `${this.baseUrl}/me`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axiosInstance.get<UserStats>(
        `${this.baseUrl}/me/stats`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getCreditsBalance(): Promise<CreditsBalance> {
    try {
      const response = await axiosInstance.get<CreditsBalance>(
        `/api/v1/credits/balance`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const userService = new UserService();