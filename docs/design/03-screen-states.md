# Screen States

ทุกหน้าที่ดึงข้อมูลจาก store ต้องรองรับสถานะตามตาราง (ไม่มี network จึงไม่มี loading ยกเว้น state ของปุ่ม submit ที่ debounce สั้น ๆ ไม่จำเป็น — ผล submit เป็นแบบ synchronous)

## Customer

| Screen | Default | Empty | Error / Validation | Success | Edge |
|---|---|---|---|---|---|
| Landing | 2 CTA + link | — | — | — | — |
| Book 1 Service | radio cards | ไม่มี active service → "No services available right now" + call shop | — | เลือกแล้ว Continue enabled | เปลี่ยน service → ล้าง date/time |
| Book 2 Date & time | day strip + slot grid | วันนั้นไม่มี Slot → "No times available on this day" | `slot_taken` banner ด้านบน | เลือก Slot แล้ว Continue enabled | วัน Closed / Full = disabled + label (ไม่ใช้สีอย่างเดียว) |
| Book 3 Details | ฟอร์ม | — | name 2–60, phone 10 หลักขึ้นต้น 0, note ≤200; error ใต้ field พร้อมไอคอน, โฟกัส field แรกที่ผิด | — | phone รับ `081-234-5678` แล้ว normalize |
| Book 4 Review | สรุป | — | `slot_taken` → กลับ step 2 | → `/book/done/:ref` | กด submit ซ้ำไม่สร้างซ้ำ (ปุ่ม disabled หลังกด) |
| Done | Pending + ref | ref ไม่พบ → NotFound copy | — | — | — |
| My booking | ฟอร์มค้นหา | — | "No booking matches that code and phone number." | การ์ดสถานะ | เลย cancellation window → ข้อความโทรร้าน; terminal status → read-only |

ข้อความสถานะใน My booking: Pending "Waiting for the shop to confirm." · Confirmed "See you soon." · Declined "The shop couldn't take this booking. Please choose another time." · Cancelled "This booking was cancelled." · Completed "Thanks for visiting." · No-show "This booking was marked as a no-show."

## Owner

| Screen | Default | Empty | Error | Edge |
|---|---|---|---|---|
| Today | 4 Stat + 2 รายการ | Needs action ว่าง → "All caught up"; ไม่มีคิว → "No bookings today"; Next up ว่าง → "No upcoming bookings" | — | วันนี้ปิด → "Closed today"; Mark outcome disabled ก่อน start + tooltip |
| Calendar | week grid | สัปดาห์ไม่มีวันเปิด → แกนเวลา 09:00–20:00 + ทุกคอลัมน์ Closed | — | คิว overlap ไม่เกิด (กันที่ Slot); จอแคบ → scroll แนวนอน (min 840px) |
| Bookings | ตาราง | ไม่ตรงตัวกรอง → EmptyState "No bookings match" + ปุ่ม Clear filters | — | tab Upcoming/Past ตาม start vs now |
| Customers | ตาราง | ไม่มี → "No customers yet" | — | แถวขยายแสดงประวัติ |
| Services | list | ไม่มี → "No services yet" + Add | EN name ว่าง / duration / price นอกช่วง → error ใต้ field | inactive = muted + "Hidden from booking page" |
| Availability | 7 แถว | — | start ≥ end, break นอกช่วง → error inline + Save disabled | Closed date ซ้ำ → ไม่เพิ่ม; วันอดีตซ่อน |
| Settings | 2 section | — | shop name ว่าง / phone ผิด / ช่วงตัวเลขเกิน | Reset demo ต้องยืนยัน Dialog |
| Booking drawer | ตามสถานะ | id ไม่พบ → ปิด drawer + ลบ query | — | terminal status → ไม่มีปุ่ม action |
| Dialog New/Reschedule | ฟอร์ม + Slots | วันนั้นไม่มี Slot → empty copy | `slot_taken` inline + refresh | owner mode ไม่ติด notice/advance |

## ปุ่ม action ต่อสถานะ (Drawer)

| Status | Actions |
|---|---|
| Pending | Accept · Decline* · Reschedule · Cancel* |
| Confirmed | Mark completed† · Mark no-show† · Reschedule · Cancel* |
| Declined / Cancelled / Completed / No-show | — |

\* ต้องผ่าน confirm Dialog · † disabled จนถึงเวลา start (tooltip "Available after start time")

## Interaction states ของ component

| Component | default | hover | focus-visible | active | disabled |
|---|---|---|---|---|---|
| Button primary | accent bg, ขาว | accent เข้มขึ้น 8% | ring 2px accent/40 offset 2 | ลด 2% | opacity 40%, `cursor-not-allowed` |
| Button secondary | border line | bg surface | ring เดียวกัน | bg `#F0F0F0` | opacity 40% |
| Slot button | border line | border ink | ring | selected = accent bg ขาว | `░` พื้น surface + ขีดฆ่าไม่ใช้ (ใช้ label) |
| Card option | border line | border ink | ring | selected = border accent 2px + check icon | — |
| Table row | — | bg surface | ring inset | — | — |

ทุก transition 150–200ms, `prefers-reduced-motion: reduce` → ปิด transition
