import type { Document } from "@/types";

// Documents for all students (admin view)
export const allDocuments: Document[] = [
  // Pedro Henrique Santos (child_001) - Maria Clara Santos
  { id: "doc_001", type: "rg", category: "parent", label: "RG - Maria Clara Santos", description: "RG do responsável", fileName: "rg_maria.pdf", fileUrl: "/uploads/rg_maria.pdf", fileSize: 1240000, status: "approved", uploadedAt: "2026-02-05T10:30:00", reviewedAt: "2026-02-06T14:00:00", required: true },
  { id: "doc_002", type: "cpf", category: "parent", label: "CPF - Maria Clara Santos", description: "CPF do responsável", fileName: "cpf_maria.pdf", fileUrl: "/uploads/cpf_maria.pdf", fileSize: 520000, status: "approved", uploadedAt: "2026-02-05T10:35:00", reviewedAt: "2026-02-06T14:05:00", required: true },
  { id: "doc_003", type: "proof_of_residence", category: "parent", label: "Comprovante - Maria Clara Santos", description: "Comprovante de residência", status: "pending", required: true },
  { id: "doc_004", type: "birth_certificate", category: "child", childId: "child_001", label: "Certidão - Pedro Henrique", description: "Certidão de nascimento", fileName: "certidao_pedro.pdf", fileUrl: "/uploads/certidao_pedro.pdf", fileSize: 890000, status: "approved", uploadedAt: "2026-02-05T11:00:00", reviewedAt: "2026-02-06T14:10:00", required: true },
  { id: "doc_005", type: "vaccination_card", category: "child", childId: "child_001", label: "Vacinação - Pedro Henrique", description: "Carteira de vacinação", fileName: "vacina_pedro.pdf", fileUrl: "/uploads/vacina_pedro.pdf", fileSize: 2100000, status: "under_review", uploadedAt: "2026-08-28T09:15:00", required: true },
  { id: "doc_006", type: "photo_3x4", category: "child", childId: "child_001", label: "Foto 3x4 - Pedro Henrique", description: "Foto recente", status: "pending", required: true },

  // Sofia Oliveira (child_002) - Ana Paula Oliveira
  { id: "doc_101", type: "rg", category: "parent", label: "RG - Ana Paula Oliveira", description: "RG do responsável", fileName: "rg_ana.pdf", fileUrl: "/uploads/rg_ana.pdf", fileSize: 1100000, status: "approved", uploadedAt: "2026-03-02T10:00:00", reviewedAt: "2026-03-03T09:00:00", required: true },
  { id: "doc_102", type: "birth_certificate", category: "child", childId: "child_002", label: "Certidão - Sofia Oliveira", description: "Certidão de nascimento", fileName: "certidao_sofia.pdf", fileUrl: "/uploads/certidao_sofia.pdf", fileSize: 950000, status: "approved", uploadedAt: "2026-03-02T10:30:00", reviewedAt: "2026-03-03T09:05:00", required: true },
  { id: "doc_103", type: "vaccination_card", category: "child", childId: "child_002", label: "Vacinação - Sofia Oliveira", description: "Carteira de vacinação", fileName: "vacina_sofia.pdf", fileUrl: "/uploads/vacina_sofia.pdf", fileSize: 1800000, status: "under_review", uploadedAt: "2026-08-30T14:00:00", required: true },

  // Miguel Costa (child_003) - Fernanda Costa
  { id: "doc_201", type: "rg", category: "parent", label: "RG - Fernanda Costa", description: "RG do responsável", fileName: "rg_fernanda.pdf", fileUrl: "/uploads/rg_fernanda.pdf", fileSize: 1300000, status: "approved", uploadedAt: "2026-02-10T08:00:00", reviewedAt: "2026-02-11T10:00:00", required: true },
  { id: "doc_202", type: "birth_certificate", category: "child", childId: "child_003", label: "Certidão - Miguel Costa", description: "Certidão de nascimento", fileName: "certidao_miguel.pdf", fileUrl: "/uploads/certidao_miguel.pdf", fileSize: 870000, status: "under_review", uploadedAt: "2026-08-29T16:00:00", required: true },
  { id: "doc_203", type: "vaccination_card", category: "child", childId: "child_003", label: "Vacinação - Miguel Costa", description: "Carteira de vacinação", status: "pending", required: true },

  // Laura Pereira (child_004) - Roberto Pereira
  { id: "doc_301", type: "rg", category: "parent", label: "RG - Roberto Pereira", description: "RG do responsável", fileName: "rg_roberto.pdf", fileUrl: "/uploads/rg_roberto.pdf", fileSize: 1150000, status: "approved", uploadedAt: "2025-02-05T09:00:00", reviewedAt: "2025-02-06T11:00:00", required: true },
  { id: "doc_302", type: "birth_certificate", category: "child", childId: "child_004", label: "Certidão - Laura Pereira", description: "Certidão de nascimento", fileName: "certidao_laura.pdf", fileUrl: "/uploads/certidao_laura.pdf", fileSize: 920000, status: "approved", uploadedAt: "2025-02-05T09:30:00", reviewedAt: "2025-02-06T11:05:00", required: true },
  { id: "doc_303", type: "photo_3x4", category: "child", childId: "child_004", label: "Foto 3x4 - Laura Pereira", description: "Foto recente", fileName: "foto_laura.jpg", fileUrl: "/uploads/foto_laura.jpg", fileSize: 340000, status: "under_review", uploadedAt: "2026-08-31T10:00:00", required: true },
];
