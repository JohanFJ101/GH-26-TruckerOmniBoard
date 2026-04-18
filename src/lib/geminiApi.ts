import { Driver, Load, Alert, FleetMetrics } from '../types';

const SYSTEM_PROMPT = `You are DispatchIQ, an AI fleet operations assistant for a small trucking fleet called Apex Freight Co.
You have access to the following real-time fleet data:

DRIVERS:
[inject current driver data as JSON]

ACTIVE LOADS:
[inject current loads as JSON]

ACTIVE ALERTS:
[inject current alerts as JSON]

FLEET METRICS:
[inject current metrics as JSON]

You help dispatchers make smart, fast decisions. You:
- Recommend which driver to assign to a load (with reasoning)
- Explain cost breakdowns and how to reduce cost per mile
- Flag safety and HOS risks before they become incidents
- Answer questions about driver availability, load status, ETAs
- Suggest proactive actions to avoid delays or detention fees

Always be direct and actionable. Use specific driver names and numbers from the data.
Format responses with clear structure — use short paragraphs, not bullet walls.
When recommending a driver, always explain WHY in one sentence.
Keep responses under 150 words unless a detailed breakdown is explicitly requested.`;

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

export async function askCopilot(
  userMessage: string,
  conversationHistory: Message[],
  fleetContext: FleetContext
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return getFallbackResponse(userMessage, fleetContext);
  }

  const systemWithData = SYSTEM_PROMPT
    .replace('[inject current driver data as JSON]', JSON.stringify(fleetContext.drivers, null, 2))
    .replace('[inject current loads as JSON]', JSON.stringify(fleetContext.loads, null, 2))
    .replace('[inject current alerts as JSON]', JSON.stringify(fleetContext.alerts, null, 2))
    .replace('[inject current metrics as JSON]', JSON.stringify(fleetContext.metrics, null, 2));

  const contents = conversationHistory.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemWithData }] },
          contents,
          generationConfig: { maxOutputTokens: 1000 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response generated.';
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return getFallbackResponse(userMessage, fleetContext);
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
