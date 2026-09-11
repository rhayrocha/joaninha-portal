import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { mockDocuments } from '@/data/mockDocuments';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json({
        documents: mockDocuments,
        source: 'clean_template',
        savedCount: 0,
      });
    }

    const supabase = getAdminClient();

    const { data: dbDocs, error } = await supabase
      .from('documents')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[API Documents List] Erro ao buscar:', error.message);
      return NextResponse.json({ documents: mockDocuments, source: 'template_fallback' });
    }

    // Mescla os documentos salvos no Supabase com a lista padrão de requisitos
    const mergedDocs = mockDocuments.map(reqDoc => {
      const match = (dbDocs || []).find(d => d.type === reqDoc.type || d.label === reqDoc.label);
      if (match) {
        return {
          ...reqDoc,
          id: match.id,
          status: match.status,
          fileUrl: match.file_url,
          fileName: match.file_name,
          fileSize: match.file_size,
          uploadedAt: match.created_at,
          rejectionReason: match.rejection_reason,
          isSupabase: true,
        };
      }
      return {
        ...reqDoc,
        isSupabase: false,
      };
    });

    return NextResponse.json({
      documents: mergedDocs,
      source: 'supabase_live',
      savedCount: dbDocs?.length || 0,
    });
  } catch (error: any) {
    console.error('[API Documents List] Erro:', error);
    return NextResponse.json({ documents: mockDocuments, source: 'mock_error' });
  }
}
