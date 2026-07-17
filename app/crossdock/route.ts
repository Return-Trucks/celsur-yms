import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

const replacements: Array<[RegExp, string]> = [
  [/Jebel Ali Dry Port/g, "Pacheco Cross-Dock Facility"], [/Noon\.com/g, "Volkswagen"], [/LuLu Hypermarket/g, "Bridgestone"], [/Al Naseem Foods/g, "Pirelli"], [/Al Naseem/g, "Pirelli"], [/Emirates Snacks/g, "Michelin"], [/Carrefour UAE/g, "Toyota"], [/Carrefour/g, "Toyota"], [/Aramex/g, "Celsur Fleet"], [/DHL/g, "Drayexpress"], [/Emirates Cargo/g, "TransAndina"], [/GST/g, "ART"], [/Amazon FBA/g, "Pacheco DC"], [/Dubai Customs/g, "Argentine Customs"],
];

const bridge = String.raw`<style>.sb{display:none!important}.main{width:100%!important}.demo-reset{border:1px solid #c8ddf1;background:#fff;color:#0b2d5e;border-radius:7px;padding:7px 10px;font:700 11px Inter,Arial,sans-serif;box-shadow:0 2px 8px #0b2d5e16;cursor:pointer}</style><script>
(() => {
 const key='shipmentx-v7-crossdock-state'; window.CD_STATE=JSON.parse(localStorage.getItem(key)||'{"events":[]}');
 const persist=()=>localStorage.setItem(key,JSON.stringify(window.CD_STATE)); const toast=(m)=>{showToast(m,'success');persist()};
 const oldNav=window.nav; window.nav=(page,el)=>{oldNav(page,el);if(parent!==window)parent.postMessage({type:'shipmentx:navigate',screen:page},location.origin)};
 const titles=['cd-dashboard','cd-orders','cd-execution','cd-exceptions','cd-audit','cd-edi'];
 window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='shipmentx:navigate'&&titles.includes(e.data.screen))window.nav(e.data.screen,null)});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const t=b.textContent.trim();if(t.includes('Resolve')||t.includes('Fulfil')||t.includes('Reassign')||t.includes('Escalate')||t.includes('Start Loading')||t.includes('Verify')||t.includes('Putaway')){window.CD_STATE.events.unshift({time:new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})+' ART',text:t});toast(t+' recorded in the demo audit trail.')}});
 const reset=document.createElement('button');reset.className='demo-reset';reset.textContent='↺ Reset demo';reset.onclick=()=>{localStorage.removeItem(key);location.reload()};(document.querySelector('.tb-actions')||document.querySelector('.tb')||document.body).appendChild(reset);
 if(parent!==window)parent.postMessage({type:'shipmentx:ready'},location.origin);const requested=location.hash.slice(1);if(titles.includes(requested))setTimeout(()=>window.nav(requested,null),0);
})();</script>`;

export async function GET() {
  let document = await readFile(join(process.cwd(), "wms.html"), "utf8");
  replacements.forEach(([from, to]) => { document = document.replace(from, to); });
  return new Response(document.replace("</body>", `${bridge}</body>`), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" } });
}
