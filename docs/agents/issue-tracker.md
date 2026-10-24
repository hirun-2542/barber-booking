# Issue tracker: Local Markdown

Specs and tickets for this project were written as local Markdown files while the repo had no remote; they were published this way rather than as hosted issues. The project is now public at `hirun-2542/barber-booking`, but the tracker stays local so the spec and ticket history remain readable in one clone.

## Conventions

- One feature per directory: `<feature-slug>/`.
- Spec: `<feature-slug>/spec.md`
- Tickets: `<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order, one file per ticket.
- Triage label: a `Status:` line near the top of the file, per `triage-labels.md`.
- "Publish to the issue tracker" means creating these files, not opening a hosted issue.
- Comments, if any, append under `## Comments` at the end of the file.

## Closing a ticket

- Keep the triage label (`Status: ready-for-agent`) and add `State: closed` below it.
- Tick each acceptance checkbox only against evidence, using the ticket's own acceptance list — never a sibling ticket's success.
- Append the resolution and its proof (test counts, commit, runtime checks) under `## Comments`.
- Leave the parent spec unchanged.
