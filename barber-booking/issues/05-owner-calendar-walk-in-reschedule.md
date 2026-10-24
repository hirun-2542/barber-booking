# 05: Owner plans the week: Calendar, Walk-in booking and Reschedule

**What to build:** The Owner sees a Monday–Sunday week, adds a Walk-in booking by clicking an empty time or the New booking button (Confirmed immediately, never overlapping), and moves a Booking to another valid Slot with Reschedule.

**Blocked by:** 04 Owner triages the day: Today, Needs action and Booking drawer

**Status:** ready-for-agent

**Spec stories:** 39, 40, 41, 42, 43, 44, 45, 46, 47, 48

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Previous / next / Today controls and the visible date range work
- [ ] Pending, Confirmed and finished bookings are visually distinct; closed days and breaks are shaded
- [ ] Clicking a booking block opens the drawer; clicking an empty cell opens New booking with that date
- [ ] Walk-in bookings ignore minimum notice and maximum advance but cannot overlap another Booking, and start as Confirmed
- [ ] Reschedule dialog lists only valid times, treats the booking's own time as free, and keeps the current status
- [ ] A conflict found at save time shows an inline error and refreshes the times
- [ ] Mark outcome buttons stay disabled until start time (shared with ticket 04)
