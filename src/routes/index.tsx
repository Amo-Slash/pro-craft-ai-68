import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ResponsibleAI } from "@/components/ResponsibleAI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Veridian WorkOS AI Productivity Assistant" },
      {
        name: "description",
        content:
          "One AI workspace for drafting emails, summarizing meetings, planning tasks and answering workplace questions.",
      },
      { property: "og:title", content: "Veridian WorkOS — AI Career & Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meeting notes, plan your week and chat with a workplace AI assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    badge: "E",
    hot: false,
    title: "Email Generator",
    body: "Draft on-tone emails with a subject, greeting and closing in one pass.",
    cta: "Draft an email →",
  },
  {
    to: "/meetings" as const,
    badge: "M",
    hot: false,
    title: "Meeting Summarizer",
    body: "Turn raw notes into decisions, action items, owners and deadlines.",
    cta: "Summarize notes →",
  },
  {
    to: "/planner" as const,
    badge: "T",
    hot: true,
    title: "Task Planner",
    body: "Prioritize by urgency and importance into a realistic daily schedule.",
    cta: "Plan my day →",
  },
  {
    to: "/assistant" as const,
    badge: "A",
    hot: false,
    title: "Workplace Assistant",
    body: "Ask about communication, meetings, planning and staying organized.",
    cta: "Start a chat →",
  },
];

const STATS = [
  { label: "Emails drafted", value: "128", note: "▲ 22 this week", hot: true },
  { label: "Meetings summarized", value: "36", note: "9 action items", hot: false },
  { label: "Tasks scheduled", value: "54", note: "7 due today", hot: true },
  { label: "Focus time saved", value: "9.5h", note: "avg per week", hot: false },
];

const ACTIVITY = [
  {
    badge: "E",
    hot: false,
    title: "Drafted follow-up to Dr. Alvarez",
    meta: "Email Generator · 9:42 AM",
    tag: "Saved",
    tagHot: true,
  },
  {
    badge: "M",
    hot: false,
    title: "Summarized Monday standup notes",
    meta: "Meeting Summarizer · 8:15 AM",
    tag: "9 actions",
    tagHot: false,
  },
  {
    badge: "T",
    hot: true,
    title: "Built a 6-task schedule for today",
    meta: "Task Planner · 7:58 AM",
    tag: "2.5h",
    tagHot: false,
  },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
            <span className="inline-block h-px w-8 bg-signal" />
            Good morning
          </div>
          <h1 className="mt-3 max-w-[20ch] text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Maya, you have <span className="text-signal-deep">4 tools</span> to clear the
            busywork.
          </h1>
          <p className="mt-3 max-w-[52ch] text-pretty text-sm text-ink-soft">
            Veridian drafts, summarizes and schedules the admin — so you spend your hours
            on the work that actually moves. Everything runs from this one dashboard.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/planner"
            className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Open planner
          </Link>
          <Link
            to="/email"
            className="rounded-[8px] border border-line bg-card px-4 py-2 text-sm font-medium hover:bg-paper/70"
          >
            New email
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              {s.label}
            </div>
            <div className="mt-1 font-display text-2xl font-semibold tracking-tight">
              {s.value}
            </div>
            <div
              className={`mt-1 text-xs ${s.hot ? "font-medium text-signal-deep" : "text-ink-soft"}`}
            >
              {s.note}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Link
            key={f.title}
            to={f.to}
            className="group rounded-[12px] border border-line bg-card p-5 hover:border-ink/25"
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid size-9 place-items-center rounded-[8px] font-display text-sm font-bold text-paper ${f.hot ? "bg-signal" : "bg-ink"}`}
              >
                {f.badge}
              </span>
              <span
                className={`text-sm font-medium text-signal-deep ${i % 2 ? "rotate-6" : "-rotate-6"}`}
              >
                →
              </span>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
              {f.title}
            </h3>
            <p className="mt-1.5 text-pretty text-sm text-ink-soft">{f.body}</p>
            <div className="mt-4 text-xs font-medium text-ink-soft">{f.cta}</div>
          </Link>
        ))}
      </section>

      <section className="rounded-[14px] border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Recent activity
          </h2>
          <span className="text-xs font-medium text-ink-soft">Last 24 hours</span>
        </div>
        <ul className="divide-y divide-line">
          {ACTIVITY.map((a) => (
            <li key={a.title} className="flex items-center gap-3 px-5 py-3.5">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-[8px] font-display text-xs font-bold text-paper ${a.hot ? "bg-signal" : "bg-ink"}`}
              >
                {a.badge}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{a.title}</div>
                <div className="text-xs text-ink-soft">{a.meta}</div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${a.tagHot ? "bg-signal/10 text-signal-deep" : "bg-paper text-ink-soft ring-1 ring-line"}`}
              >
                {a.tag}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ResponsibleAI />
    </AppShell>
  );
}
