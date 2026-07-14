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

export const dashboardApi = {
  stats: () => request<any>("/dashboard/stats"),
  recentActivity: () => request<any[]>("/dashboard/recent-activity"),
  upcomingEvents: () => request<any[]>("/dashboard/upcoming-events"),
};

export const rolesApi = {
  list: () => request<any[]>("/roles"),
  get: (id: string) => request<any>(`/roles/${id}`),
  create: (data: any) =>
    request<any>("/roles", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/roles/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/roles/${id}`, { method: "DELETE" }),
  permissions: () => request<any>("/roles/permissions"),
};

export const attendancesApi = {
  list: (params?: { page?: number; classId?: string; date?: string; studentId?: string }) => {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.classId) p.set("classId", params.classId);
    if (params?.date) p.set("date", params.date);
    if (params?.studentId) p.set("studentId", params.studentId);
    return request<{ records: any[]; total: number; page: number; totalPages: number }>(`/attendances?${p.toString()}`);
  },
  create: (data: any) => request<any>("/attendances", { method: "POST", body: JSON.stringify(data) }),
  bulkCreate: (data: any) => request<any>("/attendances/bulk", { method: "POST", body: JSON.stringify(data) }),
  getByStudent: (studentId: string, month?: string) => {
    const p = month ? `?month=${month}` : "";
    return request<any[]>(`/attendances/student/${studentId}${p}`);
  },
  getByClass: (classId: string, date: string) =>
    request<any[]>(`/attendances/class/${classId}?date=${date}`),
  getSummary: (classId: string, month: string) =>
    request<any[]>(`/attendances/summary/${classId}?month=${month}`),
};

export const examsApi = {
  list: (params?: { classId?: string; subjectId?: string; type?: string; status?: string }) => {
    const p = new URLSearchParams();
    if (params?.classId) p.set("classId", params.classId);
    if (params?.subjectId) p.set("subjectId", params.subjectId);
    if (params?.type) p.set("type", params.type);
    if (params?.status) p.set("status", params.status);
    return request<{ exams: any[]; total: number }>(`/exams?${p.toString()}`);
  },
  get: (id: string) => request<any>(`/exams/${id}`),
  create: (data: any) => request<any>("/exams", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/exams/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/exams/${id}`, { method: "DELETE" }),
  submitMarks: (examId: string, data: any) =>
    request<any>(`/exams/${examId}/marks`, { method: "POST", body: JSON.stringify(data) }),
  getResults: (examId: string) => request<any>(`/exams/${examId}/results`),
};

export const feesApi = {
  structures: (classId?: string) => {
    const p = classId ? `?classId=${classId}` : "";
    return request<any[]>(`/fees/structures${p}`);
  },
  createStructure: (data: any) =>
    request<any>("/fees/structures", { method: "POST", body: JSON.stringify(data) }),
  invoices: (params?: { studentId?: string; status?: string }) => {
    const p = new URLSearchParams();
    if (params?.studentId) p.set("studentId", params.studentId);
    if (params?.status) p.set("status", params.status);
    return request<any[]>(`/fees/invoices?${p.toString()}`);
  },
  createInvoice: (data: any) =>
    request<any>("/fees/invoices", { method: "POST", body: JSON.stringify(data) }),
  recordPayment: (data: any) =>
    request<any>("/fees/payments", { method: "POST", body: JSON.stringify(data) }),
  revenue: () => request<{ collected: number; pending: number }>("/fees/revenue"),
};

export const hrApi = {
  list: (params?: { page?: number; department?: string }) => {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.department) p.set("department", params.department);
    return request<{ teachers: any[]; total: number; page: number; totalPages: number }>(`/hr?${p.toString()}`);
  },
  get: (id: string) => request<any>(`/hr/${id}`),
  payroll: (month: string) => request<any>(`/hr/payroll/summary?month=${month}`),
};

export const notificationsApi = {
  list: () => request<any[]>("/notifications"),
  unreadCount: () => request<{ count: number }>("/notifications/unread-count"),
  markAsRead: (messageId: string) =>
    request<any>(`/notifications/${messageId}/read`, { method: "POST" }),
  notices: () => request<any[]>("/notifications/notices"),
  createNotice: (data: any) =>
    request<any>("/notifications/notices", { method: "POST", body: JSON.stringify(data) }),
  deleteNotice: (id: string) =>
    request(`/notifications/notices/${id}`, { method: "DELETE" }),
};

export const libraryApi = {
  list: (params?: { page?: number; search?: string }) => {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.search) p.set("search", params.search);
    return request<{ books: any[]; total: number }>(`/library/books?${p.toString()}`);
  },
  get: (id: string) => request<any>(`/library/books/${id}`),
  create: (data: any) => request<any>("/library/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/library/books/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/library/books/${id}`, { method: "DELETE" }),
  issue: (data: any) => request<any>("/library/issue", { method: "POST", body: JSON.stringify(data) }),
  return: (issueId: string, data: any) => request<any>(`/library/return/${issueId}`, { method: "POST", body: JSON.stringify(data) }),
  issued: () => request<any[]>("/library/issued"),
};

export const transportApi = {
  routes: () => request<any[]>("/transport/routes"),
  getRoute: (id: string) => request<any>(`/transport/routes/${id}`),
  createRoute: (data: any) => request<any>("/transport/routes", { method: "POST", body: JSON.stringify(data) }),
  updateRoute: (id: string, data: any) => request<any>(`/transport/routes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteRoute: (id: string) => request(`/transport/routes/${id}`, { method: "DELETE" }),
  assign: (data: any) => request<any>("/transport/assign", { method: "POST", body: JSON.stringify(data) }),
  unassign: (studentId: string) => request(`/transport/unassign/${studentId}`, { method: "DELETE" }),
};

export const hostelApi = {
  list: () => request<any[]>("/hostel"),
  get: (id: string) => request<any>(`/hostel/${id}`),
  create: (data: any) => request<any>("/hostel", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/hostel/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/hostel/${id}`, { method: "DELETE" }),
  rooms: (hostelId?: string) => {
    const p = hostelId ? `?hostelId=${hostelId}` : "";
    return request<any[]>(`/hostel/rooms${p}`);
  },
  createRoom: (data: any) => request<any>("/hostel/rooms", { method: "POST", body: JSON.stringify(data) }),
  assign: (data: any) => request<any>("/hostel/assign", { method: "POST", body: JSON.stringify(data) }),
  unassign: (allocationId: string) => request(`/hostel/unassign/${allocationId}`, { method: "DELETE" }),
};

export const inventoryApi = {
  list: (params?: { page?: number; category?: string; search?: string }) => {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.category) p.set("category", params.category);
    if (params?.search) p.set("search", params.search);
    return request<{ items: any[]; total: number }>(`/inventory?${p.toString()}`);
  },
  get: (id: string) => request<any>(`/inventory/${id}`),
  create: (data: any) => request<any>("/inventory", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/inventory/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/inventory/${id}`, { method: "DELETE" }),
  movement: (id: string, data: any) => request<any>(`/inventory/${id}/movements`, { method: "POST", body: JSON.stringify(data) }),
  categories: () => request<any[]>("/inventory/categories"),
  lowStock: () => request<any[]>("/inventory/low-stock"),
};

export const lmsApi = {
  courses: (params?: { page?: number }) => {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    return request<{ courses: any[]; total: number }>(`/lms/courses?${p.toString()}`);
  },
  getCourse: (id: string) => request<any>(`/lms/courses/${id}`),
  createCourse: (data: any) => request<any>("/lms/courses", { method: "POST", body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) => request<any>(`/lms/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCourse: (id: string) => request(`/lms/courses/${id}`, { method: "DELETE" }),
  addModule: (courseId: string, data: any) => request<any>(`/lms/courses/${courseId}/modules`, { method: "POST", body: JSON.stringify(data) }),
  addLesson: (moduleId: string, data: any) => request<any>(`/lms/modules/${moduleId}/lessons`, { method: "POST", body: JSON.stringify(data) }),
  assignments: (classId?: string) => {
    const p = classId ? `?classId=${classId}` : "";
    return request<any[]>(`/lms/assignments${p}`);
  },
  createAssignment: (data: any) => request<any>("/lms/assignments", { method: "POST", body: JSON.stringify(data) }),
  submitAssignment: (assignmentId: string, data: any) =>
    request<any>(`/lms/assignments/${assignmentId}/submit`, { method: "POST", body: JSON.stringify(data) }),
  gradeSubmission: (submissionId: string, data: any) =>
    request<any>(`/lms/submissions/${submissionId}/grade`, { method: "POST", body: JSON.stringify(data) }),
};

export const timetableApi = {
  getByClass: (classId: string) => request<any[]>(`/timetable/class/${classId}`),
  getByTeacher: (teacherId: string) => request<any[]>(`/timetable/teacher/${teacherId}`),
  getMy: () => request<any[]>("/timetable/my"),
  create: (data: any) => request<any>("/timetable", { method: "POST", body: JSON.stringify(data) }),
  bulkCreate: (data: any) => request<any>("/timetable/bulk", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/timetable/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/timetable/${id}`, { method: "DELETE" }),
  deleteByClass: (classId: string) => request(`/timetable/class/${classId}`, { method: "DELETE" }),
};
