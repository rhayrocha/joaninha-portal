import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('className') || 'Maternal I';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const supabase = getAdminClient();

    // 1. Busca todos os alunos ativos da turma
    const { data: students, error: studentError } = await supabase
      .from('students')
      .select('id, full_name, class_name, shift, avatar_url, birth_date')
      .eq('class_name', className)
      .eq('active', true)
      .order('full_name');

    if (studentError) {
      console.error('[API Attendance GET] Erro ao buscar alunos:', studentError.message);
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    const studentList = students || [];
    const studentIds = studentList.map(s => s.id);

    // 2. Busca registros de presença existentes para a data especificada
    let attendanceMap: Record<string, { id: string; status: 'present' | 'absent' | 'justified'; notes: string }> = {};

    if (studentIds.length > 0) {
      try {
        const { data: attendanceRows, error: attError } = await supabase
          .from('attendance')
          .select('*')
          .eq('date', date)
          .in('student_id', studentIds);

        if (!attError && attendanceRows) {
          attendanceRows.forEach(row => {
            attendanceMap[row.student_id] = {
              id: row.id,
              status: row.status as any,
              notes: row.notes || '',
            };
          });
        }
      } catch (err: any) {
        console.warn('[API Attendance GET Warning]: Tabela attendance ainda não criada:', err.message);
      }
    }

    // 3. Monta o retorno com status de cada aluno (padrão 'present' se já não marcado)
    const records = studentList.map(s => {
      const att = attendanceMap[s.id];
      return {
        studentId: s.id,
        studentName: s.full_name,
        className: s.class_name,
        shift: s.shift === 'integral' ? 'Integral' : s.shift === 'matutino' ? 'Manhã' : 'Tarde',
        avatarUrl: s.avatar_url,
        status: att ? att.status : 'present',
        notes: att ? att.notes : '',
        isRecorded: !!att,
        attendanceId: att ? att.id : undefined,
      };
    });

    return NextResponse.json({
      success: true,
      date,
      className,
      totalStudents: records.length,
      presentCount: records.filter(r => r.status === 'present').length,
      absentCount: records.filter(r => r.status === 'absent' || r.status === 'justified').length,
      records,
    });
  } catch (error: any) {
    console.error('[API Attendance GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar chamada' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      className,
      date = new Date().toISOString().split('T')[0],
      teacherId,
      records = [],
    } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Nenhum registro de chamada informado' }, { status: 400 });
    }

    const supabase = getAdminClient();

    const upsertRows = records.map((r: any) => ({
      student_id: r.studentId,
      class_name: className || 'Maternal I',
      date: date,
      status: r.status || 'present',
      notes: r.notes ? r.notes.trim() : null,
      recorded_by: teacherId || null,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('attendance')
      .upsert(upsertRows, { onConflict: 'student_id, date' })
      .select();

    if (error) {
      console.error('[API Attendance POST Error]:', error.message);
      if (error.message.includes("Could not find the table 'public.attendance'")) {
        return NextResponse.json({
          error: "A tabela 'attendance' precisa ser criada no Supabase. Acesse o SQL Editor no Supabase e execute o script 'setup_teachers_attendance.sql'.",
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'Erro ao salvar chamada no banco: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Chamada registrada com sucesso!',
      savedCount: data?.length || upsertRows.length,
      date,
    });
  } catch (error: any) {
    console.error('[API Attendance POST Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar chamada' }, { status: 500 });
  }
}
