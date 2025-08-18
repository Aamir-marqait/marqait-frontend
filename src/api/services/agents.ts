/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type {
  LogoGeneratorRequest,
  LogoGeneratorResponse,
  AgentExecuteRequest
} from '../types';
import { handleApiError } from '../utils';

class AgentsService {
  private readonly baseUrl = '/api/v1/agents';

  async generateLogo(data: LogoGeneratorRequest): Promise<LogoGeneratorResponse> {
    try {
      const requestPayload: AgentExecuteRequest = {
        parameters: {
          company_name: data.company_name,
          company_description: data.company_description,
          logo_type: data.logo_type,
          ...(data.preferred_colors && { preferred_colors: data.preferred_colors }),
          ...(data.tone && { tone: data.tone }),
          ...(data.industry_keywords && { industry_keywords: data.industry_keywords })
        },
        priority: 'NORMAL',
        max_retries: 3
      };

      const response = await axiosInstance.post<LogoGeneratorResponse>(
        `${this.baseUrl}/logo_generator/execute`,
        requestPayload
      );

      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const agentsService = new AgentsService();