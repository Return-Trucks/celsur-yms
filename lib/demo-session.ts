export type DemoPhase =
  | "documents" | "exception" | "prioritized" | "assigned" | "scheduled"
  | "gate" | "yard" | "delivered" | "empty-return" | "closed";

export type DemoSource = "Terminal Data" | "Blue Yonder / WMS" | "GPS / Driver App" | "Gate / CCTV" | "ShipmentX YMS";

export type DemoEvent = {
  id: string;
  at: string;
  actor: string;
  source: DemoSource;
  container: string;
  status: string;
  nextAction: string;
};

export type DemoSession = {
  version: 2;
  container: string;
  phase: DemoPhase;
  dispatchEligible: boolean;
  driver?: string;
  dock?: string;
  events: DemoEvent[];
  metrics: { detentionAvoided: number; onTimeConfidence: number; cycleHours: number };
};

const container = "TCKU5519902";

export function createInitialDemoSession(): DemoSession {
  return {
    version: 2,
    container,
    phase: "documents",
    dispatchEligible: false,
    events: [{ id: "e1", at: "08:15", actor: "Control Tower", source: "Terminal Data", container, status: "Customs hold", nextAction: "Clear customs documents" }],
    metrics: { detentionAvoided: 0, onTimeConfidence: 62, cycleHours: 0 },
  };
}

export type DemoAction = { type: Exclude<DemoPhase, "documents" | "closed"> | "reset"; at?: string };

export function reduceDemoSession(session: DemoSession, action: DemoAction): DemoSession {
  if (action.type === "reset") return createInitialDemoSession();
  const steps: Record<string, { phase: DemoPhase; actor: string; source: DemoSource; status: string; nextAction: string }> = {
    exception: { phase: "exception", actor: "Exception Desk", source: "ShipmentX YMS", status: "Exception resolved", nextAction: "Re-score priority" },
    prioritized: { phase: "prioritized", actor: "Prioritization Engine", source: "Blue Yonder / WMS", status: "P0 · dispatch eligible", nextAction: "Assign a driver" },
    assigned: { phase: "assigned", actor: "Dispatcher", source: "ShipmentX YMS", status: "Driver assigned", nextAction: "Book dock appointment" },
    scheduled: { phase: "scheduled", actor: "Dock Planner", source: "Blue Yonder / WMS", status: "Dock 04 · 10:30", nextAction: "Release to gate" },
    gate: { phase: "gate", actor: "Gate Control", source: "Gate / CCTV", status: "Gate-in verified", nextAction: "Move to yard stack" },
    yard: { phase: "yard", actor: "Yard Operator", source: "GPS / Driver App", status: "Moved to B-04 / R04", nextAction: "Complete delivery" },
    delivered: { phase: "delivered", actor: "Driver App", source: "GPS / Driver App", status: "Delivered · POD captured", nextAction: "Schedule empty return" },
    "empty-return": { phase: "empty-return", actor: "Return Desk", source: "Terminal Data", status: "Empty return scheduled", nextAction: "Close cycle" },
  };
  const step = steps[action.type];
  if (!step) return session;
  const events = [...session.events, { id: `e${session.events.length + 1}`, at: action.at ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: step.actor, source: step.source, container: session.container, status: step.status, nextAction: step.nextAction }];
  return { ...session, phase: step.phase, dispatchEligible: ["prioritized", "assigned", "scheduled", "gate", "yard", "delivered", "empty-return", "closed"].includes(step.phase), events, metrics: { detentionAvoided: Math.min(185, session.metrics.detentionAvoided + (step.phase === "delivered" ? 185 : 0)), onTimeConfidence: Math.min(98, session.metrics.onTimeConfidence + 5), cycleHours: step.phase === "closed" ? 18.4 : session.metrics.cycleHours } };
}
