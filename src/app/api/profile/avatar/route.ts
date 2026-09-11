import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId') as string | null;
    const file = formData.get('file') as File | null;

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo de imagem enviado' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Caminho no bucket de storage
    const ext = file.name.split('.').pop() || 'jpg';
    const storagePath = `avatars/${userId}_${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documentos-matricula')
      .upload(storagePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('[Avatar Upload Error]:', uploadError);
      return NextResponse.json({ error: 'Erro ao salvar foto: ' + uploadError.message }, { status: 500 });
    }

    // 3. Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('documentos-matricula')
      .getPublicUrl(storagePath);

    // 4. Atualizar avatar_url na tabela profiles
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (dbError) {
      console.warn('[Avatar DB Update Error]:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Foto de perfil atualizada com sucesso!',
      avatarUrl: publicUrl,
    });
  } catch (error: any) {
    console.error('[API Avatar Route Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
