# DECISIONS.md



## What I built

Fixed the major data-handling and UI bugs from T-01 through T-07. I fixed the null crashes in WorkflowCard (assignee, tags, invalid progress values) and connected the JSON data properly to the UI layer instead of relying on hardcoded placeholder state. I implemented loading and error states so the app no longer fails with a blank screen. I built the Detail Panel with workflow metadata, notes, history timeline, suggested actions, and close behavior. I also implemented the Activity Feed using the global activity log, sorted newest first with duplicate handling and anonymous-user handling. Finally, I extracted the repeated status rendering logic into a reusable StatusBadge component to remove duplicated code across components.

## What I skipped and why

I did not fully complete the AI summary functionality because the frontend API call architecture was incomplete and the request was failing due to missing authentication/CORS-safe backend handling. I chose to prioritise stabilising the core dashboard functionality and data rendering over partially implementing an unreliable AI integration. I also did not spend much time polishing styling/layout issues because functional correctness and resilience against malformed data felt more important for the scope of the assignment.

## Most difficult bug to find

The filter/search issue took the longest to debug because visually the buttons appeared to work, but the parent state was never updating. The local activeLabel state inside FilterBar made the UI look functional even though onFilterChange and onSearchChange were never called. That made it harder to notice the actual source of the problem because the issue was state propagation rather than rendering.
Also the little bugs were difficult to find without prior guidance and documentation but the comments helped a lot.

## Data quality issues I discovered

I found several intentionally inconsistent data cases while wiring the UI:

assignee can be null
tags can be null
progress is sometimes a string and sometimes a number
some progress values exceed 100
activity log contains duplicate entries
some activity entries contain empty action strings
some activity entries reference workflow IDs that do not exist
status values use inconsistent casing (active, ACTIVE, In Progress, etc.)

These issues required defensive rendering and fallback handling throughout the UI.


## AI tools I used and how

I used GPT mainly for debugging explanations, React state flow clarification, and understanding edge-case handling patterns. I used it to reason about component structure, optional chaining, sorting activity feeds, and reusable component extraction. I still implemented and adjusted the actual logic manually to fit the existing project structure and dataset shape.
I also used Claude to give suggestions for the user efficiency and improvements in the code that i might have missed. 

## What I'd do differently with more time

With more time, I would move the AI summary functionality behind a proper backend API instead of calling external APIs directly from the frontend. I would also improve the data layer by normalising workflow/activity data before rendering so components require fewer defensive checks. Finally, I would spend more time refining the reusable component structure and reducing inline styles across the dashboard.


