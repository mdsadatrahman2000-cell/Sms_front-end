export interface Class {
  id: string;
  tenantId: string;
  name: string;
  section?: string;
  roomId?: string;
  classTeacherId?: string;
  academicYearId: string;
  capacity?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  subject: { id: string; name: string; code?: string };
  teacher: { id: string; firstName: string; lastName: string };
}
