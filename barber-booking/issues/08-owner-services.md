# 08: Owner manages Services in two languages

**What to build:** The Owner adds and edits Services with an English name (required), an optional Thai name, duration and price, and hides a Service instead of deleting it; existing Bookings keep their own duration and price.

**Blocked by:** 02 Customer requests a Booking end to end

**Status:** ready-for-agent

**Spec stories:** 56, 57, 58

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Add and edit dialogs validate English name, duration (15–180 min, step 15) and price (0–100000 integer) with inline errors
- [ ] Empty Thai name falls back to English on every screen
- [ ] Hiding a Service removes it from the booking page and shows "Hidden from booking page" in the list; showing it again restores it
- [ ] Editing duration or price does not change existing Bookings
- [ ] A newly added Service is bookable by a Customer
