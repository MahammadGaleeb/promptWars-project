const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Security Headers =====
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// ===== GZIP Compression (built-in) =====
app.use((req, res, next) => {
    // Cache static assets for 1 day in production
    if (process.env.NODE_ENV === 'production') {
        if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
    next();
});

// ===== Serve Static Files =====
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
    index: 'index.html'
}));

// ===== Health Check Endpoint =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'DarshanFlow Command Center',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ===== API: Simulated System Status =====
app.get('/api/status', (req, res) => {
    res.json({
        system: 'nominal',
        totalDevotees: Math.floor(40000 + Math.random() * 20000),
        avgWaitMin: Math.floor(60 + Math.random() * 40),
        peakDensity: (2 + Math.random() * 3).toFixed(1),
        satisfaction: Math.floor(85 + Math.random() * 10),
        activeAlerts: Math.floor(2 + Math.random() * 4),
        timestamp: new Date().toISOString()
    });
});

// ===== Fallback: Serve index.html for all routes (SPA) =====
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║   DarshanFlow Command Center                ║');
    console.log('  ║   Intelligent Pilgrim Experience Dashboard   ║');
    console.log('  ╠══════════════════════════════════════════════╣');
    console.log(`  ║   🚀 Server running on port ${PORT}             ║`);
    console.log(`  ║   🌐 http://localhost:${PORT}                  ║`);
    console.log('  ║   📊 Health: /api/health                    ║');
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log('');
});
