import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ResponsibleAI, ReviewNote } from "@/components/ResponsibleAI";
import {
  EmptyState,
  ErrorBanner,
  Field,
  LoadingBlock,
  OutputBox,
  Panel,
} from "@/components/ToolPanel";
import { runAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Veridian WorkOS" },
      {
        name: "description",
        content:
          "Generate professional emails with the right subject line, greeting, body and closing in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Veridian WorkOS" },
      {
        property: "og:description",
        content: "AI-drafted professional emails you can review, edit and copy.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof TONES)[number];

function EmailPage() {
  const generate = useServerFn(runAi);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyInfo, setKeyInfo] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      setError("Please fill in both the recipient and the purpose of the email.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await generate({
        data: { kind: "email", recipient, purpose, keyInfo, tone },
      });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const clearAll = () => {
    setOutput("");
    setError("");
  };

  return (
    <AppShell title="Email Generator">
      <Panel
        title="Smart Email Generator"
        aside={<span className="hidden text-xs font-medium text-ink-soft sm:block">Input left · output right</span>}
      >
        <div className="grid lg:grid-cols-2">
          <div className="space-y-4 border-b border-line p-5 lg:border-b-0 lg:border-r">
            <Field label="Recipient / audience">
              <input
                className="field mt-1.5"
                placeholder="e.g. Dr. Alvarez, hiring manager at Acme"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Field>
            <Field label="Purpose of email">
              <input
                className="field mt-1.5"
                placeholder="What do you want to achieve?"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </Field>
            <Field
              label="Key information"
              hint="Anything you don't provide will be marked as not provided, never invented."
            >
              <textarea
                rows={4}
                className="field mt-1.5 resize-none"
                placeholder="Dates, attachments, names, context to include…"
                value={keyInfo}
                onChange={(e) => setKeyInfo(e.target.value)}
              />
            </Field>
            <Field label="Tone">
              <div className="mt-1.5 flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={
                      t === tone
                        ? "rounded-[8px] border border-ink bg-ink px-3 py-2 text-sm font-medium text-paper"
                        : "rounded-[8px] border border-line bg-paper px-3 py-2 text-sm font-medium hover:bg-paper/70"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            {error ? <ErrorBanner message={error} /> : null}
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="w-full rounded-[8px] bg-signal py-3 text-sm font-semibold text-paper hover:bg-signal-deep disabled:opacity-60"
            >
              {busy ? "Generating…" : "Generate Email"}
            </button>
          </div>

          <div className="space-y-3 p-5">
            {busy ? (
              <LoadingBlock label="Drafting your email…" />
            ) : output ? (
              <OutputBox
                value={output}
                onChange={setOutput}
                onRegenerate={run}
                onClear={clearAll}
                busy={busy}
              />
            ) : (
              <EmptyState
                title="No draft yet"
                body="Fill in the recipient, purpose and tone, then generate. Your draft appears here ready to edit and copy."
              />
            )}
            <ReviewNote />
          </div>
        </div>
      </Panel>

      <ResponsibleAI />
    </AppShell>
  );
}
