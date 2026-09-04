import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function Panel({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-line bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-signal" />
          <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-soft">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-[8px] border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
    >
      {message}
    </div>
  );
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="rounded-[10px] border border-line bg-paper p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-soft">
        <span className="flex gap-1">
          <span className="size-1.5 animate-pulse rounded-full bg-signal" />
          <span className="size-1.5 animate-pulse rounded-full bg-signal/60 [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-signal/30 [animation-delay:300ms]" />
        </span>
        {label}
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[10px] border border-dashed border-line bg-paper p-6 text-center">
      <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
      <p className="mx-auto mt-1 max-w-[46ch] text-sm text-ink-soft">{body}</p>
    </div>
  );
}

/** Output surface with copy / edit / regenerate / clear. */
export function OutputBox({
  value,
  onChange,
  onRegenerate,
  onClear,
  busy,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  busy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const btn =
    "rounded-[7px] border border-line bg-paper px-2.5 py-1.5 text-xs font-medium hover:bg-paper/70 disabled:opacity-50";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
          Generated output
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={btn} onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => setEditing((e) => !e)}
            aria-pressed={editing}
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button type="button" className={btn} onClick={onRegenerate} disabled={busy}>
            Regenerate
          </button>
          <button type="button" className={`${btn} text-ink-soft`} onClick={onClear}>
            Clear
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full resize-y rounded-[10px] border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed outline-none focus:border-ink"
        />
      ) : (
        <div className="rounded-[10px] border border-line bg-paper p-4 text-sm leading-relaxed text-ink/90">
          <FormattedText text={value} />
        </div>
      )}

      {copied ? (
        <div className="rounded-[8px] bg-success/10 px-3 py-2 text-xs font-medium text-success">
          Copied to clipboard.
        </div>
      ) : null}
    </div>
  );
}

/** Lightweight renderer for the markdown-ish output the prompts request. */
export function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        if (!line.trim()) return <div key={i} className="h-1" />;
        if (line.startsWith("## "))
          return (
            <h3
              key={i}
              className="pt-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-ink"
            >
              {line.slice(3)}
            </h3>
          );
        if (line.startsWith("# "))
          return (
            <h3 key={i} className="pt-2 font-display text-base font-semibold">
              {line.slice(2)}
            </h3>
          );
        if (/^\s*[-*•]\s+/.test(line))
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
              <span>{clean(line.replace(/^\s*[-*•]\s+/, ""))}</span>
            </div>
          );
        if (/^\s*\d+[.)]\s+/.test(line))
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="font-medium text-signal-deep">
                {line.match(/^\s*(\d+)/)?.[1]}.
              </span>
              <span>{clean(line.replace(/^\s*\d+[.)]\s+/, ""))}</span>
            </div>
          );
        if (line.startsWith("Subject:"))
          return (
            <p key={i} className="font-display text-sm font-semibold tracking-tight">
              {line}
            </p>
          );
        return <p key={i}>{clean(line)}</p>;
      })}
    </div>
  );
}

function clean(s: string) {
  return s.replace(/\*\*/g, "").replace(/^#+\s*/, "");
}
