// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface Document {
  id: string;
  fileName: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  issuesFound: number;
  severity: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "failed";
}

export async function getDocuments(): Promise<Document[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM documents 
      ORDER BY created_at DESC
    `);
    return result.rows.map(row => ({
      id: row.id,
      fileName: row.file_name,
      language: row.language,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      issuesFound: row.issues_found,
      severity: row.severity,
      status: row.status
    }));
  } finally {
    client.release();
  }
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      fileName: row.file_name,
      language: row.language,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      issuesFound: row.issues_found,
      severity: row.severity,
      status: row.status
    };
  } finally {
    client.release();
  }
}