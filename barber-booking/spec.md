Status: ready-for-agent

# Barber Booking Mockup — Spec

## Problem Statement

เจ้าของร้านคนเดียว (ตัวอย่าง: ร้านตัดผม) รับคิวผ่านโทรศัพท์/แชต จึงทับซ้อนกันง่าย ลืมคิว และไม่เห็นภาพรวมของวัน ส่วนลูกค้าต้องรอให้ร้านตอบก่อนจึงรู้ว่าได้เวลาไหน

ผู้ใช้งานจริงของ spec นี้คือเจ้าของ portfolio: ต้องการ mockup ที่คลิกได้จริงและดูน่าเชื่อถือ แสดงทั้งประสบการณ์ลูกค้าและ dashboard เจ้าของร้าน โดยไม่ต้องมี backend

## Solution

เว็บแอป static ที่มี 2 ฝั่งอยู่ในแอปเดียว:

- **ฝั่ง Customer (mobile-first)** — เลือก Service → วัน/เวลา → กรอกข้อมูล → ส่ง Booking request; ภายหลังตรวจสถานะและยกเลิกได้ด้วย Reference code + เบอร์โทร
- **ฝั่ง Owner (desktop-first) dashboard** — Today, Calendar (week), Bookings, Customers, Services, Availability, Settings; อนุมัติ/ปฏิเสธ request, บันทึก Walk-in booking, Reschedule, ปิดงานเป็น Completed/No-show

ข้อมูลทั้งหมดเก็บใน localStorage เริ่มจาก seed ที่ดูเต็มและมีปุ่ม Reset demo; เปิดฝั่ง Customer กับ Owner คนละแท็บแล้วเห็นการเปลี่ยนแปลงข้ามกันทันที สลับ EN/TH ได้ทั้งแอป สไตล์ Minimalism ขาว-ดำ + accent เขียว `#1F6F4A` สีเดียว ไม่มี login (หน้า landing เลือกฝั่ง)

## User Stories

### Landing และภาษา
1. As a portfolio viewer, I want a landing page that offers "Book as customer" and "Open owner dashboard", so that I can reach either side without logging in
2. As a portfolio viewer, I want a note that this is a demo with data stored in my browser, so that I understand nothing is sent anywhere
3. As a visitor, I want to switch between EN and TH from any page, so that I can read the app in my language
4. As a visitor, I want my language choice remembered after refresh, so that I don't have to switch again
5. As a Thai-speaking visitor, I want dates, weekday/month names, prices (฿) and statuses localized, so that the Thai UI feels native
6. As a visitor, I want a Service whose Thai name is empty to show its English name, so that nothing appears blank
7. As a visitor, I want a friendly not-found page with a link home, so that a wrong URL isn't a dead end

### Customer — จอง
8. As a Customer, I want to see only active Services with duration and price, so that I can choose what I need
9. As a Customer, I want changing the Service to clear my chosen date/time, so that I never book a time that doesn't fit the new duration
10. As a Customer, I want a horizontal strip of days from today up to the maximum advance days, so that I can pick a date quickly on my phone
11. As a Customer, I want days when the Shop is closed marked "Closed" and fully booked days marked "Full", so that I know why I can't choose them
12. As a Customer, I want to see only start times that really fit the Service duration, so that I can't pick a time that overruns closing or the break
13. As a Customer, I want times that are too soon (inside the minimum notice) to be hidden, so that I don't request something impossible
14. As a Customer, I want times held by someone else's Pending or Confirmed Booking to disappear, so that I never double-book
15. As a Customer, I want an empty state when a day has no times, so that I'm told to try another day
16. As a Customer, I want to enter name, phone and an optional note, with clear validation messages, so that the Shop can reach me
17. As a Customer, I want a review step before sending, so that I can check Service, date and time
18. As a Customer, I want to be told clearly the Shop must confirm my request, so that I don't assume it is final
19. As a Customer, I want to be sent back to time selection with a message if my chosen time was just taken, so that I can recover without retyping
20. As a Customer, I want a confirmation page with a large Reference code and a reminder to save it, so that I can find my Booking later
21. As a Customer, I want a progress indicator ("Step n of 4"), so that I know how much is left

### Customer — ตรวจและยกเลิก
22. As a Customer, I want to look up my Booking with Reference code and phone, so that I can see its status without an account
23. As a Customer, I want a clear message when nothing matches, so that I can correct a typo
24. As a Customer, I want the Reference code prefilled when I come from the confirmation page, so that I only type my phone
25. As a Customer, I want a plain-language explanation for each status, so that I know what happens next
26. As a Customer, I want the status to update live when the Owner accepts or declines, so that I don't have to refresh
27. As a Customer, I want to cancel a Pending or Confirmed Booking after a confirmation prompt, so that I don't cancel by accident
28. As a Customer, I want a message with the Shop's phone when the cancellation window has closed, so that I know how else to cancel
29. As a Customer, I want a cancelled Booking's time to become bookable again, so that the Owner doesn't lose that Slot
30. As a Customer, I want a Declined request to tell me to choose another time, so that I can rebook

### Owner — ภาพรวมและงานประจำวัน
31. As the Owner, I want a Today page showing today's bookings, pending requests, expected revenue and next up, so that I grasp my day at a glance
32. As the Owner, I want a "Needs action" list of all Pending requests and past-start Confirmed bookings, so that nothing is forgotten
33. As the Owner, I want to Accept or Decline from that list, so that I can clear requests in one click
34. As the Owner, I want to mark past-start bookings Completed or No-show inline, so that my records and revenue stay accurate
35. As the Owner, I want today's schedule in time order, so that I can follow the day
36. As the Owner, I want "Closed today" shown when the Shop is closed, so that an empty schedule isn't confusing
37. As the Owner, I want the Pending count on the navigation, so that I notice new requests from any page
38. As the Owner, I want the dashboard to refresh when a Customer books in another tab, so that the demo feels live

### Owner — จัดการคิว
39. As the Owner, I want a week view Monday–Sunday with previous/next/today controls, so that I can plan the week
40. As the Owner, I want Pending, Confirmed and finished bookings visually distinct on the calendar, so that I read state at a glance
41. As the Owner, I want closed days and break times shaded, so that I see when I'm unavailable
42. As the Owner, I want to click a calendar block to open the booking detail, so that I can act on it
43. As the Owner, I want to click an empty calendar cell to start a new Booking on that date, so that adding Walk-in bookings is fast
44. As the Owner, I want to add a Walk-in booking that is Confirmed immediately, so that phone and walk-in customers are tracked too
45. As the Owner, I want Walk-in bookings to ignore minimum notice and maximum advance but never overlap another Booking, so that I keep flexibility without double-booking
46. As the Owner, I want to Reschedule via a dialog showing only valid times, with the Booking's own time counted as free, so that moving a booking is safe
47. As the Owner, I want Reschedule to keep the current status, so that a Confirmed booking stays Confirmed
48. As the Owner, I want Mark completed / Mark no-show disabled until the start time with a tooltip, so that I can't record outcomes early
49. As the Owner, I want confirmation prompts for Decline and Cancel, so that I don't lose a Booking by mistake
50. As the Owner, I want the booking detail to show Reference code, customer, Service, time range, price, note and source (online vs added by owner), so that I have everything in one place
51. As the Owner, I want a Bookings list with Upcoming/Past/All tabs, status filter and search by name, phone or Reference code, so that I can find any Booking
52. As the Owner, I want every booking view to open the same detail drawer, so that behavior is consistent

### Owner — Customers
53. As the Owner, I want a Customers list derived from bookings (name, phone, visits, no-shows, total spent, last visit, next booking), so that I know my regulars
54. As the Owner, I want to expand a Customer to see their booking history, so that I can recall past visits
55. As the Owner, I want to search Customers by name or phone, so that I can find someone quickly

### Owner — Services / Availability / Settings
56. As the Owner, I want to add and edit Services with English name (required), Thai name (optional), duration and price, so that my menu is accurate in both languages
57. As the Owner, I want to hide a Service instead of deleting it, so that history stays intact
58. As the Owner, I want editing a Service not to change existing bookings' duration or price, so that past records stay true
59. As the Owner, I want to set Opening hours and an optional break for each weekday, so that Slots reflect my real schedule
60. As the Owner, I want validation (start before end, break inside opening hours), so that I can't save an impossible schedule
61. As the Owner, I want to add and remove Closed dates, with past dates hidden, so that holidays are handled
62. As the Owner, I want a note that availability changes don't affect existing bookings, so that I'm not surprised by bookings outside new hours
63. As the Owner, I want to set slot interval, buffer, maximum advance days and minimum notice, so that Booking rules suit my work
64. As the Owner, I want to edit shop name, address and phone, so that the Customer pages show my details
65. As the Owner, I want a "Reset demo data" button with confirmation, so that I can restore a clean demo after experimenting

### Demo และ design
66. As a portfolio viewer, I want the seed to always show a busy "today" with Pending requests and needs-action items, so that the dashboard looks alive on first load
67. As a portfolio viewer, I want data to survive refresh, so that my demo actions don't vanish
68. As a portfolio viewer, I want a consistent minimal look (white, ink text, 1px lines, one green accent, no shadows) in both languages, so that the piece reads as one design
69. As a mobile Customer, I want the booking pages usable at 390px width without horizontal scrolling, so that booking works on my phone
70. As the Owner on a large screen, I want a sidebar dashboard that collapses to a top bar on small screens, so that it's still usable on a phone
71. As a keyboard user, I want visible focus states and dialogs that close with Esc, so that the app is accessible

## Implementation Decisions

**Stack/โครงสร้าง**
- Vite + React + TypeScript + Tailwind CSS 4, hash-based routing (deploys to any static host), date-fns for date math (en/th locales), lucide icons, Inter + Noto Sans Thai (UI) and IBM Plex Mono (Reference code); npm
- Three layers: **domain** (pure TypeScript, no React) → **store** (state + persistence + mutations) → **UI** (customer pages, dashboard pages, shared components)
- No backend, no login; timezone = browser; times shown 24h `HH:mm`; no year displayed

**Domain model** (ใช้คำตาม GLOSSARY: Shop, Owner, Customer, Service, Booking, Booking request, Walk-in booking, Reference code, Slot, Opening hours, Closed date, Booking rules, Reschedule)
- Booking statuses: Pending, Confirmed, Declined, Cancelled, Completed, No-show. Transitions: Pending → Confirmed | Declined | Cancelled; Confirmed → Completed | No-show | Cancelled; the rest are terminal
- Pending, Confirmed and Completed hold time; Declined, Cancelled and No-show release it
- Booking snapshots Service duration and price at creation; stores phone as digits only; records source (online / owner) and who cancelled
- Customer is not stored — derived by grouping bookings by phone (name from most recently created booking)
- Reference code: 6 characters from an alphabet excluding `O`, `I`, `0`, `1`, unique among existing bookings
- Phone validity: 10 digits starting with `0`; displayed as `081-234-5678`
- Opening hours: 7 weekdays each with open flag, start, end, optional break; plus a list of Closed dates
- Booking rules: slot interval (15/30/60), buffer (0/5/10/15 min), max advance days (1–60), min notice hours (0–48)

**Slot calculation (single source of truth, used by customer flow, owner dialogs and final store check)**
- Two modes: `customer` and `owner`
- Both: past dates → none; Closed date or closed weekday → none; candidate starts step by the slot interval while the Service fits before closing; drop candidates overlapping the break; drop candidates overlapping any occupying Booking, expanded by the buffer on both sides; support ignoring one Booking (for Reschedule)
- `customer` only: reject dates beyond max advance; reject starts earlier than now + min notice
- `owner`: no notice/advance limits and may start earlier today
- Store re-validates the Slot against current time and state immediately before saving; failure returns `slot_taken`

**Store actions:** create booking (customer → Pending/online, owner → Confirmed/owner), set status (rejects invalid transitions), reschedule (owner mode, keeps status), save/toggle Service, save Availability, save Settings, reset demo. All mutations persist to localStorage and sync across tabs through the `storage` event. A clock hook refreshes time-dependent screens every minute

**Business rules**
- Customer cancel allowed only for Pending/Confirmed and only if start ≥ now + min notice hours
- Completed/No-show allowed only at or after start time
- Reschedule allowed for Pending/Confirmed
- Today stats: today count = Confirmed + Completed today; pending = all Pending; expected revenue = price sum of Confirmed + Completed today; next up = earliest Confirmed starting now or later
- Needs action = all Pending (by start) + Confirmed whose start has passed
- No auto-expiry of Pending requests; Services are never deleted (deactivate instead)

**Seed (deterministic from "now")**
- Shop "Ash & Oak Barber"; 5 active Services + 1 inactive; 10 Customers; weekly closed day chosen so today is always open; one Closed date ~9–10 days ahead
- Bookings from 14 days back to 7 days ahead on non-overlapping fixed times; today fully populated; past → mostly Completed with some No-show/Cancelled; future → mostly Confirmed with some Pending and one Declined; most recent past booking today stays Confirmed to show Needs action

**UI/Design system**
- Tokens: ink `#111111`, muted `#6B6B6B`, line `#E6E6E6`, surface `#FAFAFA`, accent `#1F6F4A`, accent-soft `#E8F1EC`; 1px lines, `rounded-md`, no shadows except dialog/drawer; accent only for primary CTA, Confirmed state, selected state and focus ring; "danger" is expressed with ink outline, never red
- Status badge shapes: hollow ring (Pending), filled accent dot (Confirmed), filled ink dot (Completed), short dash in muted (Declined/Cancelled/No-show)
- Customer layout: centered narrow column; Dashboard layout: sidebar ≥ `lg`, top bar + scrollable nav below
- Booking detail opens via a query parameter on any dashboard route so every list uses one mechanism
- UI strings live in typed EN/TH dictionaries; the TH dictionary must be type-checked as complete; number is rendered separately from unit text (Plex Mono digits where unambiguity matters)

**Routes:** landing, book, book done (by Reference code), my booking (optional prefilled code), dashboard (redirects to today) with today / calendar / bookings / customers / services / availability / settings, and a catch-all not-found

## Testing Decisions

- **Seam (one):** the domain layer's public functions — slot calculation, status transitions/permissions, reference/phone helpers, customer derivation, stats, seed. It is pure and deterministic given `(state, now)`, so it covers the rules that matter most without a browser. Store actions are thin wrappers over it and are not tested separately
- **Good test:** asserts observable results (which start times are offered, which transitions are allowed, what the seed contains) using a fixed `now`; never asserts internal helpers, call counts, or markup
- **Must cover:** closed weekday/Closed date; break overlap; closing-time overflow; Pending holds a Slot and Cancelled releases it; buffer; min notice and max advance for `customer` vs `owner`; ignoring own Booking when rescheduling; allowed/forbidden transitions; customer cancel window; Reference code alphabet and uniqueness; phone validation; seed invariants for 7 consecutive "now" values (today open, no overlaps among occupying bookings, all within hours and outside breaks, at least one Pending and one booking today)
- **Prior art:** none — repo is greenfield; Vitest in a Node environment, colocated `*.test.ts`
- **UI is verified by smoke run in a real browser, not unit tests:** customer books → owner accepts in another tab → customer sees Confirmed → customer cancels → Slot reappears; Pending time hidden from booking; EN/TH switch; Reset demo; 390px and 1440px layouts; screenshots of Landing, Book date/time, Today, Calendar to confirm fonts and colors

## Out of Scope

- Backend, database, authentication, multi-user/multi-shop, staff/provider selection
- Real notifications (email/SMS/LINE), payments, deposits, online reviews
- Customer-side Reschedule; drag-and-drop in the calendar; recurring bookings
- Auto-expiry of Pending requests
- Charts/reports beyond the four Today numbers
- Per-service buffers, per-day overrides other than Closed dates, multiple breaks per day
- Timezone selection; year display / Buddhist-era formatting
- Deleting Services; importing/exporting data
- Dedicated tests for UI components or store wiring

## Further Notes

- Detailed execution plan (algorithm order, seed arithmetic, per-page behavior): `local://barber-booking-mockup-plan.md`
- Glossary file `GLOSSARY.md` is created during implementation Step 1 using the terms above; every screen, status label and test must use those terms (e.g. "Booking", never "appointment")
- Seed shop name, address and Services are placeholders; the Owner can change them in Settings
- This spec was published as a local Markdown file because the repo has no git remote; no remote or hosted issue was created
