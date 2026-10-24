# Wireframes (low-fidelity)

สัญลักษณ์: `[ ]` ปุ่ม/ตัวเลือก · `( )` radio · `▓` selected (accent) · `░` disabled/shaded · `┄` เส้นประ (Pending)

## Customer — mobile 390px

### C1 Landing `/`
```
┌──────────────────────────┐
│ Ash & Oak Barber   EN|TH │
├──────────────────────────┤
│ Book a chair.            │
│ 12 Soi Ari 1, Bangkok    │
│                          │
│ ┌──────────────────────┐ │
│ │ Book as customer   → │ │  ← primary (accent)
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Open owner dashboard→│ │
│ └──────────────────────┘ │
│ Check my booking         │
│                          │
│ Portfolio demo — data is │
│ stored in your browser.  │
└──────────────────────────┘
```

### C2 Book — step 1 Service
```
┌──────────────────────────┐
│ ‹ Ash & Oak        EN|TH │
│ Step 1 of 4  ▓▓░░░░░░    │
│ Choose a service         │
│ ┌──────────────────────┐ │
│ │▓ Haircut      ฿350   │ │
│ │  45 min              │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │  Skin fade    ฿450   │ │
│ │  60 min              │ │
│ └──────────────────────┘ │
│        … (active only)   │
│ [        Continue      ] │
└──────────────────────────┘
```

### C3 Book — step 2 Date & time
```
┌──────────────────────────┐
│ Step 2 of 4              │
│ (banner: time was taken) │  ← เฉพาะ slot_taken
│ ← Fri  Sat  Sun  Mon  → │
│    10   11   12   13     │
│   ▓▓▓  ░░░  ░░░         │
│        Closed Full       │
│ Available times          │
│ [10:00] [10:30] [11:00]  │
│ [11:30] [12:00] [14:00]  │
│ [        Continue      ] │
└──────────────────────────┘
```

### C4 Book — step 3 Details / step 4 Review
```
┌──────────────────────────┐        ┌──────────────────────────┐
│ Step 3 of 4              │        │ Step 4 of 4              │
│ Name *                   │        │ Haircut · 45 min · ฿350  │
│ [____________________]   │        │ Sat 11 Oct · 14:00–14:45 │
│ Phone *                  │        │ Somchai K. · 081-234-5678│
│ [____________________]   │        │ ──────────────────────── │
│ ⚠ Enter a 10-digit …     │        │ The shop will confirm    │
│ Note (optional)          │        │ your request.            │
│ [____________________]   │        │ [   Request booking    ] │
│ [ Back ] [ Continue ]    │        │ [ Back ]                 │
└──────────────────────────┘        └──────────────────────────┘
```

### C5 Done `/book/done/:ref` · C6 My booking
```
┌──────────────────────────┐        ┌──────────────────────────┐
│ ○ Pending                │        │ Check my booking         │
│ Request sent             │        │ Reference code           │
│   K7M2QX   (mono, 32px)  │        │ [______]                 │
│ Save this code to check  │        │ Phone                    │
│ or cancel your booking.  │        │ [____________]  [Find]   │
│ Haircut · Sat 11 Oct     │        │ ──────────────────────── │
│ 14:00–14:45              │        │ ● Confirmed  See you soon│
│ [ Check my booking ]     │        │ Haircut · 14:00–14:45    │
│ Back to home             │        │ [ Cancel booking ]       │
└──────────────────────────┘        └──────────────────────────┘
```

## Owner dashboard — desktop 1440px

### D0 Shell (ทุกหน้า)
```
┌────────────┬──────────────────────────────────────────────────┐
│ Ash & Oak  │ Today                 [View booking page] EN|TH  │
│            ├──────────────────────────────────────────────────┤
│ ▓ Today    │                                                  │
│   Calendar │                 page content                     │
│   Bookings²│                                                  │
│   Customers│                                                  │
│   Services │                                                  │
│   Availab. │                                                  │
│   Settings │                                                  │
└────────────┴──────────────────────────────────────────────────┘
  ² badge = จำนวน Pending           < lg: sidebar → top bar + nav เลื่อนแนวนอน
```

### D1 Today
```
│ Today's bookings │ Pending requests │ Expected revenue │ Next up      │
│        8         │        3         │      ฿2,950      │ 15:30 Nat…   │
│                                                    [+ New booking]    │
│ Needs action                      │ Today's schedule                   │
│ ┄ 10:00 Somchai  [Accept][Decline]│ 10:00–10:45 Somchai  ○ Pending     │
│ ● 09:30 James  [Completed][No-show]│ 11:30–12:15 Pim…     ● Confirmed   │
│ (empty → All caught up)           │ (closed → Closed today)            │
```

### D2 Calendar (week)
```
│ ‹ › [Today]          6 – 12 Oct                         [+ New booking]│
│       │ Mon 6 │ Tue 7 │ Wed 8 │ Thu 9 │ Fri 10│ Sat 11│ Sun 12│
│ 10:00 │┄┄┄┄┄┄┄│       │▌Conf. │       │       │       │░Closed│
│ 10:30 │┄Pend┄┄│       │▌      │       │       │       │░      │
│ 13:00 │░break░│░break░│░break░│░break░│░break░│░break░│░      │
│  → คลิกบล็อก = Drawer · คลิกช่องว่าง = New booking (เติมวัน)      │
```

### D3 Bookings
```
│ [Upcoming|Past|All]  [Status ▾]  [🔍 name / phone / ref]  [+ New]   │
│ Date   Time   Customer  Phone  Service  Price  Status   Ref         │
│ 10 Oct 14:00  Somchai…  081…   Haircut  ฿350   ○ Pending K7M2QX     │
```

### D4 Customers · D5 Services
```
│ [🔍 name / phone]                 │ Services           [+ Add service]│
│ Name  Phone  Visits No-show Spent │ Haircut / ตัดผม  45 min ฿350 [on]│
│ ▸ Somchai  081…  6   0   ฿2,100   │ Hot towel shave  45 min ฿300 [off]│
│   └ history rows → Drawer         │   Hidden from booking page   [Edit]│
```

### D6 Availability · D7 Settings
```
│ Mon [on]  10:00 ▾ – 20:00 ▾  Break [on] 13:00 ▾–14:00 ▾              │
│ …                                      Closed dates [date][Add]      │
│ ⚠ inline errors; [Save] disabled        • 19 Oct  ×                  │
│ Changes don't affect existing bookings.                              │
├──────────────────────────────────────────────────────────────────────┤
│ Shop profile: name · address · phone                                 │
│ Booking rules: interval · buffer · max advance · min notice  [Save]  │
│ Demo data: [Reset demo data] → Dialog                                │
```

### D8 Booking drawer (ขวา 420px) · D9 New / Reschedule dialog
```
┌─ K7M2QX ─────────── ✕ ┐     ┌─ New booking ───────────────┐
│ ○ Pending             │     │ Service ▾   Date [____]     │
│ Somchai K.            │     │ Times: [10:00][10:30]…      │
│ 081-234-5678          │     │ Name  Phone  Note           │
│ Haircut               │     │ ⚠ slot_taken (inline)       │
│ Sat 11 Oct 14:00–14:45│     │ [Cancel]        [Create]    │
│ ฿350 · Online         │     └─────────────────────────────┘
│ [Accept][Decline]     │      Reschedule = เฉพาะ Date + Times
│ [Reschedule][Cancel]  │
└───────────────────────┘
```
