# TODO list

- [ ] Make the npm Playwright tests work offline
  - Problem: running `npm run test:e2e` fails when the environment is offline.
  - Error:
    ```text
    [WebServer] Error: next/font: error:
    [WebServer] Failed to fetch Outfit from Google Fonts.
    [WebServer] If you are offline or behind a proxy, self-host the font with next/font/local, or set HTTP_PROXY/HTTPS_PROXY so Next.js can reach fonts.googleapis.com.
    [WebServer]
    [WebServer] Import trace:
    [WebServer]   Server Component:
    [WebServer]     [next]/internal/font/google/outfit_ffcb2779.module.css
    [WebServer]     [next]/internal/font/google/outfit_ffcb2779.js
    [WebServer]     ./app/layout.tsx

    [WebServer]     at ignore-listed frames

    Error: Process from config.webServer was not able to start. Exit code: 1
    ```
  - Goal: self-host the font with `next/font/local` or configure the required proxy variables so the tests can run without external network access.

- [ ] Deploy to Vercel via CI/CD
  - First step: deploy manually to understand the process.
  - Next: automate the deployment workflow and validate the CI/CD flow.