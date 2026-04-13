# Postman API Collection Guide

## Overview
This document provides a comprehensive Postman collection for testing the Doctor Appointment Booking System API.

## Collection Structure

### 1. Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - User login
- **GET** `/api/users/profile` - Get user profile
- **PATCH** `/api/users/profile` - Update user profile

### 2. Doctors
- **GET** `/api/doctors` - List all doctors
- **GET** `/api/doctors/:id` - Get doctor details
- **POST** `/api/doctors` - Create doctor (Admin)
- **PATCH** `/api/doctors/:id` - Update doctor (Admin)
- **DELETE** `/api/doctors/:id` - Delete doctor (Admin)

### 3. Appointments
- **POST** `/api/appointments` - Book appointment (Patient)
- **GET** `/api/appointments/my` - Get patient appointments (Patient)
- **GET** `/api/appointments/:id` - Get appointment details
- **PATCH** `/api/appointments/:id/confirm` - Confirm appointment (Admin)
- **PATCH** `/api/appointments/:id/cancel` - Cancel appointment
- **PATCH** `/api/appointments/:id/complete` - Complete appointment (Admin)
- **GET** `/api/appointments` - Get all appointments (Admin)

### 4. Admin
- **GET** `/api/admin/users` - List all users (Admin)
- **PATCH** `/api/admin/users/:id/deactivate` - Deactivate user (Admin)
- **GET** `/api/admin/appointments/overview` - Appointment overview (Admin)

## Environment Variables

Set these variables in Postman for easier testing:

```
baseUrl = http://localhost:5000
patientToken = <token from patient login>
adminToken = <token from admin login>
patientId = <patient user ID>
adminId = <admin user ID>
doctorId = <created doctor ID>
appointmentId = <created appointment ID>
```

## Testing Workflow

### Step 1: Register and Login

1. **Register as Patient**
   ```
   POST /api/auth/register
   Body:
   {
     "name": "Alice Patient",
     "email": "alice@example.com",
     "password": "password123",
     "role": "patient"
   }
   ```
   - Copy the `token` to `patientToken` environment variable
   - Copy the `id` to `patientId`

2. **Register as Admin**
   ```
   POST /api/auth/register
   Body:
   {
     "name": "Bob Admin",
     "email": "bob@example.com",
     "password": "admin123",
     "role": "admin"
   }
   ```
   - Copy the `token` to `adminToken`
   - Copy the `id` to `adminId`

### Step 2: Doctors Management (Admin)

1. **Create Doctor**
   ```
   POST /api/doctors
   Headers: Authorization: Bearer {{adminToken}}
   Body:
   {
     "name": "Dr. Sarah Johnson",
     "specialization": "Cardiology",
     "bio": "Board-certified cardiologist with 15 years experience",
     "availableDays": ["Monday", "Wednesday", "Friday"],
     "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
   }
   ```
   - Copy the `_id` to `doctorId`

2. **List All Doctors**
   ```
   GET /api/doctors
   ```

3. **Search Doctors**
   ```
   GET /api/doctors?search=cardiology
   ```

4. **Get Doctor Details**
   ```
   GET /api/doctors/{{doctorId}}
   ```

### Step 3: Appointment Booking (Patient)

1. **Book Appointment**
   ```
   POST /api/appointments
   Headers: Authorization: Bearer {{patientToken}}
   Body:
   {
     "doctor": "{{doctorId}}",
     "appointmentDate": "2024-05-20",
     "timeSlot": "10:00",
     "notes": "Regular checkup"
   }
   ```
   - Copy the `_id` to `appointmentId`

2. **Get My Appointments**
   ```
   GET /api/appointments/my
   Headers: Authorization: Bearer {{patientToken}}
   ```

3. **Get Appointment Details**
   ```
   GET /api/appointments/{{appointmentId}}
   Headers: Authorization: Bearer {{patientToken}}
   ```

### Step 4: Appointment Management (Admin)

1. **Get All Appointments**
   ```
   GET /api/appointments
   Headers: Authorization: Bearer {{adminToken}}
   ```

2. **Confirm Appointment**
   ```
   PATCH /api/appointments/{{appointmentId}}/confirm
   Headers: Authorization: Bearer {{adminToken}}
   ```

3. **Get Appointment Overview**
   ```
   GET /api/admin/appointments/overview
   Headers: Authorization: Bearer {{adminToken}}
   ```

4. **Get Appointment Overview with Filters**
   ```
   GET /api/admin/appointments/overview?status=pending&startDate=2024-05-01&endDate=2024-05-31
   Headers: Authorization: Bearer {{adminToken}}
   ```

### Step 5: User Profile Management (Patient)

1. **Get Profile**
   ```
   GET /api/users/profile
   Headers: Authorization: Bearer {{patientToken}}
   ```

2. **Update Profile**
   ```
   PATCH /api/users/profile
   Headers: Authorization: Bearer {{patientToken}}
   Body:
   {
     "name": "Alice Updated",
     "password": "newpassword456"
   }
   ```

### Step 6: Admin User Management

1. **List All Users**
   ```
   GET /api/admin/users
   Headers: Authorization: Bearer {{adminToken}}
   ```

2. **Deactivate User**
   ```
   PATCH /api/admin/users/{{patientId}}/deactivate
   Headers: Authorization: Bearer {{adminToken}}
   ```

## Error Testing

### Test 401 Unauthorized
```
GET /api/appointments/my
(without Authorization header)
```

### Test 403 Forbidden
```
POST /api/doctors
Headers: Authorization: Bearer {{patientToken}}
Body: {...}
(patient trying to create doctor - should fail)
```

### Test 404 Not Found
```
GET /api/doctors/invalidid
```

### Test 409 Conflict (Duplicate Email)
```
POST /api/auth/register
Body:
{
  "name": "Another Alice",
  "email": "alice@example.com",
  "password": "password123",
  "role": "patient"
}
```

### Test 400 Bad Request (Validation)
```
POST /api/auth/register
Body:
{
  "name": "John",
  "email": "invalid-email",
  "password": "123"
}
```

## Export Collection

To share the collection:

1. In Postman, click the three dots next to collection name
2. Select "Export"
3. Choose format (JSON)
4. Share the exported file

Import in another Postman instance:
1. Click "Import" button
2. Select the JSON file
3. Set environment variables

## Performance Testing

### Concurrent Bookings
Test double-booking prevention by sending multiple booking requests for the same slot simultaneously:

1. Prepare 3 identical booking requests with same doctor, date, and time
2. Send them rapidly using Postman collection runner
3. Only 1 should succeed, others should return 409 Conflict
