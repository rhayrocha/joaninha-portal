import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { allStudents, parentInfo } from '@/data/mockStudents';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: dbStudents, error } = await supabase
      .from('students')
      .select('*, profiles:parent_id (*)')
      .order('full_name');

    if (error || !dbStudents) {
      return NextResponse.json({
        students: allStudents,
        parentInfo,
        source: 'mock_fallback',
      });
    }

    const mappedStudents = dbStudents.map((s: any) => ({
      id: s.id,
      name: s.full_name,
      className: s.class_name || 'Maternal I',
      shift: s.shift === 'integral' ? 'Integral' : s.shift === 'matutino' ? 'Manhã' : 'Tarde',
      photoUrl: s.avatar_url || 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=150&h=150&fit=crop&crop=face',
      parentId: s.parent_id,
      birthDate: s.birth_date,
      allergies: s.allergies,
    }));

    const mappedParentInfo: Record<string, any> = { ...parentInfo };
    dbStudents.forEach((s: any) => {
      if (s.profiles && s.parent_id) {
        mappedParentInfo[s.parent_id] = {
          name: s.profiles.full_name,
          email: s.profiles.email,
          phone: s.profiles.phone || '(11) 98765-4321',
          cpf: s.profiles.cpf || '456.789.123-00',
          avatarUrl: s.profiles.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        };
      }
    });

    // Se houver alunos no Supabase, inclui os do banco e complementa com as turmas
    const finalStudents = mappedStudents.length > 0
      ? [...mappedStudents, ...allStudents.filter(m => !mappedStudents.some(s => s.name === m.name))]
      : allStudents;

    return NextResponse.json({
      students: finalStudents,
      parentInfo: mappedParentInfo,
      source: 'supabase_live',
      supabaseCount: mappedStudents.length,
    });
  } catch (error: any) {
    console.error('[API Admin Students List Error]:', error);
    return NextResponse.json({
      students: allStudents,
      parentInfo,
      source: 'mock_error',
    });
  }
}
