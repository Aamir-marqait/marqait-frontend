/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type {
  LogoGeneratorRequest,
  LogoGeneratorResponse,
  SocialMediaGeneratorRequest,
  SocialMediaGeneratorResponse,
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
          logo_style: data.logo_type, // Backend expects both logo_type and logo_style
          ...(data.preferred_colors && { preferred_colors: data.preferred_colors }),
          ...(data.tone && { tone: data.tone }),
          ...(data.industry_keywords && { industry_keywords: data.industry_keywords })
        },
        priority: 'NORMAL',
        max_retries: 3
      };

      const response = await axiosInstance.post<LogoGeneratorResponse>(
        `${this.baseUrl}/logo_generator/execute`,
        requestPayload,
        { timeout: 300000 } // 5 minutes for AI generation
      );

      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async generateSocialMediaPost(data: SocialMediaGeneratorRequest): Promise<SocialMediaGeneratorResponse> {
    try {
      const requestPayload: AgentExecuteRequest = {
        parameters: {
          platform: data.platform,
          type: data.type,
          context: data.context,
          ...(data.carousel !== undefined && { carousel: data.carousel }),
          ...(data.brand_name && { brand_name: data.brand_name }),
          ...(data.target_audience && { target_audience: data.target_audience }),
          ...(data.additional_context && { additional_context: data.additional_context })
        },
        priority: 'NORMAL',
        max_retries: 3
      };

      const response = await axiosInstance.post<SocialMediaGeneratorResponse>(
        `${this.baseUrl}/social_media_generator/execute`,
        requestPayload,
        { timeout: 300000 } // 5 minutes for AI generation
      );

      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const agentsService = new AgentsService();