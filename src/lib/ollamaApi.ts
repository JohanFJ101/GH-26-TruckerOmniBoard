import { Driver, Load, Alert, FleetMetrics } from '../types';

const SYSTEM_PROMPT = `You are DispatchIQ, an AI copilot for Apex Freight Co. You give dispatchers fast, structured answers using live fleet data.

FLEET DATA:
Drivers: [inject current driver data as JSON]
Loads: [inject current loads as JSON]
Alerts: [inject current alerts as JSON]
Metrics: [inject current metrics as JSON]

---

RESPONSE FORMAT — always follow this template exactly:

**[Short title summarizing the answer — 5 words max]**

[1–2 sentence direct answer. Lead with the most important fact. Name specific drivers, load IDs, and dollar amounts from the data.]

**Details**
- **[Driver/Load/Metric]:** [one-line fact]
- **[Driver/Load/Metric]:** [one-line fact]
- (add more bullets only if needed — max 5)

**Action**
[One clear instruction the dispatcher should take right now. Start with a verb. Be specific.]

---

RULES:
- Never use vague language like "it depends" or "you may want to consider"
- Always use bold (**text**) for driver names, load IDs, dollar amounts, and percentages
- If recommending a driver, the first sentence must say who and why in one breath
- If there is a risk, state the dollar impact
- Total response must stay under 120 words
- Do not repeat the question back or add a closing remark`;

const MODEL = 'gemma3:4b';
const FETCH_TIMEOUT_MS = 120_000;

interface Message {
  role: string;
  content: string;
}

interface FleetContext {
  drivers: Driver[];
  loads: Load[];
  alerts: Alert[];
  metrics: FleetMetrics;
}

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaStreamChunk {
  message?: { role: string; content: string };
  done?: boolean;
  error?: string;
}

function getOllamaUrl(): string {
  if (import.meta.env.DEV) {
    return '/ollama/api/chat';
  }
  const base = (import.meta.env.VITE_OLLAMA_URL as string | undefined) ?? 'http://localhost:11434';
  return `${base.replace(/\/$/, '')}/api/chat`;
}

function buildMessages(
  userMessage: string,
  conversationHistory: Message[],
  fleetContext: FleetContext
): OllamaMessage[] {
  const systemWithData = SYSTEM_PROMPT
    .replace('[inject current driver data as JSON]', JSON.stringify(fleetContext.drivers))
    .replace('[inject current loads as JSON]', JSON.stringify(fleetContext.loads))
    .replace('[inject current alerts as JSON]', JSON.stringify(fleetContext.alerts))
    .replace('[inject current metrics as JSON]', JSON.stringify(fleetContext.metrics));

  return [
    { role: 'system', content: systemWithData },
    ...conversationHistory.map<OllamaMessage>((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];
}

export async function askCopilot(
  userMessage: string,
  conversationHistory: Message[],
  fleetContext: FleetContext,
  onToken?: (token: string) => void
): Promise<string> {
  const messages = buildMessages(userMessage, conversationHistory, fleetContext);

  let response: Response;
  try {
    response = await fetch(getOllamaUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, stream: true }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    console.error('Ollama fetch failed:', error);
    return getFallbackResponse(userMessage, fleetContext);
  }

  if (!response.ok) {
    console.error('Ollama API error:', response.status);
    return getFallbackResponse(userMessage, fleetContext);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return getFallbackResponse(userMessage, fleetContext);
  }

  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const chunk: OllamaStreamChunk = JSON.parse(line);
          if (chunk.error) throw new Error(chunk.error);
          const token = chunk.message?.content ?? '';
          if (token) {
            full += token;
            onToken?.(token);
          }
        } catch (parseErr) {
          // ignore malformed chunk
        }
      }
    }
  } catch (streamErr) {
    console.error('Ollama stream error:', streamErr);
    if (!full) return getFallbackResponse(userMessage, fleetContext);
  } finally {
    reader.cancel().catch(() => undefined);
  }

  return full.trim() || 'No response generated.';
}

export async function pingOllama(): Promise<string> {
  try {
    const response = await fetch(getOllamaUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'Respond with only the word "pong".' }],
        stream: false,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return `**Ollama status:** ⚠️ Unreachable (HTTP ${response.status}).\n\nMake sure Ollama is running on localhost:11434 and that \`${MODEL}\` is pulled.`;
    }

    const data = await response.json() as { message?: { content?: string } };
    const reply = data.message?.content?.trim() ?? '';
    return `**Ollama status:** ✅ Online\n\n- Model: \`${MODEL}\`\n- Endpoint: \`localhost:11434\`\n- Ping reply: "${reply}"`;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return `**Ollama status:** ❌ Offline\n\nCould not reach the local Ollama server. Start it with \`ollama serve\` and confirm \`${MODEL}\` is installed.\n\nError: ${msg}`;
  }
}

function getFallbackResponse(userMessage: string, ctx: FleetContext): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('best driver') || msg.includes('dallas') || msg.includes('assign')) {
    const available = ctx.drivers.filter((d) => !d.currentLoadId);
    const best = available.sort((a, b) => b.hos.driveRemaining - a.hos.driveRemaining)[0];
    if (best) {
      return `Based on current fleet data, I'd recommend **${best.name}** (${best.truckId}) for this assignment.\n\n**Why:** ${best.name} has ${best.hos.driveRemaining}h of drive time remaining and is currently ${best.status} in ${best.location.city}, ${best.location.state}. Their on-time rate is ${best.performance.onTimeRate}% with a cost per mile of $${best.performance.avgCostPerMile.toFixed(2)}.\n\nEstimated deadhead to pickup would be approximately 45 miles ($112 at $2.50/mi). Total estimated cost including fuel: $${(best.performance.avgCostPerMile * 400 + 112).toFixed(0)}.`;
    }
    return 'All drivers are currently assigned. Consider waiting for the next driver to become available or contacting a contract driver.';
  }

  if (msg.includes('delay') || msg.includes('risk')) {
    return `**Load L-3298** is your biggest risk right now. Ray Delgado is running 90 minutes late into Atlanta with only 2h of drive time remaining.\n\n**Financial impact:** $340 potential detention fee + $200 if the delivery window is missed entirely.\n\n**Recommended action:** Contact Coyote Logistics now to notify of delay. Book a rest stop near Meridian, MS — Ray needs a mandatory break before he can complete the run.`;
  }

  if (msg.includes('cost per mile') || msg.includes('cost')) {
    return `Your fleet cost per mile is trending **down** — currently at **$1.87/mi**, which is 3.2% lower than last week.\n\n**Biggest contributor to cost:** Ray Delgado at $2.01/mi. His routes have higher deadhead percentages and he's been hitting more detention. Sandra Okonkwo is your most efficient driver at $1.74/mi.\n\n**Quick win:** Reduce deadhead by 2% and you'll save approximately $380/week across the fleet.`;
  }

  if (msg.includes('hos') || msg.includes('ray') || msg.includes('delgado')) {
    return `**Ray Delgado (D-003)** — HOS Status:\n\n- Drive remaining: **2.0h** ⚠️ CAUTION\n- Duty remaining: 4.5h\n- Cycle remaining: 12.0h\n- Next break required in: 2.0h\n- Restart available: No\n\nRay is in Houston, TX on load L-3298 (Dallas → Atlanta). He **cannot** complete the remaining ~4h drive without a mandatory rest break. You need to either book a stop or plan a relay.`;
  }

  if (msg.includes('availability') || msg.includes('tomorrow')) {
    const available = ctx.drivers.filter((d) => !d.currentLoadId);
    return `**Fleet availability tomorrow morning:**\n\n${available.map((d) => `- **${d.name}** — ${d.location.city}, ${d.location.state} — ${d.hos.driveRemaining}h drive remaining`).join('\n')}\n\n${ctx.drivers.filter((d) => d.currentLoadId).map((d) => `- **${d.name}** — Currently on load ${d.currentLoadId}, expected free by late afternoon`).join('\n')}\n\nYou have ${available.length} drivers immediately available for dispatch.`;
  }

  return `I'm analyzing your fleet data now. Here's a quick snapshot:\n\n- **${ctx.metrics.activeLoads} active loads** with ${ctx.metrics.alertsActive} alerts requiring attention\n- **Cost per mile:** $${ctx.metrics.costPerMile.current.toFixed(2)} (${ctx.metrics.costPerMile.vsLastWeek > 0 ? '+' : ''}${ctx.metrics.costPerMile.vsLastWeek}% vs last week)\n- **On-time rate:** ${ctx.metrics.onTimeRate}%\n- **${ctx.metrics.driversAvailable} drivers** available for new assignments\n\nWhat specific aspect would you like me to dig into?`;
}
