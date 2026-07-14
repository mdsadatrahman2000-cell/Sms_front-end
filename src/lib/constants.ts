export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sms-back-end-cd36.onrender.com/api/v1";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  PRINCIPAL: "principal",
  VICE_PRINCIPAL: "vice_principal",
  TEACHER: "teacher",
  CLASS_TEACHER: "class_teacher",
  STUDENT: "student",
  PARENT: "parent",
  ACCOUNTANT: "accountant",
  HR: "hr",
  LIBRARIAN: "librarian",
  TRANSPORT_MANAGER: "transport_manager",
  HOSTEL_MANAGER: "hostel_manager",
  INVENTORY_MANAGER: "inventory_manager",
  EXAM_CONTROLLER: "exam_controller",
  GUEST: "guest",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
} as const;

export const FEE_STATUS = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
  OVERDUE: "overdue",
} as const;

export const EXAM_TYPES = ["midterm", "final", "quiz", "assignment", "practical", "other"] as const;

export const LEAVE_TYPES = ["sick", "personal", "casual", "other"] as const;

export const LEAVE_STATUS = ["pending", "approved", "rejected"] as const;

export const ADMISSION_STATUS = ["applied", "reviewed", "enrolled", "rejected"] as const;

export const PAYMENT_METHODS = ["cash", "card", "bank_transfer", "online", "cheque"] as const;

export const NAVIGATION = {
  MAIN: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Students", href: "/students" },
    { label: "Teachers", href: "/teachers" },
    { label: "Classes", href: "/classes" },
    { label: "Subjects", href: "/subjects" },
    { label: "Guardians", href: "/guardians" },
  ],
  ACADEMIC: [
    { label: "Academic Years", href: "/academic-years" },
    { label: "Attendance", href: "/attendances" },
    { label: "Exams", href: "/exams" },
    { label: "Reports", href: "/reports" },
    { label: "LMS", href: "/lms" },
    { label: "Timetable", href: "/timetable" },
    { label: "Notices", href: "/notices" },
  ],
  FINANCE: [{ label: "Fees", href: "/fees" }],
  OPERATIONS: [
    { label: "HR & Staff", href: "/hr" },
    { label: "Leaves", href: "/leaves" },
    { label: "Admissions", href: "/admissions" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Library", href: "/library" },
    { label: "Transport", href: "/transport" },
    { label: "Hostel", href: "/hostel" },
    { label: "Inventory", href: "/inventory" },
  ],
  SYSTEM: [
    { label: "Tenants", href: "/tenants" },
    { label: "Roles", href: "/roles" },
    { label: "Settings", href: "/settings" },
  ],
} as const;
