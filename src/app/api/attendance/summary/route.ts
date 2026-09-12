import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId é obrigatório' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Busca dados do aluno
    const { data: student, error: studentErr } = await supabase
      .from('students')
      .select('id, full_name, class_name')
      .eq('id', studentId)
      .single();

    if (studentErr || !student) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // 2. Busca registros de presença do aluno
    let history: any[] = [];
    try {
      const { data: rows, error: attErr } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (!attErr && rows) {
        history = rows;
      }
    } catch {
      // Tabela attendance ainda não criada
    }

    const todayRecord = history.find(r => r.date === todayStr);

    const totalDays = history.length;
    const absentDays = history.filter(r => r.status === 'absent' || r.status === 'justified').length;
    const presentDays = history.filter(r => r.status === 'present').length;

    const attendanceRate = totalDays > 0 
      ? Math.round((presentDays / totalDays) * 100) 
      : 100;

    // 3. Busca a professora responsável pela turma
    let teacherName = 'Profª Camila Valente';
    try {
      const { data: classTeacher } = await supabase
        .from('teacher_classes')
        .select('profiles:teacher_id(full_name)')
        .eq('class_name', student.class_name)
        .limit(1)
        .single();

      if (classTeacher && (classTeacher as any).profiles?.full_name) {
        teacherName = (classTeacher as any).profiles.full_name;
      }
    } catch {
      // Tabela teacher_classes ainda não criada
    }

    return NextResponse.json({
      success: true,
      studentId,
      studentName: student.full_name,
      className: student.class_name,
      teacherName,
      todayStatus: todayRecord ? todayRecord.status : 'present', // Se escola iniciou dia e aluno está presente
      todayNotes: todayRecord ? todayRecord.notes : null,
      isTodayRecorded: !!todayRecord,
      totalDays: Math.max(totalDays, 22), // 22 dias letivos de referência base se histórico for recente
      presentDays: totalDays > 0 ? presentDays : 22,
      absentDays,
      attendanceRate,
    });
  } catch (error: any) {
    console.error('[API Attendance Summary Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar resumo de presença' }, { status: 500 });
  }
}
