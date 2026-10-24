# 10: Owner edits Shop profile, Booking rules and resets the demo

**What to build:** The Owner edits shop name, address and phone, tunes the Booking rules (slot interval, buffer, maximum advance, minimum notice) and can reset the whole demo to the seed with a confirmation.

**Blocked by:** 02 Customer requests a Booking end to end

**Status:** ready-for-agent

**Spec stories:** 63, 64, 65

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Profile changes appear in the customer header and footer
- [ ] Each Booking rule changes the Slots a Customer is offered (interval, buffer, advance days, minimum notice)
- [ ] Validation: name required, phone valid, advance 1–60, notice 0–48, with inline errors
- [ ] Reset demo data asks for confirmation and restores seed data; data still persists after refresh
