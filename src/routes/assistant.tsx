import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ResponsibleAI } from "@/components/ResponsibleAI";
import { ErrorBanner, FormattedText, Panel } from "@/components/ToolPanel";
import { runAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant — Veridian WorkOS" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about workplace productivity, professional communication, meeting preparation and staying organized.",
      },
      { property: "og:title", content: "AI Workplace Assistant — Veridian WorkOS" },
      {
        property: "og:description",
        content: "A conversational assistant for productivity, communication and planning.",
      },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi Maya. I can help with professional communication, meeting prep, task planning and staying organized. What would you like to tackle first?",
};

const SUGGESTIONS = [
  "Help me prepare talking points for a project review",
  "How do I politely chase an unanswered email?",
  "Structure my first week in a new job",
];

function AssistantPage() {
  const generate = useServerFn(runAi);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const res = await generate({
        data: { kind: "chat", messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant could not reply. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title="AI Assistant">
      <Panel
        title="Workplace Assistant"
        aside={
          <button
            type="button"
            onClick={() => {
              setMessages([GREETING]);
              setError("");
            }}
            className="rounded-[7px] border border-line bg-paper px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper/70"
          >
            Clear conversation
          </button>
        }
      >
        <div className="max-h-[52vh] min-h-[320px] space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[78%] text-pretty rounded-[12px] rounded-tr-[3px] bg-ink px-4 py-3 text-sm leading-relaxed text-paper">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="max-w-[85%] text-pretty rounded-[12px] rounded-tl-[3px] border border-line bg-paper px-4 py-3 text-sm leading-relaxed">
                  <FormattedText text={m.content} />
                </div>
              </div>
            ),
          )}

          {busy ? (
            <div className="flex justify-start">
              <div className="rounded-[12px] rounded-tl-[3px] border border-line bg-paper px-4 py-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-ink-soft">
                  <span className="flex gap-1">
                    <span className="size-1.5 animate-pulse rounded-full bg-signal" />
                    <span className="size-1.5 animate-pulse rounded-full bg-signal/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-signal/30 [animation-delay:300ms]" />
                  </span>
                  Thinking…
                </span>
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="space-y-3 border-t border-line p-4">
          {messages.length === 1 && !busy ? (
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper/70"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {error ? <ErrorBanner message={error} /> : null}

          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              className="field flex-1"
              placeholder="Ask about communication, meetings, planning…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-[8px] bg-signal px-4 py-2.5 text-sm font-semibold text-paper hover:bg-signal-deep disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      </Panel>

      <ResponsibleAI />
    </AppShell>
  );
}
