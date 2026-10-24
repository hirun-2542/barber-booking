# User Flow & Sitemap

อ้างอิง: `barber-booking/spec.md` · ศัพท์ตาม `GLOSSARY.md` (Booking, Slot, Owner, Customer, ...)

## Personas

| Persona | บริบท | เป้าหมายหลัก |
|---|---|---|
| Customer | มือถือ 390px, เข้าครั้งเดียวผ่านลิงก์ | จองเวลาที่ว่างจริง ได้ Reference code ตรวจ/ยกเลิกได้ |
| Owner | จอใหญ่ที่หน้าร้าน, บางครั้งมือถือ | เห็นภาพรวมวัน, อนุมัติ request, ไม่ทับคิว |
| Portfolio viewer | ผู้ชมที่ลองกดเล่น | เข้าถึงทั้งสองฝั่งภายใน 1 คลิก |

## Sitemap

```mermaid
flowchart TD
  L["/ Landing"] --> B["/book — Book flow (4 steps)"]
  L --> M["/my-booking — Check booking"]
  L --> D["/dashboard"]
  B --> BD["/book/done/:ref"]
  BD --> M
  D --> T["today"]
  D --> C["calendar"]
  D --> BK["bookings"]
  D --> CU["customers"]
  D --> S["services"]
  D --> A["availability"]
  D --> ST["settings"]
  T -. "?booking=id" .-> DR(["Booking drawer"])
  C -. "?booking=id" .-> DR
  BK -. "?booking=id" .-> DR
  CU -. "?booking=id" .-> DR
  DR --> RS(["Reschedule dialog"])
  T --> NB(["New booking dialog"])
  C --> NB
  BK --> NB
```

| Route | Layout | ผู้ใช้ | หมายเหตุ |
|---|---|---|---|
| `/` | Customer | ทุกคน | เลือกฝั่ง |
| `/book` | Customer | Customer | step ใน component state (ไม่มี route ต่อ step) |
| `/book/done/:ref` | Customer | Customer | ไม่เจอ ref → copy แบบ not found |
| `/my-booking?ref=` | Customer | Customer | prefill ref |
| `/dashboard/today` … `/settings` | Dashboard | Owner | 7 หน้า, nav ซ้าย (≥ lg) หรือแถบเลื่อนด้านบน |
| `?booking=<id>` บนทุกหน้า dashboard | — | Owner | Drawer เดียวใช้ทุกหน้า → deep link ได้ |
| `*` | Customer | ทุกคน | Not found + ลิงก์กลับ `/` |

## Flow 1 — Customer จองคิว

```mermaid
flowchart TD
  S([เข้า Landing]) --> A["กด Book as customer"]
  A --> B1["1 Service: เลือกบริการ (active เท่านั้น)"]
  B1 --> B2["2 Date & time: เลือกวัน → เลือก Slot"]
  B2 -->|ไม่มี Slot วันนั้น| E1["Empty state: No times available → เลือกวันอื่น"]
  E1 --> B2
  B2 --> B3["3 Details: name / phone / note"]
  B3 -->|validation ไม่ผ่าน| V["Error ใต้ field + โฟกัส field แรกที่ผิด"]
  V --> B3
  B3 --> B4["4 Review: สรุป + 'The shop will confirm'"]
  B4 --> SUB["กด Request booking"]
  SUB -->|slot_taken| R["กลับ step 2 + banner 'That time was just taken'"]
  R --> B2
  SUB -->|สำเร็จ: Pending| DONE["/book/done/:ref — Request sent + Reference code"]
  DONE --> MY["Check my booking"]
```

## Flow 2 — Customer ตรวจ / ยกเลิก

```mermaid
flowchart TD
  S([กรอก ref + phone]) -->|ไม่ตรง| NF["'No booking matches that code and phone number.'"]
  NF --> S
  S -->|ตรง| ST{"status"}
  ST -->|pending / confirmed| W{"start ≥ now + minNotice?"}
  W -->|ใช่| CB["ปุ่ม Cancel booking → Dialog ยืนยัน → Cancelled (Slot ว่างคืน)"]
  W -->|ไม่| CALL["ข้อความ: Cancellations close N h before… โทรร้าน"]
  ST -->|declined| DC["อธิบาย + ลิงก์ Book again"]
  ST -->|cancelled / completed / no_show| INFO["แสดงสถานะ + สรุป (read-only)"]
```

Status เปลี่ยนสดเมื่อ Owner กดอนุมัติ (storage event) — ไม่ต้อง refresh

## Flow 3 — Owner ประจำวัน

```mermaid
flowchart TD
  S([Open owner dashboard]) --> T["Today: 4 ตัวเลข + Needs action"]
  T --> P{"รายการ"}
  P -->|Pending| AD["Accept → Confirmed / Decline (Dialog) → Declined"]
  P -->|Confirmed เลย start| OC["Completed / No-show"]
  T --> NB["New booking (Walk-in) → Confirmed ทันที"]
  T --> CAL["Calendar: คลิกบล็อก → Drawer / คลิกช่องว่าง → New booking"]
  CAL --> DR["Drawer: Reschedule (dialog) / Cancel (Dialog)"]
  NB -->|ชน Slot| ER["error inline + refresh Slots"]
```

## Flow 4 — Owner ตั้งค่า

```mermaid
flowchart LR
  SV["Services: Add/Edit/Hide"] --> AV["Availability: hours, break, Closed dates"]
  AV --> SE["Settings: profile + Booking rules"]
  SE --> RS["Reset demo data (Dialog ยืนยัน)"]
```

การเปลี่ยน Availability/Settings/Service **ไม่แตะ** Booking เดิม (Booking เก็บ snapshot duration/price)

## Booking status machine

```mermaid
stateDiagram-v2
  [*] --> Pending: Customer request
  [*] --> Confirmed: Owner Walk-in
  Pending --> Confirmed: Accept
  Pending --> Declined: Decline
  Pending --> Cancelled: Cancel
  Confirmed --> Completed: หลัง start
  Confirmed --> NoShow: หลัง start
  Confirmed --> Cancelled: Cancel
```

Pending/Confirmed/Completed ถือครอง Slot · Declined/Cancelled/No-show ปล่อย Slot
