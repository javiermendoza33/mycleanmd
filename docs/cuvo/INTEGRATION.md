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
