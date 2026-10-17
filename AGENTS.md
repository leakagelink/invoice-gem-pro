<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Share the bill UI through a browser-safe component; the Android client builds its own TanStack route tree without the Start document shell, so packaged startup never depends on SSR.
- Android ships every screen and asset in dist-android; do not register app-shell workers in the packaged client because local assets already work offline.
- Register the published website's generated worker only through register-app-worker with preview, iframe, development, and kill-switch guards; use NetworkFirst for document requests and never cache OAuth or API requests.
- Validate locally stored bill collections before startup so invalid storage cannot strand the splash screen.
