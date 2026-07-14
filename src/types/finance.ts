export interface FeeStructure {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  classId: string;
  amount: number;
  frequency: string;
  academicYearId: string;
  class?: { name: string; section?: string };
  createdAt: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "unpaid" | "partial" | "paid" | "overdue";
  student?: { user: { firstName: string; lastName: string } };
  feeStructure?: { name: string };
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  createdAt: string;
}
