export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  description?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  classId: string;
  subjectId: string;
  startDate: string;
  endDate: string;
  totalMarks: number;
  passingMarks: number;
  status: string;
  class?: { name: string; section?: string };
  subject?: { name: string };
  createdAt: string;
}

export interface Mark {
  id: string;
  tenantId: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  exam?: Exam;
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  tenantId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  class?: { name: string; section?: string };
  subject?: { name: string };
  teacher?: { firstName: string; lastName: string };
}
