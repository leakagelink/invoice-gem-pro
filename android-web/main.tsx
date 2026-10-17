import { createRoot } from "react-dom/client";
import { createHashHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { SplashScreen } from "@capacitor/splash-screen";
import { BillApp } from "../src/components/BillApp";
import "../src/styles.css";

// Capacitor already ships all screens locally. No SSR document shell or service worker.
// Hash history keeps routing working whatever path the WebView opens (/, /index.html, ...).
const rootRoute = createRootRoute({ component: Outlet, notFoundComponent: BillApp });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: BillApp });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]), history: createHashHistory() });

function hideNativeSplash() {
  void SplashScreen.hide().catch(() => { /* Browser-only checks have no native splash. */ });
}

const container = document.getElementById("root");
try {
  if (!container) throw new Error("App root missing");
  createRoot(container).render(<RouterProvider router={router} />);
} catch (error) {
  if (container) container.textContent = "App start nahi ho payi. App band karke dobara kholo.";
  console.error(error);
} finally {
  hideNativeSplash();
  // Safety net: never leave the native splash on screen.
  setTimeout(hideNativeSplash, 1500);
}
