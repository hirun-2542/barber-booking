# 11: Demo polish, responsive and accessibility pass

**What to build:** The finished demo opens with a busy "today" (Pending requests and a Needs action row), keeps data across refresh, looks like one minimal design in both languages, works at 390px and 1440px, and is usable by keyboard.

**Blocked by:** 03 Customer checks and cancels a Booking; 05 Owner plans the week: Calendar, Walk-in booking and Reschedule; 06 Owner finds any Booking in the Bookings list; 07 Owner reviews Customers derived from Bookings; 08 Owner manages Services in two languages; 09 Owner sets Opening hours and Closed dates; 10 Owner edits Shop profile, Booking rules and resets the demo

**Status:** ready-for-agent

**Spec stories:** 66, 67, 68, 69, 70, 71

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Seed always shows today populated, at least one Pending request and a Needs action item, for any day of the week
- [ ] No horizontal page scroll at 390px on every route
- [ ] Customer pages use touch targets of at least 44px
- [ ] Every dialog and drawer closes with Esc (only the topmost one when nested), traps focus and returns focus on close
- [ ] Visible focus ring on every interactive element; status never conveyed by colour alone
- [ ] Screenshots of Landing, Book date/time, Today and Calendar in EN and TH confirm Inter + Noto Sans Thai and the single accent
