# Design System — Minimalism (ขาว-ดำ + accent เขียวเดียว)

สไตล์อ้างอิง: "Minimalism & Swiss Style" (ผลค้น ui-ux-pro-max ยืนยัน: shadow none, single accent, grid-based, high contrast) — ผล `--design-system` อัตโนมัติ (Dark Mode OLED / Enterprise Gateway) ไม่ตรงโจทย์ จึงไม่ใช้

## Color tokens

| Token | Hex | ใช้กับ | Contrast บนขาว |
|---|---|---|---|
| `ink` | `#111111` | ข้อความหลัก, เส้น focus ฉุกเฉิน, ปุ่ม danger | 18.9:1 |
| `muted` | `#6B6B6B` | ข้อความรอง, label | 5.3:1 |
| `line` | `#E6E6E6` | เส้นขอบ 1px | — (ตกแต่ง) |
| `surface` | `#FAFAFA` | พื้นรอง, วันปิด, break, hover | — |
| `accent` | `#1F6F4A` | primary CTA, Confirmed, selected, focus ring | 6.12:1 (ขาวบน accent 6.12:1) |
| `accent-soft` | `#E8F1EC` | พื้นบล็อก Confirmed, selected bg | accent บน soft 5.31:1; muted บน soft 4.62:1 |

กฎ: ไม่มีสีที่สอง — ไม่ใช้แดง/เหลือง; สถานะต้องมี **รูปร่าง + ข้อความ** เสมอ (ไม่พึ่งสีอย่างเดียว)

## Typography

| Role | Family | หมายเหตุ |
|---|---|---|
| UI Latin | Inter Variable | |
| UI Thai | Noto Sans Thai (400/500/600) | ครอบคลุม glyph ไทย; stack: `Inter Variable, Noto Sans Thai, system-ui` |
| Reference code / เวลาที่ต้องไม่อ่านผิด | IBM Plex Mono 500 | zero มี slash/dot; ใช้เฉพาะตัวเลข/โค้ด ไม่ใส่ข้อความไทย |

| Style | Size / Line | Weight |
|---|---|---|
| Display (หัวข้อ landing, ref ใหญ่) | 32 / 40 | 600 |
| Title | 22 / 30 | 600 |
| Body | 16 / 24 (มือถือ), 14 / 20 (ตาราง dashboard) | 400 |
| Label / caption | 12 / 16 | 500 |
| Stat value | 28 / 32 | 600, tabular-nums |

แยก run ตัวเลขกับหน่วย (`45` mono-free + `นาที` UI) ไม่ผสมสคริปต์ใน run เดียวใน component ที่ใช้ mono

## Spacing / shape / elevation

- Base 4px; scale 4 · 8 · 12 · 16 · 24 · 32 · 48
- Radius `6px` (`rounded-md`) ทุก component; badge/pill ไม่ใช้
- Border 1px `line`; **ไม่มี shadow** ยกเว้น Dialog/Drawer `shadow-sm`
- Customer column `max-w-md` (448px) · Dashboard sidebar 232px · Drawer 420px
- Breakpoint: base (390) → `md` 768 → `lg` 1024 (sidebar) → ทดสอบ 1440

## Components

| Component | Spec |
|---|---|
| Button | `primary` / `secondary` / `ghost` / `danger` (ขอบ+ตัวอักษร ink); `md` สูง 44px (มือถือ touch ≥44), `sm` สูง 32px (dashboard เท่านั้น); icon-only ต้องมี `aria-label` |
| Input / Select / Textarea | สูง 44px, border line → focus border accent + ring; label มองเห็นเสมอ (ไม่ใช้ placeholder แทน label) |
| Field | label + ช่อง + error (ไอคอน `AlertCircle` + ข้อความ ink) ผูก `aria-describedby`, `aria-invalid` |
| StatusBadge | 12px/500 + สัญลักษณ์: Pending = วงแหวนกลวง ink · Confirmed = จุดทึบ accent + ตัวอักษร accent · Completed = จุดทึบ ink · Declined / Cancelled / No-show = ขีดสั้น muted + ตัวอักษร muted |
| Card | border line, ไม่มีพื้น, padding 16 |
| Dialog | overlay `black/20`, `role="dialog"` `aria-modal`, Esc / backdrop ปิด, โฟกัส element แรก, คืนโฟกัสเมื่อปิด |
| Drawer | ขวา 420px, พฤติกรรม a11y เท่า Dialog |
| Segmented | EN\|TH, Upcoming\|Past\|All; `role="tablist"` / `radiogroup` ตามบริบท |
| Stat | label muted 12px + ค่า 28px |
| EmptyState | ไอคอน line 24px muted + ประโยคเดียว + (ถ้ามี) 1 action |
| SlotButton | ขอบ line, selected = accent bg + ตัวอักษรขาว, ตัวเลขเวลา tabular-nums, สูง 44px |
| DayChip | วัน + เลขวัน; disabled แสดง label Closed/Full ใต้เลข |
| Calendar block | Pending = ขอบประ ink พื้นขาว · Confirmed = accent-soft + แถบซ้าย 3px accent · Completed/No-show = surface + ตัวอักษร muted |

Icons: lucide (เส้น 1.5px, 20px) ไม่ใช้ emoji; ไอคอนตกแต่ง `aria-hidden`

## Motion

150–200ms ease-out สำหรับ hover/focus/dialog fade; ไม่มี animation ตกแต่ง; `prefers-reduced-motion` → `transition: none`

## Accessibility checklist

- Contrast ข้อความ ≥ 4.5:1 (ตารางด้านบน)
- ทุก control เข้าถึงด้วยคีย์บอร์ด, focus ring มองเห็นเสมอ, ลำดับ tab ตามภาพ
- Touch target ≥ 44×44 บนหน้า Customer
- ข้อความ error อยู่ใกล้ field, ไม่ใช้สีอย่างเดียว
- Pending count บน nav มี `aria-label` ("3 pending")
- `html[lang]` เปลี่ยนตามภาษา
- ไม่มี horizontal scroll ที่ 390px (ยกเว้น day strip ที่ตั้งใจเลื่อน และ Calendar บนจอแคบ)

## i18n

- EN/TH dictionary แบบ typed; TH ต้องครบทุก key (compile-time)
- วันที่ไม่แสดงปี; เวลา 24 ชม.; ราคา `฿` ผ่าน `Intl.NumberFormat`
- ชื่อ Service: ช่อง TH ว่าง → fallback EN
