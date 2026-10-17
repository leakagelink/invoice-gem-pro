import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anuragtechnology.billmaking",
  appName: "Anurag Bill Making",
  webDir: "dist-android",
  plugins: { SplashScreen: { launchAutoHide: true, launchShowDuration: 500, showSpinner: false } },
};
export default config;