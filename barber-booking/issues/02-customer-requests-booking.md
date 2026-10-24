# 02: Customer requests a Booking end to end

**What to build:** A Customer picks an active Service, a day and a Slot, enters name and phone, reviews, and submits a Booking request that becomes Pending, holds its Slot and gives a Reference code. Seeded demo data and localStorage persistence make the shop look real from the first load.

**Blocked by:** 01 App shell, language switch and Landing

**Status:** ready-for-agent
**State:** closed

**Spec stories:** 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

- [x] Only active Services appear, with duration and price; changing the Service clears the chosen date and time
- [x] Day strip runs from today to the maximum advance days; closed days show "Closed" and fully booked days show "Full", both disabled
- [x] Offered times fit the Service duration, avoid the break and closing time, respect minimum notice, and exclude times held by Pending, Confirmed or Completed bookings
- [x] A selected day that has no times shows the empty state
- [x] Name and phone are validated with messages next to the field and focus moves to the first invalid field
- [x] Review step shows Service, date, time, name, phone and the note that the shop will confirm; a progress indicator shows the step
- [x] If the chosen time was taken meanwhile, the Customer returns to date/time with a banner and can pick again
- [x] Submitting creates a Pending Booking, shows a large Reference code, and survives a refresh

## Comments

Closed against this ticket's own acceptance list. Evidence:

- `npm run build` passes; `npx vitest run` passes (3 files, 19 tests: Slot rules, status transitions, phone/code helpers, seed invariants for 7 consecutive days).
- Browser smoke against `vite preview` with the clock fixed to Mon 12 Oct 2026 11:10 (checks run in a real Chromium tab; state manipulated through localStorage only to reach otherwise rare states).
- Only the 5 active Services listed (inactive "Hot towel shave" absent) with `45 min` / `฿350`; switching Service then Continue left Continue disabled on step 2.
- Thu 15 Oct (regular closed weekday) rendered "Closed" and disabled; Wed 14 Oct with a single 30-minute opening fully booked rendered "Full" and disabled.
- On Mon 12 Oct at 11:10 the offered times excluded 12:30, 13:00, 13:30 (break), 10:00, 11:00, 11:30 (before now + 1 h) and every start held by seeded Pending/Confirmed/Completed bookings.
- Empty submit showed both field errors and put focus on an `aria-invalid=true` field. Review showed "The shop will confirm your request.", name and `087-777-7777`.
- A booking inserted from a second tab at the chosen time made "Request booking" return to step 2 with "That time was just taken. Please pick another."; selecting another time and submitting produced code `U4M8D5` (6 chars, no O/I/0/1), status Pending, and the page still showed it after reload.
- A selected day made Closed from another tab showed "No times available on this day".
