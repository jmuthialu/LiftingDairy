# Create workout

## Route
http://localhost:3000/dashboard/workout/new

## Create auth and data-mutation.md documents
[prompt 1]:
create a new auth.md documentation file in the /docs directory. this file should highlight the coding standards for everything to do with auth in this app, specifically that this app uses clerk for authentication.


## Create new workout feature

[prompt 1 / edit mode]:
create a new page at /dashboard/workout/new with a form to create a new workout.

[prompt 2 / edit mode]:
the redirect should be done client side, not within the server action

[prompt 3 / edit mode]:
add into the docs/data-mutations.md file a rule that says the redirect() function should not be used within server actions. redirects should instead be done client side after the call to a server action resolves.