# 03: Customer checks and cancels a Booking

**What to build:** A Customer finds a Booking with Reference code and phone number, understands its status in plain language, sees changes the Owner makes without refreshing, and cancels within the allowed window so the Slot becomes bookable again.

**Blocked by:** 02 Customer requests a Booking end to end

**Status:** ready-for-agent
**State:** closed

**Spec stories:** 22, 23, 24, 25, 26, 27, 28, 29, 30

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

- [x] Lookup with Reference code + phone shows the Booking; a wrong pair shows "No booking matches that code and phone number."
- [x] Coming from the confirmation page prefills the Reference code
- [x] Each of the six statuses shows its own plain-language sentence; Declined offers "Book again"
- [x] Status updates live when the Owner changes it in another tab
- [x] Cancel needs a confirmation dialog and sets Cancelled by the customer
- [x] Past the cancellation window the Customer sees the cutoff hours and the Shop phone instead of a Cancel button
- [x] A cancelled Booking releases its Slot on the booking page

## Comments

Closed against this ticket's own acceptance list. Evidence:

- `npm run build` passes; `npx vitest run` passes (3 files, 19 tests: Slot rules, status transitions, phone/code helpers, seed invariants for 7 consecutive days).
- Browser smoke against `vite preview` with the clock fixed to Mon 12 Oct 2026 11:10 (checks run in a real Chromium tab; state manipulated through localStorage only to reach otherwise rare states).
- Wrong pair `ZZZZZZ` / `0800000000` showed the no-match message; `#/my-booking?ref=U4M8D5` prefilled the first input.
- Setting the booking to each status and re-looking-up showed: "Waiting for the shop to confirm.", "See you soon.", "The shop couldn't take this booking." (+ "Book again"), "This booking was cancelled.", "Thanks for visiting.", "This booking was marked as a no-show."
- Confirmed booking starting 11:30 at now = 11:10 (min notice 1 h) showed "Cancellations close 1 h …" with `098-765-4321` and no Cancel button.
- Cancel on a future Confirmed booking opened "Cancel this booking?"; confirming stored `status=cancelled`, `cancelledBy=customer`.
- A status change dispatched from another context while the lookup was open flipped Pending to "See you soon." without reload.
- Earlier manual run: after the customer cancelled a Confirmed 12:00 Haircut on Mon 12 Oct, 12:00 returned to the offered times.
