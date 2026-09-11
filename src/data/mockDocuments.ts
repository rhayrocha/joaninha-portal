import type { Document } from "@/types";

export const mockDocuments: Document[] = [
  // Parent Documents
  {
    id: "doc_req_rg",
    type: "rg",
    category: "parent",
    label: "RG do Responsável",
    description: "Documento de identidade do responsável (frente e verso)",
    status: "pending",
    required: true,
  },
  {
    id: "doc_req_cpf",
    type: "cpf",
    category: "parent",
    label: "CPF do Responsável",
    description: "Cadastro de Pessoa Física do responsável legal",
    status: "pending",
    required: true,
  },
  {
    id: "doc_req_residence",
    type: "proof_of_residence",
    category: "parent",
    label: "Comprovante de Residência",
    description: "Conta de luz, água ou telefone recente (últimos 3 meses)",
    status: "pending",
    required: true,
  },
  // Child Documents
  {
    id: "doc_req_birth",
    type: "birth_certificate",
    category: "child",
    label: "Certidão de Nascimento",
    description: "Cópia legível da certidão de nascimento da criança",
    status: "pending",
    required: true,
  },
  {
    id: "doc_req_vaccine",
    type: "vaccination_card",
    category: "child",
    label: "Carteira de Vacinação",
    description: "Carteira de vacinação da criança com as doses em dia",
    status: "pending",
    required: true,
  },
  {
    id: "doc_req_photo",
    type: "photo_3x4",
    category: "child",
    label: "Foto 3x4 da Criança",
    description: "Foto recente da criança para a ficha cadastral",
    status: "pending",
    required: true,
  },
  {
    id: "doc_req_medical",
    type: "medical_report",
    category: "child",
    label: "Laudo Médico / Restrições",
    description: "Laudo médico caso possua alergias, intolerâncias ou condições especiais",
    status: "pending",
    required: false,
  },
];
