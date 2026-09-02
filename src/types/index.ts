// ===== Enums =====

export type DocumentStatus = "pending" | "under_review" | "approved" | "rejected";

export type DocumentCategory = "parent" | "child";

export type PaymentPlan = "monthly" | "annual";

export type DocumentType =
  | "rg"
  | "cpf"
  | "proof_of_residence"
  | "birth_certificate"
  | "vaccination_card"
  | "photo_3x4"
  | "medical_report"
  | "school_transfer";

export type PaymentStatus = "paid" | "pending" | "overdue" | "cancelled";

export type PaymentMethod = "boleto" | "pix";

// ===== Interfaces =====

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  avatarUrl?: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  className: string;
  shift: string;
  photoUrl?: string;
  parentId: string;
  enrollmentDate: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  category: DocumentCategory;
  childId?: string;
  label: string;
  description: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  status: DocumentStatus;
  uploadedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  required: boolean;
}

export interface Payment {
  id: string;
  childId: string;
  childName: string;
  parentName?: string;
  reference: string; // "Setembro/2026"
  dueDate: string;
  amount: number;
  discount: number;
  fine: number;
  totalAmount: number;
  status: PaymentStatus;
  paymentPlan: PaymentPlan;
  paidAt?: string;
  paidAmount?: number;
  barcode?: string;
  pixCode?: string;
  pixQrCodeData?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordinator";
  avatarUrl?: string;
}

// ===== Helper Types =====

export interface DocumentTypeConfig {
  type: DocumentType;
  label: string;
  description: string;
  category: DocumentCategory;
  required: boolean;
}

export const PARENT_DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    type: "rg",
    label: "RG do Responsável",
    description: "Documento de identidade (frente e verso)",
    category: "parent",
    required: true,
  },
  {
    type: "cpf",
    label: "CPF do Responsável",
    description: "Cadastro de Pessoa Física",
    category: "parent",
    required: true,
  },
  {
    type: "proof_of_residence",
    label: "Comprovante de Residência",
    description: "Conta de luz, água ou telefone (últimos 3 meses)",
    category: "parent",
    required: true,
  },
];

export const CHILD_DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    type: "birth_certificate",
    label: "Certidão de Nascimento",
    description: "Cópia da certidão de nascimento",
    category: "child",
    required: true,
  },
  {
    type: "vaccination_card",
    label: "Carteira de Vacinação",
    description: "Carteira de vacinação atualizada",
    category: "child",
    required: true,
  },
  {
    type: "photo_3x4",
    label: "Foto 3x4",
    description: "Foto recente tamanho 3x4",
    category: "child",
    required: true,
  },
  {
    type: "medical_report",
    label: "Laudo Médico",
    description: "Laudo médico (se aplicável - alergias, condições especiais)",
    category: "child",
    required: false,
  },
];
