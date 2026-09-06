import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { asaas } from '@/lib/asaas';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      parentName,
      parentEmail,
      parentCpf,
      parentPhone,
      parentPassword = 'senha123',
      studentName,
      studentBirthDate,
      studentClassName = 'Maternal I',
      studentShift = 'integral',
      studentAllergies,
      studentBloodType,
    } = body;

    if (!parentName || !parentEmail || !studentName || !studentBirthDate) {
      return NextResponse.json({
        error: 'Preencha os campos obrigatórios: Nome do Responsável, E-mail, Nome do Aluno e Data de Nascimento.',
      }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Cria usuário no Supabase Auth
    let parentId: string;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: parentEmail.trim(),
      password: parentPassword,
      email_confirm: true,
      user_metadata: {
        full_name: parentName.trim(),
        role: 'parent',
      },
    });

    if (authError) {
      // Se o usuário já existe no auth, tenta buscar o ID existente
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', parentEmail.trim())
          .single();
        if (existingProfile) {
          parentId = existingProfile.id;
        } else {
          return NextResponse.json({ error: 'Este e-mail já está cadastrado no sistema.' }, { status: 400 });
        }
      } else {
        console.error('[Admin Create Parent Auth Error]:', authError);
        return NextResponse.json({ error: 'Erro ao criar conta no Supabase Auth: ' + authError.message }, { status: 400 });
      }
    } else {
      parentId = authData.user.id;
    }

    // 2. Salva/Atualiza o perfil na tabela 'profiles'
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: parentId,
        email: parentEmail.trim(),
        full_name: parentName.trim(),
        cpf: parentCpf ? parentCpf.trim() : null,
        phone: parentPhone ? parentPhone.trim() : null,
        role: 'parent',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('[Admin Create Parent Profile Error]:', profileError);
      return NextResponse.json({ error: 'Erro ao salvar perfil no banco: ' + profileError.message }, { status: 500 });
    }

    // 3. Cadastra o Aluno na tabela 'students'
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        parent_id: parentId,
        full_name: studentName.trim(),
        birth_date: studentBirthDate,
        class_name: studentClassName,
        shift: studentShift,
        allergies: studentAllergies ? studentAllergies.trim() : null,
        blood_type: studentBloodType ? studentBloodType.trim() : null,
        active: true,
      })
      .select()
      .single();

    if (studentError) {
      console.error('[Admin Create Student Error]:', studentError);
      return NextResponse.json({ error: 'Erro ao cadastrar aluno: ' + studentError.message }, { status: 500 });
    }

    // 4. Integração opcional com Asaas (cadastra cliente)
    if (parentCpf) {
      try {
        await asaas.getOrCreateCustomer({
          name: `${parentName} (Resp. ${studentName})`,
          cpfCnpj: parentCpf,
          email: parentEmail,
          phone: parentPhone,
          externalReference: parentId,
        });
      } catch (asaasErr) {
        console.warn('[Admin Create Parent Asaas Warning]:', asaasErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Responsável e aluno cadastrados com sucesso!',
      credentials: {
        email: parentEmail.trim(),
        password: parentPassword,
      },
      parent: {
        id: parentId,
        name: parentName.trim(),
        email: parentEmail.trim(),
        cpf: parentCpf,
        phone: parentPhone,
      },
      student: studentData,
    });
  } catch (error: any) {
    console.error('[Admin Create Parent General Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao cadastrar responsável' }, { status: 500 });
  }
}
