# Ash & Oak Barber

**ระบบจองคิวร้านตัดผมสำหรับเจ้าของคนเดียว** — ลูกค้าเลือกบริการกับเวลาที่ว่างจริงแล้วส่งคำขอจองเองจากมือถือ เจ้าของร้านเห็นทั้งวันในหน้าเดียว อนุมัติคำขอ บันทึกคิว walk-in และปิดงานได้โดยไม่ต้องมี backend

ทั้งสองฝั่งอยู่ในเว็บแอปตัวเดียว ไม่มี login ไม่มีฐานข้อมูลกลาง — หน้าแรกให้เลือกว่าจะเข้าเป็นลูกค้าหรือเจ้าของร้าน ข้อมูลเก็บใน `localStorage` เปิดสองแท็บเทียบกันแล้วเห็นการเปลี่ยนแปลงไหลข้ามแท็บทันที สลับ EN/TH ได้ทุกหน้า สไตล์ Minimalism ขาว-ดำ + accent เขียวเดียว

<img src="docs/screenshots/00-hero.png" width="900" alt="หน้า Today ของเจ้าของร้าน พร้อมหน้าจอมือถือของลูกค้า">

---

## สารบัญ

- [ภาพรวม](#ภาพรวม)
- [ฟีเจอร์](#ฟีเจอร์)
- [หน้าจอ](#หน้าจอ)
- [กฎการจอง](#กฎการจอง)
- [สถาปัตยกรรม](#สถาปัตยกรรม)
- [เริ่มใช้งาน](#เริ่มใช้งาน)
- [ข้อมูลเดโม](#ข้อมูลเดโม)
- [การทดสอบ](#การทดสอบ)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [เอกสาร](#เอกสาร)
- [ข้อจำกัดและหมายเหตุ](#ข้อจำกัดและหมายเหตุ)

---

## ภาพรวม

ร้านตัดผมที่เจ้าของคนเดียวรับคิวทางโทรศัพท์และแชต มีปัญหาซ้ำเดิมสามข้อ: คิวทับกันเพราะไม่มีใครเห็นตารางรวม, ลูกค้าต้องรอคำตอบก่อนจึงรู้ว่าได้เวลาไหน, และตอนสิ้นวันไม่มีบันทึกว่าใครมาใครไม่มา ระบบนี้แทนที่วงจรนั้นด้วยหน้าจอเดียวที่ทั้งสองฝ่ายใช้ร่วมกัน:

| บทบาท | อุปกรณ์ | สิ่งที่ทำได้ |
|---|---|---|
| **ลูกค้า** | มือถือ (390px) | เลือก Service → วัน/เวลา → กรอกชื่อกับเบอร์ → ตรวจทาน → ส่งคำขอ ได้ Reference code ไว้ตรวจสถานะและยกเลิกเอง |
| **เจ้าของร้าน** | เดสก์ท็อป (1440px) | Today, Calendar สัปดาห์, Bookings, Customers, Services, Availability, Settings — อนุมัติ/ปฏิเสธ, เพิ่ม Walk-in booking, Reschedule, ปิดงานเป็น Completed / No-show |
| **ผู้ชม (เดโม)** | เบราว์เซอร์ | เปิดหน้าแรกแล้วกดฝั่งไหนก็ได้ทันที มีข้อมูลตัวอย่างที่วันนี้เต็มวันเสมอ และกด Reset demo ได้ |

จุดที่ออกแบบมาให้ตรงกับงานจริงของร้าน:

- **เวลาไม่เคยทับ** — Slot ทุกช่องคำนวณจาก Service duration, เวลาเปิด–ปิด, break, buffer, minimum notice และ Closed date ชุดเดียวกันทั้งฝั่งลูกค้า ฝั่งเจ้าของ และตอนบันทึกจริง
- **ราคาและเวลาไม่เปลี่ยนย้อนหลัง** — การจอง snapshot duration กับราคาไว้ตอนสร้าง แก้ Service ทีหลังจึงไม่ทำให้ประวัติเพี้ยน
- **สถานะไปทางเดียว** — Pending → Confirmed → Completed ตามตารางที่กำหนดไว้ ไม่มีการกระโดดข้ามหรือย้อนกลับ
- **ไม่มีปุ่มที่กดแล้วพัง** — ปิดงานได้เฉพาะหลังเวลาเริ่ม, ยกเลิกได้เฉพาะก่อน deadline, ทุกอย่างที่ปิดไม่ได้จะอธิบายว่าทำไม

---

## ฟีเจอร์

### ลูกค้า (มือถือ)

- จอง 4 ขั้นตอนพร้อมตัวบอกความคืบหน้า (`Step n of 4`): Service → วันและเวลา → ข้อมูลติดต่อ → ตรวจทาน
- Day strip เลื่อนดูวันได้ถึงขอบเขตที่ร้านตั้งไว้ วันปิดร้านขึ้นป้าย `Closed` วันเต็มขึ้น `Full` — ไม่ซ่อนและไม่พึ่งสีอย่างเดียว
- แสดงเฉพาะ Slot ที่ใส่ Service นี้แล้วพอดี: ไม่ล้นเวลาปิดร้าน, ไม่ทับ break, ไม่ทับคิวที่ถืออยู่, ไม่เร็วเกิน minimum notice
- ฟอร์มตรวจชื่อ 2–60 ตัวอักษร, เบอร์ 10 หลักขึ้นต้นด้วย `0`, โน้ตไม่เกิน 200 ตัวอักษร — error อยู่ติดช่องและโฟกัสช่องแรกที่ผิด
- ได้ Reference code 6 ตัว (ตัด `O`, `I`, `0`, `1` ออกเพื่อไม่ให้อ่านผิด) ไว้ตรวจสถานะด้วย code + เบอร์โทร
- หน้ายืนยันบอกชัดว่าร้านต้องกดยืนยันก่อน ไม่ใช่ยืนยันอัตโนมัติ
- สถานะเปลี่ยนเองเมื่อเจ้าของกดรับในอีกแท็บ ไม่ต้อง refresh; ยกเลิกได้เอง จนถึง deadline ถ้าเลยแล้วจะบอกเบอร์ร้านให้โทรแทน

### เจ้าของร้าน (เดสก์ท็อป)

| หน้า | ทำอะไรได้ |
|---|---|
| **Today** | ตัวเลข 4 ตัว (คิววันนี้, คำขอรอยืนยัน, รายได้คาดการณ์, คิวถัดไป) + Needs action + ตารางคิวทั้งวันเรียงตามเวลา |
| **Calendar** | สัปดาห์จันทร์–อาทิตย์ เลื่อนสัปดาห์ก่อน/ถัดไป/วันนี้ บล็อกคิวแยกสีตามสถานะ วันปิดและ break แรเงา คลิกบล็อกเปิดดีเทล คลิกช่องว่างสร้างคิว |
| **Bookings** | ตารางทั้งหมด แท็บ Upcoming/Past/All กรองตามสถานะ ค้นด้วยชื่อ เบอร์ หรือ Reference code |
| **Customers** | ลูกค้าที่ derive จากประวัติการจอง (จำนวนครั้ง, no-show, ยอดใช้จ่าย, ครั้งล่าสุด, คิวกัดไป) กดแถวเพื่อกางประวัติ |
| **Services** | เพิ่ม/แก้ไข (ชื่อ EN บังคับ, ชื่อ TH ไม่บังคับ, ระยะเวลา, ราคา) ซ่อนจากหน้าจองได้โดยไม่ลบ |
| **Availability** | เวลาเปิด–ปิดและ break ของทั้ง 7 วัน พร้อมรายการ Closed date |
| **Settings** | ข้อมูลร้าน, กฎการจอง (slot interval, buffer, จองล่วงหน้าได้กี่วัน, แจ้งล่วงหน้ากี่ชั่วโมง), Reset demo |

- รับ/ปฏิเสธคำขอได้จาก Needs action ในแถวเดียว และปิดงานเป็น Completed / No-show ได้หลังเวลาเริ่มเท่านั้น (ก่อนหน้านั้นปุ่มปิดพร้อม tooltip)
- Walk-in booking ที่เจ้าของสร้างเป็น Confirmed ทันที ไม่ติด minimum notice/advance limit แต่ยังกันการทับคิว
- Reschedule ผ่าน dialog ที่เสนอเฉพาะเวลาว่าง (นับเวลาของคิวนั้นเองว่าว่าง) และคงสถานะเดิมไว้
- ดีเทลการจองเป็น drawer อันเดียวกันทุกหน้า เปิดผ่าน query parameter

### ภาษาและการออกแบบ

- สลับ EN/TH ได้ทุกหน้าและจำภาษาไว้หลัง refresh — dictionary 283 คีย์ต่อภาษา ตรวจความครบตอน compile
- วันที่ ตัวเลข และราคา (฿) แสดงตามภาษา; เวลาเป็น 24 ชั่วโมง `HH:mm` ทุกจุด (ใช้ `TimeSelect` ของโปรเจกต์ ไม่ใช้ `<input type="time">` ที่ browser จะโชว์ AM/PM ตาม locale)
- สไตล์ minimalism: ink `#111111`, เส้น 1px `#E6E6E6`, accent เดียว `#1F6F4A`, ไม่มีเงายกเว้น dialog/drawer
- ฟอนต์ Inter + Noto Sans Thai (UI) และ IBM Plex Mono (เวลาและ Reference code ที่อ่านผิดไม่ได้)
- คีย์บอร์ดใช้ได้ทั้งแอป, focus ring มองเห็นเสมอ, dialog ปิดด้วย Esc, error ผูกด้วย `aria-describedby`

---

## หน้าจอ

ภาพทั้งหมดถ่ายจากแอปที่ build แล้วรันจริงบนเครื่องนี้ ที่ `deviceScaleFactor: 2` (มือถือ 390×844, เดสก์ท็อป 1440×900) ไม่ใช่ mockup — ข้อมูลข้างในคือ seed ของเดโม

### ลูกค้า — จองจบในมือถือ

| เลือกบริการ | วันและเวลา | กรอกข้อมูล |
|---|---|---|
| <img src="docs/screenshots/02-book-service.png" width="240" alt="เลือกบริการ"> | <img src="docs/screenshots/03-book-date.png" width="240" alt="เลือกวันและเวลา"> | <img src="docs/screenshots/04-book-details.png" width="240" alt="กรอกข้อมูลติดต่อ"> |

| ตรวจทาน | ได้ Reference code | ตรวจสถานะภายหลัง |
|---|---|---|
| <img src="docs/screenshots/05-book-review.png" width="240" alt="ตรวจทานก่อนส่ง"> | <img src="docs/screenshots/06-book-done.png" width="240" alt="หน้าได้รับ Reference code"> | <img src="docs/screenshots/07-my-booking.png" width="240" alt="ตรวจสถานะการจอง"> |

### เจ้าของร้าน — Today และการรับคำขอ

<img src="docs/screenshots/08-owner-today.png" width="900" alt="หน้า Today ของเจ้าของร้าน">

| คำขอรออนุมัติ (drawer) | ปฏิทินสัปดาห์ | เพิ่ม Walk-in / Reschedule |
|---|---|---|
| <img src="docs/screenshots/11-owner-accept-request.png" width="290" alt="ดีเทลคำขอที่รออนุมัติ"> | <img src="docs/screenshots/09-owner-calendar.png" width="290" alt="ปฏิทินสัปดาห์"> | <img src="docs/screenshots/12-owner-new-booking.png" width="290" alt="dialog เพิ่มการจอง"> |

### เจ้าของร้าน — งานจัดการ

| Bookings | Customers | Services |
|---|---|---|
| <img src="docs/screenshots/10-owner-booking-drawer.png" width="290" alt="รายการจองและ drawer"> | <img src="docs/screenshots/13-owner-customers.png" width="290" alt="ลูกค้าและประวัติ"> | <img src="docs/screenshots/14-owner-services.png" width="290" alt="จัดการบริการ"> |

| Availability | Settings |
|---|---|
| <img src="docs/screenshots/15-owner-availability.png" width="440" alt="เวลาทำการ"> | <img src="docs/screenshots/16-owner-settings.png" width="440" alt="ตั้งค่าและกฎการจอง"> |

### สองภาษา

| หน้าแรก (EN) | หน้าแรก (TH) |
|---|---|
| <img src="docs/screenshots/01-landing.png" width="240" alt="หน้าแรกภาษาอังกฤษ"> | <img src="docs/screenshots/17-landing-th.png" width="240" alt="หน้าแรกภาษาไทย"> |

<img src="docs/screenshots/18-owner-today-th.png" width="900" alt="หน้า Today ภาษาไทย">

วิดีโอจากเดโมเดียวกัน: [`demo-flow.mp4`](docs/portfolio/demo-flow.mp4) (36 วินาที — ลูกค้าจองบนมือถือ → เจ้าของกดรับ → เวลาที่ถูกจองหายจากตัวเลือก) และ [`promo.mp4`](docs/portfolio/promo.mp4) (96 วินาที พร้อมสไลด์เล่าเรื่อง)

---

## กฎการจอง

สถานะ 6 แบบ และทางเดินที่ระบบยอมให้:

| สถานะ | ไปต่อได้ | ถือเวลาไว้ไหม |
|---|---|---|
| Pending | Confirmed, Declined, Cancelled | ใช่ |
| Confirmed | Completed, No-show, Cancelled | ใช่ |
| Completed | — | ใช่ |
| Declined / Cancelled / No-show | — | ไม่ (คืน Slot) |

- Cancelled โดยลูกค้าได้เฉพาะ Pending/Confirmed และเฉพาะเมื่อเวลาเริ่มยังห่างเกิน minimum notice ที่ตั้งไว้
- Completed/No-show บันทึกได้ตั้งแต่เวลาเริ่มผ่านไปแล้ว
- Service ที่แก้ไขไม่กระทบการจองเก่า เพราะ duration กับราคาถูก snapshot ตอนสร้าง
- เบอร์โทรเก็บเป็นตัวเลขล้วน ตรวจรูปแบบ 10 หลักขึ้นต้น `0` แสดงเป็น `081-234-5678`
- Pending ไม่หมดอายุอัตโนมัติ — เจ้าของต้องจัดการเอง (ตั้งใจให้ตรงกับการทำงานจริงของร้านเล็ก)

---

## สถาปัตยกรรม

```mermaid
flowchart TB
  C[ลูกค้า]
  O[เจ้าของร้าน]
  R["React + HashRouter"]
  P["pages/"]
  S["AppStore"]
  D["domain/"]
  L[("localStorage")]

  C --> R
  O --> R
  R --> P
  P --> S
  S --> D
  S --> L
  L -. storage event .-> S
```

สามชั้นแยกกันชัด: **domain** เป็น TypeScript ล้วนไม่มี React (คำนวณ Slot, ตรวจ transition, สถิติ, seed) → **store** ถือ state และเขียนลง `localStorage` → **UI** เป็นหน้าจอสองชุดที่ใช้ store เดียวกัน เพราะตรรกะทั้งหมดอยู่ชั้นล่าง การทดสอบจึงไม่ต้องเปิดเบราว์เซอร์

- **ไม่มี backend** — ทุกอย่างรันในแท็บ ข้อมูลอยู่รอดหลัง refresh และ sync ข้ามแท็บด้วย `storage` event (เปิดลูกค้ากับเจ้าของคนละแท็บแล้วเห็นกันทันที)
- **HashRouter** — route อยู่ใน `#` จึงวางบน static host อะไรก็ได้โดยไม่ต้องตั้ง rewrite rule
- **แหล่งความจริงเดียวของ Slot** — `getAvailableSlots()` เรียกจากหน้าจอง, dialog ของเจ้าของ และ store ก่อนบันทึกจริง ถ้าคิวถูกแย่งไประหว่างนั้น store ตอบ `slot_taken`
- **เวลาสด** — `useNow()` ต่ออายุทุกนาที หน้าจอที่ขึ้นกับเวลาจึงไม่ค้างอยู่ที่ค่าเก่า

| ชั้น | เทคโนโลยี |
|---|---|
| UI | React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · lucide-react |
| Routing | `react-router` (`HashRouter`) |
| วันที่ | `date-fns` (locale `en` / `th`) |
| ฟอนต์ | `@fontsource` — Inter Variable, Noto Sans Thai, IBM Plex Mono |
| Tests | Vitest (Node environment, colocated `*.test.ts`) |
| Lint | oxlint |
| State | `localStorage` คีย์ `bookingsaas.state.v1` |

Design tokens ที่ใช้ทั้งแอป (รายละเอียดใน [`docs/design/04-design-system.md`](docs/design/04-design-system.md)):

| Token | ค่า | ใช้กับ |
|---|---|---|
| `ink` | `#111111` | ข้อความหลัก, ปุ่ม danger |
| `muted` | `#6B6B6B` | ข้อความรอง, label |
| `line` | `#E6E6E6` | เส้นขอบ 1px |
| `surface` | `#FAFAFA` | พื้นรอง, วันปิด, break |
| `accent` | `#1F6F4A` | primary CTA, Confirmed, selected, focus ring |
| `accent-soft` | `#E8F1EC` | พื้นบล็อก Confirmed |

---

## เริ่มใช้งาน

ต้องมี Node.js `^20.19.0` หรือ `>=22.12.0` (ตามที่ Vite 8 กำหนด) — ไม่ต้องมี Docker, ฐานข้อมูล หรือ account ใด ๆ

```bash
npm install
npm run dev
```

เปิด **<http://localhost:5173>** แล้วเลือก **Book as customer** หรือ **Open owner dashboard**

คำสั่งที่เหลือ:

```bash
npm run build      # tsc -b && vite build → dist/
npm run preview    # เสิร์ฟ dist/ ที่ build แล้ว (http://localhost:4173)
npm test           # vitest run
npm run lint       # oxlint
```

ลองแบบเห็นภาพเร็วที่สุด: เปิดสองแท็บ — แท็บหนึ่ง `#/book` จองคิว 1 รายการ อีกแท็บ `#/dashboard/today` คำขอจะโผล่ใน Needs action ทันที กด Accept แล้วกลับไปดูแท็บลูกค้า สถานะเปลี่ยนเป็น Confirmed เอง

---

## ข้อมูลเดโม

- Seed สร้างจาก "ตอนนี้" ทุกครั้ง: วันนี้เปิดร้านและมีคิวเต็มวัน มีคำขอ Pending ค้างอยู่ และมีคิวที่เลยเวลาเริ่มแล้วรอปิดงาน — dashboard จึงดูมีงานตั้งแต่เปิดครั้งแรก
- ร้านสมมติ "Ash & Oak Barber", Service 5 รายการที่เปิดใช้ + 1 ที่ซ่อนไว้, ลูกค้า 10 คน และคิวตั้งแต่ 14 วันก่อนถึง 7 วันข้างหน้า
- ถาวรที่คีย์ `bookingsaas.state.v1`; กด **Reset demo data** ใน Settings เพื่อกลับไปข้อมูลตัวอย่าง
- ชื่อร้าน ที่อยู่ บริการ ราคา และลูกค้าเป็นข้อมูลสมมติทั้งหมด ไม่มีข้อมูลของร้านจริง

---

## การทดสอบ

```bash
npx tsc -b        # ผ่าน ไม่มี error
npx vitest run    # 3 ไฟล์ 19 tests ผ่านทั้งหมด
npm run build     # ผ่าน (JS ~426 kB / gzip ~124 kB)
npx oxlint        # 13 warnings (react-hooks exhaustive-deps / purity) ไม่มี error
```

ชุดทดสอบครอบคลุม seam เดียวคือ `src/domain/` ซึ่งเป็นตรรกะที่ผิดแล้วเจ็บจริง: การคำนวณ Slot (วันปิด, break, ล้นเวลาปิดร้าน, buffer, notice, advance, คิวที่ถูกยกเลิก), ตาราง transition, หน้าต่างการยกเลิกของลูกค้า, Reference code และเบอร์โทร, สถิติ Today และ invariant ของ seed ส่วน UI ตรวจด้วยการเดิน flow จริงในเบราว์เซอร์: จองครบ 4 ขั้นจนได้ Reference code → เจ้าของกด Accept ในอีกแท็บ → ลูกค้าเห็นสถานะ Confirmed → ยกเลิกแล้ว Slot กลับมาว่าง → สลับภาษาไทยแล้วข้อความ วันที่ และสถานะเปลี่ยนตาม

---

## โครงสร้างโปรเจกต์

```
src/
  domain/        ตรรกะล้วน ไม่มี React: slots, booking transitions, stats, customers, seed, time (+ *.test.ts)
  store/         AppStore (localStorage + cross-tab sync), useNow
  pages/
    customer/    Landing, BookFlow (4 steps), BookDone, MyBooking, NotFound
    dashboard/   Today, Calendar, Bookings, Customers, Services, Availability, Settings
  components/
    ui/          Button, Form (Input/Select/TimeSelect), DatePicker, Overlay, StatusBadge, Switch
    booking/     BookingDrawer, dialogs, CustomerFields, DateSlots
  i18n/          dictionary EN/TH แยกตามหมวด (283 keys, ตรวจความครบตอน compile)
  layouts/       CustomerLayout, DashboardLayout
docs/
  screenshots/   ภาพจากแอปจริงที่ใช้ใน README นี้
  design/        user flow, wireframes, screen states, design system + ภาพบอร์ด
  portfolio/     สไลด์ PDF วิดีโอ และชุดนำเสนอ portfolio
barber-booking/  spec.md + issues/ (ticket 01–12)
GLOSSARY.md      คำในโดเมน (Shop, Owner, Customer, Booking, Slot, …)
```

---

## เอกสาร

| ไฟล์ | เนื้อหา |
|---|---|
| [`barber-booking/spec.md`](barber-booking/spec.md) | ข้อกำหนดเชิงพฤติกรรมทั้งหมด: problem, 71 user stories, implementation & testing decisions, out of scope |
| [`barber-booking/issues/`](barber-booking/issues) | ticket 01–12 ที่ลงมือทำตามลำดับ พร้อมหลักฐานการตรวจรับ |
| [`GLOSSARY.md`](GLOSSARY.md) | คำในโดเมนและคำที่ห้ามใช้ (เช่น "Booking" ไม่ใช่ "appointment") |
| [`docs/design/`](docs/design) | user flow + sitemap, wireframes, screen states, design system |
| [`docs/portfolio/guide.md`](docs/portfolio/guide.md) | ชุดนำเสนอ portfolio: ไฟล์ไหนใช้ทำอะไร และตัวเลขในสไลด์มาจากไหน |

---

## ข้อจำกัดและหมายเหตุ

- **เดโม ไม่ใช่ระบบใช้งานจริง** — ไม่มี backend, ฐานข้อมูล, login หรือ multi-shop ข้อมูลอยู่เฉพาะในเบราว์เซอร์เครื่องนั้น และหายทันทีถ้าล้าง site data
- **ไม่มี Integrations** — ไม่มีการแจ้งเตือน SMS/LINE/อีเมล, การชำระเงิน, มัดจำ หรือปฏิทินภายนอก
- **ลูกค้าเลื่อนนัดเองไม่ได้** (เจ้าของเท่านั้น), ปฏิทินไม่มี drag-and-drop, ไม่มีคิวจองซ้ำ
- **Pending ไม่หมดอายุอัตโนมัติ** และ Service ถูกลบไม่ได้ (ซ่อนได้) — ตั้งใจให้ตรงกับ workflow ร้านเล็ก
- **ไม่มีปีในวันที่และไม่เลือก timezone** — ใช้เวลาของเบราว์เซอร์ตรง ๆ
- **ตัวเลขในเดโมเป็นสิ่งที่ระบบทำได้ ไม่ใช่ผลลัพธ์ทางธุรกิจ** — วัดตอนอัดวิดีโอ: ลูกค้าจองครบ 6 แตะ (จองวันอื่น +1), เจ้าของกดรับ 1 แตะ, ชุดทดสอบ 19 ข้อผ่าน เดโมนี้ยังไม่มีผู้ใช้จริง จึงไม่มีตัวเลขรายได้หรือเวลาที่ประหยัดได้
- repo นี้ไม่มีไฟล์ `LICENSE` — สงวนลิขสิทธิ์โดยผู้เขียน ใช้เป็นผลงานอ้างอิง/พอร์ตโฟลิโอ
