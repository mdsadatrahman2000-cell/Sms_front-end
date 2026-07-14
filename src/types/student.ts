export interface Student {
  id: string;
  tenantId: string;
  userId: string;
  user: { firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string };
  admissionNumber: string;
  rollNumber?: string;
  classId?: string;
  class?: { id: string; name: string; section?: string };
  section?: string;
  house?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  nationality?: string;
  previousSchool?: string;
  admissionDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentGuardian {
  id: string;
  studentId: string;
  guardianId: string;
  relationship: string;
  isPrimary: boolean;
  guardian: { id: string; firstName: string; lastName: string; phone: string; email: string };
}
