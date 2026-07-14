"use client"

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/auth";
import { API_URL } from "@/lib/constants";

interface UseApiOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>({ url, method = "GET", body, immediate = true }: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Request failed");
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [immediate]);

  return { data, loading, error, refetch: fetchData };
}
