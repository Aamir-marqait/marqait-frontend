/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LogoGeneratorRequest {
  company_name: string;
  company_description: string;
  logo_type: string;
  preferred_colors?: string[];
  tone?: string;
  industry_keywords?: string[];
}

export interface LogoGeneratorResponse {
  execution_id: string;
  status: string;
  output_data: {
    logo_image_url: string;
    explanation: string;
    logo_type: string;
    company_name: string;
    colors_used?: string[];
    style_traits?: string;
    generation_prompt?: string;
    metadata?: {
      generation_time_seconds: number;
      image_size: string;
      model_used: string;
    };
  };
}

export interface AgentExecuteRequest {
  parameters: Record<string, any>;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  max_retries?: number;
}

export type LogoType = 
  | 'wordmark' 
  | 'lettermark' 
  | 'pictorial' 
  | 'abstract' 
  | 'combination' 
  | 'emblem';

export interface SocialMediaGeneratorRequest {
  platform: string;
  type: string;
  context: string;
  carousel?: boolean;
  brand_name?: string;
  target_audience?: string;
  additional_context?: string;
}

export interface SocialMediaImage {
  url: string;
  alt_text: string;
  sequence: number;
}

export interface SocialMediaGeneratorResponse {
  execution_id: string;
  status: string;
  output_data: {
    images: SocialMediaImage[];
    caption: string;
    hashtags: string[];
    platform: string;
    content_type: string;
    is_carousel: boolean;
    engagement_tips: string[];
    best_posting_times: string[];
    character_count: number;
    metadata: {
      generation_time_seconds: number;
      context_used: string;
      model_used: string;
      total_images: number;
    };
  };
}

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'linkedin';
export type ContentType = 'post' | 'story';