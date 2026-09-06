export type UserRole = 'parent' | 'admin' | 'coordinator' | 'teacher';

export interface DatabaseProfile {
  id: string;
  email: string;
  fullName: string;
  cpf?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseStudent {
  id: string;
  parentId: string;
  fullName: string;
  birthDate: string;
  className: string;
  shift: 'matutino' | 'vespertino' | 'integral';
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseDocument {
  id: string;
  studentId?: string;
  parentId: string;
  type: string;
  label: string;
  category: 'child' | 'parent';
  required: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  fileUrl?: string;
  fileSize?: number;
  fileName?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabasePayment {
  id: string;
  parentId: string;
  studentId?: string;
  asaasPaymentId?: string;
  asaasCustomerId?: string;
  title: string;
  description?: string;
  amount: number;
  discountAmount?: number;
  finalAmount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'ANNUAL';
  pixCopyPaste?: string;
  pixQrCodeImage?: string;
  invoiceUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseDailyRoutine {
  id: string;
  className: string;
  routineDate: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  pedagogicalTitle: string;
  pedagogicalDescription: string;
  bilingualActivity?: string;
  napInfo?: string;
  nutritionistSignature?: string;
  createdAt: string;
}
