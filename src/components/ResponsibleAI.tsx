export const RESPONSIBLE_AI_TEXT =
  "AI-generated content may contain errors or inaccuracies. Always review and verify AI-generated information before using it for important decisions or professional communication. Do not enter passwords, financial information, confidential company information, medical information or other sensitive personal information.";

export function ResponsibleAI() {
  return (
    <section className="flex flex-col gap-3 rounded-[12px] border border-line bg-ink p-5 text-paper sm:flex-row sm:items-start sm:gap-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-signal font-display text-sm font-bold text-paper">
        !
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-paper/50">
          Responsible AI
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-paper/85">
          {RESPONSIBLE_AI_TEXT}
        </p>
      </div>
    </section>
  );
}

export function ReviewNote() {
  return (
    <div className="flex items-center gap-2 rounded-[8px] bg-signal/10 px-3 py-2 text-xs text-ink-soft">
      <span className="size-1.5 shrink-0 rounded-full bg-signal" />
      Review before using — AI output may contain inaccuracies.
    </div>
  );
}
