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

export async function callClaude(system, user, maxTokens = 2000) {
  const msg = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  return smartParse(msg.content[0].text);
}
