/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type { 
  SignupRequest, 
  SignupResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse,
  SigninRequest,
  SigninResponse,
  RefreshTokenResponse
} from '../types';
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

  async signin(data: SigninRequest): Promise<SigninResponse> {
    try {
      const response = await axiosInstance.post<SigninResponse>(
        `${this.baseUrl}/signin`,
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
}

export const authService = new AuthService();