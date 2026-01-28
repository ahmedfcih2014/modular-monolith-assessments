# API Contract

## 1. Doctor Availability

### List my slots

```bash
curl /api/v1/availability/slots
```

---

### Add a new slot

```bash
curl -X POST /api/v1/availability/slots \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "time": "2023-02-22T16:30:00",
    "doctorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "isReserved": false,
    "cost": 150.00
  }'
```

---

## 2. Appointment Booking

### View all doctors' available slots (patients)

```bash
curl /api/v1/appointments/slots/available
```

---

### Book an appointment

```bash
curl -X POST /api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "slotId": "550e8400-e29b-41d4-a716-446655440000",
    "patientId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "patientName": "John Doe",
    "reservedAt": "2023-02-20T10:00:00"
  }'
```

---

## 3. Appointment Confirmation

No public API. Confirmation is triggered automatically when a patient books an appointment. The system logs a confirmation notification (patient name, appointment time, doctor name) for both the patient and the doctor.

---

## 4. Doctor Appointment Management

### View my upcoming appointments

```bash
curl /api/v1/doctor/appointments/upcoming
```

---

### Mark appointment as completed

```bash
curl -X PATCH /api/v1/doctor/appointments/{appointmentId}/complete
```

---

### Cancel an appointment

```bash
curl -X PATCH /api/v1/doctor/appointments/{appointmentId}/cancel
```
