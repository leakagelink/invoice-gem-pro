import { refuseAppWorker } from "./pwa-policy";

export async function registerAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (refuseAppWorker(import.meta.env.PROD, location.hostname, window.self !== window.top, location.search)) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter((registration) => {
      const worker = registration.active || registration.waiting || registration.installing;
      return worker && new URL(worker.scriptURL).origin === location.origin && new URL(worker.scriptURL).pathname === "/sw.js";
    }).map((registration) => registration.unregister()));
    return;
  }
  const { registerSW } = await import("virtual:pwa-register");
  registerSW({ immediate: true });
}