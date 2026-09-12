import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({
      status: 'unconfigured',
      message: 'Variáveis de ambiente do Supabase não encontradas neste deploy da Vercel.',
      configured: { 
        supabaseUrl: !!supabaseUrl, 
        hasAnonKey: !!anonKey, 
        hasServiceKey: !!serviceKey 
      },
      hint: 'Certifique-se de marcar o ambiente "Preview" ao salvar as variáveis na Vercel e faça um Redeploy sem cache.',
      deploymentTimestamp: new Date().toISOString(),
    }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    // Testa se as tabelas principais já foram criadas
    const tables = ['profiles', 'students', 'documents', 'payments', 'daily_routines', 'teacher_classes', 'attendance'];
    const tableStatus: Record<string, { exists: boolean; count?: number; error?: string }> = {};

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          tableStatus[table] = { exists: false, error: error.message };
        } else {
          tableStatus[table] = { exists: true, count: count ?? 0 };
        }
      } catch (err: any) {
        tableStatus[table] = { exists: false, error: err.message };
      }
    }

    const allTablesExist = Object.values(tableStatus).every(t => t.exists);

    return NextResponse.json({
      status: allTablesExist ? 'connected' : 'tables_pending',
      message: allTablesExist 
        ? '✅ Conexão com o Supabase 100% ativa e todas as tabelas criadas!'
        : '⚠️ Conectado ao Supabase, mas algumas tabelas ainda não foram criadas no SQL Editor.',
      url: supabaseUrl,
      hasServiceKey: !!serviceKey,
      tableStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API Database Status] Erro:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Falha ao conectar com o Supabase: ' + (error.message || 'Erro desconhecido'),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
