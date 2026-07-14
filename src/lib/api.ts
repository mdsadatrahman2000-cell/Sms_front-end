const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://sms-back-end-cd36.onrender.com/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "An error occurred" };
    }

    return { data };
  } catch {
    return { error: "Network error" };
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: () => request("/auth/logout", { method: "POST" }),
};

export const studentsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    return request<{ students: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/students?${searchParams.toString()}`
    );
  },
  get: (id: string) => request<any>(`/students/${id}`),
  create: (data: any) =>
    request<any>("/students", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/students/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/students/${id}`, { method: "DELETE" }),
};

export const teachersApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    return request<{ teachers: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/teachers?${searchParams.toString()}`
    );
  },
  get: (id: string) => request<any>(`/teachers/${id}`),
  create: (data: any) =>
    request<any>("/teachers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/teachers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/teachers/${id}`, { method: "DELETE" }),
};

export const classesApi = {
  list: () => request<any[]>("/classes"),
  get: (id: string) => request<any>(`/classes/${id}`),
  create: (data: any) =>
    request<any>("/classes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/classes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/classes/${id}`, { method: "DELETE" }),
};

export const subjectsApi = {
  list: () => request<any[]>("/subjects"),
  get: (id: string) => request<any>(`/subjects/${id}`),
  create: (data: any) =>
    request<any>("/subjects", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/subjects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/subjects/${id}`, { method: "DELETE" }),
};

export const tenantsApi = {
  list: () => request<any[]>("/tenants"),
  get: (id: string) => request<any>(`/tenants/${id}`),
  create: (data: any) =>
    request<any>("/tenants", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/tenants/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/tenants/${id}`, { method: "DELETE" }),
};

export const academicYearsApi = {
  list: () => request<any[]>("/academic-years"),
  get: (id: string) => request<any>(`/academic-years/${id}`),
  create: (data: any) =>
    request<any>("/academic-years", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/academic-years/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/academic-years/${id}`, { method: "DELETE" }),
  setCurrent: (id: string) =>
    request<any>(`/academic-years/${id}/set-current`, { method: "POST" }),
};

export const guardiansApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    return request<{ guardians: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/guardians?${searchParams.toString()}`
    );
  },
  get: (id: string) => request<any>(`/guardians/${id}`),
  create: (data: any) =>
    request<any>("/guardians", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/guardians/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/guardians/${id}`, { method: "DELETE" }),
  linkStudent: (guardianId: string, studentId: string) =>
    request<any>(`/guardians/${guardianId}/link/${studentId}`, { method: "POST" }),
  unlinkStudent: (guardianId: string, studentId: string) =>
    request(`/guardians/${guardianId}/unlink/${studentId}`, { method: "DELETE" }),
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://sms-back-end-cd36.onrender.com/api/v1";

export const uploadApi = {
  upload: async (file: File, entityType: string, entityId?: string, category?: string, description?: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", entityType);
    if (entityId) formData.append("entityId", entityId);
    if (category) formData.append("category", category);
    if (description) formData.append("description", description);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { error: data.message || "Upload failed" };
    }

    return { data: await response.json() };
  },

  list: (params?: { entityType?: string; entityId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.entityType) searchParams.set("entityType", params.entityType);
    if (params?.entityId) searchParams.set("entityId", params.entityId);
    return request<any[]>(`/upload?${searchParams.toString()}`);
  },

  download: (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return `${API_BASE}/upload/${id}/download${token ? `?token=${token}` : ""}`;
  },

  delete: (id: string) => request(`/upload/${id}`, { method: "DELETE" }),
};
