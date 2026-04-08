import axios from 'axios';
import { config } from './config.js';

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
    throw new ApiError('Not logged in. Set STARTUPKIT_API_KEY environment variable.');
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
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (statusCode === 401) {
        throw new ApiError('Session expired. Please check your API key.', 401);
      }

      if (statusCode === 402) {
        throw new ApiError('Insufficient credits. Please upgrade your plan.', 402);
      }

      if (statusCode === 429) {
        throw new ApiError('Rate limited. Please wait and try again.', 429);
      }

      throw new ApiError(message, statusCode, error.code);
    }
    throw error;
  }
}
