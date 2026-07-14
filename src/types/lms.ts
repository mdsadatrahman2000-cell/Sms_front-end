export interface Course {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  subjectId?: string;
  teacherId: string;
  classId?: string;
  status: "draft" | "published" | "archived";
  subject?: { name: string };
  teacher?: { firstName: string; lastName: string };
  modules?: CourseModule[];
  _count?: { modules: number };
  createdAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: "text" | "video" | "document" | "quiz";
  contentUrl?: string;
  contentText?: string;
  durationMinutes?: number;
  orderIndex: number;
}

export interface Assignment {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  totalMarks?: number;
  dueDate: string;
  allowLateSubmission?: boolean;
  latePenaltyPercent?: number;
  class?: { name: string };
  subject?: { name: string };
  submissions?: Submission[];
  _count?: { submissions: number };
  createdAt: string;
}

export interface Submission {
  id: string;
  tenantId: string;
  assignmentId: string;
  studentId: string;
  submissionUrl?: string;
  submissionText?: string;
  marksObtained?: number;
  grade?: string;
  feedback?: string;
  status: "submitted" | "graded" | "returned";
  student?: { user: { firstName: string; lastName: string } };
  createdAt: string;
}
