'use client';
import { useState, useCallback } from 'react';

interface UseAIAgentOptions {
  agent: string;
  onSuccess?: (output: string) => void;
  onError?: (error: string) => void;
}

export function useAIAgent({ agent, onSuccess, onError }: UseAIAgentOptions) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput]   = useState('');
  const [error, setError]     = useState('');

  const run = useCallback(async (task: string, context?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, task, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Agent request failed');
      const result = data.output || data.content || '';
      setOutput(result);
      onSuccess?.(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }, [agent, onSuccess, onError]);

  const reset = useCallback(() => { setOutput(''); setError(''); }, []);

  return { run, loading, output, error, reset };
}
