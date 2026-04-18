# DispatchIQ — Fleet Operations Dashboard

## Claude Code Master Build Document

> GlobeHack Season 1 · TruckerPath "Marketplace & Growth" Track Project folder: C:\Users\johan\Documents\GC26 Truck

---

## 1. PROJECT OVERVIEW

**Product Name:** DispatchIQ  
**Tagline:** The AI brain for small fleet dispatchers  
**Core Pitch:** An AI-native fleet operations assistant that sits on top of TruckerPath's existing data layer — turning real-time driver GPS, fuel prices, weigh station wait times, and HOS data into smart dispatcher decisions.

**Problem Solved:** Small fleet dispatchers (5–50 trucks) assign loads blindly — no real-time driver visibility, no cost intelligence, no proactive alerts. They run on spreadsheets and phone calls.

**Key Differentiator:** DispatchIQ doesn't just show data — it makes decisions and explains them. It uses TruckerPath's unique data moat (fuel prices, weigh station status, parking availability, 1M+ crowdsourced driver inputs) to calculate the TRUE cost of every dispatch decision before it's made.

**Problem Areas Addressed (minimum 2 required):**

1. ✅ **Smart Dispatch** — AI-ranked driver assignment with true cost scoring
2. ✅ **Cost Intelligence** — Real cost-per-mile broken down by driver/route/load
3. ✅ **Proactive Alerts** — Live load monitoring with financial impact estimates
4. ✅ **Safety & Compliance** — HOS violation early warning system

---

## 2. TECH STACK

```
Frontend:     React 18 + TypeScript
Styling:      Tailwind CSS + custom CSS variables
Charts:       Recharts
Maps:         Leaflet.js (react-leaflet)
Animations:   Framer Motion
Icons:        Lucide React
AI Layer:     Anthropic Claude API (claude-sonnet-4-6) via fetch
State:        Zustand
Routing:      React Router v6
Build:        Vite
Package Mgr:  npm
```

**No backend required for the hackathon demo.** All data is mocked/simulated. The AI calls go directly to the Anthropic API from the frontend.

---

## 3. PROJECT STRUCTURE

```
GC26 Truck/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component + routing
│   ├── index.css                   # Global styles + CSS variables
│   │
│   ├── data/
│   │   ├── mockDrivers.ts          # Mock driver fleet data
│   │   ├── mockLoads.ts            # Mock load/freight data
│   │   ├── mockAlerts.ts           # Mock proactive alerts
│   │   └── mockMetrics.ts          # Mock cost/performance metrics
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   │
│   ├── store/
│   │   └── useStore.ts             # Zustand global state
│   │
│   ├── lib/
│   │   ├── claudeApi.ts            # Anthropic API wrapper
│   │   └── costCalculator.ts       # True cost calculation logic
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Left navigation sidebar
│   │   │   ├── TopBar.tsx          # Top header with alerts badge
│   │   │   └── Layout.tsx          # Main layout wrapper
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MetricsRow.tsx      # Top KPI cards row
│   │   │   ├── FleetMap.tsx        # Live driver location map
│   │   │   ├── AlertsFeed.tsx      # Real-time alerts panel
│   │   │   └── ActiveLoads.tsx     # Loads in transit table
│   │   │
│   │   ├── dispatch/
│   │   │   ├── LoadQueue.tsx       # Pending loads to assign
│   │   │   ├── DriverSelector.tsx  # AI-ranked driver cards
│   │   │   ├── TrueCostCard.tsx    # Cost breakdown per driver option
│   │   │   └── AssignModal.tsx     # Confirm assignment modal
│   │   │
│   │   ├── copilot/
│   │   │   ├── CopilotPanel.tsx    # AI chat interface (main feature)
│   │   │   ├── CopilotMessage.tsx  # Individual message bubble
│   │   │   └── SuggestedPrompts.tsx # Quick-action prompt chips
│   │   │
│   │   └── shared/
│   │       ├── Badge.tsx
│   │       ├── StatusDot.tsx
│   │       ├── HOSBar.tsx          # Visual HOS hours remaining bar
│   │       └── CostTrend.tsx       # Sparkline cost trend
│   │
│   └── pages/
│       ├── Dashboard.tsx           # Main overview page
│       ├── Dispatch.tsx            # Smart dispatch page
│       ├── Copilot.tsx             # Full AI copilot page
│       ├── Drivers.tsx             # Driver management page
│       └── Analytics.tsx          # Cost intelligence page
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── CLAUDE.md                       # This file
```

---

## 4. DESIGN SYSTEM

### 4.1 Aesthetic Direction

**Industrial Dark / Tactical Operations Center**  
Think: mission control meets logistics war room. Dark backgrounds, amber/orange accent (trucker/road feel), monospace data readouts, tight grid layouts. NOT generic SaaS purple. NOT Bootstrap blue.

### 4.2 Color Palette (CSS Variables in index.css)

```css
:root {
  /* Backgrounds */
  --bg-base:        #0a0c10;   /* Near-black base */
  --bg-surface:     #111318;   /* Card/panel backgrounds */
  --bg-elevated:    #1a1d25;   /* Hover states, modals */
  --bg-border:      #252833;   /* Subtle borders */

  /* Brand Colors */
  --accent-primary: #f97316;   /* Trucker orange — primary CTA, highlights */
  --accent-amber:   #fbbf24;   /* Amber — warnings, HOS caution */
  --accent-blue:    #3b82f6;   /* Blue — informational, links */
  --accent-green:   #22c55e;   /* Green — safe status, on-time */
  --accent-red:     #ef4444;   /* Red — violations, critical alerts */

  /* Text */
  --text-primary:   #f1f5f9;   /* Main text */
  --text-secondary: #94a3b8;   /* Subtext, labels */
  --text-muted:     #475569;   /* Timestamps, metadata */

  /* Special */
  --glow-orange:    0 0 20px rgba(249, 115, 22, 0.3);
  --glow-blue:      0 0 20px rgba(59, 130, 246, 0.2);
}
```

### 4.3 Typography

```css
/* Import in index.html <head> */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;500;600;700&display=swap');

/* Usage */
--font-display:  'Sora', sans-serif;      /* Headings, UI labels */
--font-mono:     'Space Mono', monospace; /* Data values, metrics, IDs */
```

### 4.4 Component Conventions

- All cards: `bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl`
- Active/selected state: `border-[var(--accent-primary)]` + subtle orange glow
- Status badges: pill-shaped, colored dot + label
- Metric numbers: Space Mono font, large, no commas for live feel
- All transitions: `transition-all duration-200`

---

## 5. DATA MODELS (src/types/index.ts)

```typescript
// ─── DRIVER ──────────────────────────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  avatar: string;              // initials fallback
  truckId: string;
  truckType: 'dry-van' | 'reefer' | 'flatbed' | 'tanker';
  status: 'driving' | 'on-duty' | 'off-duty' | 'sleeper';
  location: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    lastUpdated: string;       // ISO timestamp
  };
  hos: {
    driveRemaining: number;    // hours, e.g. 8.5
    dutyRemaining: number;     // hours, e.g. 11.0
    cycleRemaining: number;    // hours in 70h/8day cycle
    nextBreakIn: number;       // hours until mandatory 30-min break
    restartAvailable: boolean;
  };
  performance: {
    onTimeRate: number;        // 0-100%
    avgCostPerMile: number;    // dollars
    safetyScore: number;       // 0-100
    totalMilesThisWeek: number;
  };
  currentLoadId: string | null;
  phone: string;
}

// ─── LOAD ────────────────────────────────────────────────────────────────────
export interface Load {
  id: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'delayed';
  pickup: {
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
    time: string;              // ISO
    windowHours: number;       // flexibility window
  };
  delivery: {
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
    time: string;              // ISO deadline
  };
  commodity: string;
  weight: number;              // lbs
  miles: number;               // total route miles
  rate: number;                // dollars, broker rate
  assignedDriverId: string | null;
  brokerName: string;
  priority: 'standard' | 'hot' | 'critical';
}

// ─── DISPATCH OPTION (AI Output) ─────────────────────────────────────────────
export interface DispatchOption {
  driver: Driver;
  score: number;               // 0-100 AI ranking score
  rank: number;                // 1, 2, 3
  trueCost: {
    total: number;             // total estimated cost
    deadheadMiles: number;
    deadheadCost: number;      // at $2.50/mi
    fuelCost: number;          // based on route fuel prices
    hosRisk: string;           // 'none' | 'caution' | 'high'
    estimatedDetention: number;
    estimatedTollCost: number;
  };
  rippleEffects: string[];     // ["Driver will miss Load #L-2049 tomorrow"]
  recommendation: string;      // AI explanation sentence
  warnings: string[];          // ["Low HOS — may need rest stop in Amarillo"]
}

// ─── ALERT ───────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  type: 'breakdown' | 'delay' | 'hos-violation' | 'weather' | 'deviation' | 'inspection';
  severity: 'info' | 'warning' | 'critical';
  loadId?: string;
  driverId: string;
  title: string;
  description: string;
  financialImpact?: number;    // estimated $ impact
  actionRequired: string;      // what dispatcher should do
  timestamp: string;
  acknowledged: boolean;
}

// ─── METRIC ──────────────────────────────────────────────────────────────────
export interface FleetMetrics {
  costPerMile: {
    current: number;
    trend: number[];           // last 7 days
    vsLastWeek: number;        // % change
  };
  onTimeRate: number;
  activeLoads: number;
  driversAvailable: number;
  deadheadPercentage: number;
  revenueToday: number;
  alertsActive: number;
}
```

---

## 6. MOCK DATA (src/data/mockDrivers.ts)

Create 6 drivers with realistic data spread across the US:

```typescript
export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'D-001',
    name: 'Marcus Webb',
    truckId: 'T-4821',
    truckType: 'dry-van',
    status: 'driving',
    location: { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL', lastUpdated: '2 min ago' },
    hos: { driveRemaining: 6.5, dutyRemaining: 9.0, cycleRemaining: 42.0, nextBreakIn: 2.5, restartAvailable: false },
    performance: { onTimeRate: 94, avgCostPerMile: 1.82, safetyScore: 91, totalMilesThisWeek: 1840 },
    currentLoadId: 'L-3301',
    phone: '(312) 555-0182',
  },
  {
    id: 'D-002',
    name: 'Sandra Okonkwo',
    truckId: 'T-3390',
    truckType: 'reefer',
    status: 'on-duty',
    location: { lat: 35.1495, lng: -90.0490, city: 'Memphis', state: 'TN', lastUpdated: '5 min ago' },
    hos: { driveRemaining: 10.0, dutyRemaining: 13.5, cycleRemaining: 58.0, nextBreakIn: 4.0, restartAvailable: false },
    performance: { onTimeRate: 98, avgCostPerMile: 1.74, safetyScore: 97, totalMilesThisWeek: 2210 },
    currentLoadId: null,
    phone: '(901) 555-0241',
  },
  {
    id: 'D-003',
    name: 'Ray Delgado',
    truckId: 'T-5501',
    truckType: 'dry-van',
    status: 'driving',
    location: { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX', lastUpdated: '1 min ago' },
    hos: { driveRemaining: 2.0, dutyRemaining: 4.5, cycleRemaining: 12.0, nextBreakIn: 2.0, restartAvailable: false },
    performance: { onTimeRate: 87, avgCostPerMile: 2.01, safetyScore: 78, totalMilesThisWeek: 3100 },
    currentLoadId: 'L-3298',
    phone: '(713) 555-0309',
  },
  {
    id: 'D-004',
    name: 'Tanya Rivers',
    truckId: 'T-2204',
    truckType: 'flatbed',
    status: 'off-duty',
    location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ', lastUpdated: '45 min ago' },
    hos: { driveRemaining: 11.0, dutyRemaining: 14.0, cycleRemaining: 65.0, nextBreakIn: 8.0, restartAvailable: true },
    performance: { onTimeRate: 96, avgCostPerMile: 1.79, safetyScore: 94, totalMilesThisWeek: 890 },
    currentLoadId: null,
    phone: '(602) 555-0178',
  },
  {
    id: 'D-005',
    name: 'James Patel',
    truckId: 'T-6612',
    truckType: 'dry-van',
    status: 'sleeper',
    location: { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN', lastUpdated: '3 hr ago' },
    hos: { driveRemaining: 11.0, dutyRemaining: 14.0, cycleRemaining: 55.0, nextBreakIn: 11.0, restartAvailable: false },
    performance: { onTimeRate: 91, avgCostPerMile: 1.88, safetyScore: 89, totalMilesThisWeek: 1650 },
    currentLoadId: null,
    phone: '(615) 555-0444',
  },
  {
    id: 'D-006',
    name: 'Debbie Kowalski',
    truckId: 'T-1103',
    truckType: 'reefer',
    status: 'driving',
    location: { lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA', lastUpdated: '8 min ago' },
    hos: { driveRemaining: 7.5, dutyRemaining: 10.0, cycleRemaining: 38.0, nextBreakIn: 3.5, restartAvailable: false },
    performance: { onTimeRate: 93, avgCostPerMile: 1.91, safetyScore: 88, totalMilesThisWeek: 2050 },
    currentLoadId: 'L-3305',
    phone: '(215) 555-0622',
  },
];
```

---

## 7. PAGES & COMPONENTS — DETAILED SPECS

---

### 7.1 LAYOUT (src/components/layout/)

#### Sidebar.tsx

- Fixed left sidebar, 64px wide collapsed / 240px expanded
- Logo: "DispatchIQ" with small truck icon at top
- Nav items with icons: Dashboard, Dispatch, AI Copilot, Drivers, Analytics
- Active item: orange left border + orange icon
- Bottom: fleet name "Apex Freight Co." + settings icon
- Collapsible on click

#### TopBar.tsx

- Height: 56px
- Left: current page title + breadcrumb
- Center: Live fleet status indicator — "6 DRIVERS · 3 ACTIVE LOADS · LIVE" with pulsing green dot
- Right: Alerts bell with red badge count, dispatcher avatar

---

### 7.2 DASHBOARD PAGE (src/pages/Dashboard.tsx)

**Layout: 3-section grid**

```
┌─────────────────────────────────────────────────────┐
│  MetricsRow (5 KPI cards spanning full width)        │
├──────────────────────────┬──────────────────────────┤
│  FleetMap (60% width)    │  AlertsFeed (40% width)  │
│  Live driver pins on map │  Scrollable alert list   │
├──────────────────────────┴──────────────────────────┤
│  ActiveLoads table (full width)                      │
└─────────────────────────────────────────────────────┘
```

#### MetricsRow.tsx — 5 KPI Cards

Each card: icon + label + big number + trend indicator

|Card|Icon|Value|Trend|
|---|---|---|---|
|Cost Per Mile|TrendingDown|$1.87|-3.2% vs last week (green)|
|Active Loads|Package|3|—|
|On-Time Rate|Clock|94%|+1.4% (green)|
|Drivers Available|Users|3/6|—|
|Deadhead %|Route|12.4%|+2.1% (red = bad)|

Styling: Cards have a subtle top border glow matching the trend color.

#### FleetMap.tsx

- Use `react-leaflet` with a dark tile layer (CartoDB dark matter)
- Custom truck icon pins per driver, colored by status:
    - Green = driving/on-duty + good HOS
    - Amber = caution (HOS < 3hrs)
    - Red = violation/breakdown
    - Gray = off-duty/sleeper
- Click pin → popup with driver name, HOS bar, current load, "Assign Load" button
- Animate pin to pulse if driver has active alert

#### AlertsFeed.tsx

- Header: "Live Alerts" + count badge
- Each alert row:
    - Severity icon (colored)
    - Driver name + alert title
    - Financial impact chip (if applicable): "$340 detention risk"
    - Time ago
    - "View" → opens detail
    - "Dismiss" button
- Critical alerts have red left border + subtle red background
- Sort: critical first, then by time

#### ActiveLoads.tsx

- Table columns: Load ID | Route | Driver | Status | ETA | Rate | Actions
- Status badges: color-coded pill (In Transit = blue, Delayed = amber, Critical = red)
- Inline ETA — if delayed, show original vs updated ETA in red
- Row click expands to show full load detail inline

---

### 7.3 DISPATCH PAGE (src/pages/Dispatch.tsx)

**This is the hero feature. Most important page for judges.**

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  Load Queue panel (left 35%)  │  Assignment panel   │
│  - Pending loads list         │  (right 65%)        │
│  - Select load to assign      │  - AI driver options│
│                               │  - True cost cards  │
└─────────────────────────────────────────────────────┘
```

#### LoadQueue.tsx

- List of pending/unassigned loads
- Each item: Load ID, route (City → City), deadline, commodity, rate
- Hot/Critical loads have orange/red dot
- Selected load has orange highlight
- "New Load" button at top

#### DispatchOption / TrueCostCard.tsx

When a load is selected, show 3 AI-ranked driver options:

**Each Driver Option Card contains:**

```
┌────────────────────────────────────────────────┐
│ #1  BEST MATCH        ← rank badge             │
│ Marcus Webb · T-4821 · Dry Van                 │
│ Chicago, IL · 6h 30m HOS remaining             │
│                                                │
│ AI RECOMMENDATION:                             │
│ "Closest driver with sufficient HOS and low    │
│  deadhead. 18 miles to pickup vs 43 for next   │
│  best option."                                 │
│                                                │
│ TRUE COST BREAKDOWN                            │
│  Deadhead:      18 mi    $45                  │
│  Fuel (route):           $312                  │
│  Weigh delays:  ~8 min   $18                   │
│  Estimated toll:         $22                   │
│  ─────────────────────────────                │
│  TOTAL ESTIMATED COST:   $397  ← bold orange  │
│  Rate:                   $1,850                │
│  Estimated Margin:       $1,453 (78.5%)        │
│                                                │
│ ⚠ HOS caution: may need 30-min break at Joliet│
│                                                │
│         [ASSIGN THIS DRIVER]  ← orange button │
└────────────────────────────────────────────────┘
```

Other 2 options show same format but collapsed by default, expandable.

#### Ripple Effect Preview

Below driver options, show a 24h timeline:

- "If you assign Webb to this load, here is your fleet availability tomorrow:"
- Visual bar chart: which drivers are free/busy at what times

#### AssignModal.tsx

Confirmation modal:

- Summary: Load → Driver
- One-click send notification to driver (simulated)
- Confirm button triggers status update

---

### 7.4 AI COPILOT PAGE (src/pages/Copilot.tsx)

**The "wow" moment for judges — they'll interact with this.**

**Layout: Full-page chat interface**

```
┌─────────────────────────────────────────────────────┐
│ DISPATCH COPILOT              [Clear] [Export]       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Welcome message + suggested prompts]               │
│                                                      │
│  Chat messages area (scrollable)                     │
│                                                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│  [Quick action chips]                                │
│  ┌─────────────────────────────────────┐  [Send]    │
│  │ Ask anything about your fleet...    │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

#### CopilotPanel.tsx — AI Implementation

The copilot calls the real Anthropic API. Build it as follows:

```typescript
// src/lib/claudeApi.ts

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

export async function askCopilot(
  userMessage: string,
  conversationHistory: { role: string; content: string }[],
  fleetContext: { drivers: Driver[]; loads: Load[]; alerts: Alert[]; metrics: FleetMetrics }
): Promise<string> {
  const systemWithData = SYSTEM_PROMPT
    .replace('[inject current driver data as JSON]', JSON.stringify(fleetContext.drivers, null, 2))
    .replace('[inject current loads as JSON]', JSON.stringify(fleetContext.loads, null, 2))
    .replace('[inject current alerts as JSON]', JSON.stringify(fleetContext.alerts, null, 2))
    .replace('[inject current metrics as JSON]', JSON.stringify(fleetContext.metrics, null, 2));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemWithData,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}
```

**IMPORTANT:** Add `VITE_ANTHROPIC_API_KEY=your_key_here` to `.env` file.

#### SuggestedPrompts.tsx — Quick Action Chips

Show these clickable prompt chips above the input:

```
"Who's my best driver for a Dallas pickup at 6am?"
"Which loads are at risk of delay today?"
"Why is my cost per mile up this week?"
"Show me Ray Delgado's HOS status"
"What's my fleet availability tomorrow morning?"
"Which driver should I NOT assign to long hauls right now?"
```

#### Message Styling

- User messages: right-aligned, orange background pill
- AI messages: left-aligned, dark surface card with subtle orange left border
- AI response has "DispatchIQ" header + small truck icon
- Loading state: animated typing dots
- Each AI message shows a "suggested action" chip if relevant (e.g., "Assign Webb to L-3401")

---

### 7.5 ANALYTICS PAGE (src/pages/Analytics.tsx)

**Cost Intelligence view — the second key problem area.**

**Layout:**

```
┌─────────────────┬────────────────────────────────────┐
│ Cost Per Mile   │  7-Day Trend Line Chart             │
│ by Driver       │  (fleet average vs individual)      │
│ (ranked list)   │                                     │
├─────────────────┴────────────────────────────────────┤
│  Load Profitability Table                             │
│  Load ID | Route | Driver | Miles | Cost | Rate | Margin│
├───────────────────────────────────────────────────────┤
│  Cost Breakdown Donut Chart                           │
│  Fuel / Deadhead / Detention / Tolls / Other          │
└───────────────────────────────────────────────────────┘
```

Charts: use Recharts. Dark theme — grid lines `var(--bg-border)`, chart colors use design palette.

---

### 7.6 DRIVERS PAGE (src/pages/Drivers.tsx)

Simple grid of driver cards, each showing:

- Driver name + avatar initials
- Truck ID + type badge
- Status indicator (colored dot)
- HOS bar (visual): Drive remaining / Duty remaining
- Safety score gauge
- Location + last updated
- Performance stats: on-time %, cost/mi, miles this week
- "Message" + "Assign Load" action buttons

---

## 8. KEY SHARED COMPONENTS

### HOSBar.tsx

```tsx
// Visual HOS remaining bar
// Props: driveRemaining (0-11), dutyRemaining (0-14)
// Colors: green > 6hrs, amber 2-6hrs, red < 2hrs
// Show: colored fill bar + number label
```

### StatusDot.tsx

```tsx
// Small colored dot with optional pulse animation
// Props: status ('driving' | 'on-duty' | 'off-duty' | 'sleeper' | 'alert')
// driving = green pulse, alert = red pulse, others = static
```

### Badge.tsx

```tsx
// Pill badge for severity/priority/type labels
// Props: label, variant ('info' | 'warning' | 'critical' | 'success' | 'neutral')
```

---

## 9. ANIMATIONS & INTERACTIONS

Use Framer Motion for:

- Page transitions: fade + slight upward slide (y: 10 → 0)
- Metric cards: count-up animation on mount
- Alert feed: new alerts slide in from right
- Driver option cards: staggered entrance (delay: index * 0.1s)
- Map pins: scale pulse on alert
- Copilot messages: fade in + slight translate

CSS-only for:

- Button hover states
- Card hover lift (transform: translateY(-2px))
- Status dot pulse (keyframe animation)

---

## 10. SETUP INSTRUCTIONS

### Initial Setup

```bash
cd "C:\Users\johan\Documents\GC26 Truck"
npm create vite@latest . -- --template react-ts
npm install

# Install all dependencies
npm install tailwindcss postcss autoprefixer
npm install framer-motion lucide-react recharts
npm install react-leaflet leaflet @types/leaflet
npm install zustand react-router-dom
npm install @types/react-router-dom

# Init Tailwind
npx tailwindcss init -p
```

### tailwind.config.js

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### .env file (create in project root)

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### vite.config.ts — Add proxy to avoid CORS on Anthropic API

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        headers: {
          'anthropic-version': '2023-06-01',
        },
      },
    },
  },
})
```

**If using proxy, update claudeApi.ts fetch URL to `/api/anthropic/v1/messages`**

---

## 11. BUILD ORDER (recommended sequence)

Claude Code should build in this order to avoid dependency issues:

1. `src/types/index.ts` — all interfaces first
2. `src/data/mockDrivers.ts` + `mockLoads.ts` + `mockAlerts.ts` + `mockMetrics.ts`
3. `src/index.css` — design tokens + global styles
4. `src/store/useStore.ts` — Zustand store
5. `src/lib/claudeApi.ts` — AI wrapper
6. `src/lib/costCalculator.ts` — cost logic
7. Layout components: `Sidebar.tsx` → `TopBar.tsx` → `Layout.tsx`
8. Shared components: `Badge.tsx`, `StatusDot.tsx`, `HOSBar.tsx`
9. Dashboard components: `MetricsRow.tsx` → `AlertsFeed.tsx` → `FleetMap.tsx` → `ActiveLoads.tsx`
10. `src/pages/Dashboard.tsx` — assemble dashboard
11. Dispatch components → `src/pages/Dispatch.tsx`
12. Copilot components → `src/pages/Copilot.tsx`
13. `src/pages/Drivers.tsx`
14. `src/pages/Analytics.tsx`
15. `src/App.tsx` — routing + layout wrapper
16. Final: `index.html` (add Google Fonts link)

---

## 12. DEMO SCRIPT (for judges)

When demoing to judges, follow this flow:

1. **Dashboard** (30 sec) — "Here's the fleet at a glance. 3 active loads, 2 alerts, cost per mile trending down."
    
2. **Alert** (20 sec) — Click the amber alert "Ray Delgado — HOS Caution · $340 detention risk". Show financial impact.
    
3. **Smart Dispatch** (60 sec) — "A new load just came in: Chicago to Dallas, $1,850, pickup in 4 hours." Select it from queue. Show 3 AI-ranked options with true cost cards. "DispatchIQ recommends Marcus Webb — 18 miles deadhead vs 43 for the next option, saving $62 in deadhead alone."
    
4. **AI Copilot** (90 sec) — Type: _"Who's my best driver for the Dallas pickup at 6am tomorrow and what's the true cost?"_ → Show real AI response. Then: _"Why is my cost per mile up this week?"_
    
5. **Analytics** (20 sec) — "Here's where the cost is coming from. Deadhead is up 2% — Ray Delgado's routes are the main contributor."
    

**Total demo: ~3.5 minutes**

---

## 13. NOTES FOR CLAUDE CODE

- All mock data should be realistic — real US city coordinates, realistic HOS numbers, real-sounding driver names
- The AI Copilot is the centerpiece — make sure the system prompt is rich with context
- Prioritize the Dispatch page and Copilot page over Analytics if short on time
- The map MUST work — use OpenStreetMap tiles (free, no API key): `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` or CartoDB Dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Keep components small — max ~150 lines per file
- Use TypeScript strictly — no `any` types
- All monetary values: format as `$X,XXX` with commas
- Responsive down to 1280px minimum (judges will be on laptops)
- No placeholder lorem ipsum — all text should be real trucking/logistics language

---

---

## 14. NAVPRO API — OVERVIEW

**What it is:** TruckerPath's official fleet management REST API, released March 31, 2026.  
**Base URL:** `https://api.truckerpath.com/navpro`  
**Auth:** JWT Bearer token — `Authorization: Bearer <your_jwt_token>`  
**Rate limit:** 25 requests/second  
**OpenAPI version:** 3.0.1

### How to Get Credentials

- **Self-serve:** Log into NavPro platform → Settings → API Docs module
- **Contact:** Email `integrations@truckerpath.com` with: First/Last Name, Email, Company Name
- **For hackathon:** Mention GlobeHack — they may fast-track access
- **IMPORTANT:** When emailing, ask specifically: _"Do you have a sandbox/staging environment so we don't affect live fleet data?"_

### Add to .env

```
VITE_NAVPRO_JWT=your_navpro_jwt_token_here
```

---

## 15. NAVPRO API — ENDPOINT REFERENCE

The API has 8 groups. Below are all endpoints relevant to DispatchIQ.

### 🟢 READ-ONLY ENDPOINTS (safe to call — use these for demo)

#### Drivers

```
POST /api/driver/query
Body: { page: 0, size: 20, status: "ACTIVE" }
Returns: paginated list of all drivers with IDs, names, phone, license info, type
```

```
POST /api/driver/dispatch        ← THE MOST IMPORTANT ENDPOINT
Body: {
  driver_id: number,
  time_range: {
    start_time: "2026-04-19T00:00:00Z",   // ISO 8601 UTC, max 30-day range
    end_time:   "2026-04-19T23:59:59Z"
  },
  date_source: "APP" | "ELD"    // APP = TruckerPath app GPS, ELD = hardware ELD
}
Returns: {
  trail: [{ id, latitude, longitude, time }],   // GPS breadcrumb trail
  active_trip: { trip_id, eta }                  // current trip ETA if in-transit
}
Use for: FleetMap live pins, ETA on active loads, detecting route deviations
```

#### Vehicles

```
POST /api/vehicle/query
Body: { status: "ACTIVE", vehicle_type: "TRUCK", page: 0, size: 20 }
Returns: truck list with dimensions (height, width, length, weight), fuel type, assigned drivers
Use for: feeding truck specs into routing profile, displaying fleet inventory
```

#### Documents

```
POST /api/document/query
Body: {
  upload_by_ids: [driverId1, driverId2],
  document_types: ["BILL_OF_LADING", "INVOICE", "PROOF_OF_DELIVERY"],
  page: 0,
  size: 50
}
Returns: list of uploaded documents with type, name, upload time, associated driver/load
Use for: billing automation — flag loads missing BOL or POD
Document type enum: BILL_OF_LADING | INVOICE | PROOF_OF_DELIVERY | UPLOAD_FILE | PAYMENTT
```

#### Routing Profiles

```
GET /api/trip/routing-profile/list
Returns: list of saved truck routing profiles (dimensions, weight, axle config)
Use for: passing routing_profile_id into trip creation for compliant truck routes
```

#### POIs (Custom Locations)

```
POST /api/poi/query
Body: { group_id: number, page: 0, size: 20 }
Returns: company's custom POIs (warehouses, customers, fuel stops)
Use for: showing company locations on the FleetMap
```

#### Terminals (Driver Groups)

```
POST /api/terminal/query/list
Returns: list of terminals (driver groups) with member counts
Use for: organizing drivers by region/terminal in the UI
```

---

### 🔴 WRITE ENDPOINTS — DO NOT CALL DURING HACKATHON DEMO

These endpoints modify or delete live fleet data. They are built in the codebase but **never called** during the demo. All write operations are simulated client-side with mock responses.

```
POST /api/trip/create           ← Pushes real route to driver's TruckerPath app
POST /api/vehicle/update/status ← Changes truck ACTIVE/INACTIVE
POST /api/vehicle/edit          ← Edits truck specs
POST /api/driver/edit           ← Edits driver info
POST /api/document/edit         ← Renames/changes document visibility
DELETE /api/vehicle/delete      ← PERMANENTLY deletes vehicles
DELETE /api/poi/delete/{id}     ← Deletes custom locations
DELETE /api/poi/delete/group/   ← Deletes ENTIRE POI group + all POIs inside
DELETE /api/terminal/delete/    ← Deletes driver terminal
DELETE /api/document/delete     ← Deletes uploaded documents (BOLs, invoices)
```

**Trip creation shape (for reference — mock this in the demo):**

```typescript
// POST /api/trip/create
{
  driver_id: number,                    // from /api/driver/query
  scheduled_start_time: "2026-04-19T08:00:00Z",
  routing_profile_id: number,           // optional, from routing-profile/list
  stop_points: [
    {
      latitude: 41.8781,
      longitude: -87.6298,
      address_name: "Chicago, IL",
      appointment_time: "2026-04-19T10:00:00Z",
      dwell_time: 30,                   // minutes at stop
      notes: "Gate code: 1234"
    },
    {
      latitude: 32.7767,
      longitude: -96.7970,
      address_name: "Dallas, TX",
      appointment_time: "2026-04-20T08:00:00Z",
      dwell_time: 0,
      notes: ""
    }
  ]
}
// Returns: { trip_id: "20260419-1", success: true }
// Effect: Driver receives push notification in TruckerPath app → Accepts → Navigates
```

---

## 16. NAVPRO API — INTEGRATION CODE

### src/lib/navproApi.ts

```typescript
// ============================================================
// NavPro API — READ-ONLY wrapper for DispatchIQ
// BASE: https://api.truckerpath.com/navpro
// AUTH: JWT Bearer token via VITE_NAVPRO_JWT env variable
//
// ⚠️  WRITE ENDPOINTS ARE INTENTIONALLY NOT EXPORTED
//     All assignment/dispatch actions are SIMULATED in the UI
//     Do not add write calls without explicit confirmation
// ============================================================

const NAVPRO_BASE = 'https://api.truckerpath.com/navpro';

function getHeaders() {
  return {
    'Authorization': `Bearer ${import.meta.env.VITE_NAVPRO_JWT}`,
    'Content-Type': 'application/json',
  };
}

// ── Types matching NavPro API response shapes ──────────────────

export interface NavProDriver {
  driver_id: number;
  driver_first_name: string;
  driver_last_name: string;
  driver_phone_number: string;
  driver_type: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface NavProTrailPoint {
  id: number;
  latitude: number;
  longitude: number;
  time: string;  // "2026-04-19T10:12:35.557"
}

export interface NavProDispatchData {
  trail: NavProTrailPoint[];
  active_trip: {
    trip_id: string;
    eta: string;  // ISO datetime
  } | null;
}

export interface NavProDocument {
  document_id: number;
  document_name: string;
  document_type: 'BILL_OF_LADING' | 'INVOICE' | 'PROOF_OF_DELIVERY' | 'UPLOAD_FILE';
  upload_time: number;  // Unix timestamp ms
  is_private: boolean;
  scope: string;
}

export interface NavProVehicle {
  vehicle_id: number;
  vehicle_no: string;
  vehicle_type: string;
  trailer_type: string;
  status: 'ACTIVE' | 'INACTIVE';
  fuel_type: string;
  vehicle_details: {
    vehicle_height: number;
    vehicle_width: number;
    vehicle_length: number;
    fuel_capacity: number;
  };
}

// ── API Functions (READ ONLY) ──────────────────────────────────

/**
 * Fetch all active drivers in the fleet.
 * Maps to: POST /api/driver/query
 */
export async function fetchDrivers(): Promise<NavProDriver[]> {
  try {
    const res = await fetch(`${NAVPRO_BASE}/api/driver/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ page: 0, size: 50, status: 'ACTIVE' }),
    });
    const data = await res.json();
    return data.records ?? [];
  } catch {
    console.warn('NavPro driver fetch failed — using mock data');
    return [];
  }
}

/**
 * Get GPS trail + active trip ETA for a single driver.
 * Maps to: POST /api/driver/dispatch
 * Use for: FleetMap live pins, load tracking, ETA display
 */
export async function fetchDriverTracking(
  driverId: number,
  hoursBack = 6
): Promise<NavProDispatchData | null> {
  try {
    const now = new Date();
    const start = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);

    const res = await fetch(`${NAVPRO_BASE}/api/driver/dispatch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        driver_id: driverId,
        time_range: {
          start_time: start.toISOString().replace(/\.\d{3}Z$/, 'Z'),
          end_time: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        },
        date_source: 'APP',
      }),
    });
    const data = await res.json();
    return data.data ?? null;
  } catch {
    console.warn(`NavPro tracking fetch failed for driver ${driverId}`);
    return null;
  }
}

/**
 * Fetch all active fleet vehicles.
 * Maps to: POST /api/vehicle/query
 */
export async function fetchVehicles(): Promise<NavProVehicle[]> {
  try {
    const res = await fetch(`${NAVPRO_BASE}/api/vehicle/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'ACTIVE', vehicle_type: 'TRUCK', page: 0, size: 50 }),
    });
    const data = await res.json();
    return data.records ?? [];
  } catch {
    console.warn('NavPro vehicle fetch failed — using mock data');
    return [];
  }
}

/**
 * Query uploaded documents for a set of drivers.
 * Maps to: POST /api/document/query
 * Use for: billing automation — detecting missing BOLs / PODs
 */
export async function fetchDocuments(driverIds: number[]): Promise<NavProDocument[]> {
  try {
    const res = await fetch(`${NAVPRO_BASE}/api/document/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        upload_by_ids: driverIds,
        document_types: ['BILL_OF_LADING', 'INVOICE', 'PROOF_OF_DELIVERY'],
        page: 0,
        size: 50,
      }),
    });
    const data = await res.json();
    return data.records ?? [];
  } catch {
    console.warn('NavPro document fetch failed — using mock data');
    return [];
  }
}

// ── SIMULATED WRITE (demo-safe) ────────────────────────────────

/**
 * SIMULATED trip assignment — does NOT call the real API.
 * In production this would call POST /api/trip/create.
 * Returns a fake trip_id after a short delay to simulate API latency.
 */
export async function simulateAssignTrip(
  driverId: number,
  pickup: { lat: number; lng: number; address: string; time: string },
  delivery: { lat: number; lng: number; address: string; time: string }
): Promise<{ trip_id: string; success: boolean }> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  const fakeId = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 100)}`;
  console.log('[SIMULATED] Would call POST /api/trip/create with:', { driverId, pickup, delivery });
  return { trip_id: fakeId, success: true };
}
```

---

## 17. NAVPRO API — HOW IT CONNECTS TO THE TRUCKERPATH DRIVER APP

This section explains the full integration loop so Claude Code builds the right UX hooks.

### The Real-World Flow (production)

```
Dispatcher clicks "Assign" in DispatchIQ
         │
         ▼
POST /api/trip/create  →  NavPro API
         │
         ▼
Driver's TruckerPath App receives push notification
Driver sees trip in "Trips" tab → taps Accept → taps Start
         │
         ▼
Driver navigates with truck-safe routing (bridge heights, weight limits, HOS-aware stops)
         │
         ▼
DispatchIQ polls POST /api/driver/dispatch every 60s
         │
         ▼
FleetMap updates live pin position + ETA on ActiveLoads table
```

### The Demo Flow (hackathon — simulated writes, real reads if JWT available)

```
Dispatcher clicks "Assign" in DispatchIQ
         │
         ▼
simulateAssignTrip() — fake 800ms delay → returns mock trip_id
         │
         ▼
UI shows "✓ Route sent to Marcus Webb's TruckerPath app"
Load status updates to "assigned" in Zustand store
         │
         ▼
FleetMap shows driver pin moving (animated along mock route path)
ETA countdown shown on ActiveLoads table
```

### Deep Link (alternative — no API key needed)

TruckerPath supports a URL schema that opens a destination directly in the driver app:

```
truckerpath://navigate?lat=32.7767&lng=-96.7970&name=Dallas+Warehouse
```

Use this in the "Message Driver" button as a fallback — generates a tappable link the dispatcher can text to the driver.

---

## 18. NAVPRO API — MOCK DATA SHAPES

When the NavPro JWT is not available, all API functions fall back to mock data. Mock data MUST match the real NavPro API response shapes exactly so the integration is plug-and-play when credentials are added.

### Mock GPS Trail (matches /api/driver/dispatch response)

```typescript
// src/data/mockNavpro.ts

export const MOCK_DISPATCH_DATA: Record<string, NavProDispatchData> = {
  'D-001': {
    trail: [
      { id: 4031401, latitude: 41.8500, longitude: -87.7200, time: '2026-04-19T08:10:00Z' },
      { id: 4031402, latitude: 41.8600, longitude: -87.6900, time: '2026-04-19T08:25:00Z' },
      { id: 4031403, latitude: 41.8781, longitude: -87.6298, time: '2026-04-19T08:40:00Z' },
    ],
    active_trip: { trip_id: '20260419-3', eta: '2026-04-20T14:30:00' },
  },
  'D-002': {
    trail: [
      { id: 4031410, latitude: 35.1200, longitude: -90.0800, time: '2026-04-19T07:00:00Z' },
      { id: 4031411, latitude: 35.1350, longitude: -90.0650, time: '2026-04-19T07:30:00Z' },
      { id: 4031412, latitude: 35.1495, longitude: -90.0490, time: '2026-04-19T08:00:00Z' },
    ],
    active_trip: null,
  },
  // ... add for D-003 through D-006
};
```

### navproApi.ts fallback pattern

All fetch functions already have try/catch that returns `[]` or `null` on failure. In `useStore.ts`, when NavPro returns empty, fall back to MOCK_DRIVERS / MOCK_DISPATCH_DATA automatically:

```typescript
// In useStore.ts initializeFleet():
const navproDrivers = await fetchDrivers();
const drivers = navproDrivers.length > 0
  ? mapNavProDriversToInternal(navproDrivers)
  : MOCK_DRIVERS;  // fallback to mock
```

---

## 19. NAVPRO API — JUDGE TALKING POINTS

When demoing, use these exact lines to explain the integration:

**On the map:** _"Every driver pin you see is pulling live GPS from TruckerPath's NavPro API — the same GPS that's already running on the driver's phone. No new hardware, no new app."_

**On the Assign button:** _"When a dispatcher clicks Assign, in production this fires a single API call to NavPro which pushes the full truck-safe route directly to the driver's existing TruckerPath app. The driver gets a notification, accepts, and navigates — the dispatcher never has to call them."_

**On documents:** _"After delivery, DispatchIQ queries NavPro's document API to check which BOLs and PODs have been uploaded. Any load missing documents gets flagged automatically — no more chasing drivers for paperwork."_

**On the API being new:** _"TruckerPath literally launched this API on March 31st, three weeks ago. We're one of the first teams building on it."_ — this will impress judges significantly.

---

_End of CLAUDE.md — DispatchIQ Build Document v2.0_ _GlobeHack Season 1 · Built for TruckerPath Marketplace & Growth Track_ _Updated: NavPro API integration added (sections 14–19)_