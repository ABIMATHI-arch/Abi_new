# EduAttend Backend (Supabase Edition)

A robust Node.js and Express.js backend for the EduAttend educational attendance system, powered by Supabase.

## Features
- **JWT Authentication**: Secure login for both students and faculty.
- **Role-Based Access Control**: Different permissions for Students and Faculty.
- **Attendance Management**: Faculty can mark attendance, and students can view their history via Supabase.
- **Supabase Integration**: Real-time database and secure storage.

## Tech Stack
- **Node.js**
- **Express.js**
- **Supabase** (PostgreSQL)
- **JWT (JSON Web Tokens)**
- **Bcrypt.js**

## Getting Started

### Prerequisites
- Node.js installed
- A Supabase project (URL and Anon Key)

### Installation
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_secret_key
   ```
4. Set up the Database:
   - Copy the content of `supabase_setup.sql` and run it in your Supabase SQL Editor.
5. Seed the database (Optional):
   ```bash
   node seed.js
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Attendance
- `POST /api/attendance/mark` - Mark student attendance (Faculty only)
- `GET /api/attendance/my-history` - Get own attendance (Student only)
- `GET /api/attendance/all` - Get all marked attendance (Faculty only)

### Users
- `GET /api/users/students` - Get list of students (Faculty only)
