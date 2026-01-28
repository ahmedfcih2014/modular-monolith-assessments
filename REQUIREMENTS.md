## Business Requirements:

Your application should adhere to the following business requirements:

### 1. Doctor Availability:

- As a doctor, I want to be able to list my slots
- As a doctor, I want to be able to add new slots where a single time slot should have the following:
  - Id: Guid
  - Time: Date → 22/02/2023 04:30 pm
  - DoctorId: Guid
  - IsReserved: bool
  - Cost: Decimal

### 2. Appointment Booking:

- As a Patient, I want to be able to view all doctors' available (only) slots
- As a patient, I want to be able to book an appointment in a free slot. An Appointment should have the following:
  - Id: Guid
  - SlotId: Guid
  - PatientId: Guid
  - PatientName: string
  - ReservedAt: Date

### 3. Appointment Confirmation:

- Once a patient schedules an appointment, the system should send a confirmation notification to the patient and the doctor
- The confirmation notification should include the appointment details, such as the patient's name, appointment time, and Doctor's name.
- For the sake of this assessment, the notification could be just a Log message

### 4. Doctor Appointment Management:

- As a Doctor, I want to be able to view my upcoming appointments.
- As a Doctor, I want to be able to mark appointments as completed or cancel them if necessary.

### 5. Data Persistence:

- Use any db engine or even in-memory list with no db at all

## Specifications:

1. You don’t need to care about authentication or authorization, make it public APIs
2. Assume the system is serving a single Doctor only
3. Apply modular monolith architecture
4. The system should consist of four modules each with a different architecture as follows:
   - Doctor Availability Module: Traditional Layered Architecture
   - Appointment Booking Module: Clean architecture
   - Appointment Confirmation Module: Simplest architecture possible
   - Doctor Appointment Management: Hexagonal Architecture

5. (A plus point)Write unit and integration testing
