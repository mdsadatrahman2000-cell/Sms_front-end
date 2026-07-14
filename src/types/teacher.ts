export interface Teacher {
  id: string;
  tenantId: string;
  userId: string;
  user: { firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string };
  employeeId?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  experience?: number;
  salary?: number;
  joiningDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
