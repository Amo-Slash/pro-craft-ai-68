import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ResponsibleAI } from "@/components/ResponsibleAI";
import { Field, Panel } from "@/components/ToolPanel";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Veridian WorkOS" },
      {
        name: "description",
        content:
          "Set your name, role and default email tone, and review the responsible AI guidance for this workspace.",
      },
      { property: "og:title", content: "Settings — Veridian WorkOS" },
      {
        property: "og:description",
        content: "Personal details, defaults and responsible AI guidance.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Maya Kowalski");
  const [role, setRole] = useState("Final-year student · Research assistant");
  const [tone, setTone] = useState("Formal");
  const [saved, setSaved] = useState(false);

  return (
    <AppShell title="Settings">
      <Panel title="Your profile">
        <div className="max-w-xl space-y-4 p-5">
          <Field label="Display name">
            <input
              className="field mt-1.5"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
          </Field>
          <Field label="Role or study programme" hint="Used to give the assistant context.">
            <input
              className="field mt-1.5"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSaved(false);
              }}
            />
          </Field>
          <Field label="Default email tone">
            <select
              className="field mt-1.5"
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
                setSaved(false);
              }}
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Persuasive</option>
            </select>
          </Field>

          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded-[8px] bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Save preferences
          </button>

          {saved ? (
            <div className="rounded-[8px] bg-success/10 px-3 py-2 text-xs font-medium text-success">
              Preferences saved for this session.
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel title="Data & privacy">
        <div className="space-y-2 p-5 text-sm text-ink-soft">
          <p>
            Conversations and generated drafts live only in your browser for the current
            session and are cleared when you refresh or use the clear buttons.
          </p>
          <p>
            Text you submit is sent to the AI provider to produce a response. Never include
            passwords, financial, medical or confidential company information.
          </p>
        </div>
      </Panel>

      <ResponsibleAI />
    </AppShell>
  );
}
