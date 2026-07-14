export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: { code: string; details?: any };
  timestamp: string;
  path: string;
}
