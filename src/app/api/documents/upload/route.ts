import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentId = formData.get('documentId') as string;
    const type = (formData.get('type') as string) || 'documento';
    const label = (formData.get('label') as string) || 'Documento';
    const category = (formData.get('category') as string) || 'parent';
    const studentId = (formData.get('studentId') as string) || null;
    const parentId = (formData.get('parentId') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (!parentId) {
      return NextResponse.json({ error: 'ID do responsável é obrigatório para anexar documento' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Sanitiza o nome do arquivo e monta o caminho no Storage
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folderId = studentId || parentId;
    const storagePath = `matriculas/${folderId}/${Date.now()}_${cleanFileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Upload para o bucket 'documentos-matricula'
    const { error: uploadError } = await supabase.storage
      .from('documentos-matricula')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Upload Storage Error]:', uploadError);
      return NextResponse.json({ error: 'Erro ao salvar arquivo no Supabase Storage: ' + uploadError.message }, { status: 500 });
    }

    // 3. Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('documentos-matricula')
      .getPublicUrl(storagePath);

    // 4. Salvar registro na tabela 'documents'
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        student_id: category === 'child' ? studentId : null,
        parent_id: parentId,
        type,
        label,
        category: category as 'child' | 'parent',
        required: true,
        status: 'under_review',
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Database Insert Error]:', dbError);
      return NextResponse.json({ error: 'Erro ao gravar documento no banco: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Documento enviado com sucesso para o Supabase!',
      document: {
        id: docData.id,
        type: docData.type,
        label: docData.label,
        category: docData.category,
        status: docData.status,
        fileUrl: docData.file_url,
        fileName: docData.file_name,
        fileSize: docData.file_size,
        uploadedAt: docData.created_at,
      },
    });
  } catch (error: any) {
    console.error('[Upload Document Route Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no upload' }, { status: 500 });
  }
}
