const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const serverless = require('serverless-http');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// NETLIFY ROUTING FIX: 
app.use((req, res, next) => {
    res.setHeader('X-Backend-Server', 'Abi_new-Node');
    next();
});

// Detailed request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

const STATIC_PATH = path.join(__dirname, '../');
console.log(`[EduAttend] Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`[EduAttend] Static directory: ${STATIC_PATH}`);
console.log(`[EduAttend] Port: ${process.env.PORT || 5000}`);

// 1. API Routes (Flexible Prefixing for Netlify/Local)
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const userRoutes = require('./routes/users');

// We mount the routes on both /api and / so they work in all environments
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/attendance', attendanceRoutes);
app.use('/attendance', attendanceRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

// 2. API Status/Root
app.get(['/api', '/api/status', '/status'], (req, res) => {
    res.json({
        status: 'online',
        message: 'Abi_new API is running with Supabase...',
        timestamp: new Date()
    });
});

// 3. Fallback for undefined API routes (Crucial: prevents returning HTML for API calls)
app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `API endpoint ${req.originalUrl} not found`
    });
});

// 4. Serve static files (Frontend)
const frontendPath = path.join(__dirname, '../');
app.use(express.static(frontendPath));

// 5. Catch-all for Frontend (SPA support)
app.use((req, res, next) => {
    // If it's a GET request and not for an API route, serve index.html
    if (req.method === 'GET' && !req.url.startsWith('/api')) {
        return res.sendFile(path.join(frontendPath, 'index.html'));
    }
    next();
});

// 6. Global error handler
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
    if (err.stack) console.error(err.stack);

    res.status(err.status || 500).json({
        error: 'Server Error',
        message: err.message || 'An unexpected error occurred'
    });
});

const PORT = process.env.PORT || 5000;

// ONLY start the local server if we are NOT on Netlify
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    app.listen(PORT, '0.0.0.0', async () => {
        console.log(`\n🚀 Local Server running on http://localhost:${PORT}`);
        // ... (rest of log)
    });
}

// Prevent server crash on unhandled errors
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for Netlify Functions
module.exports = app;
module.exports.handler = serverless(app);
