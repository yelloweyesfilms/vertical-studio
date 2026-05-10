import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function smartParse(text) {
  const start = text.indexOf("{");
  if (start === -1) throw new Error("Pas de JSON dans la réponse");
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\" && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end !== -1) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch (_) {}
  }
  let json = text.slice(start);
  json = json.replace(/,?\s*"[^"]*$/, "");
  json = json.replace(/:\s*"[^"]*$/, ': ""');
  json = json.replace(/,\s*\{[^}]*$/, "");
  const stack = [];
  inStr = false; esc = false;
  for (const ch of json) {
    if (esc) { esc = false; continue; }
    if (ch === "\\" && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }
  if (inStr) json += '"';
  json += stack.reverse().join("");
  return JSON.parse(json);
}

async function withRetry(fn, maxAttempts = 2) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const retryable = e.status === 529 || e.status === 503 || e.status === 500 || e.status === 502;
      if (attempt === maxAttempts || !retryable) throw e;
      await new Promise(r => setTimeout(r, attempt * 1500));
    }
  }
}

export async function callClaude(system, user, maxTokens = 2000) {
  return withRetry(async () => {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: [{ type: "text", text: system.trim() }],
      messages: [{ role: "user", content: [{ type: "text", text: user.trim() }] }],
    });
    return smartParse(msg.content[0].text);
  });
}

export async function streamClaude(system, user, maxTokens = 2000, onChunk) {
  let fullText = "";
  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: [{ type: "text", text: system.trim() }],
    messages: [{ role: "user", content: [{ type: "text", text: user.trim() }] }],
  });
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
      fullText += chunk.delta.text;
      if (onChunk) onChunk(chunk.delta.text);
    }
  }
  return smartParse(fullText);
}
