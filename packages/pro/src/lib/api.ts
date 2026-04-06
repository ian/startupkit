import axios, { AxiosError } from 'axios';
import { config } from './config.js';
import chalk from 'chalk';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>({
  method,
  path,
  data,
  params,
  timeout = 30000,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}): Promise<T> {
  if (!config.apiKey) {
    throw new ApiError('Not logged in. Run "startupkit-pro login" first.');
  }

  try {
    const response = await axios.request<T>({
      method,
      url: `${config.apiBaseUrl}${path}`,
      data,
      params,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (statusCode === 401) {
        config.clear();
        throw new ApiError('Session expired. Please run "startupkit-pro login" again.', 401);
      }

      if (statusCode === 429) {
        throw new ApiError('Rate limited. Please wait a moment and try again.', 429);
      }

      if (statusCode === 402) {
        throw new ApiError(
          `Insufficient credits. ${chalk.cyan('Run "startupkit-pro credits" to check your balance.')}`,
          402
        );
      }

      throw new ApiError(message, statusCode, error.code);
    }
    throw error;
  }
}

export interface ApiResponse<T> {
  data: T;
  creditsUsed: number;
  creditsRemaining: number;
}

export async function trackedApiRequest<T>(
  request: () => Promise<T>
): Promise<ApiResponse<T>> {
  const before = config.credits;
  const result = await request();

  // Refresh credits if we have them
  if (before !== undefined && config.credits !== undefined) {
    const used = typeof before === 'number' && typeof config.credits === 'number'
      ? before - config.credits
      : 0;
    return {
      data: result,
      creditsUsed: used > 0 ? used : 0,
      creditsRemaining: config.credits,
    };
  }

  return {
    data: result,
    creditsUsed: 0,
    creditsRemaining: 0,
  };
}
