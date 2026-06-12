// Server-side DeepSeek client. NEVER expose DEEPSEEK_API_KEY to the client.
// If the key is missing or the call fails, callers must fall back to mock content.

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekOptions {
  messages: DeepSeekMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callDeepSeek(
  opts: DeepSeekOptions
): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: opts.model ?? "deepseek-chat",
        messages: opts.messages,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 600,
        stream: false,
      }),
    });

    if (!res.ok) {
      console.error("DeepSeek error", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
    return null;
  } catch (err) {
    console.error("DeepSeek call failed", err);
    return null;
  }
}
