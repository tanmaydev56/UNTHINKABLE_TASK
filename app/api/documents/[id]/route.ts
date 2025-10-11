// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById, pool } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Params received:', params); // Debug log
    const { id } = params;
    console.log('Document ID:', id); // Debug log
    
    const document = await getDocumentById(id);
    console.log('Document from DB:', document); // Debug log
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { geminiReport, analysisCompleted, issuesFound, severity, status } = await request.json();

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `UPDATE documents 
         SET gemini_report = $1, analysis_completed = $2, issues_found = $3, severity = $4, status = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 
         RETURNING *`,
        [geminiReport, analysisCompleted, issuesFound, severity, status, params.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      const updatedDocument = result.rows[0];
      return NextResponse.json({
        id: updatedDocument.id,
        fileName: updatedDocument.file_name,
        language: updatedDocument.language,
        content: updatedDocument.content,
        createdAt: updatedDocument.created_at,
        updatedAt: updatedDocument.updated_at,
        issuesFound: updatedDocument.issues_found,
        severity: updatedDocument.severity,
        status: updatedDocument.status,
        geminiReport: updatedDocument.gemini_report,
        analysisCompleted: updatedDocument.analysis_completed
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}