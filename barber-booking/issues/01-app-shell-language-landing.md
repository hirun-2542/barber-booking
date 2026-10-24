# 01: App shell, language switch and Landing

**What to build:** A visitor opens the app, sees a Landing page offering "Book as customer", "Open owner dashboard" and "Check my booking", can switch the whole UI between EN and TH (remembered after refresh), and gets a friendly not-found page on a wrong URL. Both layouts (centered customer column, owner sidebar dashboard) and the minimal design tokens exist.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent
**State:** closed

**Spec stories:** 1, 2, 3, 4, 5, 7

Completion contract: a vertical slice through UI and store with its domain tests where a rule changes, plus a smoke run in a real browser at 390px (customer pages) or 1440px (dashboard pages). Vocabulary follows `GLOSSARY.md`.

- [x] Landing shows the three entry points and the "data is stored in your browser" note
- [x] EN/TH toggle on every page switches all UI text; the choice survives a refresh and updates the page language attribute
- [x] Thai dates, weekday/month names, prices and statuses are localized; a Service with an empty Thai name shows its English name
- [x] An unknown route shows a not-found page with a link home
- [x] Customer layout at 390px and dashboard layout at 1440px render without horizontal scroll

## Comments

Closed against this ticket's own acceptance list. Evidence:

- `npm run build` passes; `npx vitest run` passes (3 files, 19 tests: Slot rules, status transitions, phone/code helpers, seed invariants for 7 consecutive days).
- Browser smoke against `vite preview` with the clock fixed to Mon 12 Oct 2026 11:10 (checks run in a real Chromium tab; state manipulated through localStorage only to reach otherwise rare states).
- Landing entry points and demo note present; unknown route `#/nope/zzz` shows "Page not found" + "Back to home".
- TH toggle set `html[lang=th]`, Landing rendered Thai after reload; with `services[0].name.th=""` the booking page listed "Haircut" next to Thai names; Thai step-2 page showed Thai date labels and "วันและเวลา".
- `document.documentElement.scrollWidth` = 390 on `#/`, `#/book`, `#/my-booking`, `#/dashboard/today`; = 1440 on `#/dashboard/calendar`.
