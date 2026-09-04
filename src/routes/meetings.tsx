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

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Veridian WorkOS" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with key points, decisions, action items, deadlines and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Veridian WorkOS" },
      {
        property: "og:description",
        content: "Structured meeting summaries built only from the notes you paste.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SECTIONS = [
  "Meeting Summary",
  "Key Discussion Points",
  "Decisions Made",
  "Action Items",
  "Deadlines",
  "Responsible People",
];

function MeetingsPage() {
  const generate = useServerFn(runAi);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (notes.trim().length < 20) {
      setError("Please paste at least a few lines of meeting notes.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await generate({ data: { kind: "meeting", notes } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Summarizing failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title="Meeting Summarizer">
      <Panel
        title="Meeting Notes Summarizer"
        aside={
          <span className="hidden text-xs font-medium text-ink-soft sm:block">
            Nothing outside your notes is added
          </span>
        }
      >
        <div className="grid lg:grid-cols-2">
          <div className="space-y-4 border-b border-line p-5 lg:border-b-0 lg:border-r">
            <Field
              label="Paste your meeting notes"
              hint="Raw, messy notes are fine — bullet points, transcript fragments or shorthand."
            >
              <textarea
                rows={16}
                className="field mt-1.5 resize-y"
                placeholder={
                  "e.g.\n- Standup 9am, Maya, Tom, Priya\n- Tom: API migration blocked on staging keys\n- Decision: ship v2 on Friday\n- Priya to send updated timeline by Wednesday"
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-1.5">
              {SECTIONS.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-line"
                >
                  {s}
                </span>
              ))}
            </div>
            {error ? <ErrorBanner message={error} /> : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={run}
                disabled={busy}
                className="flex-1 rounded-[8px] bg-signal py-3 text-sm font-semibold text-paper hover:bg-signal-deep disabled:opacity-60"
              >
                {busy ? "Summarizing…" : "Summarize Notes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotes("");
                  setOutput("");
                  setError("");
                }}
                className="rounded-[8px] border border-line bg-paper px-4 text-sm font-medium text-ink-soft hover:bg-paper/70"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {busy ? (
              <LoadingBlock label="Reading your notes…" />
            ) : output ? (
              <OutputBox
                value={output}
                onChange={setOutput}
                onRegenerate={run}
                onClear={() => {
                  setOutput("");
                  setError("");
                }}
                busy={busy}
              />
            ) : (
              <EmptyState
                title="No summary yet"
                body="Paste notes on the left and summarize. Anything the notes don't cover is marked as not provided instead of invented."
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
