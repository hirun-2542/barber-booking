# Glossary

- **Shop** — the single business taking bookings, run by one Owner. _Avoid_: store, business account
- **Owner** — the one person who runs the Shop and uses the dashboard; also the only provider. _Avoid_: admin, staff, barber (as a role)
- **Customer** — a person who books, identified by phone number. _Avoid_: client, user, guest
- **Service** — something the Shop offers, with a duration and price; can be hidden from booking. _Avoid_: product, treatment, menu item
- **Booking** — one Customer's reserved time for one Service. _Avoid_: appointment, reservation, queue item
- **Booking request** — a Booking a Customer made online, which starts as Pending
- **Walk-in booking** — a Booking the Owner adds directly; it starts as Confirmed. _Avoid_: manual booking
- **Pending / Confirmed / Declined / Cancelled / Completed / No-show** — Booking statuses; Pending, Confirmed and Completed hold the time; Declined is the Owner refusing a request; Cancelled is withdrawn by either side; Completed and No-show are outcomes recorded after the start time
- **Reference code** — the short code a Customer uses, with their phone, to find their Booking. _Avoid_: booking ID, ticket
- **Slot** — a start time a Booking for a given Service can take. _Avoid_: queue, timeslot
- **Opening hours** — the weekly open/close times and break per weekday. _Avoid_: schedule, shifts
- **Closed date** — a specific date the Shop is closed despite Opening hours. _Avoid_: holiday, day off
- **Booking rules** — slot interval, buffer, minimum notice and how far ahead Customers can book
- **Reschedule** — the Owner moving a Booking to another Slot without changing its status
