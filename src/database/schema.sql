-- ==============================================================================
-- Creche Escola Joaninha - Schema de Banco de Dados de Produção (PostgreSQL / Supabase)
-- Suporta: 150+ Alunos, Gestão de Documentos, Faturas Automatizadas e Rotina Pedagógica
-- ==============================================================================

-- Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABELA DE PERFIS / USUÁRIOS (Pais, Mães e Equipe Diretiva)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'admin', 'coordinator', 'teacher')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TABELA DE ALUNOS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    class_name VARCHAR(50) NOT NULL DEFAULT 'Maternal I',
    shift VARCHAR(20) NOT NULL DEFAULT 'integral' CHECK (shift IN ('matutino', 'vespertino', 'integral')),
    blood_type VARCHAR(5),
    allergies TEXT,
    emergency_contact VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABELA DE DOCUMENTOS CADASTRADOS & MATRÍCULA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'certidao_nascimento', 'carteira_vacinacao', 'rg_responsavel', 'comprovante_residencia', etc.
    label VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('child', 'parent')),
    required BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    file_url TEXT,
    file_size INTEGER, -- em bytes
    file_name VARCHAR(255),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TABELA DE COBRANÇAS / MENSALIDADES (Integrada ao Asaas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    asaas_payment_id VARCHAR(100) UNIQUE, -- ID da cobrança retornado pelo Asaas (ex: pay_123456)
    asaas_customer_id VARCHAR(100),       -- ID do cliente no Asaas (ex: cus_123456)
    title VARCHAR(255) NOT NULL,          -- ex: "Mensalidade - Outubro/2026"
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,       -- Valor nominal (ex: 2200.00)
    discount_amount NUMERIC(10, 2) DEFAULT 0.00, -- Desconto de pontualidade (ex: 100.00)
    final_amount NUMERIC(10, 2) NOT NULL, -- Valor com desconto ou final
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    billing_type VARCHAR(20) NOT NULL DEFAULT 'PIX' CHECK (billing_type IN ('PIX', 'BOLETO', 'CREDIT_CARD', 'ANNUAL')),
    pix_copy_paste TEXT,                  -- Chave copia e cola retornada pela API do Asaas
    pix_qr_code_image TEXT,               -- Imagem base64 do QR Code gerado pelo Asaas
    invoice_url TEXT,                     -- Link direto do boleto/fatura oficial do Asaas
    paid_at TIMESTAMP WITH TIME ZONE,     -- Data e hora em que o Webhook confirmou o pagamento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABELA DE ROTINA PEDAGÓGICA & CARDÁPIO DO DIA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) NOT NULL DEFAULT 'Maternal I',
    routine_date DATE NOT NULL DEFAULT CURRENT_DATE,
    morning_snack TEXT NOT NULL,
    lunch TEXT NOT NULL,
    afternoon_snack TEXT NOT NULL,
    pedagogical_title VARCHAR(255) NOT NULL,
    pedagogical_description TEXT NOT NULL,
    bilingual_activity TEXT,
    nap_info TEXT DEFAULT 'Repouso pleno em ambiente climatizado (13:00 às 14:30)',
    nutritionist_signature VARCHAR(255) DEFAULT 'Dra. Helena Prado - CRN-3 Nutricionista Infantil',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_name, routine_date)
);

-- ------------------------------------------------------------------------------
-- ÍNDICES PARA ALTA PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_payments_parent_id ON payments(parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_id ON payments(asaas_payment_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS) - PADRÃO SUPABASE
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;

-- 1. Pais só podem visualizar seus próprios dados e de seus filhos
CREATE POLICY "Pais visualizam próprio perfil" ON profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'coordinator'));

CREATE POLICY "Pais visualizam próprios alunos" ON students
    FOR SELECT USING (parent_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'coordinator'));

CREATE POLICY "Pais visualizam próprios documentos" ON documents
    FOR SELECT USING (parent_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'coordinator'));

CREATE POLICY "Pais enviam próprios documentos" ON documents
    FOR INSERT WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Pais visualizam próprias mensalidades" ON payments
    FOR SELECT USING (parent_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'coordinator'));

-- 2. Todos os responsáveis autenticados podem ver a rotina pedagógica
CREATE POLICY "Leitura pública de rotinas para usuários autenticados" ON daily_routines
    FOR SELECT USING (auth.role() = 'authenticated');
