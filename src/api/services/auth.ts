/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type { 
  SignupRequest, 
  SignupResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse,
  SigninRequest,
  SigninResponse,
  RefreshTokenResponse,
  User,
  UserStats
} from '../types';
import { userService } from './user';
import { handleApiError } from '../utils';

class AuthService {
  private readonly baseUrl = '/api/v1/auth';

  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await axiosInstance.post<SignupResponse>(
        `${this.baseUrl}/signup`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await axiosInstance.post<VerifyOtpResponse>(
        `${this.baseUrl}/verify-otp`,
        data
      );
      
      if (response.data.tokens) {
        this.saveAuthData(response.data.tokens, response.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async signin(data: SigninRequest): Promise<SigninResponse & { userStats?: UserStats }> {
    try {
      const response = await axiosInstance.post<SigninResponse>(
        `${this.baseUrl}/signin`,
        data
      );
      
      if (response.data.tokens) {
        this.saveAuthData(response.data.tokens, response.data.user);
        
        // Fetch updated user profile and stats after login
        try {
          const [userProfile, userStats] = await Promise.all([
            userService.getCurrentUser(),
            userService.getUserStats()
          ]);
          
          // Update stored user data with fresh profile
          this.saveAuthData(response.data.tokens, userProfile);
          
          return {
            ...response.data,
            user: userProfile,
            userStats
          };
        } catch (profileError) {
          console.warn('Failed to fetch user profile/stats:', profileError);
          return response.data;
        }
      }
      
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post<RefreshTokenResponse>(
        `${this.baseUrl}/refresh`,
        { refresh_token: refreshToken }
      );
      
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      return response.data;
    } catch (error: any) {
      this.logout();
      throw handleApiError(error);
    }
  }

  private saveAuthData(tokens: any, user: any): void {
    localStorage.setItem('auth_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  async signout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axiosInstance.post(`${this.baseUrl}/signout`, {
          refresh_token: refreshToken
        });
      }
    } catch (error: any) {
      console.error('Signout error:', error);
    } finally {
      this.logout();
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async fetchUserProfile(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) return null;
      const userProfile = await userService.getCurrentUser();
      
      // Update stored user data
      const tokens = {
        access_token: this.getAccessToken() || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
        token_type: 'bearer',
        expires_in: 1800
      };
      this.saveAuthData(tokens, userProfile);
      
      return userProfile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  async fetchUserStats(): Promise<UserStats | null> {
    try {
      if (!this.isAuthenticated()) return null;
      return await userService.getUserStats();
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return null;
    }
  }
}

export const authService = new AuthService();