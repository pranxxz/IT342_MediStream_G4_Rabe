## MediStream
MediStream is a lightweight patient queue and consultation management system designed specifically for small clinics and barangay health centers. The project aims to digitize the traditionally manual process of managing patient registration, tracking live queues, and storing medical history, thereby reducing errors and improving the patient experience.

## Core Features
### 1. Patient & Staff Management
Digital Registration: Easily add, edit, or delete patient profiles and manage medical staff records.

History Tracking: Instantly retrieve a patient’s full visit history and past consultation notes to ensure continuity of care.

### 2. Real-Time Queueing System
Live Status Updates: Patients are automatically added to the queue upon registration with a "Waiting" status.

Queue Transitions: Smoothly move patients from "Waiting" to "Consulting" and finally to "Done" after the visit.

### 3. Digital Consultations
Structured Logging: Medical professionals can record symptoms, diagnoses, prescriptions (medicine), and general remarks.

Consultation Service Layer: Built-in support for adding, updating, and fetching consultation records via a RESTful API.

## Technology Stack
Frontend: React 18, Javascript, and Tailwind CSS for a responsive web interface.

Mobile: Kotlin and Jetpack Compose for a native Android application.

Backend: Java 17 with Spring Boot 3.x and Spring Security.

Database: PostgreSQL 14+ for secure relational data storage.

Authentication: JWT (JSON Web Tokens) for session handling and Bcrypt for password hashing.

#### Backend (Spring Boot)
Steps to run:
1. Open a terminal and navigate to the backend directory: cd backend\demo
2. Run the Maven wrapper: .\mvnw.cmd spring-boot:run

#### Frontend (React + JavaScript)
Steps to run:
1. Open a terminal and navigate to the backend directory: cd web\medistream
2. Install dependencies (if not already done): npm install
3. Start the development server: npm start

The app will be available at http://localhost:3000 by default.

#### Database
PostgreSQL must be running locally.
JWT and Bcrypt are configured in the backend – no extra steps needed for basic setup.
