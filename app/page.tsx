"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The v6.1 experience is intentionally isolated in an iframe.  The source
 * prototype owns a large, interactive operational state machine (including
 * driver and yard-operator workspaces); loading it as a same-origin document
 * keeps that realistic demo flow intact while this Next page remains a tiny,
 * Vercel-safe shell.
 */
export default function Page() {
  const [screen, setScreen] = useState("dashboard");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const sendToExperience = (nextScreen: string) => frame.current?.contentWindow?.postMessage(
      { type: "shipmentx:navigate", screen: nextScreen },
      window.location.origin,
    );
    const setFromHash = () => {
      const nextScreen = window.location.hash.slice(1) || "dashboard";
      setScreen(nextScreen);
      sendToExperience(nextScreen);
    };
    const receive = (event: MessageEvent<{ type?: string; screen?: string }>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "shipmentx:ready") {
        sendToExperience(window.location.hash.slice(1) || "dashboard");
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

  return (
    <main className="demo-shell" aria-label="ShipmentX Celsur operations demo">
      <iframe
        className="demo-frame"
        title="ShipmentX Celsur Operations Console"
        ref={frame}
        src={`/experience#${screen}`}
        onLoad={() => frame.current?.contentWindow?.postMessage({ type: "shipmentx:navigate", screen }, window.location.origin)}
        allow="clipboard-write"
      />
    </main>
  );
}
