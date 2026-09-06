-- ==============================================================================
-- Creche Escola Joaninha - Setup Completo do Banco de Dados (Supabase / PostgreSQL)
-- Execute este script completo no menu: "SQL Editor" -> "New query" -> "Run"
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABELAS DO SISTEMA
-- ------------------------------------------------------------------------------

-- Tabela de Perfis de Usuários (Pais, Mães e Equipe da Escola)
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

-- Tabela de Alunos / Crianças
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

-- Tabela de Documentos de Matrícula
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('child', 'parent')),
    required BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    file_url TEXT,
    file_size INTEGER,
    file_name VARCHAR(255),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cobranças / Mensalidades (Integrada ao Asaas)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    asaas_payment_id VARCHAR(100) UNIQUE,
    asaas_customer_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    final_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    billing_type VARCHAR(20) NOT NULL DEFAULT 'PIX' CHECK (billing_type IN ('PIX', 'BOLETO', 'CREDIT_CARD', 'ANNUAL')),
    pix_copy_paste TEXT,
    pix_qr_code_image TEXT,
    invoice_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Rotina Pedagógica Diária
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
-- 3. ÍNDICES DE PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_payments_parent_id ON payments(parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_id ON payments(asaas_payment_id);

-- ------------------------------------------------------------------------------
-- 4. SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
DROP POLICY IF EXISTS "Acesso completo para service role" ON profiles;
CREATE POLICY "Acesso completo para service role" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso completo para service role" ON students;
CREATE POLICY "Acesso completo para service role" ON students FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso completo para service role" ON documents;
CREATE POLICY "Acesso completo para service role" ON documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso completo para service role" ON payments;
CREATE POLICY "Acesso completo para service role" ON payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso completo para service role" ON daily_routines;
CREATE POLICY "Acesso completo para service role" ON daily_routines FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 5. DADOS INICIAIS (SEED) - FAMÍLIA DEMONSTRAÇÃO & ESCOLA
-- ------------------------------------------------------------------------------

-- Inserir Perfil da Mãe (Maria Clara Santos)
INSERT INTO profiles (id, email, full_name, cpf, phone, role)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'maria.santos@exemplo.com.br',
    'Maria Clara Santos',
    '456.789.123-00',
    '(11) 98765-4321',
    'parent'
) ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Inserir Perfil da Coordenação Escolar
INSERT INTO profiles (id, email, full_name, role)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'diretoria@joaninhacreche.com.br',
    'Coordenação Joaninha',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Inserir Aluno (Pedro Henrique Santos)
INSERT INTO students (id, parent_id, full_name, birth_date, class_name, shift, blood_type, allergies)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Pedro Henrique Santos',
    '2023-05-14',
    'Maternal I',
    'integral',
    'O+',
    'Nenhuma alergia alimentar relatada'
) ON CONFLICT (id) DO NOTHING;

-- Inserir Rotina Pedagógica de Hoje
INSERT INTO daily_routines (class_name, routine_date, morning_snack, lunch, afternoon_snack, pedagogical_title, pedagogical_description, bilingual_activity)
VALUES (
    'Maternal I',
    CURRENT_DATE,
    'Maçã higienizada fatiada e suco natural de laranja sem açúcar',
    'Arroz integral, feijão carioca, purê de abóbora cabotiá e peito de frango desfiado com ervas finas',
    'Bolo caseiro de banana com aveia e água de coco fresca',
    'Exploração Sensorial das Cores da Natureza',
    'Atividade lúdica no jardim com folhas secas, flores e texturas para desenvolvimento da coordenação motora fina.',
    'Storytime em Inglês: The Very Hungry Caterpillar (apresentação dos nomes das frutas)'
) ON CONFLICT (class_name, routine_date) DO NOTHING;
