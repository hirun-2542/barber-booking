# 12: Design review fixes from the visual board

**What to build:** Apply the six refinements found while reviewing the screenshot boards, using the recommended resolution for each (the owner chose to track them as one ticket; individual items can be dropped by editing this list).

**Blocked by:** 11 Demo polish, responsive and accessibility pass

**Status:** ready-for-agent

**Spec stories:** none (refinement of delivered work)

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

- [ ] Seed has about 3–4 Pending requests so Today and Needs action stay short on first load
- [ ] Today "Needs action" rows no longer collide at 390px: actions wrap below the text
- [ ] Calendar blocks for Completed/No-show get a thin grey border and the break band contrasts with the grid
- [ ] Native date inputs (Availability Closed dates, New booking) are replaced by a minimal date picker that follows the language and the design tokens
- [ ] Landing shows a one-line summary of today's opening hours and the starting price without adding colour or imagery
- [ ] New booking button sits on the same row as the page title on Today
