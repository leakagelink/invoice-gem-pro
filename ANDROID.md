# Update the Android app (PowerShell)

Sync the latest Lovable changes to GitHub first, then run on your PC.

If `git pull` previously failed with "local changes would be overwritten", back up and remove the old hand-made files first:

```powershell
Set-Location C:\Users\ASUS\invoice-gem-pro
New-Item -ItemType Directory -Path ..\abm-backup -Force | Out-Null
Copy-Item android-web, capacitor.config.ts, vite.android.config.ts, package.json ..\abm-backup -Recurse -Force
Remove-Item -Recurse -Force android-web
Remove-Item -Force capacitor.config.ts, vite.android.config.ts
git checkout -- package.json
```

Then update and build:

```powershell
git pull
npm install
Remove-Item -Recurse -Force dist-android -ErrorAction SilentlyContinue
npx vite build --config vite.android.config.ts
npx cap sync android
npx cap open android
```

`git pull` must end without "error" / "Aborting", otherwise the APK still contains the old build. Do NOT run `npm run build` for Android — that builds the website only.

In Android Studio choose Build > Build APK(s), then install the new APK as an update with the same signing key. Do not uninstall or clear storage unless you are willing to lose locally saved bills. If the android folder does not exist yet, run `npx cap add android` before sync.

The Android entry renders the bill screen directly (no router, no SSR document shell, no server code), so it starts on any WebView path. The native splash is hidden as soon as the app mounts, with a 1.5s safety fallback. Location lookup and real ads still need internet.

If this APK still stalls, open chrome://inspect/#devices on your computer with USB debugging enabled and share the WebView console error.
