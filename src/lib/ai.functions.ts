import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  CHAT_SYSTEM_PROMPT,
  emailPrompt,
  meetingPrompt,
  plannerPrompt,
} from "./prompts";

const MODEL = "google/gemini-3.7-flash";

const taskSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
  deadline: z.string(),
  duration: z.string(),
});

const requestSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("email"),
    recipient: z.string().min(1, "Recipient is required"),
    purpose: z.string().min(1, "Purpose is required"),
    keyInfo: z.string(),
    tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  }),
  z.object({
    kind: z.literal("meeting"),
    notes: z.string().min(20, "Please paste at least a few lines of notes"),
  }),
  z.object({
    kind: z.literal("planner"),
    horizon: z.enum(["Daily", "Weekly"]),
    tasks: z.array(taskSchema).min(1, "Add at least one task"),
  }),
  z.object({
    kind: z.literal("chat"),
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().min(1),
        }),
      )
      .min(1),
  }),
]);

type AiRequest = z.infer<typeof requestSchema>;

type GatewayMessage = { role: "system" | "user" | "assistant"; content: string };

function buildMessages(data: AiRequest): GatewayMessage[] {
  switch (data.kind) {
    case "email":
      return [{ role: "user", content: emailPrompt(data) }];
    case "meeting":
      return [{ role: "user", content: meetingPrompt(data.notes) }];
    case "planner":
      return [{ role: "user", content: plannerPrompt(data.tasks, data.horizon) }];
    case "chat":
      return [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...data.messages.map((m) => ({ role: m.role, content: m.content })),
      ];
  }
}

function friendlyError(status: number, message: string) {
  if (status === 429)
    return "The AI service is busy right now. Please wait a moment and try again.";
  if (status === 402)
    return "AI credits are exhausted for this workspace. Add credits in Lovable to keep generating.";
  if (status === 403)
    return "AI access is currently blocked for this workspace. Please check your Lovable AI settings.";
  if (status === 401) return "The AI service is not configured correctly.";
  return message || "The AI service could not complete this request.";
}

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured (missing API key).");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: buildMessages(data),
        temperature: data.kind === "meeting" ? 0.2 : 0.6,
      }),
    });

    if (!res.ok) {
      let message = "";
      try {
        const body = (await res.json()) as { error?: { message?: string } };
        message = body?.error?.message ?? "";
      } catch {
        message = await res.text().catch(() => "");
      }
      throw new Error(friendlyError(res.status, message));
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) throw new Error("The AI returned an empty response. Please try again.");

    return { text };
  });
