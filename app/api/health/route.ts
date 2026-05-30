import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const checks: Record<string, { ok: boolean; message: string }> = {};

  // OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  checks.openai = openaiKey
    ? { ok: true,  message: `Key configured (${openaiKey.slice(0,8)}...)` }
    : { ok: false, message: 'OPENAI_API_KEY not set' };

  // Supabase
  const sbUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.supabase = (sbUrl && sbAnon)
    ? { ok: true,  message: `Configured (${sbUrl})` }
    : { ok: false, message: 'Supabase env vars not set — auth disabled' };

  // Model
  checks.model = {
    ok: true,
    message: `Using ${process.env.OPENAI_MODEL ?? 'gpt-4o'}`
  };

  const allOk = checks.openai.ok; // OpenAI is the only hard requirement

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks,
  }, { status: allOk ? 200 : 503 });
}
