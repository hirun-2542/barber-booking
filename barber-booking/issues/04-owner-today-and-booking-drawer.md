# 04: Owner triages the day: Today, Needs action and Booking drawer

**What to build:** The Owner opens Today to see today's bookings, pending requests, expected revenue and next up, works through "Needs action" (accept or decline requests, record Completed / No-show), and opens any Booking in one shared detail drawer reachable from every dashboard page.

**Blocked by:** 02 Customer requests a Booking end to end

**Status:** ready-for-agent

**Spec stories:** 31, 32, 33, 34, 35, 36, 37, 38, 49, 50, 52

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

The behaviour was implemented before this ticket was written and has only been type-checked and spot-checked. First exercise every acceptance criterion in a real browser, then fix every defect found and add a domain test when a rule is wrong.

- [ ] Today shows the four numbers and "Next up" with its date when it is not today
- [ ] Needs action lists all Pending plus Confirmed bookings whose start has passed, with inline Accept/Decline or Completed/No-show
- [ ] Accept, Decline, Cancel work through the drawer; Decline and Cancel ask for confirmation; invalid moves are impossible from the UI
- [ ] Mark completed / Mark no-show are disabled before the start time with a tooltip and visible helper text
- [ ] Drawer shows Reference code, customer, phone, Service, date and time range, price, note, source and who cancelled
- [ ] Opening `?booking=<id>` on any dashboard route shows the same drawer; an unknown id closes it
- [ ] Today shows "Closed today" / "No bookings today" / "All caught up" in the right situations
- [ ] The Pending count on the navigation and all numbers update when a Customer books from another tab
