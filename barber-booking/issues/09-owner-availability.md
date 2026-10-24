# 09: Owner sets Opening hours and Closed dates

**What to build:** The Owner edits Opening hours and an optional break for each weekday and manages Closed dates; Customers immediately see matching Slots while existing Bookings stay untouched.

**Blocked by:** 02 Customer requests a Booking end to end

**Status:** ready-for-agent

**Spec stories:** 59, 60, 61, 62

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Seven rows, Monday first, with weekday names in the current language
- [ ] Start before end and a break inside opening hours are enforced with inline errors; Save is disabled while invalid or unchanged
- [ ] Closed dates: add (duplicates ignored), list ascending, remove, past dates hidden
- [ ] Saving changes the Slots and day labels on the booking page
- [ ] Note that changes do not affect existing Bookings is visible; "Saved" confirmation appears after saving
