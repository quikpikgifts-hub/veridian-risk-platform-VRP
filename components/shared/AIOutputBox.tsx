'use client';
import { cn } from '@/lib/utils';
import { Brain, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface AIOutputBoxProps {
  output: string;
  loading?: boolean;
  label?: string;
  className?: string;
  maxHeight?: string;
}

export function AIOutputBox({ output, loading, label = 'AI Analysis', className, maxHeight = 'max-h-64' }: AIOutputBoxProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={cn('bg-amber-500/[0.04] border border-amber-500/20 rounded-[3px]', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-amber-500/15">
        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[2px] uppercase text-amber-400">
          <Brain className="w-3 h-3" />
          {label}
          {loading && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot ml-1" />}
        </div>
        {!loading && output && (
          <button onClick={copy} className="text-white/25 hover:text-white/60 transition-colors p-0.5 rounded hover:bg-white/5">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      <div className={cn('px-3 py-3 overflow-y-auto scrollable', maxHeight)}>
        {loading ? (
          <div className="flex items-center gap-2 text-amber-200/40 text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot delay-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot delay-400" />
            <span className="ml-1">Processing…</span>
          </div>
        ) : output ? (
          <p className="text-[11.5px] text-amber-100/60 leading-relaxed whitespace-pre-wrap">{output}</p>
        ) : (
          <p className="text-[11px] text-white/20 italic">Run the agent to see AI output here.</p>
        )}
      </div>
    </div>
  );
}
