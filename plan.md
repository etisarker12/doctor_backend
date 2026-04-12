# Doctor Appointment Booking System — Full Plan

**Course:** CSE 300 — Project & Web Programming Lab
**Team:** (Add team member names and IDs here)
**Supervisor:** (Add supervisor name and department here)
**Submission Date:** (Add submission date here)

---

## 1. Project Overview

**Project Name:** Doctor Appointment Booking System
**Goal:** Build a modern web-based appointment booking platform where patients can register, browse available doctors, and book appointments online. Admins can manage doctors and appointments through a dedicated dashboard. The system eliminates manual booking processes, reduces waiting times, and improves efficiency for both patients and hospital staff.

Each appointment will:
- Appear as a booking tied to a specific doctor, patient, date, and time slot
- Accept bookings only from registered and authenticated patients
- Prevent double-booking of the same time slot for the same doctor
- Allow admin to approve, cancel, or manage appointments from the dashboard
- Maintain a full appointment history accessible to each patient
- Support search and filtering of doctors by specialization

This project addresses a real-world need for a reliable, paperless, and scalable appointment system that can be adopted by clinics, hospitals, and private practices. The system is especially relevant in contexts where patients lose time to long queues and manual scheduling.

This project will be submitted as a graded deliverable for CSE 300, so the implementation must be:
- Clean, well-structured, and layered
- Fully documented with Postman
- Deployable on Vercel (frontend) and Render (backend)
- Demonstrating real-world backend engineering: authentication, role-based access, input validation, and scheduled data management

---

## 2. Core Product Vision

The Doctor Appointment Booking System is not just a booking form. It should become:
- A real-world demonstration of RESTful API design with proper HTTP semantics
- A secure, role-enforced system where patients and admins operate in strictly separated access lanes
- A platform that prevents double-bookings through server-side time slot validation
- An automated system where appointment data is managed persistently without manual record-keeping
- A complete transaction lifecycle from doctor listing through booking to appointment history
- A strong foundation for professional full-stack MERN development skills

The entire appointment lifecycle — from doctor registration by admin to patient booking and history tracking — is handled digitally within the platform. Two distinct user-facing portals exist: one for Patients and one for Admins, alongside public doctor browsing for visitors.

---

## 3. Technology Stack

We will use the **MERN stack** with a traditional persistent client-server architecture.

**Frontend:**
- React.js
- Tailwind CSS
- Axios or Fetch API

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB Atlas
- Mongoose (ODM)

**Authentication:**
- JWT (JSON Web Tokens) — stateless session management
- bcryptjs — secure password hashing

**API Documentation:**
- Postman collection with sample requests and responses

**Deployment:**
- Vercel — frontend hosting
- Render — backend hosting (persistent Express server)

**Dev Tools:**
- ESLint + Prettier — code quality and formatting
- Nodemon — hot reload during development
- Git + GitHub — version control and collaboration

**Optional:**
- Docker — containerization for consistent dev/prod environments

**Why MERN:**
The MERN stack provides a unified JavaScript ecosystem across all layers, reducing context switching and accelerating development. MongoDB's schema flexibility accommodates the varied data structures of doctors, appointments, and user profiles without requiring costly schema migrations. React's component model enables reusable UI elements such as doctor cards, booking forms, and appointment history tables. The combination of Express middleware and JWT ensures role enforcement and security concerns are handled cleanly and uniformly across all routes.

---

## 4. Important Architecture Decision

Because the backend requires a **persistent, always-running process** for reliable appointment data management and time slot validation, we cannot use Vercel serverless functions for the backend.

**Chosen approach:**
- React SPA on Vercel for the frontend
- Express.js server on Render for the backend
- MongoDB Atlas as the shared database

**Three-tier system architecture:**

```
Presentation Layer  →  React.js SPA
                        Renders UI for patient portal, doctor listing,
                        and admin dashboard. Communicates via REST API calls.

Application Layer   →  Node.js / Express.js API Server
                        Handles routing, business logic, JWT middleware,
                        role enforcement, and appointment management logic.

Data Layer          →  MongoDB Database
                        Persists users, doctors, appointments,
                        and audit records.
```

All client requests pass through Express middleware for JWT verification and role validation before reaching the relevant controller. Appointment slot conflict detection runs server-side on every booking request to ensure data integrity.

**Why Render for the backend:**
Render's free tier supports persistent Node.js/Express servers, which are required for:
- Maintaining consistent server-side time slot validation on every booking request
- Reliable connection pooling to MongoDB Atlas
- Running long-lived Express processes that handle concurrent booking requests safely

**Why not serverless for the backend:**
Serverless functions are stateless and spin up per request. Consistent appointment conflict checking and reliable MongoDB connection pooling are better served by a persistent process. The booking engine is a core feature and is non-negotiable.

---

## 5. Development Philosophy

This project demonstrates real-world engineering practices. Follow these rules throughout:

1. Build phase by phase — complete and test one phase fully before starting the next
2. Keep each phase focused on one clear backend concern with a visible, testable outcome
3. Do not over-engineer early — no complex real-time features until the REST layer is solid
4. Ship a working, tested API before building the frontend
5. Use the layered folder structure from day one: routes → controllers → services → models
6. Add features only after the base flow works end-to-end
7. Prefer clear, readable code over clever one-liners — this is also a learning project
8. Keep backend and frontend responsibilities clearly separated
9. Validate all inputs server-side — never trust the client alone
10. Test every endpoint in Postman before moving to the next phase
11. Agree on API contracts before parallel development begins
12. Use GitHub pull requests with peer review for all merges

---

## 6. Primary User Roles

**1) Visitor (unauthenticated)**
Can:
- Browse the list of available doctors
- View doctor profiles including name, specialization, and available time slots
- View general platform information

Cannot:
- Book appointments
- Access appointment history
- Access any protected routes

**2) Patient**
Can:
- Register with a unique email address and select the Patient role
- Log in and receive a signed JWT
- Browse all available doctors with search and filter by specialization
- Book an appointment with a doctor by selecting an available date and time slot
- View their own full appointment history
- Cancel their own upcoming appointments
- Manage their own profile information

**3) Admin**
Can:
- Log in with admin credentials
- Add, edit, and remove doctor profiles from the platform
- View all appointments across all patients
- Approve or cancel any appointment
- Manage patient accounts — view, deactivate accounts
- Oversee platform health and audit appointment data

**Optional — Hospital Supervisor:**
Higher-level stakeholders who access an analytics dashboard to view platform performance metrics such as total appointments booked, most-consulted doctors, and daily booking statistics. This role is out of scope for MVP.

---

## 7. MVP Scope (Must Build First)

The first release must include only what is required for the graded submission.

**Public features:**
- Browse all available doctors
- View single doctor profile with specialization and available time slots
- Search doctors by name or specialization

**Patient features:**
- Register and login
- Book an appointment by selecting a doctor, date, and time slot
- Receive rejection with descriptive error when slot is unavailable or already booked
- View full appointment history with status
- Cancel an upcoming appointment

**Admin features:**
- Login as admin
- Add, edit, and delete doctor profiles
- View all appointments system-wide
- Approve or cancel any appointment
- Deactivate patient accounts

**Non-negotiable MVP data per appointment:**
- Patient reference
- Doctor reference
- Appointment date and time slot
- Status — pending / confirmed / cancelled / completed
- Created timestamp

**Explicitly out of scope for MVP:**
- Online payment gateway or billing integration
- Video consultation or telemedicine features
- Mobile native applications (iOS / Android)
- Real-time WebSocket push notifications (basic polling used instead)
- Email or SMS notification system (optional advanced feature)
- Multi-location or multi-branch support

---

## 8. Phase-wise Delivery Plan

**Phase 1 — Project Setup & Database (Weeks 1–2)**
Goal: working server, DB connection, all models defined.

Tasks:
- Initialize Node.js project and install all dependencies
- Configure `.env`, `.env.example`, and `.gitignore`
- Build `server.js` and `src/config/db.js` with error handling
- Define all 3 Mongoose models (User, Doctor, Appointment) with correct fields, types, and indexes
- Create global error handler stub in `src/utils/errorHandler.js`
- Create all empty placeholder folders for future phases
- First Git commit pushed to GitHub

Deliverable: server starts, MongoDB connects, health route returns 200, all models load cleanly

---

**Phase 2 — Authentication & Role System (Weeks 3–4)**
Goal: secure register, login, and middleware that protects all future routes.

Tasks:
- Install bcryptjs and jsonwebtoken
- Add pre-save password hashing hook to User model
- Build `POST /api/auth/register` — validate input, hash password, sign JWT
- Build `POST /api/auth/login` — verify credentials, return signed JWT
- Write `protect` middleware — verifies JWT, attaches `req.user`
- Write `restrictTo(role)` middleware — checks role, returns 403 if mismatched
- Test all auth flows and role enforcement in Postman

Deliverable: register, login, and role-protected routes all working correctly

---

**Phase 3 — Doctor Management CRUD (Weeks 5–6)**
Goal: admins can fully create and manage doctor profiles, patients can browse them.

Tasks:
- Build all doctor routes, controllers, and Joi validators
- `POST /api/doctors` — admin only, creates doctor profile
- `GET /api/doctors` — public, returns all active doctors with optional search/filter by specialization
- `GET /api/doctors/:id` — public, single doctor profile with available time slots
- `PATCH /api/doctors/:id` — admin only
- `DELETE /api/doctors/:id` — admin only
- Document all endpoints in Postman

Deliverable: admins can create and manage doctor profiles, public can browse and search them

---

**Phase 4 — Appointment Booking Engine (Weeks 7–8)**
Goal: patients can book appointments safely with double-booking prevention.

Tasks:
- Build `POST /api/appointments` — patient only
- Validate: doctor exists, selected date and time slot is valid, slot is not already booked by another patient
- Reject bookings for unavailable slots with descriptive error
- Use atomic `findOneAndUpdate` or unique compound index to prevent race conditions on simultaneous bookings
- Create Appointment document after successful validation
- Build `GET /api/appointments/my` — patient only, returns own appointment history
- Build `GET /api/appointments` — admin only, returns all appointments across all patients
- Test concurrent booking scenario in Postman

Deliverable: booking works correctly, unavailable slots are rejected, race conditions are handled

---

**Phase 5 — Appointment Status Management (Weeks 9–10)**
Goal: admins can manage appointment statuses and patients can cancel their own bookings.

Tasks:
- Build `PATCH /api/appointments/:id/confirm` — admin only, sets status to `confirmed`
- Build `PATCH /api/appointments/:id/cancel` — admin or owning patient, sets status to `cancelled`
- Build `PATCH /api/appointments/:id/complete` — admin only, sets status to `completed`
- Validate that cancellation is only allowed before appointment date has passed
- Build `GET /api/appointments/:id` — patient (own) or admin, single appointment details
- Test all status transitions in Postman

Deliverable: all appointment status transitions work correctly with proper role enforcement

---

**Phase 6 — Profile Management (Weeks 11–12)**
Goal: patients can view and update their own profile information.

Tasks:
- Build `GET /api/users/profile` — patient only, returns own profile
- Build `PATCH /api/users/profile` — patient only, allows updating name and password
- Validate: name is non-empty, password meets minimum length if provided, re-hash on change
- Build `GET /api/admin/users` — admin only, list all users
- Build `PATCH /api/admin/users/:id/deactivate` — admin only, sets `isActive: false`
- Ensure deactivated users cannot log in — check `isActive` flag in login route

Deliverable: profile management works for patients, admin user management works correctly

---

**Phase 7 — Admin Dashboard, Error Handling & API Docs (Weeks 13–14)**
Goal: complete admin controls, clean error responses for all cases, and full API documentation.

Tasks:
- Build admin appointment overview route with filters by status and date
- Wire global `errorHandler.js` as the last middleware in `server.js`
- Wrap all controller logic in try/catch calling `next(error)`
- Create custom `ApiError` class with `statusCode` and `message`
- Write full Postman collection for every endpoint with sample request and response bodies
- Deploy backend to Render and confirm all routes work on the live URL
- Write README with setup instructions, environment variable reference, and API overview

Deliverable: admin dashboard works, all errors return clean JSON, full API documented, backend deployed

---

## 9. Optional / Advanced Features

These should only be added after the full MVP is working, tested, and submitted.

- Email notifications — notify patients when appointments are confirmed or cancelled by admin
- Search doctors by specialization with advanced filters (experience, rating, availability)
- Doctor ratings and reviews — patients can rate a doctor after a completed appointment
- Doctor availability schedule management — admin defines available days and time slots per doctor
- Patient profile photo upload via Cloudinary
- Appointment reminder system — automated reminders before appointment date
- Responsive mobile design with PWA capabilities
- Analytics dashboard — total bookings, most-booked doctors, cancellation rates

---

## 10. Recommended Folder Structure

```
doctor-booking-backend/
├── src/
│   ├── config/
│   │   └── db.js                        # MongoDB connection with error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── middleware/
│   │   └── auth.js                      # protect + restrictTo middleware
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── doctor.controller.js
│   │   ├── appointment.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   └── appointmentService.js        # slot conflict logic, status transitions
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   ├── appointment.routes.js
│   │   └── admin.routes.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── doctor.validator.js
│   │   └── appointment.validator.js
│   └── utils/
│       ├── errorHandler.js              # global error middleware
│       └── ApiError.js                  # custom error class
├── .env                                 # never commit
├── .env.example                         # commit this with empty values
├── .gitignore
├── server.js                            # app entry point
└── package.json
```

---

## 11. Core Data Models

**User**
```js
{
  name:      String, required, trim
  email:     String, required, unique, lowercase    // indexed
  password:  String, required, minlength 6          // bcrypt hashed via pre-save hook
  role:      enum ['patient', 'admin'], required
  isActive:  Boolean, default true
  timestamps: true

  indexes: { email: 1 }
}
```

**Doctor**
```js
{
  name:             String, required, trim
  specialization:   String, required, trim
  bio:              String, trim
  availableDays:    [String]                        // e.g. ['Monday', 'Wednesday']
  availableSlots:   [String]                        // e.g. ['09:00', '10:00', '11:00']
  isActive:         Boolean, default true
  timestamps: true

  indexes: { specialization: 1 }
}
```

**Appointment**
```js
{
  patient:          ObjectId → User, required
  doctor:           ObjectId → Doctor, required
  appointmentDate:  Date, required                  // stored in UTC
  timeSlot:         String, required                // e.g. '10:00'
  status:           enum ['pending', 'confirmed', 'cancelled', 'completed'], default 'pending'
  notes:            String, trim
  timestamps: true

  indexes: { patient: 1 }, { doctor: 1, appointmentDate: 1, timeSlot: 1 } unique
}
```

---

## 12. Minimum API Plan

**Public APIs**
```
GET  /api/doctors                    list all active doctors (search by specialization)
GET  /api/doctors/:id                single doctor profile with available slots
```

**Auth APIs (public)**
```
POST /api/auth/register              create account as patient
POST /api/auth/login                 login, returns signed JWT
```

**Patient APIs (protected — patient role)**
```
POST  /api/appointments              book an appointment with a doctor
GET   /api/appointments/my           view own appointment history
GET   /api/appointments/:id          view single appointment detail
PATCH /api/appointments/:id/cancel   cancel own upcoming appointment
GET   /api/users/profile             view own profile
PATCH /api/users/profile             update own profile
```

**Admin APIs (protected — admin role)**
```
POST   /api/doctors                          add a new doctor
PATCH  /api/doctors/:id                      edit doctor profile
DELETE /api/doctors/:id                      remove doctor

GET    /api/appointments                     view all appointments
PATCH  /api/appointments/:id/confirm         confirm an appointment
PATCH  /api/appointments/:id/cancel          cancel an appointment
PATCH  /api/appointments/:id/complete        mark appointment as completed

GET    /api/admin/users                      list all users
PATCH  /api/admin/users/:id/deactivate       deactivate a user account
```

---

## 13. Key Pages to Build (Frontend)

**Public:**
1. Home — hero section, search bar, featured doctors, how-it-works explainer
2. Doctors List — grid of available doctors with search and filter by specialization
3. Doctor Profile — full info, specialization, bio, available slots, and booking button

**Patient:**
4. Register / Login
5. Book Appointment — date picker, time slot selector, confirmation step
6. My Appointments — history of own bookings with status badges and cancel option
7. Profile Page — view and update personal information

**Admin:**
8. Admin Dashboard — overview of all appointments with filter by status and date
9. Doctor Management — add, edit, delete doctor profiles
10. User Management — list all patients, deactivate accounts
11. Appointment Management — confirm, cancel, or complete individual appointments

---

## 14. Home Page Section Plan

Recommended sections for the first version:
- Hero with platform tagline and call to action for patients to book now
- Search bar — search by doctor name or specialization
- Featured doctors grid — a selection of active doctor profiles
- How it works — simple 3-step explainer: Register → Find a Doctor → Book Appointment
- Call to action encouraging patients to sign up and book their first appointment

Keep the home page simple in the first version. The priority is surfacing available doctors clearly and guiding new users to understand the booking process.

---

## 15. Doctor Card Content

Each doctor card in the listing grid should show:
- Doctor name
- Specialization badge
- Short bio (truncated to 2 lines)
- Available days summary
- Active status indicator
- "View Profile" button
- "Book Appointment" button — visible only to logged-in patients

Optional later:
- Average patient rating
- Total appointments completed
- Profile photo

---

## 16. Doctor Profile Page Content

The doctor profile page should include:
- Doctor name and full bio
- Specialization and available days
- Available time slots for a selected date — rendered as a grid of selectable buttons
- Booking form — visible only to logged-in patients, with date picker and slot selector
- Real-time slot availability feedback — booked slots shown as disabled
- Clear unavailability messages — "No slots available for this date"

**Preview note:**
Do not attempt to embed third-party content or external booking tools via iframe. Browser security headers will block embedding in most cases. Always keep "Book Appointment" as the primary action on the profile page.

---

## 17. Submission and Booking Workflow

**Patient flow:**
1. Patient registers with a unique email, selects Patient role, and logs in
2. Patient browses the doctor list and filters by specialization if needed
3. Patient opens a doctor profile and selects an available date
4. Patient selects an available time slot — already-booked slots are shown as disabled
5. Patient submits the booking — system validates the slot server-side
6. If slot is taken by a concurrent request, patient receives a descriptive rejection error
7. Appointment is created with status `pending`
8. Admin logs into the dashboard and reviews pending appointments
9. Admin confirms the appointment — status changes to `confirmed`
10. Patient can view updated appointment status in their appointment history

**Real use case from proposal:**
- Patient searches for a cardiologist, finds Dr. Rahman, views available slots on Monday
- Patient selects 10:00 AM, submits booking — appointment created as `pending`
- Admin confirms the appointment, patient sees `confirmed` status in their history
- If patient cannot attend, they cancel through the platform before the appointment date

**Admin review checks:**
- Is the appointment time slot still available and conflict-free?
- Is the patient account in good standing and active?
- Is the doctor profile accurate and up to date?
- Are there any scheduling conflicts that require manual resolution?

---

## 18. Validation Rules

**User registration:**
- Name required, non-empty
- Email required, valid format, must be unique
- Password required, minimum 6 characters
- Role required, must be `patient` (admin accounts created separately)

**Appointment booking:**
- Doctor must exist and be active
- Appointment date must be in the future
- Time slot must be one of the doctor's defined available slots
- The doctor-date-slot combination must be unique — no double booking allowed
- User role must be `patient` — admins cannot book appointments through the patient flow
- Concurrent bookings handled atomically — only one can claim a slot

**Doctor management (admin):**
- Name required, non-empty
- Specialization required, non-empty
- Available days must be valid day names
- Available slots must follow HH:MM format
- Bio optional, maximum 500 characters if provided

**Profile update:**
- Name required if provided, non-empty
- Password minimum 6 characters if provided, re-hashed before saving

---

## 19. Security Rules

Must implement from Non-Functional Requirements:

- Password hashing with bcrypt — pre-save hook on User model, never stored in plain text
- JWT signed with `JWT_SECRET` from environment variables — payload contains only `{ id, role }`, no sensitive data
- `protect` middleware — verifies and decodes JWT on every protected route, attaches `req.user`
- `restrictTo(role)` middleware — checks role server-side on every protected endpoint, never trusted from client
- Role checks enforced server-side at both middleware and controller level
- Input validation with Joi — centralized in the validators folder, applied on all POST and PATCH requests
- Inputs sanitized to prevent NoSQL injection attacks
- Compound unique index on Appointment collection enforces one-booking-per-slot at database level, more reliable than application-level checks alone
- Atomic conflict check on appointment booking — prevents race condition where two patients simultaneously claim the same slot
- All appointment dates stored and compared in UTC to prevent timezone-related drift
- Deactivated users blocked at login — `isActive` flag checked before issuing JWT

Do not trust client-side validation alone. Every validation must be enforced server-side.

---

## 20. Database and Hosting Notes

**MongoDB Atlas:**
Use Atlas because it connects reliably from Render-hosted Express servers and from local development machines. Use the free M0 shared cluster for the project. All times stored in UTC.

**Render notes (backend):**
- Render runs a persistent Node.js process — appointment conflict validation runs reliably here
- Use a reusable Mongoose connection helper in `src/config/db.js`
- Render free tier spins down after inactivity — use UptimeRobot or similar to keep the backend alive during demo and testing periods
- Avoid heavy processing inside individual API route handlers — keep them lightweight and delegate logic to service functions

**Vercel notes (frontend only):**
- React SPA deployed to Vercel
- All API calls point to the Render backend URL via `REACT_APP_API_URL` environment variable
- No backend logic runs on Vercel
- Use Vite-friendly image optimization where applicable

**File uploads:**
Profile photo upload is an optional advanced feature. If implemented, do not store uploaded files inside Vercel or Render filesystem. Use Cloudinary — either the upload widget or a client-to-Cloudinary direct upload flow.

---

## 21. Environment Variables

**Backend (.env on Render):**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/doctor-booking-db
JWT_SECRET=your_strong_random_secret_here
NODE_ENV=production
```

**Frontend (.env on Vercel):**
```
REACT_APP_API_URL=https://your-render-backend.onrender.com
```

**Optional (if image upload is added):**
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit `.env`. Commit `.env.example` with the same keys and empty values. Add `.env` to `.gitignore` on the very first commit before any other files are pushed.

---

## 22. Teaching-Friendly Build Order

Because this project demonstrates real engineering to students, follow this order so every session ends with a working, testable outcome:

**Session 1:**
- Explain the appointment lifecycle concept — register, browse, book, confirm, history
- Initialize Node.js project, install dependencies, configure ESLint and Prettier
- Build `server.js`, `db.js`, and health route — run and show MongoDB connection in terminal

**Session 2:**
- Define all 3 Mongoose models — explain fields, types, enums, and why each index exists
- Show how compound unique indexes work on the Appointment model and why they matter for data integrity

**Session 3:**
- Build register and login routes — explain bcrypt hashing and JWT signing
- Demonstrate in Postman — show the token returned on login

**Session 4:**
- Write `protect` and `restrictTo` middleware
- Test role enforcement in Postman — show 401 without token, 403 for wrong role

**Session 5:**
- Build full doctor CRUD with Joi validation
- Show admin-only access in Postman — demonstrate validation error responses on public and admin routes

**Session 6:**
- Build appointment booking engine — explain the atomic compound index conflict check
- Demonstrate double-booking prevention by sending two rapid concurrent booking requests for the same slot

**Session 7:**
- Build appointment status management routes — confirm, cancel, complete
- Show status transition enforcement in Postman — demonstrate that patients cannot confirm their own appointments

**Session 8:**
- Build profile management routes for patients
- Build admin user management routes — show deactivated user being blocked at login

**Session 9:**
- Wire global error handler — show clean JSON error responses for all failure cases
- Deploy backend to Render, deploy frontend to Vercel
- Write and walk through the Postman collection

This sequence ensures students see a working API endpoint at the end of every single session.

---

## 23. UI/UX Guidance

The visual style should feel clean, trustworthy, and medical-grade — not decorative.

Recommended direction:
- Clean card layout for doctor listings — photo or placeholder avatar, name, specialization badge, available days
- Clear appointment status indicators with color — blue for Pending, green for Confirmed, red for Cancelled, gray for Completed
- Time slot grid on doctor profile page — available slots as clickable buttons, booked slots as disabled
- Strong typography hierarchy — doctor name and specialization should be the most prominent text on the profile page
- Consistent button styles — primary blue for "Book Appointment", secondary for "View Profile", red outline for cancel actions
- Minimal color palette — calm blues and whites consistent with a medical context
- Mobile-responsive layout from the start — both patient and admin portals must work on mobile viewports
- Forms must provide real-time validation feedback — show inline error messages as users type, not only on submit

Do not try to make it fancy in the first version. Focus on:
- Making the booking action obvious and immediately accessible from the doctor profile
- Showing appointment status clearly at all times in the patient history view
- Keeping forms simple with unambiguous validation messages
- Clear empty states — "No doctors available yet", "You have no upcoming appointments"

---

## 24. Performance Guidance

Since the backend runs on Render free tier and the frontend on Vercel Hobby, optimize from the start:

- Index all fields used in frequent queries — `patientId`, `doctorId`, `status`, `appointmentDate`, `doctor + appointmentDate + timeSlot`
- Keep conflict check logic fast and atomic — target under 300ms response time per booking request
- Use `.lean()` on Mongoose read queries where you do not need Mongoose document methods — returns plain JS objects and is significantly faster
- Paginate doctor and appointment listings — never return all documents in one response once data grows
- Avoid deep nested population chains — keep `.populate()` to one level deep
- On the frontend, avoid unnecessary client-side re-fetches — cache doctor data client-side for the duration of a browsing session
- Keep the React bundle lean — avoid heavy libraries that are not needed for MVP

---

## 25. SEO and Discoverability

Basic SEO should be included in the React frontend even in MVP:

- Proper, descriptive page titles per route — e.g., "Book Appointment with Dr. Rahman | Doctor Booking"
- Meta descriptions on the home page, doctors list page, and individual doctor profile pages
- Open Graph tags on doctor profile pages so shared links render a preview
- Consistent, readable URL patterns — `/doctors/:id`, `/appointments/my`
- Public doctor listing and profile pages should be server-renderable if SSR is added in future
- Search-engine-friendly public pages — no JavaScript-only content rendering on critical public views

---

## 26. Things to Avoid Early

Do not build any of the following before the core MVP is working and submitted:

- Real-time WebSocket appointment updates — use simple page reload or basic polling first
- Email or SMS notification system
- Profile photo upload for doctors or patients
- Video consultation or telemedicine features
- Online payment or billing integration
- Complex analytics or reporting dashboard
- Doctor self-registration and self-managed availability
- Multi-branch or multi-location support
- Mobile native app (iOS or Android)
- Microservices or any distributed architecture
- Advanced state management libraries unless strictly necessary

The first goal is a working, tested, documented appointment API that covers all coding tasks from the project brief. Everything else is optional.

---

## 27. Suggested Git Workflow

Use clean, focused commits so the project history is readable and reviewable.

**Branches:**
```
main                              # production-ready code only
dev                               # integration branch
feature/phase1-setup
feature/phase2-auth
feature/phase3-doctor-crud
feature/phase4-booking
feature/phase5-status-management
feature/phase6-profile
feature/phase7-admin
feature/deployment
feature/frontend-home
feature/frontend-doctor-profile
feature/frontend-appointments
feature/frontend-dashboard
```

**Commit style:**
```
feat: initialize project structure and MongoDB connection
feat: define User, Doctor, Appointment Mongoose models with indexes
feat: add bcrypt pre-save hook to User model
feat: build register and login routes with JWT
feat: add protect and restrictTo middleware
feat: build doctor CRUD with Joi validation — admin only routes
feat: build appointment booking with compound index conflict check
feat: build appointment history route for patients
feat: build appointment status management routes — confirm, cancel, complete
feat: build patient profile view and update routes
feat: build admin user management and deactivation routes
feat: wire global error handler with ApiError class
docs: add full Postman collection for all endpoints
chore: deploy backend to Render and update environment variables
fix: handle already-booked slot rejection with correct status code
fix: resolve concurrent booking conflict in simultaneous request test
```

---

## 28. Launch / Submission Checklist

Before demo and final submission:

- [ ] Backend deployed on Render, live URL confirmed and stable
- [ ] Frontend deployed on Vercel, connected to Render backend via environment variable
- [ ] MongoDB Atlas connection stable in production environment
- [ ] Register and login work end-to-end for patient and admin roles
- [ ] Role middleware correctly blocks wrong roles on every protected route
- [ ] Admins can add, edit, and delete doctor profiles
- [ ] Patients can browse and search doctors by specialization
- [ ] Patients can book appointments — unavailable slots rejected with descriptive error
- [ ] Double-booking prevention confirmed — second booking of same slot returns conflict error
- [ ] Patients can view full appointment history with correct status
- [ ] Patients can cancel their own upcoming appointments
- [ ] Admin can view all appointments and filter by status
- [ ] Admin can confirm, cancel, and complete appointments
- [ ] Admin can deactivate patient accounts — deactivated users blocked at login
- [ ] All API errors return clean JSON with correct HTTP status codes
- [ ] Full Postman collection completed with sample requests and responses for all endpoints
- [ ] `.env` is gitignored and never committed
- [ ] `.env.example` is committed with empty values
- [ ] README written with setup instructions, environment variable reference, and how to run locally
- [ ] Code follows consistent naming conventions with inline comments on complex logic

---

## 29. Immediate Execution Plan

Start with the following exact order and do not skip steps:

1. Initialize Node.js project — `npm init -y`, install all dependencies
2. Set up folder structure, `.env`, `.env.example`, `.gitignore`, `server.js`
3. Connect MongoDB Atlas in `src/config/db.js` with error handling and logging
4. Define all 3 Mongoose models with correct fields, types, validation, and indexes
5. Create `errorHandler.js` stub and `ApiError.js` class
6. Build register and login routes and JWT middleware — test in Postman
7. Write `protect` and `restrictTo(role)` middleware — test role enforcement
8. Build doctor CRUD with Joi validation — test all routes in Postman
9. Build appointment booking engine with compound index conflict check — test valid and invalid scenarios
10. Build appointment status management routes — test all transitions in Postman
11. Build patient profile view and update routes
12. Build admin user management routes — test deactivation blocking login
13. Build admin appointment overview with filters
14. Wire global error handler as last middleware in `server.js`
15. Write full Postman collection for all endpoints
16. Deploy backend to Render — confirm all routes on live URL
17. Build React frontend — home, doctors list, doctor profile, booking, appointment history, dashboard, auth pages
18. Deploy frontend to Vercel — connect to Render backend URL
19. End-to-end test the full lifecycle: register → browse doctors → book → confirm → view history → cancel
20. Write README and finalize submission

---

## 30. Final Direction for Claude / Cursor

When implementing this project, follow these rules without exception:

1. Use the `routes → controllers → services → models` layered architecture strictly — no business logic in route files
2. Never trust client-sent role, user ID, or validation data — always re-validate server-side
3. Always use a compound unique index on `{ doctor, appointmentDate, timeSlot }` to prevent double-booking at the database level — this is non-negotiable
4. Use Joi for all input validation, centralized in the validators folder, applied before the controller is reached
5. All async controller functions must be wrapped in try/catch and call `next(error)` — never `res.json` inside a catch block
6. Keep appointment conflict checking in the service layer — never in the route file
7. Store and compare all dates and times in UTC — never rely on local timezone
8. Index every field used in a query — check every `find()`, `findOne()`, and `findOneAndUpdate()` call
9. Implement features strictly in the planned phase order — do not jump ahead
10. Prefer small, safe, focused commits — do not batch multiple features into one commit
11. Do not add notifications, payments, video consultation, or image upload before the core API is complete and tested
12. Keep the backend stateless — the only stateful component is MongoDB

---

## 31. Recommended Next Step

After this plan, the next document to create should be `agent.md` or `cursor-rules.md`.

That file should define:
- Coding style rules — naming conventions for files, functions, variables, and routes
- Folder discipline — what belongs in controllers vs services vs utils
- API design conventions — HTTP methods per action, status codes per scenario, consistent response shape `{ success, data, message }`
- Mongoose conventions — always use timestamps, always define indexes, always use lean() on reads
- Validation conventions — always Joi, always server-side, always before controller logic
- Error handling conventions — always use ApiError class, always call next(error), never swallow errors silently
- Deployment constraints — keep handlers fast, no blocking operations, no large in-memory state
- "Do not over-engineer" rules — no abstraction layers that are not immediately needed, no clever patterns that obscure intent

---

## 32. Summary

The Doctor Appointment Booking System should be built as a **graded-quality, portfolio-ready, production-aware MERN full-stack booking system**.

The correct strategy is:
- Keep architecture strictly layered — routes → controllers → services → models — with no exceptions
- Build and fully test the backend API before writing a single line of frontend code
- Use compound unique MongoDB indexes for all concurrent-sensitive logic — especially appointment slot booking
- Add role enforcement at both the middleware level and the database query level
- Use Joi validation on every input, compound unique indexes for data integrity, and a global error handler for clean responses
- Document every endpoint in Postman before considering any phase complete
- Deploy early and keep the live link working throughout development

This will make the project:
- Strong enough to serve as a real portfolio piece demonstrating senior-quality backend engineering
- Complete enough to fulfill all coding tasks from the CSE 300 project brief
- Correctly scoped for a 14-week semester lab submission
- A solid foundation for professional full-stack MERN development careers
- Clean and explainable in a demo or code review setting