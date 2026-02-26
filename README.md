# EduAttend 🎓
### Smart Institutional Gateway & Attendance Management System

EduAttend is a premium, full-stack educational management platform designed for modern institutions. It streamlines the connection between faculty and students through a secure, real-time interface powered by **Node.js** and **Supabase**.

![EduAttend Preview](https://images.unsplash.com/photo-1523240715181-014b9f81800e?auto=format&fit=crop&q=80&w=1000)

## ✨ Key Features

- **🔐 Dual-Portal Security**: Separate, secure gateways for Faculty and Students.
- **🚀 Real-time Database**: Powered by Supabase for instant data synchronization.
- **📊 Interactive Dashboards**: 
    - **Faculty**: Mark attendance, view student analytics, and manage courses.
    - **Students**: Track attendance percentage, view performance quotes, and recent logs.
- **📱 Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- **☁️ Auto-Registration**: Seamless onboarding process for new students.

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Glassmorphism), HTML5.
- **Backend**: Node.js, Express.js.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing.

## 🚀 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/EduAttend.git
   cd EduAttend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Configuration**:
   - Create a project on [Supabase](https://supabase.com/).
   - Run the SQL script found in `Backend/supabase_setup.sql` in the Supabase SQL Editor.
   - Create a `.env` file in the `Backend` directory:
     ```env
     PORT=5000
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_anon_key
     JWT_SECRET=your_secret_key
     ```

4. **Run the application**:
   ```bash
   npm start
   ```

## 🌐 Deployment

### Backend (Render/Railway/Heroku)
- Set the root directory to `Backend`.
- Build Command: `npm install`
- Start Command: `node server.js`
- Ensure all Environment Variables are added to the host dashboard.

### Frontend (Netlify/Vercel/GitHub Pages)
- Connect your GitHub repository.
- Publish directory: `Root` (where `index.html` is located).

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for Educational Excellence.*
