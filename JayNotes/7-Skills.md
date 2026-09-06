# Skills

## Intro
Skills are very similar to rules or docs that we created. The difference is that the skills are not fully read at the front. Only the description is read and appropriate skills will be used based on need.

This is different from rules which are fully read into context. Also if the app has several MCP connections these will add up to context.

Ex: We can create a skill to read Neon DB. This will load only when DB is read unlike MCP where all the details are loaded upfront in the context.

## Create skill
You do not create skill from scratch. You use skill-creator from https://www.skills.sh and install it. Note: Skills from 3rd P sites can contain scripts which we need to be very careful of. Aboid this except `skill-creator` skill from Anthropic.

[prompt 1]
Create a new skill that queries the db for all the workout entries for the past year using the DB URL connection defined in .env file. Plot this data to a bar chart using a python script where the x-axis has the month and y axis displays the number of workouts. This chart should be exported as image.

// Create a new skill -> will use skill-crator skill

## Calling a skill

[prompt]
generate workout-frequency-chart

OR

/workout-frequency-chart