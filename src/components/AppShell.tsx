import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", hot: true },
  { to: "/email", label: "Email Generator", hot: false },
  { to: "/meetings", label: "Meeting Summarizer", hot: false },
  { to: "/planner", label: "Task Planner", hot: true },
  { to: "/assistant", label: "AI Assistant", hot: false },
  { to: "/settings", label: "Settings", hot: false },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <div className="lg:flex">
        <aside className="shrink-0 border-b border-line bg-card lg:sticky lg:top-0 lg:h-screen lg:w-[236px] lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center gap-2.5 px-5">
            <div className="grid size-8 -rotate-6 place-items-center rounded-[6px] bg-ink font-display text-sm font-bold text-paper">
              V
            </div>
            <div className="leading-none">
              <div className="font-display text-[15px] font-semibold tracking-tight">
                Veridian
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                WorkOS
              </div>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-[8px] px-3 py-2.5 text-sm text-ink-soft hover:bg-paper/70"
                activeProps={{ className: "bg-ink text-paper font-medium" }}
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${item.hot ? "bg-signal" : "bg-line"}`}
                />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden px-3 pt-4 lg:block">
            <div className="rounded-[10px] bg-ink p-4 text-paper">
              <div className="text-[10px] uppercase tracking-[0.18em] text-paper/50">
                Responsible AI
              </div>
              <p className="mt-2 text-xs leading-relaxed text-paper/80">
                AI output may contain errors. Verify before use, and never enter
                passwords, financial, medical or confidential data.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="z-20 border-b border-line bg-paper/90 backdrop-blur-sm lg:sticky lg:top-0">
            <div className="flex h-16 items-center gap-3 px-5">
              <h1 className="font-display text-lg font-semibold tracking-tight">
                {title}
              </h1>
              <div className="ml-auto flex items-center gap-3">
                <div className="hidden w-56 items-center gap-2 rounded-[8px] border border-line bg-card px-3 py-2 text-sm text-ink-soft sm:flex">
                  <span className="text-ink-soft/60">⌕</span>
                  <span>Search…</span>
                </div>
                <div className="grid size-9 place-items-center rounded-full bg-ink font-display text-sm font-semibold text-paper">
                  MK
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
