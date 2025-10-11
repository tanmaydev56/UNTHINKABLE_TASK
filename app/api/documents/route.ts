// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, language, content, issuesFound, severity, status } = await request.json();

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO documents (file_name, language, content, issues_found, severity, status) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [fileName, language, content, issuesFound, severity, status]
      );

      const savedDocument = result.rows[0];
      
      return NextResponse.json({
        id: savedDocument.id,
        fileName: savedDocument.file_name,
        language: savedDocument.language,
        content: savedDocument.content,
        createdAt: savedDocument.created_at,
        updatedAt: savedDocument.updated_at,
        issuesFound: savedDocument.issues_found,
        severity: savedDocument.severity,
        status: savedDocument.status
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM documents 
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      const documents = result.rows.map(row => ({
        id: row.id,
        fileName: row.file_name,
        language: row.language,
        content: row.content,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        issuesFound: row.issues_found,
        severity: row.severity,
        status: row.status,
        geminiReport: row.gemini_report, // Add this
        analysisCompleted: row.analysis_completed
      }));
      
      return NextResponse.json(documents);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}