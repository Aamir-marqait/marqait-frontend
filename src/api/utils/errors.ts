import { AxiosError } from 'axios';
import type { ApiError } from '../types';

export class ApiException extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}

export const handleApiError = (error: AxiosError): ApiException => {
  if (error.response?.data) {
    const errorData = error.response.data as ApiError;
    return new ApiException(
      errorData.message || 'An error occurred',
      error.response.status,
      errorData.errors
    );
  }

  return new ApiException(
    error.message || 'Network error occurred',
    error.response?.status || 500
  );
};

export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
  if (!errors) return '';
  
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
};