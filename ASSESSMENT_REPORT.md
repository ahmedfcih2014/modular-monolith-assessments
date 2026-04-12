# Assessment report: reviewed backend modules

**Scope:** `appointment-confirmation`, `doctor-availability`, `doctor-appointment-management`, against `REQUIREMENTS.md`, `API_CONTRACT.md`, and the stated per-module architecture styles.

---

## Executive summary

**Strengths:** Modular boundaries, event-driven confirmation, global `SharedModule` for `DataStore`, doctor routes aligned with the contract, and upcoming appointments logic that uses **slot time** and **non-terminal** rows.

**Main risks:** Confirmation content still omits **doctor name**; doctor availability POST body vs contract; **`DataStore` keys on `AppointmentEntity`** while several call sites pass the **`Appointment` subclass** (runtime failure risk); **`AppModule` may still register `DataStore` alongside `SharedModule`** (verify single owner); **no automated tests** for the optional testing criterion.

---

## 1. Appointment confirmation

### What works

- No public API (matches contract).
- Subscribes to `appointment.created` after booking.
- Logs patient, time, slot/cost (reasonable “notification” stand-in).

### Gaps and missing items

| Item | Severity | Detail |
|------|----------|--------|
| Doctor **name** in notification | High | `REQUIREMENTS.md` §3 and `API_CONTRACT.md` §3 require patient name, appointment time, and **doctor’s name**. Logs show doctor id only; no name in the model. |
| Two audiences (patient vs doctor) | Low | Contract allows a single log line covering both; optional to split into two labeled lines. |
| Observability | Low | Raw `console.log` vs `Logger` — not required by spec, but weaker for ops. |

### Suggestions

- Introduce a **doctor display name** (constant for single-doctor, config, or small doctor record) and include it in the event or resolve it in the processor.
- Optionally use Nest **`Logger`** with a stable message shape.

---

## 2. Doctor availability

### What works

- `GET`/`POST` under `/api/v1/availability/slots` (with global prefix + versioning).
- Slot fields: id, time, doctorId, isReserved, cost; layered **controller → service → store**.

### Gaps and missing items

| Item | Severity | Detail |
|------|----------|--------|
| POST body vs `API_CONTRACT.md` | Medium | Contract example includes **`id`**; `CreateSlotDto` has no `id`, and `main.ts` uses `forbidNonWhitelisted: true`, so a body matching the doc **fails validation**. Service also **generates** `id` server-side. |
| “List **my** slots” | Low | `getSlots()` returns **all** slots; acceptable if “single doctor” is explicit everywhere, but not modeled (e.g. filter by `doctorId`). |
| Decimal type | Low | `cost` as `number` — normal in TS; document if strict decimal is required. |

### Suggestions

- Either **add optional `id`** to the DTO (and use it when present) **or** change the contract/example to **omit** client `id` and document server-generated ids.
- If you keep single-doctor: optional **query param** or constant filter for `doctorId` so “my slots” is explicit in the API.

---

## 3. Doctor appointment management

### What works

- Routes match contract: `GET .../upcoming`, `PATCH .../:appointmentId/complete`, `PATCH .../:appointmentId/cancel`.
- Use cases implement **ports**; controller injects tokens (good driving side for hex).
- Upcoming logic: **no `status`**, **slot.time > now** — aligned with “upcoming” semantics.

### Gaps and missing items

| Item | Severity | Detail |
|------|----------|--------|
| `DataStore` **entity class identity** | **Critical** | `findAll` / `findOne` / `update` compare `entityClass === AppointmentEntity`. Call sites pass **`Appointment`** (subclass). In JS, **`Appointment !== AppointmentEntity`**, so appointment operations may **throw** or **mis-report**. Affects upcoming, complete, cancel. |
| Hexagonal “full” style | Medium | Use cases inject **`DataStore` directly** — no **outbound repository port**; persistence adapter is not isolated. |
| Cross-module types | Medium | Domain `Appointment` extends booking’s `AppointmentEntity`; **`AppointmentStatus`** duplicated — coupling and drift risk. |
| `AppModule` providers | Medium | **`SharedModule`** already provides `DataStore`, but **`AppModule` may still list `DataStore`** in `providers` — risk of duplicate registration / confusion. |
| DI duplication | Low | If `UpcomingAppointmentService` is registered both as a raw class and as `useClass` for the token, two instances may exist (waste only if nothing injects the class). |

### Suggestions

- **Fix store usage:** use **`AppointmentEntity`** in all `DataStore` calls, **or** extend `DataStore` to treat subclass/name consistently (prefer one canonical class for persistence).
- **Tighten hex:** add **`AppointmentRepository` / query ports** implemented by an adapter that wraps `DataStore`; keep use cases free of infrastructure types.
- **Reduce coupling:** move shared persisted shape to **`shared/contracts`** or introduce a small **read model** DTO returned by ports.
- **Remove** redundant `DataStore` from `AppModule.providers` if `SharedModule` is the single owner.

---

## 4. Cross-cutting (whole backend)

| Item | Detail |
|------|--------|
| Tests | `REQUIREMENTS.md` lists tests as a plus; verify presence of unit/integration tests under `backend` — absence is a gap for assessment polish. |
| Modular monolith | Feature modules + shared store are coherent; remaining work is **contract alignment** and **entity/adapter boundaries**. |

---

## Scores (1 = weak vs requirements; 10 = fully met)

### By module

| Module | Score | Short rationale |
|--------|------:|-----------------|
| **appointment-confirmation** | **6** | Flow and “simplest” shape are fine; **doctor name** missing from logs vs requirement + contract. |
| **doctor-availability** | **7** | Core behavior and layering are solid; **POST `id`** / whitelist vs contract and **“my” slots** semantics hold the score down. |
| **doctor-appointment-management** | **7** | Routes and upcoming semantics are good; **hex** incomplete and **`Appointment` vs `DataStore`** is a serious correctness risk until fixed. |

### Aggregate

| View | Score |
|------|------:|
| **Combined (reviewed modules)** | **~7 / 10** |
| **With “tests plus” considered** | **~6.5 / 10** (if no tests) |

### Score rubric

- **8–10:** Requirements + contract + declared architecture pattern satisfied with only minor nits.
- **6–7:** Main behavior present; clear gaps in contract details, boundaries, or correctness risks.
- **≤5:** Major misses or unsafe behavior.

---

*Generated as a structured export of the modular monolith assessment review.*
