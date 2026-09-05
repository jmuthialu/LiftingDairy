# Dashboard feature

## Udemy Repo
https://github.com/tomphill/liftingdiarycourse

## Create Dashboard feature UI only
[prompt 1]
Create a document under docs/ui.md that outlines the coding standards for building UI layer for this app. All ui components should use only shadcn UI library. No custom UI allowed, only shadcn UI components.

For data formatting use the library date-fns. Date should be formatted like below examples.
1st Aug 2025
2nd Sep 2025
3rd Aug 2026
4th Feb 2026

[prompt 2]
Update claude.md file to ALWAYS refer to coding standards from the documents in docs folder.

[prompt 3]
Create /dashboard route that shows a dashboard feature which shows a calendar defaulting to current date and showing the workouts for that date. If user selects a different data it should  show the workouts for the selected date. Generate code for UI layer only. Do not generate any data fetching or server side code.

## Generate coding document for data fetching.md

[prompt 1]
Create a document under docs/data-fetching.md that outlines the coding standards for fetching data from Neon DB using Drizzle ORM. MANDATORY - All data fetching should be coded as server side component ONLY. No client side component  or any client side routing allowed. Data fetching SHOULD be performed through helper functions defined under data folder.

[prompt 2]
Add additional rules to docs/data-fetching.md. DO NOT use raw SQL anytime. Very important that a logged in user should be able to see their data only. SHOULD NOT be able to see other's data. 