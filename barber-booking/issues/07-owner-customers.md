# 07: Owner reviews Customers derived from Bookings

**What to build:** The Owner sees every Customer (grouped by phone) with visits, no-shows, total spent, last visit and next booking, can search, and expands a row to read that Customer's history.

**Blocked by:** 04 Owner triages the day: Today, Needs action and Booking drawer

**Status:** ready-for-agent

**Spec stories:** 53, 54, 55

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Columns and values match the Bookings (visits and total spent count Completed only; next booking is the nearest Pending/Confirmed in the future)
- [ ] Search matches name or phone digits
- [ ] Expanding a row shows the full history; clicking a history row opens the drawer
- [ ] Empty and no-match states are distinct
