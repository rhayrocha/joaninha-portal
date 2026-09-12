-- ==============================================================================
-- Creche Escola Joaninha - Módulo de Professores e Chamada Diária (Presença)
-- Execute este script no menu: Supabase Dashboard -> "SQL Editor" -> "Run"
-- ==============================================================================

-- 1. Tabela de Vinculação de Professores com Turmas
CREATE TABLE IF NOT EXISTS teacher_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, class_name)
);

-- 2. Tabela de Chamada / Presença Diária
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'justified')),
    notes TEXT,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 3. Índices de Performance
CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON teacher_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_class ON teacher_classes(class_name);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_name, date);

-- 4. Habilitar Segurança RLS
ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acesso
DROP POLICY IF EXISTS "Acesso completo para service role" ON teacher_classes;
CREATE POLICY "Acesso completo para service role" ON teacher_classes FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso completo para service role" ON attendance;
CREATE POLICY "Acesso completo para service role" ON attendance FOR ALL USING (true);

-- 6. Inserir Professora de Teste Inicial (Camila Valente) se não existir
INSERT INTO profiles (id, email, full_name, role, phone, avatar_url)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'camila.valente@joaninhacreche.com.br',
    'Profª Camila Valente',
    'teacher',
    '(11) 98888-7777',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
) ON CONFLICT (email) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = 'teacher';

-- Vincular a Professora Camila ao Maternal I
INSERT INTO teacher_classes (teacher_id, class_name)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Maternal I'
) ON CONFLICT (teacher_id, class_name) DO NOTHING;
