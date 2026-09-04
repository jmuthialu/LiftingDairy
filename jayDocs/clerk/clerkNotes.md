# ClerkNotes

Run the agent prompt in the file "clerkAIPrompt" to setup clerk. This will perform the below steps.

Clerk CLI installed locally, signed in as jaytestnut@gmail.com
Project initialized and linked to app app_3IsJ6JzC77qoLGYvEGYrRv1oNEa (Next.js App Router detected)
src/proxy.ts, sign-in/sign-up pages, and .env.local keys created by clerk init
Added /__clerk/:path* to the proxy matcher
Added sign-in/sign-up buttons and a user button to layout.tsx header
clerk doctor passed all checks (dev instance configured; no production instance yet)
Dev server running at http://localhost:3000 — home, /sign-in, /sign-up all return 200.

As a side effect it also installed 8 skills at ~/.agents/skills/clerk-*
