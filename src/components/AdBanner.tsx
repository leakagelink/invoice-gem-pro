// AdMob test banner. AdMob only serves inside the Android/iOS app build
// (Capacitor + @capacitor-community/admob). Test IDs below are Google's official test units.
export const ADMOB_TEST = {
  appId: "ca-app-pub-3940256099942544~3347511713",
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
};

export function AdBanner() {
  return (
    <div className="no-print mx-auto flex h-[50px] w-full max-w-[320px] items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground">
      <span className="rounded bg-accent px-1.5 py-0.5 font-semibold text-accent-foreground">Test Ad</span>
      AdMob Banner 320×50
    </div>
  );
}

export function InterstitialAd({ onClose }: { onClose: () => void }) {
  return (
    <div className="no-print fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-foreground/80 p-6">
      <div className="flex h-80 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-2xl bg-card text-muted-foreground">
        <span className="rounded bg-accent px-2 py-1 text-sm font-semibold text-accent-foreground">Test Ad</span>
        AdMob Interstitial
      </div>
      <button onClick={onClose} className="rounded-full bg-card px-6 py-2 font-semibold text-foreground">Close ✕</button>
    </div>
  );
}
