import { NextRequest, NextResponse } from 'next/server';
import { complete, openAIErrorResponse, TOKEN_LIMITS } from '@/lib/openai';
import { getAgentPrompt } from '@/lib/agents';
import { writeAuditLog, extractRequestContext } from '@/lib/audit';

export const runtime = 'nodejs';
export const maxDuration = 55;

export async function POST(req: NextRequest) {
  const ctx = extractRequestContext(req.headers);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON.' }, { status: 400 });

    const {
      agent = 'agt-01', agentName = 'Operations',
      task, context, systemOverride, maxTokens,
    } = body as Record<string, unknown>;

    if (!task || typeof task !== 'string' || !task.trim()) {
      await writeAuditLog({
        action: 'ai_agent_invoked', resource: 'ai-agent',
        ...ctx, success: false,
        details: { error: 'missing_task', agent },
      });
      return NextResponse.json({ success: false, error: 'task is required.' }, { status: 400 });
    }

    const system = (typeof systemOverride === 'string' && systemOverride.trim())
      ? systemOverride
      : getAgentPrompt(String(agent));

    const user = (typeof context === 'string' && context.trim())
      ? `Task: ${task.trim()}\n\nAdditional Context:\n${context.trim()}`
      : `Task: ${task.trim()}`;

    const result = await complete({
      system,
      user,
      maxTokens: typeof maxTokens === 'number' ? maxTokens : TOKEN_LIMITS.STANDARD,
    });

    await writeAuditLog({
      action: 'ai_agent_invoked', resource: 'ai-agent',
      resourceId: String(agent),
      ...ctx, success: true,
      details: { agent, agentName, model: result.model,
                 inputTokens: result.inputTokens, outputTokens: result.outputTokens },
    });

    return NextResponse.json({
      success: true, output: result.output,
      agent, agentName, model: result.model,
      finishReason: result.finishReason,
      inputTokens: result.inputTokens, outputTokens: result.outputTokens,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[/api/ai-agent]', error);
    await writeAuditLog({
      action: 'ai_agent_invoked', resource: 'ai-agent',
      ...ctx, success: false,
      details: { error: String(error) },
    });
    const e = openAIErrorResponse(error);
    return NextResponse.json({ success: false, error: e.error, code: e.code }, { status: e.status });
  }
}
