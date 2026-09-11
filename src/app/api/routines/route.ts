import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('className') || 'Maternal I';

    const supabase = getAdminClient();

    // 1. Busca rotina da turma mais recente no banco
    const { data: dbRoutine, error } = await supabase
      .from('daily_routines')
      .select('*')
      .eq('class_name', className)
      .order('routine_date', { ascending: false })
      .limit(1)
      .single();

    if (!error && dbRoutine) {
      return NextResponse.json({
        success: true,
        source: 'supabase_live',
        routine: dbRoutine,
      });
    }

    // 2. Se a escola ainda não cadastrou para esta turma específica, retorna a base padrão da creche
    const defaultRoutine = {
      class_name: className,
      routine_date: new Date().toISOString().split('T')[0],
      morning_snack: 'Frutinhas selecionadas da estação (mamão formosa e uvas sem sementes) acompanhadas de biscoitinho artesanal de aveia e mel.',
      lunch: 'Arroz integral orgânico, feijãozinho caseiro carioca, filé de frango grelhado em tiras, purê de abóbora cabotiá e saladinha fresca de alface baby.',
      afternoon_snack: 'Salada de frutas frescas com aveia em flocos e suco de laranja natural prensado a frio.',
      pedagogical_title: 'Ateliê das Cores & Sensações da Natureza',
      pedagogical_description: 'Vivência com tintas naturais à base de beterraba e espinafre sobre papéis de grande formato, estimulando a coordenação motora fina e percepção sensorial.',
      bilingual_activity: 'Storytime & Circle Time: Cantiga temática "Twinkle Twinkle Little Star" com introdução de vocabulário de cores (Red, Yellow, Green).',
      nap_info: 'Repouso pleno em ambiente climatizado (13:00 às 14:30)',
      nutritionist_signature: 'Dra. Helena Prado - CRN-3 Nutricionista Infantil',
    };

    return NextResponse.json({
      success: true,
      source: 'school_standard',
      routine: defaultRoutine,
    });
  } catch (error: any) {
    console.error('[API Routines GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar rotina' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      className = 'Maternal I',
      routineDate = new Date().toISOString().split('T')[0],
      morningSnack,
      lunch,
      afternoonSnack,
      pedagogicalTitle,
      pedagogicalDescription,
      bilingualActivity,
      napInfo,
    } = body;

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('daily_routines')
      .upsert({
        class_name: className,
        routine_date: routineDate,
        morning_snack: morningSnack,
        lunch: lunch,
        afternoon_snack: afternoonSnack,
        pedagogical_title: pedagogicalTitle,
        pedagogical_description: pedagogicalDescription,
        bilingual_activity: bilingualActivity,
        nap_info: napInfo || 'Repouso pleno em ambiente climatizado (13:00 às 14:30)',
      }, { onConflict: 'class_name, routine_date' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rotina e cardápio do dia salvos com sucesso!',
      routine: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
