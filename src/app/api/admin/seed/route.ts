import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = getAdminClient();

    // 1. Famílias de Teste Realistas
    const families = [
      {
        email: 'maria.santos@exemplo.com.br',
        password: 'senha123',
        fullName: 'Maria Clara Santos',
        cpf: '456.789.123-00',
        phone: '(11) 98765-4321',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        student: {
          name: 'Pedro Henrique Santos',
          birthDate: '2022-04-15',
          className: 'Maternal I',
          shift: 'integral',
          allergies: 'Nenhuma alergia relatada',
          avatarUrl: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=150&h=150&fit=crop&crop=face',
        },
        payments: [
          {
            title: 'Mensalidade - Setembro/2026',
            amount: 2200,
            discount: 100,
            finalAmount: 2100,
            dueDate: '2026-09-10',
            status: 'paid',
            paidAt: '2026-09-08T14:30:00Z',
            asaasId: 'pay_maria_set2026',
            pix: '00020126580014br.gov.bcb.pix0136joaninha-maria-setembro-pix52040000530398654062100.005802BR5925CRECHE JOANINHA6009SAO PAULO62070503***6304ABCD',
          },
          {
            title: 'Mensalidade - Outubro/2026',
            amount: 2200,
            discount: 100,
            finalAmount: 2100,
            dueDate: '2026-10-10',
            status: 'pending',
            asaasId: 'pay_maria_out2026',
            pix: '00020126580014br.gov.bcb.pix0136joaninha-maria-outubro-pix52040000530398654062100.005802BR5925CRECHE JOANINHA6009SAO PAULO62070503***6304ABCD',
          }
        ]
      },
      {
        email: 'carlos.silva@exemplo.com.br',
        password: 'senha123',
        fullName: 'Carlos Eduardo Silva',
        cpf: '321.654.987-11',
        phone: '(11) 97654-3210',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        student: {
          name: 'Beatriz Silva',
          birthDate: '2023-01-20',
          className: 'Berçário',
          shift: 'integral',
          allergies: 'Intolerância leve a lactose',
          avatarUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&h=150&fit=crop&crop=face',
        },
        payments: [
          {
            title: 'Mensalidade - Outubro/2026',
            amount: 2400,
            discount: 100,
            finalAmount: 2300,
            dueDate: '2026-10-15',
            status: 'pending',
            asaasId: 'pay_carlos_out2026',
            pix: '00020126580014br.gov.bcb.pix0136joaninha-carlos-beatriz-pix52040000530398654062300.005802BR5925CRECHE JOANINHA6009SAO PAULO62070503***6304XYZW',
          }
        ]
      },
      {
        email: 'fernanda.lima@exemplo.com.br',
        password: 'senha123',
        fullName: 'Fernanda Rocha Lima',
        cpf: '789.123.456-22',
        phone: '(11) 91234-5678',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        student: {
          name: 'Gabriel Lima',
          birthDate: '2021-08-10',
          className: 'Jardim I',
          shift: 'vespertino',
          allergies: 'Rinite alérgica a poeira',
          avatarUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&h=150&fit=crop&crop=face',
        },
        payments: [
          {
            title: 'Mensalidade - Setembro/2026',
            amount: 1950,
            discount: 0,
            finalAmount: 1950,
            dueDate: '2026-09-05',
            status: 'overdue',
            asaasId: 'pay_fernanda_set2026',
            pix: '00020126580014br.gov.bcb.pix0136joaninha-fernanda-gabriel-pix52040000530398654061950.005802BR5925CRECHE JOANINHA6009SAO PAULO62070503***6304VENC',
          }
        ]
      }
    ];

    const results: any[] = [];

    for (const fam of families) {
      // 1. Cria ou obtém usuário no Supabase Auth
      let userId: string;
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: fam.email,
        password: fam.password,
        email_confirm: true,
        user_metadata: { full_name: fam.fullName, role: 'parent' },
      });

      if (authError) {
        // Se já existe, busca o ID do profile
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', fam.email)
          .single();
        
        if (existing) {
          userId = existing.id;
        } else {
          // Busca nos users do Auth
          const { data: users } = await supabase.auth.admin.listUsers();
          const found = users?.users?.find(u => u.email === fam.email);
          userId = found ? found.id : '';
        }
      } else {
        userId = authData.user.id;
      }

      if (!userId) continue;

      // 2. Salva no profiles
      await supabase.from('profiles').upsert({
        id: userId,
        email: fam.email,
        full_name: fam.fullName,
        cpf: fam.cpf,
        phone: fam.phone,
        role: 'parent',
        avatar_url: fam.avatarUrl,
        updated_at: new Date().toISOString(),
      });

      // 3. Salva Aluno
      const { data: studentData } = await supabase.from('students').upsert({
        parent_id: userId,
        full_name: fam.student.name,
        birth_date: fam.student.birthDate,
        class_name: fam.student.className,
        shift: fam.student.shift,
        allergies: fam.student.allergies,
        avatar_url: fam.student.avatarUrl,
        active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'parent_id, full_name' as any }).select().single();

      const studentId = studentData?.id;

      // 4. Salva Cobranças
      for (const p of fam.payments) {
        await supabase.from('payments').upsert({
          parent_id: userId,
          student_id: studentId,
          asaas_payment_id: p.asaasId,
          title: p.title,
          description: `${p.title} - ${fam.student.name}`,
          amount: p.amount,
          discount_amount: p.discount,
          final_amount: p.finalAmount,
          due_date: p.dueDate,
          status: p.status,
          billing_type: 'PIX',
          paid_at: p.paidAt || null,
          pix_copy_paste: p.pix,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'asaas_payment_id' });
      }

      results.push({
        name: fam.fullName,
        email: fam.email,
        student: fam.student.name,
        className: fam.student.className,
        paymentsCount: fam.payments.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Base de dados de teste populada com 3 famílias reais no Supabase!',
      families: results,
    });
  } catch (error: any) {
    console.error('[Admin Seed Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao popular dados' }, { status: 500 });
  }
}
