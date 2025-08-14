export interface SignupRequest {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
  company_name?: string;
  industry?: string;
}

export interface VerifyOtpRequest {
  email_address: string;
  otp_code: string;
}

export interface SigninRequest {
  email_address: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  company_name?: string;
  industry?: string;
  profile_image_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  plan?: 'free' | 'professional' | 'enterprise';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface SignupResponse {
  message: string;
  user: null;
  tokens: null;
}

export interface VerifyOtpResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface SigninResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface UserStats {
  account_age_days: number;
  total_executions: number;
  successful_executions: number;
  success_rate: number;
  total_credits_spent: number;
  current_subscription: 'free' | 'professional' | 'enterprise';
  member_since: string;
  last_activity: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}