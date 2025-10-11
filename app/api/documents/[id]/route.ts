// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById, pool } from '@/lib/db';

/* ---------- GET ---------- */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  try {
    const { id } = await params;                  // ← await
    const document = await getDocumentById(id);
    if (!document)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    return NextResponse.json(document);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

/* ---------- PUT ---------- */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;                   // ← await
  const body = await request.json();

  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE documents
       SET gemini_report   = $1,
           analysis_completed = $2,
           issues_found    = $3,
           severity        = $4,
           status          = $5,
           updated_at      = NOW()
       WHERE id = $6
       RETURNING *`,
      [body.geminiReport, body.analysisCompleted, body.issuesFound, body.severity, body.status, id]
    );
    client.release();

    if (result.rows.length === 0)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}