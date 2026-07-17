import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

const presentationLayer = String.raw`<style>.sidebar{visibility:hidden!important;pointer-events:none!important}</style><script>
  (() => {
    const originalNav = window.nav;
    window.nav = function(screen) { originalNav(screen); if (window.parent !== window) window.parent.postMessage({ type: "shipmentx:navigate", screen }, window.location.origin); };
    window.addEventListener("message", event => { if (event.origin === window.location.origin && event.data?.type === "shipmentx:navigate" && BREADCRUMBS[event.data.screen]) window.nav(event.data.screen); });
    if (window.parent !== window) window.parent.postMessage({ type: "shipmentx:ready" }, window.location.origin);
    const requested = window.location.hash.slice(1); if (requested && BREADCRUMBS[requested]) window.setTimeout(() => window.nav(requested), 0);
  })();
</script>`;

export async function GET() {
  const document = await readFile(join(process.cwd(), "ShipmentX_Mockup_v6.1.html"), "utf8");
  const shellDocument = document.replace('<aside class="sidebar">', '<aside class="sidebar" style="display:none!important">');
  return new Response(shellDocument.replace("</body>", `${presentationLayer}</body>`), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" } });
}
