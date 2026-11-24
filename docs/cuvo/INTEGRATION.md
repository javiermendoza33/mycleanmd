# The Labo Method × Cuvo Health (Grow plan) — integration design

Written Nov 23 2026 from Cuvo's public contract (`cuvo-integrations-openapi.yaml`, 110 operations, downloaded from
developers.cuvo.co/docs/openapi.yaml) before we have a sandbox key. Javier signs up for **Grow** ($15,000 setup + $2,500/mo +
$25 per completed consult; API, webhooks, MCP, live video, EPCS/TRT, labs, CRM sync). Test keys are `cuvo_sk_test_…`, live
`cuvo_sk_live_…`, base `https://api.cuvo.co`, bearer auth, every write carries an idempotency header, errors are
`application/problem+json`.

## Who holds what
- **Cuvo = the EMR / system of record for PHI**: patients, consents, intake answers, cases, prescriptions, orders, labs, visits,
  messages. Cuvo signs the BAA and runs the licensed clinicians (or Monika as a bring-your-own clinician).
- **thelabomethod.com = the brand**: marketing, program choice, the sign-up experience, payment (Stripe settles to our own
  merchant account), and a patient portal that *renders* Cuvo data. Our database keeps only the account (Supabase auth) and
  the mapping `user_id → cuvo patient id (pat_…)` plus case ids and payment state. No intake answers or clinical data are
  stored on our side once Cuvo is live (today's `labo_*` intake tables are retired for the Method).

## The patient flow (what the landing page drives)
| Step | On our site | Cuvo call |
|---|---|---|
| 1 Choose a program | /programs → "Get started" | `GET /v1/states` (serve CA + WA only), `GET /v1/question_sets` (the published intake for that treatment) |
| 2 Quick check | state, age, sex at birth, goal — no account yet | none (we refuse out-of-state before any PHI) |
| 3 Account | email + password (Supabase auth) | none |
| 4 Patient | name, DOB, phone, shipping address | `POST /v1/patients` (`external_id` = our user id) |
| 5 Consents | telehealth + privacy, versioned text we show | `POST /v1/patients/{id}/consents` ×2 (`kind: telehealth` / `privacy`) |
| 6 Intake | questions rendered from the set (`QuestionSetQuestion`), answers typed boolean / number / string / choice | kept client-side until step 8 |
| 7 Pay | Stripe Checkout, program price | — |
| 8 File the case | after `checkout.session.completed` | `POST /v1/cases` with `patient`, `question_set {id, version}`, `answers[]`, `requested_medications[]` (formulary ids from `GET /v1/medications`), `consent_ids`, `external_id` = our order id. `hold: true` is the alternative if we file before payment and `POST /v1/cases/{id}/release_hold` on paid |
| 9 Visit (when the clinician needs one) | portal shows slots | `GET /v1/visits/slots` → `POST /v1/visits` → `GET /v1/visits/{id}/join` (short-lived link) |
| 10 Labs | portal shows the order, the patient picks walk-in / Tasso kit / nurse | `POST /v1/lab_orders`, `GET …/collection_options`, `GET /v1/lab_consents`, `POST …/confirm`; results via `GET /v1/lab_results/{id}` (values + PDF link) |
| 11 Plan + shipping | portal timeline | read-only: `GET /v1/cases/{id}/prescriptions`, `…/orders`, `GET /v1/orders/{id}` |
| 12 Messages | portal thread | `GET/POST /v1/cases/{id}/messages` (as the patient) |

Case statuses: `received → queued → in_review → (visit_required | waiting_on_patient | waiting_on_integration) → approved | declined | cancelled | withdrawn`.
Order statuses arrive as events: `order.created → order.at_pharmacy → order.shipped → order.delivered` (or `blocked` / `failed`; retail: `ready_for_pickup` / `picked_up`).

## Webhooks → the portal timeline
One endpoint `POST /api/labo/cuvo/webhook` registered with `POST /v1/webhook_endpoints` (HMAC-SHA256, timestamped; secret shown once;
rotate keeps the old one 24 h). Subscribe to: `case.*`, `prescription.*`, `order.*`, `lab_order.*`, `lab_result.final.v1`, `visit.*`,
`consent.recorded.v1`, `membership.*`. Backstop: `GET /v1/events` polling. Each event updates the patient's timeline row and
notifies (email via Resend, SMS later). The hero demo card's three rows ("labs received · clinician review · pharmacy shipped")
are literally `lab_result.final` → `case.approved` → `order.shipped`.

## Sandbox plan (the day the test key lands)
`PATCH /v1/test/autopilot` sets how fast the sandbox approves/ships; `POST /v1/test/cases/{id}/decision|ship|deliver|block|fail`,
`/v1/test/visits/{id}/start|complete|no_show`, `/v1/test/lab_orders/*`, `POST /v1/test/webhooks/trigger`, `POST /v1/test/reset`.
Our `CUVO_MODE=mock` adapter (`src/lib/cuvo/`) mirrors these so the whole UX can be built now; switching to the sandbox is
`CUVO_API_KEY=cuvo_sk_test_…`.

## Env (Vercel project mycleanmd)
`CUVO_API_KEY` (sensitive), `CUVO_WEBHOOK_SECRET` (sensitive), `CUVO_MODE` = `mock` | `live`, `CUVO_QUESTION_SET_<PROGRAM>` ids once we see them.

## Open questions for Cuvo's onboarding call
1. Can Monika be the credentialed prescriber for CA + WA cases inside the network, with Cuvo's clinicians as overflow? (bring-your-own is listed on every plan.)
2. Sandbox: the pricing table says "Sandbox and test environment: Grow = No" while the developer portal says any account mints `cuvo_sk_test_` keys. Confirm Grow gets test mode.
3. Which question sets exist for GLP-1, TRT, menopause/HRT, peptides, and whether we can author our own.
4. Live video visits are "priced per visit" outside the platform fee: the number.
5. Retail pharmacy vs partner compounding pharmacy for GLP-1 in WA/CA; cold-chain shipping cost per order.

## Nov 24 2026 — checked against the published docs (developers.cuvo.co/docs/*)
- Confirmed as designed: bearer test/live key prefixes (90-day expiry, 24 h rotation overlap), `Cuvo-Organization` header (optional with one grant), `Idempotency-Key` on every POST/PATCH/DELETE (16–128 chars, 24 h memory, `409 idempotency_conflict`, `Idempotent-Replayed: true`), problem+json errors with a stable `code`, rate limits 1200/min test · 600/min live (`429 rate_limited`, `Retry-After: 60`), 1 MB bodies, patients/consents (`kind`: telehealth|privacy, `version`, `accepted_at`; `external_id` returns the existing patient), cases (`hold` → `release_hold`; `409 consent_required` / `visit_required` / `not_available_in_state`; `GET /v1/states` rules), question sets (`input`/`type`/`options{id,label}`/`ask_when`/`critical_options`; example id `semaglutide-glp-1-weight-loss`), prescriptions (`dispensable`, `changed_fields`, comparison outcomes), orders (`preparing → at_pharmacy → shipped → delivered`, `blocked` with reason, `fill_number`), refills (`POST /v1/cases/{id}/refills`, 21-day minimum), messages (patient|integration authors only), events (thin in live; `since`/`starting_after`), realtime = Ably token (notification only).
- **Fixed in `src/lib/cuvo`:** `visitSlots(state, from, to)` (window ≤ 14 days, `capacity` per slot — pooled and provider-blind) and `bookVisit(patient, slot_start, case?, audio_only?)`; the Nov 23 shape (patient/start/clinicians_free) was wrong. Added `order(id)` / `visit(id)` so thin events resolve to a case. Join links expire 15 min after `GET /v1/visits/{id}/join`: request at join time, never store.
- **Built: `POST /api/labo/cuvo/webhook`** — verifies the `Cuvo-Signature` header (`t=…,v1=…`, HMAC-SHA256 hex over `${t}.${raw body}`, 300 s tolerance, either v1 during rotation), dedupes on `Cuvo-Event-Id` (kept as `data.cuvo_event_id` on the timeline row), resolves case/order/visit events to the `labo_care` row, updates `status` (approved→active, declined, cancelled/withdrawn→cancelled, queued/in_review→filed) and writes the customer timeline event. Register it with `POST /v1/webhook_endpoints` (scope webhooks:manage) for case.*, prescription.*, order.*, visit.*, lab_order.*, lab_result.final.v1; the signing secret it returns goes in the `CUVO_WEBHOOK_SECRET` env var. Retries ≈ 9 attempts over ~3 days; 20 consecutive failures disable the endpoint.
- **Billing model per the docs:** charges are per clinical event (`case_approved`, `case_declined`, `case_cancelled_after_review`, `video_visit` — only on `visit.completed.v1`; a case decided in a visit is billed as the visit). `GET /v1/usage`, `GET /v1/invoices`, `charge.created.v1`. Visits are pooled and provider-blind: nothing in the API lets the clinic's own clinician take a case — a contract question, not an API one. Commercial terms live in memory, not here.
- Test mode: `PATCH /v1/test/autopilot {approve_after_s, ship_after_s, lab_result_after_s}`, `POST /v1/test/webhooks/trigger`, `POST /v1/test/reset`; rows deleted after 30 days; never send real patient data to test mode.

## Nov 24 2026 (evening) — first sandbox case, end to end, from the live site
- `GET /api/labo/cuvo/catalog` (test key only; `?set=<id>` returns the questions) → 12 question sets, 14 medications, 20 states in the sandbox. Set ids wired in `start/page.tsx` `QUESTION_SET`; medication ids in `enroll/route.ts` `MEDICATION`; lines are `{ medication_id, prescriber_decides: true }`.
- **Answer rules learned the hard way:** a choice answer must be the option's **label exactly as written** (not its id); multi-choice = labels joined with `"; "`; a `none_option` can't combine with others; `send_as` questions (height+weight) are sent as their sub-answers (`weight_pounds`, `height_inches`, type number), not as the parent; conditionals (`ask_when`) are left out when not asked. `StartFlow.tsx` → `asked()` + `toCuvoAnswers()` implement this; validation errors now carry `issues` (path: message).
- `POST /api/labo/cuvo/sandbox` (test key only) drives `/v1/test/*`: decision body is `{ decision: "approve" | "decline" | "needs_info", plan: [{ medication_id, quantity, refills, days_supply, directions }] }` (approve needs `plan`); `ship` takes `{ carrier, tracking_number }`; `deliver` takes `{}`; ship/deliver 404 "no order yet" until approved.
- Verified sequence on the production site: enroll → patient + 2 consents + case on hold → hold released (sandbox self-pay) → approve → ship → deliver; the receiver wrote 10 timeline rows (received, queued, in_review, approved, prescription created/updated, order created/at_pharmacy/shipped/delivered) and set `labo_care.status = active`. Unmatched events (patient.created, consent.recorded) are logged and acked.
- Still to build: the visit path — controlled meds (testosterone) and hormone sets answer `409 visit_required` on `POST /v1/cases`; the enroll route should book `POST /v1/visits` with `intake` instead, then show slots/join link in the portal.
