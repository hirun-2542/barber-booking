# 06: Owner finds any Booking in the Bookings list

**What to build:** The Owner browses all Bookings with Upcoming / Past / All tabs, filters by status and searches by name, phone or Reference code, then opens a row in the drawer.

**Blocked by:** 04 Owner triages the day: Today, Needs action and Booking drawer

**Status:** ready-for-agent

**Spec stories:** 51

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Upcoming sorts soonest first and Past latest first, based on start time versus now
- [ ] Status filter and search combine; phone search matches digits regardless of dashes
- [ ] Clicking or pressing Enter on a row opens the drawer
- [ ] No match shows an empty state with "Clear filters" that resets tab, status and search
- [ ] Table scrolls inside its own wrapper at 390px without breaking the page
