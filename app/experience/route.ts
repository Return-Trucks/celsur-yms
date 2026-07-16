import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

const resetLayer = String.raw`
<style>
  .demo-reset{border:1px solid #C8DDF1;background:#fff;color:#0B2D5E;border-radius:7px;padding:7px 10px;font:700 11px Inter,Arial,sans-serif;box-shadow:0 2px 8px #0B2D5E16;cursor:pointer}
  .demo-reset:hover{background:#EBF3FB}
</style>
<script>
  (() => {
    const key = "shipmentx-v61-demo-state";
    const baselineKey = "shipmentx-v61-demo-baseline";
    const clone = value => JSON.parse(JSON.stringify(value));
    const getState = () => ({
      version: 1,
      containers: CONTAINERS, docs: DOC_STATE, assignments: ASSIGNMENTS,
      threads: CHAT_THREADS, truckQueue: TRUCK_QUEUE, weights: WEIGHTS,
      yardDrill: YARD_DRILL, yardStack: YARD_STACK, operatorMap: YP3,
      dockAppointments: DOCK_APPTS, dockFilter: DOCK_FILTER, dockView: DOCK_VIEW,
      c360Number: C360_NUM, c360Tab: C360_TAB,
      mobile: { role: mobileRole, tab: mobileTab, stage: mobileStage, portDeparted, driverLocation, yardArrived, deliveryClosed, yardInstruction, mapView: mobileMapView, historyOpen: mobileHistoryOpen },
      operator: { zone: operatorZone, block: operatorBlock, container: operatorContainer, condition: operatorCondition, inspected: operatorInspected, jobStep: operatorJobStep, jobType: operatorJobType, photos: operatorPhotos, mapLevel: operatorMapLevel },
    });
    const restore = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || "null");
        if (saved && Array.isArray(saved.containers) && saved.containers.length) {
          CONTAINERS = saved.containers; DOC_STATE = saved.docs || DOC_STATE; ASSIGNMENTS = saved.assignments || ASSIGNMENTS;
          CHAT_THREADS = saved.threads || CHAT_THREADS; TRUCK_QUEUE = saved.truckQueue || TRUCK_QUEUE; WEIGHTS = saved.weights || WEIGHTS;
          YARD_DRILL = saved.yardDrill || YARD_DRILL; YARD_STACK = saved.yardStack || YARD_STACK; YP3 = saved.operatorMap || YP3;
          DOCK_APPTS = saved.dockAppointments || DOCK_APPTS; DOCK_FILTER = saved.dockFilter || DOCK_FILTER; DOCK_VIEW = saved.dockView || DOCK_VIEW;
          C360_NUM = saved.c360Number || C360_NUM; C360_TAB = saved.c360Tab || C360_TAB;
          if (saved.mobile) { mobileRole=saved.mobile.role; mobileTab=saved.mobile.tab; mobileStage=saved.mobile.stage; portDeparted=saved.mobile.portDeparted; driverLocation=saved.mobile.driverLocation; yardArrived=saved.mobile.yardArrived; deliveryClosed=saved.mobile.deliveryClosed; yardInstruction=saved.mobile.yardInstruction; mobileMapView=saved.mobile.mapView; mobileHistoryOpen=saved.mobile.historyOpen; }
          if (saved.operator) { operatorZone=saved.operator.zone; operatorBlock=saved.operator.block; operatorContainer=saved.operator.container; operatorCondition=saved.operator.condition; operatorInspected=saved.operator.inspected; operatorJobStep=saved.operator.jobStep; operatorJobType=saved.operator.jobType; operatorPhotos=saved.operator.photos; operatorMapLevel=saved.operator.mapLevel; }
        }
        if (!localStorage.getItem(baselineKey)) localStorage.setItem(baselineKey, JSON.stringify(getState()));
      } catch (_) { localStorage.removeItem(key); }
    };
    const save = () => {
      try { localStorage.setItem(key, JSON.stringify({ ...getState(), savedAt: Date.now() })); } catch (_) {}
    };
    restore();
    if (typeof renderAll === "function") renderAll();
    window.addEventListener("beforeunload", save);
    document.addEventListener("click", () => window.setTimeout(save, 0));
    document.addEventListener("input", () => window.setTimeout(save, 0));
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "demo-reset";
    reset.textContent = "↺ Reset demo";
    reset.title = "Restore the original client-demo scenario";
    reset.addEventListener("click", () => {
      localStorage.removeItem(key);
      window.location.reload();
    });
    (document.querySelector(".tb-actions") || document.body).appendChild(reset);
    const originalNav = window.nav;
    window.nav = function(screen) {
      originalNav(screen);
      if (window.parent !== window) window.parent.postMessage({ type: "shipmentx:navigate", screen }, window.location.origin);
    };
    window.addEventListener("message", event => {
      if (event.origin === window.location.origin && event.data && event.data.type === "shipmentx:navigate" && BREADCRUMBS[event.data.screen]) window.nav(event.data.screen);
    });
    if (window.parent !== window) window.parent.postMessage({ type: "shipmentx:ready" }, window.location.origin);
    const requestedScreen = window.location.hash.slice(1);
    if (requestedScreen && BREADCRUMBS[requestedScreen]) window.setTimeout(() => window.nav(requestedScreen), 0);
    window.addEventListener("hashchange", () => {
      const screen = window.location.hash.slice(1);
      if (BREADCRUMBS[screen]) window.nav(screen);
    });
  })();
</script>`;

export async function GET() {
  const document = await readFile(join(process.cwd(), "ShipmentX_Mockup_v6.1.html"), "utf8");
  const enhancedDocument = document.replace("</body>", `${resetLayer}</body>`);

  return new Response(enhancedDocument, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
