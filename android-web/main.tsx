import React from "react";
import { createRoot } from "react-dom/client";
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { SplashScreen } from "@capacitor/splash-screen";
import { BillApp } from "../src/components/BillApp";
import "../src/styles.css";

// Capacitor already ships all screens locally. No SSR document shell or service worker.
const rootRoute = createRootRoute({ component: Outlet });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: BillApp });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });
const container = document.getElementById("root");
if (!container) throw new Error("App root missing");
createRoot(container).render(<RouterProvider router={router} />);
void SplashScreen.hide().catch(() => { /* Browser-only checks have no native splash. */ });