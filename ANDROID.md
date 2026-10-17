# Update the Android app (PowerShell)

Commit/sync the latest Lovable changes to GitHub first, then run on your PC:

```powershell
Set-Location C:\Users\ASUS\invoice-gem-pro
git pull
npm install
npx vite build --config vite.android.config.ts
npx cap sync android
npx cap open android
```

If Git reports conflicts with your earlier locally created android-web files, back up those files before accepting the updated versions from this project. Do not overwrite local work without a backup.

In Android Studio choose Build > Build APK(s), then install the new APK as an update with the same signing key. Do not uninstall or clear storage unless you are willing to lose locally saved bills. If the android folder does not exist yet, run `npx cap add android` before sync.

The updated Android entry does not import the website's SSR document shell, generated route tree, or server code. Every current screen (new bill, saved bills, ads) and the PDF libraries are bundled into the APK, so screen loading does not require internet. Location lookup and real ads still need internet; browser PDF/print behavior in a native WebView requires separate native integration.

The native splash auto-hides after 500ms; the branded app splash lasts 450ms after the bill UI mounts. Invalid saved collections cannot block initialization. On the website, screen caching starts only after opening the published version online; the editor preview deliberately has no offline worker.

If this APK still stalls, open chrome://inspect/#devices on your computer with USB debugging enabled and share the WebView console error. Native installation and Gradle compilation cannot be checked in the Lovable preview.