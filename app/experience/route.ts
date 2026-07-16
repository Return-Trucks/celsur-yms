import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createInitialDemoSession } from "../../lib/demo-session";

export const dynamic = "force-static";

const initialSessionJson = JSON.stringify(createInitialDemoSession());

const resetLayer = String.raw`
<style>
  .demo-reset{border:1px solid #C8DDF1;background:#fff;color:#0B2D5E;border-radius:7px;padding:7px 10px;font:700 11px Inter,Arial,sans-serif;box-shadow:0 2px 8px #0B2D5E16;cursor:pointer}
  .demo-reset:hover{background:#EBF3FB}
  .sx-attribution{display:block;font:600 9px Inter,Arial,sans-serif;letter-spacing:.03em;color:#8290a4;margin-top:2px}
  .sx-session{position:fixed;right:18px;bottom:18px;width:360px;z-index:30;background:#fff;border:1px solid #c8d8e8;border-radius:14px;box-shadow:0 14px 40px #0b2d5e24;padding:15px;display:none;font-family:Inter,Arial,sans-serif;color:#18283b}
  .sx-session.visible{display:block}.sx-session h3{margin:0;font-size:14px}.sx-session small{color:#6b7b8f}.sx-phase{display:flex;gap:6px;flex-wrap:wrap;margin:11px 0}.sx-phase span{font-size:10px;padding:4px 7px;border-radius:20px;background:#eef3f8;color:#6b7b8f}.sx-phase span.done{background:#dff5ed;color:#16754f}.sx-phase span.current{background:#0b2d5e;color:#fff}.sx-next{display:flex;gap:8px;align-items:center}.sx-next button{flex:1;border:0;border-radius:8px;background:#0b2d5e;color:#fff;padding:9px;font-weight:800;cursor:pointer}.sx-next button.secondary{background:#edf3f8;color:#0b2d5e}.sx-sources{display:flex;gap:5px;flex-wrap:wrap;margin-top:10px}.sx-source{font-size:9px;border:1px solid #d8e2ec;border-radius:5px;padding:3px 5px;color:#587087}.sx-event{border-top:1px solid #edf1f5;padding:7px 0;font-size:10px}.sx-event b{font-size:10px}.sx-presenter{position:fixed;inset:0;background:#06182ccc;z-index:60;display:none;align-items:center;justify-content:center;font-family:Inter,Arial,sans-serif}.sx-presenter.open{display:flex}.sx-presenter-card{width:min(680px,calc(100vw - 32px));max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:16px;padding:22px;box-shadow:0 24px 80px #0008}.sx-presenter-card h2{margin:0 0 4px;color:#0b2d5e}.sx-presenter-card .agenda{display:grid;grid-template-columns:28px 1fr;gap:8px;margin:16px 0}.sx-presenter-card .agenda div{font-size:12px;padding:7px 0;border-bottom:1px solid #edf1f5}.sx-presenter-card .agenda .active{font-weight:800;color:#0b2d5e}.sx-presenter-actions{display:flex;gap:8px}.sx-presenter-actions button{border:0;border-radius:8px;padding:10px 13px;font-weight:800;cursor:pointer;background:#0b2d5e;color:#fff}.sx-presenter-actions button.secondary{background:#edf3f8;color:#0b2d5e}
</style>
<script>
  (() => {
    const key = "shipmentx-v61-demo-state";
    const baselineKey = "shipmentx-v61-demo-baseline";
    const sessionKey = "shipmentx-yms-demo-session";
    const initialSession = ${initialSessionJson};
    const phases = ["documents","exception","prioritized","assigned","scheduled","gate","yard","delivered","empty-return","closed"];
    const labels = {documents:"Docs hold",exception:"Exception",prioritized:"Priority",assigned:"Driver",scheduled:"Dock",gate:"Gate",yard:"Yard",delivered:"POD", "empty-return":"Empty return",closed:"Outcome"};
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
    const getSession = () => { try { return JSON.parse(localStorage.getItem(sessionKey) || "null") || clone(initialSession); } catch (_) { return clone(initialSession); } };
    const setSession = value => { try { localStorage.setItem(sessionKey, JSON.stringify(value)); } catch (_) {} };
    const sessionSteps = {
      exception:["Exception resolved","Exception Desk","ShipmentX YMS","Re-score priority"],
      prioritized:["P0 · dispatch eligible","Prioritization Engine","Blue Yonder / WMS","Assign a driver"],
      assigned:["Driver assigned","Dispatcher","ShipmentX YMS","Book dock appointment"],
      scheduled:["Dock 04 · 10:30","Dock Planner","Blue Yonder / WMS","Release to gate"],
      gate:["Gate-in verified","Gate Control","Gate / CCTV","Move to yard stack"],
      yard:["Moved to B-04 / R04","Yard Operator","GPS / Driver App","Complete delivery"],
      delivered:["Delivered · POD captured","Driver App","GPS / Driver App","Schedule empty return"],
      "empty-return":["Empty return scheduled","Return Desk","Terminal Data","Close cycle"],
      closed:["Cycle closed · outcome ready","Control Tower","ShipmentX YMS","Present results"]
    };
    const renderSession = () => {
      const s = getSession(), idx = Math.max(0, phases.indexOf(s.phase));
      const panel = document.getElementById("sx-session"); if (!panel) return;
      panel.querySelector(".sx-phase").innerHTML = phases.map((p,i)=>'<span class="'+(i<idx?'done ':i===idx?'current ':'')+'">'+labels[p]+'</span>').join('');
      panel.querySelector(".sx-status").textContent = s.events[s.events.length-1].status;
      panel.querySelector(".sx-next-label").textContent = s.events[s.events.length-1].nextAction;
      panel.querySelector(".sx-next button").textContent = s.phase === "closed" ? "View outcome" : "Advance checkpoint →";
      panel.querySelector(".sx-events").innerHTML = s.events.slice().reverse().slice(0,4).map(e=>'<div class="sx-event"><b>'+e.at+' · '+e.actor+'</b><br>'+e.status+' · '+e.source+'<br><small>Next: '+e.nextAction+'</small></div>').join('');
      panel.querySelector(".sx-metrics").textContent = s.metrics.detentionAvoided ? 'Projected detention avoided: USD '+s.metrics.detentionAvoided+' · On-time confidence: '+s.metrics.onTimeConfidence+'%' : 'Opening exposure: customs hold · on-time confidence '+s.metrics.onTimeConfidence+'%';
    };
    const advanceSession = () => {
      const s=getSession(), idx=phases.indexOf(s.phase), next=phases[Math.min(phases.length-1, idx+1)];
      if (next === s.phase) { document.getElementById("sx-presenter")?.classList.add("open"); return; }
      const step=sessionSteps[next], now=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
      const updated={...s, phase:next, dispatchEligible:["prioritized","assigned","scheduled","gate","yard","delivered","empty-return","closed"].includes(next), events:s.events.concat([{id:"e"+(s.events.length+1),at:now,actor:step[1],source:step[2],container:s.container,status:step[0],nextAction:step[3]}]), metrics:{detentionAvoided:next==='delivered'||next==='empty-return'||next==='closed'?185:s.metrics.detentionAvoided,onTimeConfidence:Math.min(98,s.metrics.onTimeConfidence+5),cycleHours:next==='closed'?18.4:s.metrics.cycleHours}};
      setSession(updated);
      const c=CONTAINERS.find(x=>x.num===updated.container); if(c){ c.status = ({exception:'arrived',prioritized:'arrived',assigned:'pickup',scheduled:'pickup',gate:'gate-in',yard:'gate-out',delivered:'delivered','empty-return':'empty-rdy',closed:'returned'})[next] || c.status; c.stage=STATUS_TO_STAGE[c.status]||c.stage; }
      if (updated.phase==='exception'||updated.phase==='prioritized') DOC_STATE[updated.container].customs=true;
      if (updated.phase==='assigned') ASSIGNMENTS[updated.container]={driver:'Diego Vázquez',truck:'T-005',carrier:'Celsur Fleet'};
      if (updated.phase==='scheduled' && typeof DOCK_APPTS!=='undefined' && !DOCK_APPTS.some(a=>a.container===updated.container)) DOCK_APPTS.push({id:'DA-GOLDEN',time:'10:30',door:'D04',container:updated.container,status:'Confirmed',sync:'Synced',customer:'MIC'});
      if (typeof renderAll==='function') renderAll(); save(); renderSession();
      if(next==='exception') nav('exceptions'); else if(next==='prioritized') nav('priority'); else if(next==='assigned') nav('dispatch'); else if(next==='scheduled') nav('dockcalendar'); else if(next==='gate') nav('gate'); else if(next==='yard') nav('yardmap'); else if(next==='delivered') nav('delivery'); else if(next==='empty-return') nav('empty'); else if(next==='closed') nav('cycle');
    };
    restore();
    if (!localStorage.getItem(sessionKey)) setSession(initialSession);
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
    const brand=document.querySelector('.brand'); if(brand && !brand.querySelector('.sx-attribution')) brand.insertAdjacentHTML('beforeend','<span class="sx-attribution">Powered by ShipmentX YMS</span>');
    const panel=document.createElement('aside'); panel.id='sx-session'; panel.className='sx-session'; panel.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px"><div><h3>Golden container journey</h3><small>TCKU5519902 · Celsur Operations</small></div><button class="secondary" style="border:0;background:none;color:#587087;cursor:pointer" aria-label="Close">×</button></div><div class="sx-phase"></div><div style="font-size:12px;font-weight:800;margin:7px 0" class="sx-status"></div><div class="sx-metrics" style="font-size:10px;color:#6b7b8f"></div><div class="sx-sources"><span class="sx-source">Terminal Data · simulated</span><span class="sx-source">Blue Yonder/WMS · simulated</span><span class="sx-source">GPS/Driver App · simulated</span><span class="sx-source">Gate/CCTV · simulated</span></div><div class="sx-next" style="margin-top:10px"><button>Advance checkpoint →</button></div><div class="sx-next-label" style="font-size:10px;color:#6b7b8f;margin:6px 0"></div><div class="sx-events"></div>';
    document.body.appendChild(panel); panel.querySelector('.sx-next button').addEventListener('click',advanceSession); panel.querySelector('button[aria-label="Close"]').addEventListener('click',()=>panel.classList.remove('visible'));
    const toggle=document.createElement('button'); toggle.className='demo-reset'; toggle.textContent='Journey'; toggle.title='Open the golden-container journey'; toggle.addEventListener('click',()=>{panel.classList.toggle('visible');renderSession();}); (document.querySelector('.tb-actions')||document.body).appendChild(toggle);
    const presenter=document.createElement('div'); presenter.id='sx-presenter'; presenter.className='sx-presenter'; presenter.innerHTML='<div class="sx-presenter-card"><div style="display:flex;justify-content:space-between"><div><h2>Presenter Mode · Celsur Operations</h2><small>20-minute guided story · Powered by ShipmentX YMS</small></div><button class="secondary" style="border:0;background:none;font-size:20px;cursor:pointer">×</button></div><div class="agenda">'+['Operating day and exposure','Resolve customs blocker','Priority and dispatch eligibility','Assign and schedule movement','Yard and driver execution','Delivery, POD and empty return','Outcome and measurable impact'].map((x,i)=>'<div class="agenda-num">'+(i+1)+'</div><div class="agenda-item">'+x+'</div>').join('')+'</div><div class="sx-presenter-actions"><button class="sx-presenter-reset">Reset opening scenario</button><button class="secondary sx-presenter-close">Return to app</button></div></div>';
    document.body.appendChild(presenter); presenter.querySelector('.sx-presenter-close').addEventListener('click',()=>presenter.classList.remove('open')); presenter.querySelector('.sx-presenter-reset').addEventListener('click',()=>{localStorage.removeItem(key);localStorage.removeItem(sessionKey);window.location.reload();});
    const presenterEnabled=new URLSearchParams(window.parent===window?location.search:window.parent.location.search).get('presenter')==='1'; if(presenterEnabled){const p=document.createElement('button');p.className='demo-reset';p.textContent='Presenter';p.addEventListener('click',()=>presenter.classList.add('open'));(document.querySelector('.tb-actions')||document.body).appendChild(p);}
    window.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='p') presenter.classList.toggle('open');});
    renderSession();
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
