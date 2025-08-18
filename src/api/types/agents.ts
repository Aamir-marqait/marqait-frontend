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