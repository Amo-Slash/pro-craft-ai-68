import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ResponsibleAI, ReviewNote } from "@/components/ResponsibleAI";
import {
  EmptyState,
  ErrorBanner,
  ErrorBanner as Banner,
  LoadingBlock,
  OutputBox,
  Panel,
} from "@/components/ToolPanel";
import { runAi } from "@/lib/ai.functions";
import type { PlannerTask } from "@/lib/prompts";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Veridian WorkOS" },
      {
        name: "description",
        content:
          "Enter your tasks with priority, deadline and duration, and get a prioritized daily or weekly schedule with clear reasoning.",
      },
      { property: "og:title", content: "AI Task Planner — Veridian WorkOS" },
      {
        property: "og:description",
        content: "Prioritized daily and weekly schedules based on urgency, importance and effort.",
      },
    ],
  }),
  component: PlannerPage,
});

const PRIORITIES = ["High", "Medium", "Low"] as const;

const blank = (): PlannerTask => ({
  name: "",
  description: "",
  priority: "Medium",
  deadline: "",
  duration: "",
});

function PlannerPage() {
  const generate = useServerFn(runAi);
  const [tasks, setTasks] = useState<PlannerTask[]>([blank()]);
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (i: number, patch: Partial<PlannerTask>) =>
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const run = async () => {
    const filled = tasks.filter((t) => t.name.trim());
    if (filled.length === 0) {
      setError("Add at least one task with a name before planning.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await generate({ data: { kind: "planner", horizon, tasks: filled } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Planning failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title="Task Planner">
      <Panel
        title="AI Task Planner"
        aside={
          <div className="flex gap-1.5">
            {(["Daily", "Weekly"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={
                  h === horizon
                    ? "rounded-[7px] border border-ink bg-ink px-2.5 py-1.5 text-xs font-medium text-paper"
                    : "rounded-[7px] border border-line bg-paper px-2.5 py-1.5 text-xs font-medium hover:bg-paper/70"
                }
              >
                {h}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid lg:grid-cols-2">
          <div className="space-y-4 border-b border-line p-5 lg:border-b-0 lg:border-r">
            {tasks.map((t, i) => (
              <div key={i} className="space-y-3 rounded-[10px] border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    Task {i + 1}
                  </span>
                  {tasks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs font-medium text-ink-soft hover:text-signal-deep"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <input
                  className="field bg-card"
                  placeholder="Task name — e.g. Finish stats assignment"
                  value={t.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                />
                <textarea
                  rows={2}
                  className="field resize-none bg-card"
                  placeholder="Short description (optional)"
                  value={t.description}
                  onChange={(e) => update(i, { description: e.target.value })}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    className="field bg-card"
                    value={t.priority}
                    onChange={(e) =>
                      update(i, { priority: e.target.value as PlannerTask["priority"] })
                    }
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p} priority
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="field bg-card"
                    value={t.deadline}
                    onChange={(e) => update(i, { deadline: e.target.value })}
                  />
                  <input
                    className="field bg-card"
                    placeholder="e.g. 90 min"
                    value={t.duration}
                    onChange={(e) => update(i, { duration: e.target.value })}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setTasks((prev) => [...prev, blank()])}
              className="w-full rounded-[8px] border border-dashed border-line py-2.5 text-sm font-medium text-ink-soft hover:bg-paper/70"
            >
              + Add another task
            </button>

            {error ? <ErrorBanner message={error} /> : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={run}
                disabled={busy}
                className="flex-1 rounded-[8px] bg-signal py-3 text-sm font-semibold text-paper hover:bg-signal-deep disabled:opacity-60"
              >
                {busy ? "Building schedule…" : `Build ${horizon} Schedule`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTasks([blank()]);
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
              <LoadingBlock label="Prioritizing your tasks…" />
            ) : output ? (
              <OutputBox
                value={output}
                onChange={setOutput}
                onRegenerate={run}
                onClear={() => setOutput("")}
                busy={busy}
              />
            ) : (
              <EmptyState
                title="No schedule yet"
                body="Add your tasks with priority, deadline and estimated duration. The plan explains why each task landed where it did."
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

void Banner;
