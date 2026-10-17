import { createRoot } from "react-dom/client";
import { SplashScreen } from "@capacitor/splash-screen";
import { BillApp } from "../src/components/BillApp";
import "../src/styles.css";

// Capacitor ships every screen locally. The bill UI is a single screen, so it renders
// directly without a router: no SSR shell, no route matching, no service worker.
// Whatever path the WebView opens (/, /index.html, ...) the app always starts.

function hideNativeSplash() {
  void SplashScreen.hide().catch(() => { /* Browser-only checks have no native splash. */ });
}

const container = document.getElementById("root");
try {
  if (!container) throw new Error("App root missing");
  createRoot(container).render(<BillApp />);
} catch (error) {
  if (container) container.textContent = "App start nahi ho payi. App band karke dobara kholo.";
  console.error(error);
} finally {
  hideNativeSplash();
  // Safety net: never leave the native splash on screen.
  setTimeout(hideNativeSplash, 1500);
}
