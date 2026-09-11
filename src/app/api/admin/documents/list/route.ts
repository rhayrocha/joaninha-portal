import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: dbDocs, error } = await supabase
      .from('documents')
      .select('*, profiles:parent_id (full_name, avatar_url), students:student_id (full_name, class_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[API Admin Docs List] Erro ao consultar Supabase:', error.message);
      return NextResponse.json({ documents: [], error: error.message });
    }

    const formattedDocs = (dbDocs || []).map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      category: doc.category,
      childId: doc.student_id,
      label: doc.label,
      description: `Documento de ${doc.category === 'child' ? 'Aluno' : 'Responsável'}`,
      fileName: doc.file_name,
      fileUrl: doc.file_url,
      fileSize: doc.file_size,
      status: doc.status,
      uploadedAt: doc.created_at,
      reviewedAt: doc.reviewed_at,
      rejectionReason: doc.rejection_reason,
      required: doc.required ?? true,
      parentName: doc.profiles?.full_name || 'Responsável',
      childName: doc.students?.full_name || 'Aluno(a)',
      avatarUrl: doc.profiles?.avatar_url,
    }));

    return NextResponse.json({
      documents: formattedDocs,
      source: 'supabase_live',
      count: formattedDocs.length,
    });
  } catch (error: any) {
    console.error('[API Admin Docs List Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}
