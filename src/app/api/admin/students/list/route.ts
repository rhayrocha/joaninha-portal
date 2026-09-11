import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

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
        students: [],
        parentInfo: {},
        source: 'supabase_empty',
      });
    }

    const mappedStudents = dbStudents.map((s: any) => ({
      id: s.id,
      name: s.full_name,
      className: s.class_name || 'Maternal I',
      shift: s.shift === 'integral' ? 'Integral' : s.shift === 'matutino' ? 'Manhã' : 'Tarde',
      photoUrl: s.avatar_url || '',
      parentId: s.parent_id,
      birthDate: s.birth_date,
      allergies: s.allergies,
    }));

    const mappedParentInfo: Record<string, any> = {};
    dbStudents.forEach((s: any) => {
      if (s.profiles && s.parent_id) {
        mappedParentInfo[s.parent_id] = {
          name: s.profiles.full_name || 'Responsável',
          email: s.profiles.email || '',
          phone: s.profiles.phone || '',
          cpf: s.profiles.cpf || '',
          avatarUrl: s.profiles.avatar_url || '',
        };
      }
    });

    return NextResponse.json({
      students: mappedStudents,
      parentInfo: mappedParentInfo,
      source: 'supabase_live',
      supabaseCount: mappedStudents.length,
    });
  } catch (error: any) {
    console.error('[API Admin Students List Error]:', error);
    return NextResponse.json({
      students: [],
      parentInfo: {},
      source: 'error',
      error: error.message,
    }, { status: 500 });
  }
}
