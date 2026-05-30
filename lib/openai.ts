/**
 * lib/openai.ts
 * Centralised OpenAI service — singleton client, model config,
 * structured completion helper, and error classifiers.
 * Server-only — import only from API routes and Server Components.
 */
import OpenAI from 'openai';

// ── Singleton ─────────────────────────────────────────────────
let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (_client) return _client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not configured.\n' +
      '  Dev:  add it to .env.local\n' +
      '  Prod: Vercel → Project → Settings → Environment Variables'
    );
  }

  _client = new OpenAI({
    apiKey,
    maxRetries: 2,     // automatic retry on 429 / 5xx
    timeout:    45_000 // 45 s — long enough for extended reports
  });

  return _client;
}

// ── Model config ──────────────────────────────────────────────
export const MODELS = {
  PRIMARY:  process.env.OPENAI_MODEL ?? 'gpt-4o',
  FAST:     'gpt-4o-mini',
  EXTENDED: process.env.OPENAI_MODEL ?? 'gpt-4o',
} as const;

export const TOKEN_LIMITS = {
  BRIEF:    600,
  STANDARD: 1400,
  EXTENDED: 2800,
} as const;

// ── Completion types ──────────────────────────────────────────
export interface CompletionOpts {
  system:       string;
  user:         string;
  model?:       string;
  maxTokens?:   number;
  temperature?: number;
}

export interface CompletionResult {
  output:       string;
  model:        string;
  inputTokens:  number;
  outputTokens: number;
  finishReason: string;
}

// ── Core completion call ──────────────────────────────────────
export async function complete(opts: CompletionOpts): Promise<CompletionResult> {
  const client      = getOpenAIClient();
  const model       = opts.model       ?? MODELS.PRIMARY;
  const maxTokens   = opts.maxTokens   ?? TOKEN_LIMITS.STANDARD;
  const temperature = opts.temperature ?? 0.4;

  const response = await client.chat.completions.create({
    model,
    max_tokens:  maxTokens,
    temperature,
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user',   content: opts.user   },
    ],
  });

  const choice = response.choices[0];
  return {
    output:       choice.message.content ?? '',
    model:        response.model,
    inputTokens:  response.usage?.prompt_tokens     ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
    finishReason: choice.finish_reason               ?? 'unknown',
  };
}

// ── Error classifiers ─────────────────────────────────────────
export function isRateLimitError(err: unknown): boolean {
  return (
    err instanceof OpenAI.RateLimitError ||
    (err instanceof Error && err.message.toLowerCase().includes('rate limit'))
  );
}

export function isAuthError(err: unknown): boolean {
  return (
    err instanceof OpenAI.AuthenticationError ||
    (err instanceof Error && (
      err.message.toLowerCase().includes('invalid api key') ||
      err.message.toLowerCase().includes('incorrect api key')
    ))
  );
}

export function isModelError(err: unknown): boolean {
  return (
    err instanceof OpenAI.NotFoundError ||
    (err instanceof Error && err.message.includes('model'))
  );
}

// ── Standardised API error response helper ────────────────────
export function openAIErrorResponse(error: unknown): {
  success: false;
  error:   string;
  code:    string;
  status:  number;
} {
  if (isAuthError(error)) {
    return { success: false, error: 'Invalid OpenAI API key. Verify OPENAI_API_KEY.', code: 'AUTH_ERROR', status: 401 };
  }
  if (isRateLimitError(error)) {
    return { success: false, error: 'OpenAI rate limit reached. Please wait and retry.', code: 'RATE_LIMIT', status: 429 };
  }
  if (isModelError(error)) {
    return { success: false, error: `Model not available. Check OPENAI_MODEL env variable.`, code: 'MODEL_ERROR', status: 400 };
  }
  const msg = error instanceof Error ? error.message : 'Internal server error';
  if (msg.includes('OPENAI_API_KEY')) {
    return { success: false, error: 'OPENAI_API_KEY not configured.', code: 'NO_API_KEY', status: 503 };
  }
  return { success: false, error: msg, code: 'INTERNAL_ERROR', status: 500 };
}
