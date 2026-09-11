import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;
    const body = await req.json();
    const {
      studentName,
      className,
      shift,
      birthDate,
      allergies,
      bloodType,
      active,
      parentId,
      parentName,
      parentPhone,
      parentCpf,
    } = body;

    const supabase = getAdminClient();

    // 1. Atualiza dados do Aluno
    const studentUpdate: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (studentName !== undefined) studentUpdate.full_name = studentName.trim();
    if (className !== undefined) studentUpdate.class_name = className;
    if (shift !== undefined) studentUpdate.shift = shift;
    if (birthDate !== undefined) studentUpdate.birth_date = birthDate;
    if (allergies !== undefined) studentUpdate.allergies = allergies;
    if (bloodType !== undefined) studentUpdate.blood_type = bloodType;
    if (active !== undefined) studentUpdate.active = active;

    const { data: updatedStudent, error: studentError } = await supabase
      .from('students')
      .update(studentUpdate)
      .eq('id', studentId)
      .select()
      .single();

    if (studentError) {
      console.error('[Admin Student Update Error]:', studentError);
      return NextResponse.json({ error: 'Erro ao atualizar aluno: ' + studentError.message }, { status: 500 });
    }

    // 2. Se houver dados do responsável para atualizar
    const targetParentId = parentId || updatedStudent?.parent_id;
    if (targetParentId && (parentName !== undefined || parentPhone !== undefined || parentCpf !== undefined)) {
      const parentUpdate: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (parentName !== undefined) parentUpdate.full_name = parentName.trim();
      if (parentPhone !== undefined) parentUpdate.phone = parentPhone.trim();
      if (parentCpf !== undefined) parentUpdate.cpf = parentCpf.trim();

      const { error: parentError } = await supabase
        .from('profiles')
        .update(parentUpdate)
        .eq('id', targetParentId);

      if (parentError) {
        console.warn('[Admin Parent Update Warning]:', parentError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dados do aluno e responsável atualizados com sucesso!',
      student: updatedStudent,
    });
  } catch (error: any) {
    console.error('[Admin Student PATCH Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao atualizar aluno' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;
    const supabase = getAdminClient();

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Aluno removido com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
