# MediCare Clinic - Backend Architecture & Database Design

## Executive Summary

**Platform Overview:** MediCare is a premium multi-specialty clinic platform in Nairobi, Kenya, serving patients with comprehensive healthcare services including appointments, telemedicine, pharmacy, patient portal, and health resources. The backend must support high reliability, security, regulatory compliance (medical data), transactional integrity, and scalability.

---

## Part 1: Website Analysis

### Core Business Features
1. **Patient Management** – Registration, authentication, profiles, medical history
2. **Appointment System** – Booking, scheduling, cancellation, rescheduling
3. **Doctor Management** – Profiles, specialties, availability, ratings/reviews
4. **Services & Pricing** – 14+ medical services with pricing (KSh) and descriptions
5. **Pharmacy** – Medicine catalog, cart, checkout, delivery tracking
6. **Telemedicine** – Video/chat consultations, session management
7. **Patient Portal** – Vitals, medical records, prescriptions, appointment history
8. **Blog/Resources** – Health articles, educational content
9. **Payments** – Appointment fees, pharmacy purchases (Kenyan payment gateways)
10. **Notifications** – Email, SMS (appointment reminders, status updates)
11. **Live Chat** – Customer support widget
12. **Emergency** – Emergency request handling
13. **Admin Dashboard** – Content management, analytics, user management

### Content Types
- **Transactional:** Appointments, pharmacy orders, prescriptions, payments, telemedicine sessions
- **Master Data:** Doctors, services, medicines, specialties, departments, pricing
- **User-Generated:** Appointments, medical histories, testimonials, chat messages
- **Editorial:** Blog posts, health resources, FAQs
- **System:** Audit logs, notifications, analytics

---

## Part 2: PostgreSQL Database Schema

### Design Principles
- **Normalization:** Third Normal Form (3NF) for data integrity
- **Security:** Role-based access, PII encryption, audit trails
- **Performance:** Indexes on frequently queried columns, partitioning for large tables
- **Compliance:** GDPR-ready, medical data regulations (PII/PHI encryption)
- **Scalability:** Connection pooling, read replicas support

---

### 2.1 Core Tables

#### 1. **users** (Base user table)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin', 'staff') NOT NULL DEFAULT 'patient',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT email_unique UNIQUE (email),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);
```

#### 2. **doctors** (Doctor profiles)
```sql
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    specialty_id UUID NOT NULL,
    department_id UUID NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE,
    bio TEXT,
    experience_years INTEGER,
    education JSONB, -- Array of {degree, institution, year}
    availability_days TEXT[], -- ['Mon', 'Tue', ...] (ARRAY type)
    languages TEXT[],
    consultation_fee DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_specialty (specialty_id),
    INDEX idx_available (is_available)
);
```

#### 3. **patients** (Patient profiles & additional info)
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other'),
    blood_type VARCHAR(5),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT,
    chronic_conditions TEXT,
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    medical_history JSONB, -- {previous_conditions, surgeries, etc}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_insurance (insurance_provider)
);
```

#### 4. **specialties** (Medical specialties)
```sql
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);
```

#### 5. **departments** (Hospital departments)
```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    head_doctor_id UUID,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_head_doctor FOREIGN KEY (head_doctor_id) REFERENCES doctors(id),
    INDEX idx_name (name)
);
```

#### 6. **services** (Medical services)
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    long_description TEXT,
    specialty_id UUID NOT NULL,
    category VARCHAR(50), -- 'Primary Care', 'Specialist', 'Emergency', etc
    price_min DECIMAL(10, 2) NOT NULL,
    price_max DECIMAL(10, 2),
    duration_minutes INTEGER,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id),
    INDEX idx_specialty (specialty_id),
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);
```

#### 7. **appointments** (Appointment bookings)
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    service_id UUID NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show') 
           NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    consultation_fee DECIMAL(10, 2),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    appointment_type ENUM('in_clinic', 'telemedicine', 'home_visit') 
                     DEFAULT 'in_clinic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) 
                           ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT unique_booking 
        UNIQUE (doctor_id, appointment_date, appointment_time),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_type (appointment_type),
    INDEX composite_idx_doctor_date (doctor_id, appointment_date)
);
```

#### 8. **doctor_availability** (Doctor work schedule)
```sql
CREATE TABLE doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL,
    day_of_week SMALLINT NOT NULL, -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lunch_break_start TIME,
    lunch_break_end TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) 
                         ON DELETE CASCADE,
    CONSTRAINT unique_availability 
        UNIQUE (doctor_id, day_of_week),
    INDEX idx_doctor (doctor_id)
);
```

#### 9. **medical_records** (Patient medical records)
```sql
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    record_type ENUM('diagnosis', 'prescription', 'lab_result', 'imaging', 
                     'procedure_note', 'vital_signs') NOT NULL,
    description TEXT,
    data JSONB, -- Flexible field for different record types
    recorded_by_doctor_id UUID,
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) 
                          ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (recorded_by_doctor_id) REFERENCES doctors(id),
    INDEX idx_patient (patient_id),
    INDEX idx_type (record_type),
    INDEX idx_date (record_date)
);
```

#### 10. **prescriptions** (Drug prescriptions)
```sql
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    dosage VARCHAR(100) NOT NULL, -- "500mg", "1-2 tablets", etc
    frequency VARCHAR(100) NOT NULL, -- "Three times daily", "Twice daily", etc
    duration_days INTEGER NOT NULL,
    instructions TEXT,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    prescribed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment FOREIGN KEY (appointment_id) 
                              REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT fk_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_patient (patient_id),
    INDEX idx_status (status)
);
```

#### 11. **medicines** (Pharmacy inventory)
```sql
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(150),
    strength VARCHAR(50), -- "500mg", "1%", etc
    form ENUM('tablet', 'capsule', 'liquid', 'injection', 'inhaler', 'cream', 'patch'),
    unit_price DECIMAL(10, 2) NOT NULL,
    current_stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 50,
    requires_prescription BOOLEAN DEFAULT false,
    expiry_date DATE,
    description TEXT,
    side_effects JSONB,
    contraindications JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_stock (current_stock)
);
```

#### 12. **pharmacy_cart** (Shopping cart items)
```sql
CREATE TABLE pharmacy_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    requires_prescription BOOLEAN,
    prescription_id UUID,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) 
                          ON DELETE CASCADE,
    CONSTRAINT fk_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    CONSTRAINT fk_prescription FOREIGN KEY (prescription_id) 
                               REFERENCES prescriptions(id),
    CONSTRAINT unique_cart 
        UNIQUE (patient_id, medicine_id),
    INDEX idx_patient (patient_id)
);
```

#### 13. **pharmacy_orders** (Pharmacy purchase orders)
```sql
CREATE TABLE pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'refunded', 'failed') 
                   DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'ready_for_pickup', 
                      'shipped', 'delivered', 'cancelled') 
                 DEFAULT 'pending',
    delivery_type ENUM('pickup', 'home_delivery') DEFAULT 'pickup',
    delivery_address TEXT,
    delivery_date DATE,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) 
                          ON DELETE CASCADE,
    INDEX idx_patient (patient_id),
    INDEX idx_status (order_status),
    INDEX idx_date (created_at)
);
```

#### 14. **pharmacy_order_items** (Items in pharmacy order)
```sql
CREATE TABLE pharmacy_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) 
                        REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_order (order_id)
);
```

#### 15. **telemedicine_sessions** (Video consultation sessions)
```sql
CREATE TABLE telemedicine_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    session_token VARCHAR(500), -- For video service provider
    video_provider ENUM('twilio', 'jitsi', 'agora') DEFAULT 'twilio',
    session_start_time TIMESTAMP,
    session_end_time TIMESTAMP,
    duration_minutes INTEGER,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') 
           DEFAULT 'scheduled',
    recording_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment FOREIGN KEY (appointment_id) 
                              REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status)
);
```

#### 16. **telemedicine_messages** (Chat messages during consultation)
```sql
CREATE TABLE telemedicine_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    sender_type ENUM('patient', 'doctor') NOT NULL,
    message_text TEXT,
    message_type ENUM('text', 'file', 'prescription') DEFAULT 'text',
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session FOREIGN KEY (session_id) 
                          REFERENCES telemedicine_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
);
```

#### 17. **blog_posts** (Healthcare resource articles)
```sql
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    category VARCHAR(50),
    tags TEXT[],
    featured_image_url VARCHAR(500),
    views_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES doctors(id),
    INDEX idx_slug (slug),
    INDEX idx_published (is_published),
    INDEX idx_category (category)
);
```

#### 18. **testimonials** (Patient reviews & ratings)
```sql
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    service_id UUID,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) 
                          ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_verified (is_verified)
);
```

#### 19. **payments** (Financial transactions)
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE,
    user_id UUID NOT NULL,
    appointment_id UUID,
    pharmacy_order_id UUID,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    payment_method ENUM('credit_card', 'mpesa', 'bank_transfer', 'wallet') 
                   NOT NULL,
    payment_gateway VARCHAR(50), -- 'pesapal', 'flutterwave', 'safaricom', etc
    gateway_reference VARCHAR(200),
    status ENUM('pending', 'success', 'failed', 'cancelled', 'refunded') 
           DEFAULT 'pending',
    metadata JSONB, -- Additional payment info
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_appointment FOREIGN KEY (appointment_id) 
                              REFERENCES appointments(id),
    CONSTRAINT fk_pharmacy_order FOREIGN KEY (pharmacy_order_id) 
                                 REFERENCES pharmacy_orders(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

#### 20. **support_tickets** (Live chat & customer support)
```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    subject VARCHAR(300) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') 
           DEFAULT 'open',
    assigned_to_user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_assigned FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);
```

#### 21. **support_messages** (Support ticket messages)
```sql
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_internal BOOLEAN DEFAULT false, -- Internal notes only
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) 
                         ON DELETE CASCADE,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id),
    INDEX idx_ticket (ticket_id)
);
```

#### 22. **notifications** (Email/SMS/Push notifications log)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL,
    notification_type ENUM('email', 'sms', 'push') NOT NULL,
    event_type ENUM('appointment_reminder', 'appointment_confirmed', 
                    'order_status', 'prescription_ready', 'payment_receipt') 
               NOT NULL,
    subject VARCHAR(300),
    content TEXT,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    related_entity_id VARCHAR(100), -- Appointment/Order/Prescription ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    INDEX idx_recipient (recipient_id),
    INDEX idx_status (status)
);
```

#### 23. **audit_log** (System audit trail for compliance)
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);
```

#### 24. **system_settings** (Admin configuration)
```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type VARCHAR(20), -- 'string', 'boolean', 'number', 'json'
    description TEXT,
    updated_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_key (setting_key)
);
```

---

### 2.2 Database Views & Materialized Views

#### View: Doctor Dashboard Summary
```sql
CREATE VIEW doctor_dashboard_summary AS
SELECT 
    d.id,
    d.user_id,
    u.first_name,
    u.last_name,
    sp.name AS specialty,
    COUNT(DISTINCT a.id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_appointments,
    COUNT(DISTINCT CASE WHEN a.appointment_date = CURRENT_DATE AND a.status NOT IN ('cancelled', 'no-show') THEN a.id END) AS today_appointments,
    d.rating,
    d.total_reviews
FROM doctors d
JOIN users u ON d.user_id = u.id
JOIN specialties sp ON d.specialty_id = sp.id
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.id, d.user_id, u.first_name, u.last_name, sp.name, d.rating, d.total_reviews;
```

#### Materialized View: Patient Analytics (for dashboard)
```sql
CREATE MATERIALIZED VIEW patient_analytics_summary AS
SELECT 
    p.id,
    u.email,
    COUNT(DISTINCT a.id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_appointments,
    COUNT(DISTINCT CASE WHEN a.appointment_date >= CURRENT_DATE THEN a.id END) AS upcoming_appointments,
    SUM(CASE WHEN po.order_status = 'delivered' THEN po.total_amount ELSE 0 END) AS pharmacy_spending,
    MAX(a.appointment_date) AS last_appointment_date
FROM patients p
JOIN users u ON p.user_id = u.id
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN pharmacy_orders po ON p.id = po.patient_id
GROUP BY p.id, u.email;

CREATE INDEX idx_patient_analytics ON patient_analytics_summary(id);
```

---

### 2.3 Key Constraints & Relationships

| Table | Constraint | Purpose |
|-------|-----------|---------|
| appointments | UNIQUE (doctor_id, appointment_date, appointment_time) | Prevent double-booking |
| patients | UNIQUE (user_id) | One patient profile per user |
| doctors | UNIQUE (user_id, license_number) | One doctor profile per user |
| pharmacy_cart | UNIQUE (patient_id, medicine_id) | One cart item per medicine |
| services | FK to specialties | Each service belongs to a specialty |
| appointments | FK to patients, doctors, services | Referential integrity |
| prescriptions | FK to medicines, doctor, appointment | Prescription tracking |

---

## Part 3: API Design (REST)

### 3.1 Authentication & Authorization

#### Endpoints

**POST /auth/register**
- Register new patient
- Request: `{email, password, first_name, last_name, phone_number}`
- Response: `{user_id, token, refresh_token}`
- Status: 201

**POST /auth/login**
- Request: `{email, password}`
- Response: `{user_id, token, refresh_token, role}`
- Status: 200

**POST /auth/refresh**
- Request: `{refresh_token}`
- Response: `{token, refresh_token}`
- Status: 200

**POST /auth/logout**
- Invalidate token
- Status: 204

**POST /auth/forgot-password**
- Send reset email
- Request: `{email}`
- Status: 200

**POST /auth/reset-password**
- Request: `{token, new_password}`
- Status: 200

---

### 3.2 Patient Management

**GET /patients/me**
- Get current patient profile
- Auth: Required (patient)
- Response: Full patient object with medical history
- Status: 200

**PUT /patients/me**
- Update patient profile
- Auth: Required (patient)
- Request: `{date_of_birth, gender, blood_type, emergency_contact_*, allergies, chronic_conditions}`
- Status: 200

**GET /patients/{id}/medical-records**
- Get patient medical records
- Auth: Required (patient own records, doctor, admin)
- Query Params: `record_type, date_from, date_to, limit=50, offset=0`
- Status: 200

**GET /patients/{id}/vitals**
- Get vital signs history
- Auth: Required
- Status: 200

---

### 3.3 Doctor Management

**GET /doctors**
- List all doctors
- Query Params: `specialty_id, department_id, available=true, rating_min=0, limit=20, offset=0`
- Response: Array of doctors with ratings
- Status: 200

**GET /doctors/{id}**
- Get doctor profile details
- Response: `{id, name, specialty, bio, experience, rating, reviews, languages, availability, education}`
- Status: 200

**GET /doctors/{id}/availability**
- Get doctor's availability slots
- Query Params: `date_from, date_to, duration=30`
- Response: Array of available time slots
- Status: 200

**PUT /doctors/{id}** (Admin/Doctor endpoint)
- Update doctor profile
- Auth: Required (admin or doctor)
- Status: 200

**GET /doctors/{id}/schedule**
- Get doctor's weekly schedule
- Auth: Required (admin, doctor)
- Status: 200

**POST /doctors/{id}/availability** (Admin/Doctor)
- Set doctor availability
- Request: `{day_of_week, start_time, end_time, lunch_break_start, lunch_break_end}`
- Status: 201

---

### 3.4 Services & Specialties

**GET /services**
- List all medical services
- Query Params: `specialty_id, category, available=true, limit=20, offset=0`
- Response: Array of services
- Status: 200

**GET /services/{id}**
- Get service details
- Status: 200

**GET /specialties**
- List all specialties
- Status: 200

**GET /specialties/{id}/doctors**
- Get doctors in a specialty
- Status: 200

---

### 3.5 Appointments

**POST /appointments**
- Create appointment booking
- Auth: Required (patient)
- Request: `{doctor_id, service_id, appointment_date, appointment_time, appointment_type, notes}`
- Business Logic:
  - Verify doctor availability
  - Check no double-booking
  - Validate appointment_date >= today
  - Reserve slot (transactional)
- Response: `{id, status: 'scheduled', confirmation_number}`
- Status: 201

**GET /appointments**
- List patient appointments (or all for admin)
- Auth: Required (patient gets own, admin/doctor filters)
- Query Params: `status, date_from, date_to, doctor_id, limit=20, offset=0`
- Status: 200

**GET /appointments/{id}**
- Get appointment details
- Auth: Required (patient/doctor/admin)
- Status: 200

**PUT /appointments/{id}**
- Update appointment (reschedule)
- Auth: Required (patient, admin)
- Request: `{appointment_date, appointment_time}`
- Status: 200

**DELETE /appointments/{id}**
- Cancel appointment
- Auth: Required (patient, admin)
- Request: `{cancellation_reason}`
- Status: 204

**GET /appointments/{id}/confirmation**
- Email confirmation after booking
- Auth: Required
- Status: 200 (triggers email)

---

### 3.6 Medical Records & Prescriptions

**POST /medical-records**
- Create medical record (doctor endpoint)
- Auth: Required (doctor, admin)
- Request: `{patient_id, record_type, description, data}`
- Status: 201

**GET /medical-records/{id}**
- Get specific record
- Auth: Required (patient owner, doctor, admin)
- Status: 200

**POST /prescriptions**
- Create prescription (doctor endpoint)
- Auth: Required (doctor)
- Request: `{appointment_id, patient_id, medicine_id, dosage, frequency, duration_days, instructions}`
- Status: 201

**GET /prescriptions**
- List prescriptions
- Auth: Required (patient gets own, doctor, admin)
- Query Params: `status, limit=20, offset=0`
- Status: 200

**PUT /prescriptions/{id}**
- Update prescription (doctor)
- Status: 200

---

### 3.7 Pharmacy

**GET /medicines**
- List available medicines
- Query Params: `category, requires_prescription, search, in_stock=true, limit=20, offset=0`
- Status: 200

**GET /medicines/{id}**
- Get medicine details
- Status: 200

**GET /medicines/search**
- Full-text search medicines
- Query Params: `q` (search query), `limit=20`
- Status: 200

**POST /pharmacy/cart**
- Add medicine to cart
- Auth: Required (patient)
- Request: `{medicine_id, quantity, prescription_id (if RX required)}`
- Business Logic: Verify prescription if required
- Status: 201

**GET /pharmacy/cart**
- Get shopping cart
- Auth: Required (patient)
- Status: 200

**PUT /pharmacy/cart/{medicine_id}**
- Update cart item quantity
- Status: 200

**DELETE /pharmacy/cart/{medicine_id}**
- Remove from cart
- Status: 204

**GET /pharmacy/cart/total**
- Calculate total amount
- Status: 200

**POST /pharmacy/orders**
- Create pharmacy order (checkout)
- Auth: Required (patient)
- Request: `{delivery_type, delivery_address, payment_method}`
- Response: `{order_id, order_number, total_amount, payment_url}`
- Status: 201

**GET /pharmacy/orders**
- List patient orders
- Auth: Required (patient)
- Status: 200

**GET /pharmacy/orders/{id}**
- Get order details & tracking
- Status: 200

**PUT /pharmacy/orders/{id}/cancel**
- Cancel order (if not shipped)
- Auth: Required (patient, admin)
- Status: 200

---

### 3.8 Telemedicine

**POST /telemedicine/sessions**
- Start new telemedicine session
- Auth: Required (patient/doctor)
- Request: `{appointment_id}`
- Response: `{session_id, session_token, video_provider_url}`
- Status: 201

**GET /telemedicine/sessions/{id}**
- Get session details
- Status: 200

**POST /telemedicine/sessions/{id}/messages**
- Send message in session
- Auth: Required (patient/doctor in session)
- Request: `{message_text, message_type}`
- Status: 201

**GET /telemedicine/sessions/{id}/messages**
- Get session chat history
- Status: 200

**POST /telemedicine/sessions/{id}/end**
- End session
- Auth: Required (doctor initiates)
- Request: `{notes}`
- Status: 204

---

### 3.9 Blog & Resources

**GET /blog**
- List blog posts
- Query Params: `category, author_id, published=true, limit=10, offset=0`
- Status: 200

**GET /blog/{slug}**
- Get blog post by slug
- Status: 200

**POST /blog** (Admin/Doctor)
- Create blog post
- Auth: Required (admin, doctor)
- Request: `{title, excerpt, content, category, tags, featured_image_url}`
- Response: `{id, slug}`
- Status: 201

**PUT /blog/{id}** (Admin/Doctor)
- Update blog post
- Status: 200

**DELETE /blog/{id}** (Admin/Doctor)
- Delete blog post
- Status: 204

---

### 3.10 Support & Live Chat

**POST /support/tickets**
- Create support ticket
- Auth: Required
- Request: `{subject, description, priority}`
- Status: 201

**GET /support/tickets**
- List user's tickets
- Auth: Required
- Status: 200

**POST /support/tickets/{id}/messages**
- Add message to ticket
- Request: `{message, attachment_url}`
- Status: 201

**GET /support/tickets/{id}**
- Get ticket details
- Status: 200

---

### 3.11 Payments

**POST /payments/process**
- Process payment (call external gateway)
- Auth: Required
- Request: `{amount, payment_method, related_entity_type, related_entity_id}`
- Response: `{transaction_id, payment_provider_url, status}`
- Status: 201

**GET /payments/verify/{transaction_id}**
- Verify payment status
- Status: 200

**POST /payments/webhook** (External gateway callback)
- Handle payment confirmation from M-Pesa, Stripe, etc
- Request: Varies by provider
- Status: 200

---

### 3.12 Reviews & Ratings

**POST /reviews**
- Submit doctor review
- Auth: Required (patient)
- Request: `{doctor_id, service_id, rating, comment}`
- Business Logic: Verify appointment with doctor exists
- Status: 201

**GET /reviews/doctor/{doctor_id}**
- Get doctor reviews
- Status: 200

**PUT /reviews/{id}** (Admin)
- Publish/moderate review
- Status: 200

---

### 3.13 Admin Endpoints

**GET /admin/dashboard**
- Get dashboard analytics
- Auth: Required (admin)
- Response: `{total_patients, total_appointments, total_revenue, top_services, recent_bookings}`
- Status: 200

**GET /admin/analytics/appointments**
- Detailed appointment analytics
- Query Params: `date_from, date_to, group_by=(daily|weekly|monthly)`
- Status: 200

**GET /admin/analytics/revenue**
- Revenue analytics
- Status: 200

**GET /admin/users**
- List all users
- Query Params: `role, status, search, limit=50, offset=0`
- Status: 200

**POST /admin/users**
- Create user (manual)
- Request: `{email, first_name, last_name, role, phone_number}`
- Status: 201

**PUT /admin/users/{id}**
- Update user
- Status: 200

**DELETE /admin/users/{id}**
- Deactivate user
- Status: 204

**GET /admin/appointments**
- List all appointments (filter by doctor, date, etc)
- Status: 200

**GET /admin/medicines**
- List all medicines with stock management
- Status: 200

**POST /admin/medicines**
- Add new medicine
- Status: 201

**PUT /admin/medicines/{id}**
- Update medicine details/stock
- Status: 200

**GET /admin/inventory**
- View pharmacy inventory with low stock alerts
- Status: 200

**GET /admin/settings**
- Get system settings
- Status: 200

**PUT /admin/settings**
- Update system settings
- Auth: Required (admin only)
- Status: 200

---

### 3.14 Error Handling

All endpoints return standard error responses:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Doctor not found",
    "details": {}
  },
  "statusCode": 404
}
```

**Common Status Codes:**
- `400` – Bad Request (validation error)
- `401` – Unauthorized (no token)
- `403` – Forbidden (insufficient permissions)
- `404` – Not Found
- `409` – Conflict (double-booking, duplicate email, etc)
- `422` – Unprocessable Entity
- `429` – Too Many Requests (rate limiting)
- `500` – Internal Server Error
- `503` – Service Unavailable

---

## Part 4: Backend Architecture & Components

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Node.js 20 LTS | Mature, widely-used, good performance |
| **Framework** | Express.js or Fastify | Express: ecosystem, Fastify: better performance |
| **Language** | TypeScript | Type safety, better IDE support, fewer bugs |
| **Database** | PostgreSQL 15+ | ACID compliance, strong consistency, perfect for medical data |
| **ORM** | Prisma or TypeORM | Prisma: simpler API, auto-migrations; TypeORM: more control |
| **Authentication** | JWT + Refresh Tokens | Stateless, scalable |
| **Authorization** | Role-Based Access Control (RBAC) | Flexible permission model |
| **Caching** | Redis | Fast reads, session storage, real-time notifications |
| **Message Queue** | RabbitMQ or Bull (Redis-based) | Async tasks, notifications, background jobs |
| **File Storage** | S3-compatible (AWS, Linode, Wasabi) | Scalable, cost-effective |
| **Video/Chat** | Twilio or Jitsi | Telemedicine video calls |
| **Logging** | Winston or Bunyan | Structured logging, log aggregation |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting |
| **Testing** | Jest + Supertest | Unit, integration, E2E tests |
| **API Documentation** | Swagger/OpenAPI | Auto-generated API docs |

**Recommended Stack:** Node.js + Express.js + TypeScript + PostgreSQL + Prisma + Redis + Bull + JWT

---

### 4.2 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── env.ts
│   │   └── constants.ts
│   ├── middleware/
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── logging.ts
│   │   └── rateLimiter.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── patients.controller.ts
│   │   ├── doctors.controller.ts
│   │   ├── appointments.controller.ts
│   │   ├── pharmacy.controller.ts
│   │   ├── telemedicine.controller.ts
│   │   ├── blog.controller.ts
│   │   ├── payments.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── support.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── patient.service.ts
│   │   ├── doctor.service.ts
│   │   ├── appointment.service.ts
│   │   ├── pharmacy.service.ts
│   │   ├── telemedicine.service.ts
│   │   ├── payment.service.ts
│   │   ├── notification.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   ├── audit.service.ts
│   │   └── analytics.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── patient.repository.ts
│   │   ├── doctor.repository.ts
│   │   ├── appointment.repository.ts
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── patients.routes.ts
│   │   ├── doctors.routes.ts
│   │   ├── appointments.routes.ts
│   │   ├── pharmacy.routes.ts
│   │   ├── telemedicine.routes.ts
│   │   ├── blog.routes.ts
│   │   ├── payments.routes.ts
│   │   ├── support.routes.ts
│   │   ├── admin.routes.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── encryption.ts
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   └── errors.ts
│   ├── jobs/
│   │   ├── appointmentReminder.job.ts
│   │   ├── orderStatusUpdate.job.ts
│   │   ├── prescriptionNotification.job.ts
│   │   └── analyticsGenerator.job.ts
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   └── ...
│   ├── seeds/
│   │   ├── specialties.seed.ts
│   │   ├── doctors.seed.ts
│   │   ├── services.seed.ts
│   │   ├── medicines.seed.ts
│   │   └── settings.seed.ts
│   ├── app.ts (Express app setup)
│   └── server.ts (Entry point)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.json
├── openapi.yaml
└── README.md
```

---

### 4.3 Key Components

#### 1. Authentication Service
- JWT generation with RS256 signing
- Refresh token rotation
- Password hashing (bcrypt, 12+ rounds)
- Multi-factor authentication (optional 2FA with Authy/TOTP)
- Session invalidation on logout

```typescript
// Example: JWT payload
interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: 'patient' | 'doctor' | 'admin' | 'staff';
  permissions: string[];
  iat: number;
  exp: number;
}
```

#### 2. Authorization & RBAC
Define permissions per role:
- **Patient:** View own records, book appointments, manage pharmacy orders
- **Doctor:** View patients, create records, prescribe, view telemedicine sessions
- **Admin:** Full access, user management, settings, analytics
- **Staff:** Support tickets, order management, limited patient data

#### 3. TLS/HTTPS & Session Security
- Force HTTPS in production
- Secure cookies with HttpOnly, Secure, SameSite flags
- CORS configured for frontend domain only
- Rate limiting (100 requests per minute per IP)
- CSRF protection tokens

#### 4. Data Encryption
- Encrypt sensitive PII at rest:
  - Social security numbers, insurance IDs
  - Blood type, allergies, medical conditions
- Use AES-256-CBC with database-stored encryption keys
- Encrypt passwords using bcrypt (one-way)

#### 5. Medical Data Compliance
- **HIPAA** (if US-based): Audit logs, access controls, data encryption
- **GDPR** (EU patients): Right to deletion, data portability, consent management
- **Kenya Data Protection Act:** Patient consent, data minimization
- Implement audit logging for all PHI access

#### 6. Appointment Management Service
```typescript
// Business logic for appointment booking
class AppointmentService {
  async bookAppointment(params: BookAppointmentParams) {
    // 1. Validate doctor availability
    // 2. Check for double-booking (lock with transaction)
    // 3. Verify service exists and is available
    // 4. Create appointment record (transactional)
    // 5. Queue confirmation email
    // 6. Update doctor availability cache
    // 7. Return confirmation
  }

  async rescheduleAppointment(appointmentId: string, newDate, newTime) {
    // 1. Verify appointment exists and is cancellable
    // 2. Check new slot availability
    // 3. Update appointment (transactional)
    // 4. Send notification to doctor & patient
  }

  async cancelAppointment(appointmentId: string, reason: string) {
    // 1. Mark as cancelled
    // 2. Release doctor slot
    // 3. Refund payment if applicable
    // 4. Send cancellation notification
  }
}
```

#### 7. Pharmacy Service
```typescript
class PharmacyService {
  async addToCart(patientId: string, medicineId: string, quantity: number) {
    // 1. Verify medicine exists & in stock
    // 2. If prescription-only: verify active prescription
    // 3. Add/update cart item
  }

  async checkout(patientId: string, paymentMethod: string) {
    // 1. Calculate order total
    // 2. Verify all cart items still available
    // 3. Create order record
    // 4. Clear cart
    // 5. Initiate payment
    // 6. Queue SMS with order tracking
  }
}
```

#### 8. Payment Processing
- **Integration:** M-Pesa, Stripe, PayPal, Pesapal
- **Webhook handlers** for payment confirmation
- **PCI DSS compliance:** Never store card data (tokenize with provider)
- **Idempotency:** Use idempotency keys to prevent duplicate charges
- **Reconciliation:** Daily payment reconciliation job

```typescript
class PaymentService {
  async initiatePayment(
    amount: number, 
    paymentMethod: 'mpesa' | 'card' | 'bank',
    orderId: string
  ) {
    // Create payment intent with external provider
    // Return provider's payment URL
  }

  async handleWebhook(webhookEvent: PaymentWebhookEvent) {
    // Verify webhook signature
    // Update payment status
    // Update related appointment/order status
    // Trigger notifications
  }
}
```

#### 9. Email & Notification Service
```typescript
class NotificationService {
  async sendAppointmentReminder(appointmentId: string) {
    // Queue job for 24 hours before appointment
    // Send email + SMS
  }

  async sendPrescriptionReady(prescriptionId: string) {
    // Patient gets notified when prescription is filled
  }

  async sendOrderStatus(orderId: string, newStatus: string) {
    // Pharmacy order status updates
  }
}

// Email provider: SendGrid, AWS SES, Mailgun
// SMS provider: Twilio, Vonage (Nexmo), AfricasTalking
```

#### 10. Telemedicine Service
```typescript
class TelemedicineService {
  async initiateSession(appointmentId: string) {
    // 1. Verify appointment and participants
    // 2. Create session record
    // 3. Generate video room token (Twilio/Jitsi)
    // 4. Return session URL to both parties
  }

  async endSession(sessionId: string, notes: string) {
    // 1. Close session
    // 2. Save chat history
    // 3. Generate consultation report
    // 4. Mark appointment as completed
  }
}
```

#### 11. Background Jobs (with Bull/RabbitMQ)
- **Appointment reminders:** 24 hours, 2 hours, 15 minutes before
- **Payment reconciliation:** Daily at 2 AM
- **Report generation:** Weekly/monthly analytics
- **Order status updates:** Check with logistics provider
- **Email/SMS sending:** Async queue processing
- **Database maintenance:** Index optimization, old log cleanup

#### 12. Caching Strategy (Redis)
```typescript
// Cache doctor availability for 1 hour
redis.setex(`doctor:${doctorId}:availability`, 3600, JSON.stringify(slots))

// Cache doctor ratings (24 hours)
redis.setex(`doctor:${doctorId}:stats`, 86400, JSON.stringify(stats))

// Session store for WebSocket connections (telemedicine)
redis.hset(`session:${sessionId}`, 'participants', JSON.stringify([...]))
```

---

### 4.4 Database Connection & Transaction Management

```typescript
// Prisma client with connection pooling
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Transaction example (prevent double-booking)
async function bookAppointment(doctorId, date, time, patientId) {
  return prisma.$transaction(async (tx) => {
    // Lock doctor slot for this time
    const slot = await tx.appointments.findUnique({
      where: { doctor_id_appointment_date_appointment_time: {...} },
    });
    
    if (slot) throw new Error('Slot already booked');

    // Create appointment
    const appointment = await tx.appointments.create({
      data: { doctor_id: doctorId, patient_id: patientId, ... },
    });

    // Update payment status
    await tx.payments.create({ ... });

    return appointment;
  });
}
```

---

### 4.5 API Security

**Headers to implement:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

**Rate Limiting & DDoS Protection:**
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

---

### 4.6 Logging & Monitoring

**Structured logging (Winston):**
```typescript
const logger = new winston.Logger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log sensitive operations
logger.info('Appointment created', {
  appointmentId: appt.id,
  doctorId: appt.doctor_id,
  patientId: appt.patient_id,
  timestamp: new Date(),
});
```

**Metrics (Prometheus):**
- API response times
- Database query duration
- Active connections
- Payment failures
- Appointment booking rate

---

## Part 5: Admin Dashboard Design

### 5.1 Architecture Overview

**Option A: Headless CMS + React (Recommended)**
- Technology: **Strapi** (open-source) or **Contentful** (SaaS)
- Frontend: React with TypeScript + Tailwind CSS
- Advantages: Decoupled from main app, reusable content API
- Drawbacks: Separate infrastructure

**Option B: Custom Admin Panel (React Internal)**
- Technology: React + TypeScript + React Router
- Advantages: Integrated with backend, single deployment
- Drawbacks: Built into codebase, more maintenance
- **Recommended for MediCare** (given the scope)

**Option C: No-Code Admin (Quick Setup)**
- Technology: **Forest Admin** or **AdminJS**
- Advantages: Zero-code, instant CRUD interfaces
- Drawbacks: Limited customization

---

### 5.2 Recommended: Custom React Admin Dashboard

#### Tech Stack
```
Frontend:
- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (navigation)
- Zustand (state management)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- shadcn/ui (components)
- react-admin (optional: pre-built admin framework)
- Chart.js / Recharts (analytics)
- React Hook Form + Zod (forms)

Testing:
- Jest + React Testing Library
- Cypress (E2E)
```

#### Project Structure
```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── DataTable/
│   │   │   └── DataTable.tsx (reusable table)
│   │   ├── Forms/
│   │   │   ├── DoctorForm.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   ├── MedicineForm.tsx
│   │   │   └── UserForm.tsx
│   │   ├── Charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── AppointmentChart.tsx
│   │   │   └── PatientChart.tsx
│   │   └── Modals/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── PatientManagement/
│   │   ├── DoctorManagement/
│   │   ├── AppointmentManagement/
│   │   ├── PharmacyManagement/
│   │   ├── BlogManagement/
│   │   ├── PaymentManagement/
│   │   ├── UserManagement/
│   │   ├── SystemSettings/
│   │   └── Analytics/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useForm.ts
│   ├── services/
│   │   └── api.ts (API client)
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── App.tsx
│   └── main.tsx
```

---

### 5.3 Key Dashboard Sections (UI/UX)

#### 1. **Dashboard Home** (Analytics Overview)

**Layout:**
- Overview cards (KPIs):
  - Total Patients (active, inactive)
  - Today's Appointments
  - Total Revenue (month/YTD)
  - Pending Orders
  - System Health Status

- Charts (Recharts/Chart.js):
  - Revenue trend (line chart, last 12 months)
  - Appointments by specialty (bar chart)
  - Patient growth (area chart)
  - Top-performing doctors (rank chart)

- Recent Appointments Table
  - Columns: Date, Patient, Doctor, Service, Status, Amount
  - Filters: Status, Doctor, Date Range
  - Actions: View, Cancel, Reschedule

- Quick Actions
  - Create appointment
  - Add doctor
  - Create blog post
  - View pending reviews

---

#### 2. **Patient Management**

**Features:**
- **Patient List View**
  - Table: ID, Name, Email, Phone, Registration Date, Last Appointment, Status
  - Search: Name, email, phone
  - Filters: Status (active/inactive/suspended), Registration date
  - Bulk actions: Export, Deactivate, Send message

- **Patient Detail View**
  - Profile section: Name, email, phone, DOB, gender, blood type
  - Emergency contact: Name & phone
  - Medical history: Allergies, chronic conditions, past surgeries
  - Appointment history: Sortable table
  - Prescriptions: Current & past
  - Medical records: Organized by type
  - Insurance: Provider, policy number

- **Add/Edit Patient**
  - Form with validation
  - Upload medical documents (PDFs)
  - Bulk import (CSV with patient data)

---

#### 3. **Doctor Management**

**Features:**
- **Doctor List View**
  - Table: Name, Specialty, License #, Rating, Reviews, Available, Status
  - Search: Name, specialty
  - Filters: Specialty, Availability, Rating
  - Actions: View, Edit, View Schedule, Message

- **Doctor Detail View**
  - Basic info: Name, email, phone, specialty, license
  - Availability: Weekly schedule editor
  - Performance metrics:
    - Total appointments
    - Average rating
    - Consultation fee
    - Department
  - Upcoming appointments: Calendar view + list
  - Patient feedback: Reviews with comments
  - Recent medical records: By appointment

- **Add/Edit Doctor**
  - Form: Name, email, phone, specialty, license, education, bio
  - Upload profile photo
  - Set consultation fee
  - Configure availability (drag-drop calendar)

---

#### 4. **Appointment Management**

**Features:**
- **Appointment List View**
  - Calendar view (month/week/day):
    - Drag-drop to reschedule
    - Color-coded by status (scheduled, completed, cancelled)
  - List view with advanced filters:
    - Date range, doctor, patient, service, status
  - Columns: Date, Time, Patient, Doctor, Service, Status, Amount, Actions

- **Appointment Detail View**
  - Appointment info: Date, time, duration
  - Patient info: Name, contact, medical history preview
  - Doctor info: Name, specialty, contact
  - Service: Name, price, duration
  - Notes field
  - Actions: Confirm, Reschedule, Cancel, Attach medical record

- **Reporting:**
  - No-show reports
  - Cancellation reasons analysis
  - Doctor scheduling efficiency

---

#### 5. **Pharmacy Management**

**Features:**
- **Medicine Inventory**
  - Table: Name, Generic Name, Category, Price, Stock, Reorder Level, Expiry
  - Search & filters: Category, In/Out of stock, Low stock alerts
  - Actions: Edit, Delete, Reorder

- **Add/Edit Medicine**
  - Basic: Name, generic name, category, strength, form
  - Pricing: Unit price, wholesale price, retail markup
  - Inventory: Current stock, reorder level, supplier
  - Medical info: Side effects, contraindications, interactions
  - Requires prescription: Toggle

- **Pharmacy Orders**
  - Table: Order #, Patient, Date, Total, Delivery Type, Status, Tracking
  - Filters: Status, Date range, Delivery type
  - Actions: View, Update status, Mark delivered, Print receipt
  - Order detail: Items, quantities, prices, delivery address

- **Inventory Reports**
  - Low stock alerts
  - Expiring medicines (red flag if <30 days)
  - Movement report (best-sellers, slow-movers)
  - Stock valuation report

---

#### 6. **User Management**

**Features:**
- **User List**
  - Table: Name, Email, Role, Status, Created Date, Last Login, Actions
  - Search & filters: Role, status, date range
  - Roles: Patient, Doctor, Admin, Staff

- **Add/Edit User**
  - Form: Name, email, phone, password (generated), role
  - Bulk invite: Upload CSV with emails
  - Send invite email

- **User Permissions**
  - Role-based permissions matrix
  - Set per-user overrides if needed
  - Audit log: Who changed what and when

---

#### 7. **Blog & Content Management**

**Features:**
- **Blog Post List**
  - Table: Title, Author, Category, Status (draft/published), Views, Date, Actions
  - Search & filters: Category, author, status, date range

- **Blog Post Editor**
  - Rich text editor (React Quill or Slate)
  - Featured image upload
  - Category & tags selection
  - SEO metadata: Slug, meta description, keywords
  - Publish/Draft/Schedule options
  - Preview button

- **Blog Categories**
  - CRUD for categories
  - Assign to posts

---

#### 8. **Payment Management**

**Features:**
- **Transactions List**
  - Table: ID, Amount, Payment Method, Status, Date, Related Entity
  - Search & filters: Status, method, date, amount range, doctor/patient

- **Transaction Detail**
  - Full transaction info
  - Payment gateway reference
  - Refund option (if applicable)
  - Receipt generation

- **Financial Reports**
  - Revenue by service
  - Revenue by doctor
  - Payment method breakdown
  - Refund tracking
  - Reconciliation status

---

#### 9. **System Settings**

**Features:**
- **Clinic Info**
  - Clinic name, address, phone, email
  - Logo & banner upload
  - Working hours

- **Payment Gateway Config**
  - M-Pesa: API key, secret
  - Stripe: API keys
  - Pesapal: Credentials
  - Enable/disable payment methods

- **Email & SMS Config**
  - Email provider: SendGrid API key
  - SMS provider: Twilio credentials, AfricasTalking token
  - Email templates editor (Liquid syntax):
    - Appointment confirmation
    - Prescription ready
    - Order shipped
    - Password reset

- **Telemedicine Config**
  - Video provider: Twilio/Jitsi credentials
  - Session timeout settings
  - Recording options

- **Business Rules**
  - Appointment booking window (min/max days ahead)
  - Cancellation window
  - No-show policy
  - Refund policy

---

#### 10. **Analytics & Reporting**

**Features:**
- **Patient Analytics**
  - New patients (trend)
  - Patient retention rate
  - Appointment attendance rate
  - Most visited services
  - Repeat vs. first-time patients

- **Operational Analytics**
  - Doctor efficiency: Appointments per doctor, average review
  - Pharmacy efficiency: Order fulfillment time, return rate
  - Appointment no-show rate by doctor
  - Average consultation duration

- **Financial Analytics**
  - Revenue trend (daily/monthly)
  - Average appointment value
  - Pharmacy revenue vs. service revenue
  - Payment method distribution

- **Exportable Reports**
  - PDF, Excel, CSV formats
  - Scheduled email reports (daily/weekly)

---

### 5.4 Security & Permissions

**Role-Based Access Control:**

| Feature | Patient | Doctor | Admin | Staff |
|---------|---------|--------|-------|-------|
| Dashboard | Own data | Department | Full | Limited |
| Edit Profile | Own only | Own only | User & own | Own only |
| View Patients | Own | Assigned | All | All (view) |
| Create Appointment | Own | Patient lookup | Any | Patient lookup |
| Approve Payment | - | - | Yes | - |
| System Settings | - | - | Yes | - |
| User Management | - | - | Yes | - |
| Export Data | - | - | Yes | Limited |

---

### 5.5 UI/UX Considerations

**Layout:**
```
┌─────────────────────────────────────┐
│           TOP HEADER                │
│  Logo | Dashboard | Profile | Logout│
├──────────────┬──────────────────────┤
│   SIDEBAR    │                      │
│   • Dashboard│   MAIN CONTENT       │
│   • Patients │   (Dynamic)          │
│   • Doctors  │                      │
│   • Appt     │                      │
│   • Pharmacy │                      │
│   • Blog     │                      │
│   • Settings │                      │
└──────────────┴──────────────────────┘
```

**Navigation:**
- Persistent sidebar with collapsible sections
- Breadcrumb navigation
- Search bar (global search across entities)
- Dark mode toggle
- Notification bell (new orders, low stock alerts)

**Forms:**
- Client-side validation (with Zod)
- Error messages inline
- Success toasts on save
- Auto-save drafts (for long forms)
- Cancel button with confirmation

**Tables:**
- Sortable columns
- Multi-column filters
- Pagination (20/50/100 rows)
- Row selection for bulk actions
- Expand row for details

**Feedback:**
- Toast notifications (success, error, info)
- Loading skeletons
- Empty states with helpful CTAs
- Error boundary for crashes

---

### 5.6 API Integration

**Authentication:**
```typescript
// API interceptor to attach JWT token
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

**Data Fetching (React Query):**
```typescript
// Fetch patients with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['patients', { page, search }],
  queryFn: () => apiClient.get('/admin/patients', { params: { page, search } }),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes cache
});

// Mutations
const createPatientMutation = useMutation({
  mutationFn: (data) => apiClient.post('/admin/patients', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['patients'] });
    toast.success('Patient created');
  },
});
```

---

### 5.7 Deployment & Hosting

**Admin Dashboard Deployment:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

**Environment Variables (.env.admin):**
```
REACT_APP_API_URL=https://api.medicare.ke
REACT_APP_API_TIMEOUT=30000
REACT_APP_LOG_LEVEL=info
```

**Hosting Options:**
- **Vercel:** React SPA optimal, free tier available
- **Netlify:** Similar to Vercel, good CI/CD
- **AWS S3 + CloudFront:** Self-hosted, highly scalable
- **Docker on AWS ECS/EKS:** Enterprise grade
- **Heroku:** Easy deployment, good for small teams

---

## Part 6: Deployment Architecture

### 6.1 Production Environment

```
┌─────────────────┐
│  React Frontend │
│  (Hosted on     │
│  Vercel/AWS S3) │
└────────┬────────┘
         │ HTTPS
    ┌────▼────────────────────┐
    │   CloudFlare CDN        │
    │   (DDoS Protection)     │
    └────┬─────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   AWS Application Load          │
    │   Balancer (SSL/TLS Cert)       │
    └────┬─────────────────────────────┘
         │
    ┌────▼─────────────────────────────────────────┐
    │  Backend Services (ECS Fargate Containers)   │
    │  - API Server (Express.js x 3 replicas)      │
    │  - Background Workers (Bull jobs x 2)        │
    │  - Telemedicine Signaling Server (x 2)       │
    └────┬──────────────────────────────┬──────────┘
         │                              │
    ┌────▼──────────────┐    ┌─────────▼────────┐
    │  RDS PostgreSQL   │    │   Redis Cache    │
    │  (Multi-AZ)       │    │   (Cluster Mode) │
    └───────────────────┘    └──────────────────┘
         │
    ┌────▼──────────────────┐
    │  S3 File Storage      │
    │  (Medical files,      │
    │   media, backups)     │
    └──────────────────────┘
```

---

### 6.2 Backup & Recovery Strategy

**Database Backups:**
- Automated daily backups (RDS)
- Point-in-time recovery enabled (35 days)
- Weekly manual snapshots to S3
- Monthly backups archived to Glacier

**File Backups:**
- S3 versioning enabled
- Cross-region replication for critical files
- Lifecycle policies (archive old files to Glacier after 90 days)

**Disaster Recovery:**
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour
- Documented recovery procedures
- Quarterly DR drills

---

### 6.3 Monitoring & Alerting

**Metrics to Monitor:**
- API response times (p50, p95, p99)
- Database query performance
- Error rates by endpoint
- Payment processing success rate
- Queue depth (background jobs)
- Disk space usage
- Memory consumption

**Alerts:**
```
- High error rate (>5%) → PagerDuty alert
- Payment failed (3+ consecutive) → PagerDuty + Slack
- Database connection pool exhausted → Slack warning
- Backup failed → Email to ops
- Low disk space (<10%) → Slack
```

---

## Summary Table: Technology Recommendations

| Component | Technology | Reason |
|-----------|-----------|--------|
| **Backend Framework** | Express.js (Node.js) | Mature, scalable, great ecosystem |
| **Language** | TypeScript | Type safety, fewer production bugs |
| **Database** | PostgreSQL 15+ | ACID compliance, medical data integrity |
| **ORM** | Prisma | Type-safe migrations, excellent DX |
| **Caching** | Redis | Sub-millisecond reads, session storage |
| **Job Queue** | Bull (Redis-backed) | Lightweight, no external infra |
| **Auth** | JWT + Refresh Tokens | Stateless, scalable |
| **File Storage** | AWS S3 | Reliable, cost-effective, CDN-friendly |
| **Telemedicine** | Twilio | HIPAA-compliant, proven reliability |
| **Email/SMS** | SendGrid + Twilio | Reliable delivery, good rates for Kenya |
| **Admin Dashboard** | React + React Query | Rich UI, excellent DX |
| **Hosting** | AWS (ECS Fargate + RDS) | Enterprise-grade, auto-scaling |
| **CDN** | CloudFlare | DDoS protection, fast global delivery |
| **Monitoring** | Prometheus + Grafana | Open-source, flexible, cost-effective |
| **Logging** | CloudWatch + DataDog | Centralized logs, good integration |

---

## Conclusion

This backend architecture provides:
✅ **Scalability** – Horizontal auto-scaling for traffic spikes  
✅ **Reliability** – Multi-AZ deployment, automated backups, health checks  
✅ **Security** – Encryption at rest/transit, RBAC, compliance-ready  
✅ **Performance** – Caching, CDN, database optimization  
✅ **Maintainability** – Clear structure, comprehensive monitoring, documentation  
✅ **Compliance** – Audit logs, data retention policies, medical data standards  

The admin dashboard empowers non-technical staff to manage content without backend access, improving operational efficiency and reducing IT burden.
