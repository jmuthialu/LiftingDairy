# Next JS

## Highlevel
- This is a Server side rendering app (SSR)
- src/app refers to File based App Router
- Every component by default run in server. These are not loaded in browser like in SPA. For example /dashboard will make a network call and server will render dashboard page.tsx at server side and send the HTML to browser.
- Client side components are identified by line at the top "use client" (Refer workout-dashboard.tsx)