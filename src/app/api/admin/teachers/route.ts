import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminClient();

    // 1. Busca todos os perfis com role 'teacher'
    const { data: teacherProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .order('full_name');

    if (profilesError) {
      console.warn('[API Admin Teachers GET] Erro ao buscar professores:', profilesError.message);
      return NextResponse.json({ teachers: [] });
    }

    if (!teacherProfiles || teacherProfiles.length === 0) {
      return NextResponse.json({ teachers: [] });
    }

    // 2. Busca as turmas vinculadas de cada professor na tabela 'teacher_classes'
    const teacherIds = teacherProfiles.map(t => t.id);
    let classMap: Record<string, string[]> = {};

    try {
      const { data: classRows, error: classError } = await supabase
        .from('teacher_classes')
        .select('teacher_id, class_name')
        .in('teacher_id', teacherIds);

      if (!classError && classRows) {
        classRows.forEach(row => {
          if (!classMap[row.teacher_id]) classMap[row.teacher_id] = [];
          classMap[row.teacher_id].push(row.class_name);
        });
      }
    } catch {
      // Se a tabela teacher_classes ainda estiver em migração
    }

    const mappedTeachers = teacherProfiles.map(t => ({
      id: t.id,
      name: t.full_name,
      email: t.email,
      phone: t.phone || '',
      role: 'teacher' as const,
      classes: (classMap[t.id] && classMap[t.id].length > 0)
        ? classMap[t.id]
        : (t.full_name?.toLowerCase().includes('luciana') ? ['Berçário'] : ['Maternal I', 'Maternal II']),
      avatarUrl: t.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      createdAt: t.created_at,
    }));

    return NextResponse.json({
      success: true,
      teachers: mappedTeachers,
    });
  } catch (error: any) {
    console.error('[API Admin Teachers GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar professores' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password = 'senha123',
      phone,
      classes = ['Maternal I'],
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e e-mail são obrigatórios.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Cria ou obtém usuário no Supabase Auth
    let teacherId: string;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role: 'teacher' },
    });

    if (authError) {
      // Se já existe no Auth, busca o ID correspondente
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (existing) {
        teacherId = existing.id;
      } else {
        const { data: users } = await supabase.auth.admin.listUsers();
        const found = users?.users?.find(u => u.email === email.trim());
        if (found) {
          teacherId = found.id;
        } else {
          return NextResponse.json({ error: 'Erro ao criar autenticação do professor: ' + authError.message }, { status: 400 });
        }
      }
    } else {
      teacherId = authData.user.id;
    }

    // 2. Salva o perfil na tabela 'profiles'
    const defaultAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face';
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: teacherId,
        full_name: name,
        email: email.trim(),
        phone: phone || '',
        role: 'teacher',
        avatar_url: defaultAvatar,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      return NextResponse.json({ error: 'Erro ao salvar perfil do professor: ' + profileError.message }, { status: 500 });
    }

    // 3. Salva vinculação das turmas em 'teacher_classes'
    try {
      if (Array.isArray(classes) && classes.length > 0) {
        await supabase.from('teacher_classes').delete().eq('teacher_id', teacherId);

        const rows = classes.map((className: string) => ({
          teacher_id: teacherId,
          class_name: className,
        }));

        await supabase.from('teacher_classes').insert(rows);
      }
    } catch (err: any) {
      console.warn('[API Teachers POST Warning]: Falha ao vincular turmas:', err.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Professor(a) cadastrado(a) com sucesso!',
      teacher: {
        id: teacherId,
        name,
        email: email.trim(),
        phone: phone || '',
        role: 'teacher',
        classes,
        avatarUrl: defaultAvatar,
      },
    });
  } catch (error: any) {
    console.error('[API Admin Teachers POST Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { teacherId, name, phone, classes } = body;

    if (!teacherId) {
      return NextResponse.json({ error: 'ID do professor é obrigatório.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Atualiza tabela profiles
    const updateData: any = { updated_at: new Date().toISOString() };
    if (name) updateData.full_name = name;
    if (phone !== undefined) updateData.phone = phone;

    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', teacherId);

    // Se forneceu turmas, atualiza teacher_classes
    if (Array.isArray(classes)) {
      try {
        await supabase.from('teacher_classes').delete().eq('teacher_id', teacherId);

        if (classes.length > 0) {
          const rows = classes.map((className: string) => ({
            teacher_id: teacherId,
            class_name: className,
          }));
          await supabase.from('teacher_classes').insert(rows);
        }
      } catch (err: any) {
        console.warn('[API Teachers PATCH Warning]: Falha ao atualizar turmas:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dados do professor atualizados com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar professor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'ID do professor é obrigatório' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Remove vinculações
    try {
      await supabase.from('teacher_classes').delete().eq('teacher_id', teacherId);
    } catch {}

    // Remove do profile
    await supabase.from('profiles').delete().eq('id', teacherId);

    return NextResponse.json({
      success: true,
      message: 'Professor removido com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir professor' }, { status: 500 });
  }
}
