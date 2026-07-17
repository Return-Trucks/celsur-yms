"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DemoSidebar, { groupForScreen } from "./demo-sidebar";

const sidebarStorageKey = "shipmentx-demo-sidebar-expanded-v1";

const readExpandedGroups = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(sidebarStorageKey) || "[]");
    return Array.isArray(stored) && stored.every(value => typeof value === "string") ? stored : ["operations"];
  } catch { return ["operations"]; }
};

const maskEmbeddedSidebar = (iframe: HTMLIFrameElement | null) => {
  const document = iframe?.contentDocument;
  if (!document || document.getElementById("next-demo-sidebar-mask")) return;
  const style = document.createElement("style");
  style.id = "next-demo-sidebar-mask";
  style.textContent = ".sidebar{visibility:hidden!important;pointer-events:none!important}.sb{display:none!important}";
  document.head.appendChild(style);
};

/**
 * The v6.1 experience is intentionally isolated in an iframe.  The source
 * prototype owns a large, interactive operational state machine (including
 * driver and yard-operator workspaces); loading it as a same-origin document
 * keeps that realistic demo flow intact while this Next page remains a tiny,
 * Vercel-safe shell.
 */
export default function Page() {
  const [screen, setScreen] = useState("dashboard");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["operations"]);
  const [sidebarReady, setSidebarReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const experienceSource = screen.startsWith("cd-") ? "/crossdock" : "/experience";

  const navigate = useCallback((nextScreen: string) => {
    setScreen(nextScreen);
    if (window.location.hash.slice(1) !== nextScreen) window.location.hash = nextScreen;
    frame.current?.contentWindow?.postMessage({ type: "shipmentx:navigate", screen: nextScreen }, window.location.origin);
    setExpandedGroups(groups => groups.includes(groupForScreen(nextScreen)) ? groups : [...groups, groupForScreen(nextScreen)]);
  }, []);

  useEffect(() => {
    const setFromHash = () => {
      const nextScreen = window.location.hash.slice(1) || "dashboard";
      setScreen(nextScreen);
      frame.current?.contentWindow?.postMessage({ type: "shipmentx:navigate", screen: nextScreen }, window.location.origin);
      setExpandedGroups(groups => groups.includes(groupForScreen(nextScreen)) ? groups : [...groups, groupForScreen(nextScreen)]);
    };
    const receive = (event: MessageEvent<{ type?: string; screen?: string }>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "shipmentx:ready") {
        frame.current?.contentWindow?.postMessage({ type: "shipmentx:navigate", screen: window.location.hash.slice(1) || "dashboard" }, window.location.origin);
        return;
      }
      if (event.data?.type !== "shipmentx:navigate" || !event.data.screen) return;
      if (window.location.hash.slice(1) !== event.data.screen) window.location.hash = event.data.screen;
    };
    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    window.addEventListener("message", receive);
    return () => {
      window.removeEventListener("hashchange", setFromHash);
      window.removeEventListener("message", receive);
    };
  }, []);

  useEffect(() => {
    const activeGroup = groupForScreen(window.location.hash.slice(1) || "dashboard");
    const restoredGroups = readExpandedGroups();
    setExpandedGroups(restoredGroups.includes(activeGroup) ? restoredGroups : [...restoredGroups, activeGroup]);
    setSidebarReady(true);
  }, []);

  useEffect(() => {
    if (sidebarReady) window.localStorage.setItem(sidebarStorageKey, JSON.stringify(expandedGroups));
  }, [expandedGroups, sidebarReady]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "shipmentx-v61-demo-state" || event.newValue !== null) return;
      setExpandedGroups([groupForScreen(screen)]);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [screen]);

  return (
    <main className="demo-shell" aria-label="ShipmentX Celsur operations demo">
      <style>{`.demo-shell{isolation:isolate}.demo-frame{position:absolute;inset:0 0 0 var(--demo-sidebar-width);width:calc(100% - var(--demo-sidebar-width));z-index:0}.demo-sidebar{z-index:20}`}</style>
      <DemoSidebar activeScreen={screen} expandedGroups={expandedGroups} onNavigate={navigate} onToggle={groupId => setExpandedGroups(groups => groups.includes(groupId) ? groups.filter(id => id !== groupId) : [...groups, groupId])} />
      <iframe
        className="demo-frame"
        title="ShipmentX Celsur Operations Console"
        ref={frame}
        src={`${experienceSource}#${screen}`}
        onLoad={() => { maskEmbeddedSidebar(frame.current); frame.current?.contentWindow?.postMessage({ type: "shipmentx:navigate", screen }, window.location.origin); }}
        allow="clipboard-write"
      />
    </main>
  );
}
