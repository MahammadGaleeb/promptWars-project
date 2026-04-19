// ===== DarshanFlow Command Center — Live Dashboard Engine =====
// Error-free, polyfilled, production-ready version

// ===== POLYFILL: roundRect for older browsers =====
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        if (!Array.isArray(radii)) radii = [radii || 0];
        const tl = radii[0] || 0, tr = radii[1] || radii[0] || 0;
        const br = radii[2] || radii[0] || 0, bl = radii[3] || radii[1] || radii[0] || 0;
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br);
        this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl);
        this.quadraticCurveTo(x, y, x + tl, y);
        this.closePath();
        return this;
    };
}

// ===== UTILITY FUNCTIONS =====
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return Math.random() * (max - min) + min; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function animateValue(el, start, end, duration, suffix) {
    if (!el) return;
    suffix = suffix || '';
    const startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(lerp(start, end, eased));
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function parseDisplayedNumber(el) {
    if (!el) return 0;
    return parseInt(el.textContent.replace(/[^0-9\-]/g, '')) || 0;
}

// ===== CLOCK =====
function updateClock() {
    var now = new Date();
    var dateEl = document.getElementById('clock-date');
    var timeEl = document.getElementById('clock-time');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ===== SIMULATED STATE =====
var state = {
    totalDevotees: 47823,
    throughputPerHour: 4250,
    avgWaitMin: 82,
    satisfaction: 91,
    peakDensity: 3.2,
    lostPersons: 1,
    mealsServed: 18420,
    gates: [
        { id: 'G1', name: 'General Gate 1', type: 'general', occupancy: 78, wait: 12 },
        { id: 'G2', name: 'General Gate 2', type: 'general', occupancy: 52, wait: 6 },
        { id: 'G3', name: 'General Gate 3', type: 'general', occupancy: 91, wait: 22 },
        { id: 'G4', name: 'General Gate 4', type: 'general', occupancy: 65, wait: 9 },
        { id: 'G5', name: 'General Gate 5', type: 'general', occupancy: 44, wait: 4 },
        { id: 'G6', name: 'General Gate 6', type: 'general', occupancy: 72, wait: 11 },
        { id: 'G7', name: 'General Gate 7', type: 'general', occupancy: 58, wait: 7 },
        { id: 'G8', name: 'General Gate 8', type: 'general', occupancy: 83, wait: 15 },
        { id: 'P1', name: 'Priority Gate 1', type: 'priority', occupancy: 38, wait: 3 },
        { id: 'P2', name: 'Priority Gate 2', type: 'priority', occupancy: 45, wait: 4 },
        { id: 'V1', name: 'VIP Gate', type: 'vip', occupancy: 22, wait: 1 },
    ],
    priorities: [
        { name: 'Senior Citizens', color: '#fd79a8', count: 3240, wait: '18 min', icon: '\u{1F474}' },
        { name: 'Pregnant Women', color: '#e17055', count: 890, wait: '12 min', icon: '\u{1F930}' },
        { name: 'Differently Abled', color: '#6c5ce7', count: 1120, wait: '15 min', icon: '\u267F' },
        { name: 'Children (<5)', color: '#00b894', count: 4560, wait: '20 min', icon: '\u{1F476}' },
        { name: 'VIP Pass', color: '#fdcb6e', count: 2100, wait: '5 min', icon: '\u2B50' },
        { name: 'General', color: '#0984e3', count: 35913, wait: '82 min', icon: '\u{1F64F}' },
    ],
    facilities: [
        { name: 'Restrooms', icon: '\u{1F6BB}', usage: 68, detail: '5/8 available', color: '#0984e3' },
        { name: 'Annadanam Hall', icon: '\u{1F37D}\uFE0F', usage: 74, detail: '18,420 served', color: '#00b894' },
        { name: 'Water Stations', icon: '\u{1F4A7}', usage: 42, detail: '85% stock', color: '#6c5ce7' },
        { name: 'Parking', icon: '\u{1F17F}\uFE0F', usage: 78, detail: '3,120 / 4,000', color: '#e17055' },
        { name: 'Prasadam Counter', icon: '\u{1F64F}', usage: 56, detail: '12,300 distributed', color: '#fdcb6e' },
        { name: 'Medical Station', icon: '\u{1F3E5}', usage: 15, detail: '2 cases active', color: '#fd79a8' },
    ],
    alerts: [
        { level: 'warning', icon: '\u26A0\uFE0F', title: 'Gate G3: High Density', desc: 'Occupancy at 91%. Flow Marshals deploying to Zone C.', time: '2 min ago' },
        { level: 'advisory', icon: '\u{1F4E2}', title: 'Prasadam Station 2: Low Stock', desc: 'Inventory at 22%. Kitchen restocking. ETA 15 min.', time: '5 min ago' },
        { level: 'info', icon: '\u2139\uFE0F', title: 'Queue Segment 7 Cleared', desc: 'Wait time reduced from 45 to 28 minutes.', time: '8 min ago' },
        { level: 'info', icon: '\u2705', title: 'Lost Person Recovered', desc: 'Child (#RF-44821) reunited. Recovery: 3.2 min.', time: '12 min ago' },
    ],
    staff: [
        { role: 'Flow Marshal', zone: 'Zone A - Gate G1-G3', icon: '\u{1F9BA}', status: 'active' },
        { role: 'Flow Marshal', zone: 'Zone B - Gate G4-G6', icon: '\u{1F9BA}', status: 'active' },
        { role: 'Flow Marshal', zone: 'Zone C - Sanctum', icon: '\u{1F9BA}', status: 'deployed' },
        { role: 'Medical Responder', zone: 'Station Alpha', icon: '\u{1F3E5}', status: 'standby' },
        { role: 'Medical Responder', zone: 'Station Beta', icon: '\u{1F3E5}', status: 'active' },
        { role: 'Ambassador', zone: 'Queue Seg 3-5', icon: '\u{1F60A}', status: 'active' },
        { role: 'Ambassador', zone: 'Concourse East', icon: '\u{1F60A}', status: 'active' },
        { role: 'Security Lead', zone: 'Command Center', icon: '\u{1F6E1}\uFE0F', status: 'active' },
    ],
    journey: [
        { name: 'Pre-Booking', detail: 'Online slot allocation', count: 62400, status: 'completed' },
        { name: 'Arrival & Screening', detail: 'Security + Wristband', count: 51200, status: 'completed' },
        { name: 'Gate Entry', detail: 'QR/NFC verification', count: 47823, status: 'active' },
        { name: 'Queue Progression', detail: 'Dynamic compartments', count: 38500, status: 'active' },
        { name: 'Darshan', detail: 'Sanctum visit', count: 31200, status: 'active' },
        { name: 'Prasadam & Facilities', detail: 'Post-darshan services', count: 24800, status: 'pending' },
        { name: 'Exit & Feedback', detail: 'Staggered egress', count: 18600, status: 'pending' },
    ],
};

// ===== HEATMAP =====
var heatmapZones = [
    { name: 'Gate G1-G3', x: 0.08, y: 0.15, w: 0.18, h: 0.22, density: 0.78 },
    { name: 'Gate G4-G6', x: 0.08, y: 0.55, w: 0.18, h: 0.22, density: 0.55 },
    { name: 'Gate G7-G8', x: 0.74, y: 0.15, w: 0.18, h: 0.22, density: 0.83 },
    { name: 'Priority P1-P2', x: 0.74, y: 0.55, w: 0.18, h: 0.22, density: 0.38 },
    { name: 'Queue 1-3', x: 0.29, y: 0.10, w: 0.18, h: 0.18, density: 0.65 },
    { name: 'Queue 4-6', x: 0.29, y: 0.40, w: 0.18, h: 0.18, density: 0.72 },
    { name: 'Queue 7-9', x: 0.29, y: 0.70, w: 0.18, h: 0.18, density: 0.50 },
    { name: 'Sanctum', x: 0.50, y: 0.35, w: 0.22, h: 0.28, density: 0.92 },
    { name: 'Prasadam', x: 0.52, y: 0.72, w: 0.18, h: 0.18, density: 0.45 },
    { name: 'Annadanam', x: 0.52, y: 0.05, w: 0.18, h: 0.16, density: 0.60 },
    { name: 'VIP Gate', x: 0.74, y: 0.84, w: 0.18, h: 0.10, density: 0.22 },
    { name: 'Parking', x: 0.08, y: 0.84, w: 0.18, h: 0.10, density: 0.68 },
];

function getDensityColor(d) {
    if (d < 0.35) return { r: 0, g: 184, b: 148, a: 0.6 };
    if (d < 0.55) return { r: 253, g: 203, b: 110, a: 0.65 };
    if (d < 0.80) return { r: 225, g: 112, b: 85, a: 0.7 };
    return { r: 214, g: 48, b: 49, a: 0.8 };
}

function renderHeatmap() {
    var canvas = document.getElementById('heatmap-canvas');
    var container = document.getElementById('heatmap-container');
    var labelsEl = document.getElementById('heatmap-labels');
    if (!canvas || !container || !labelsEl) return;

    var rect = container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    var W = rect.width, H = rect.height;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Temple outline
    ctx.strokeStyle = 'rgba(108,92,231,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(W * 0.04, H * 0.03, W * 0.92, H * 0.94);

    // Sanctum outline
    ctx.strokeStyle = 'rgba(253,203,110,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(W * 0.50, H * 0.35, W * 0.22, H * 0.28);

    // Connecting paths (dashed)
    ctx.strokeStyle = 'rgba(108,92,231,0.12)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(W * 0.26, H * 0.26); ctx.lineTo(W * 0.29, H * 0.19); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.26, H * 0.66); ctx.lineTo(W * 0.29, H * 0.49); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.47, H * 0.49); ctx.lineTo(W * 0.50, H * 0.49); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.74, H * 0.26); ctx.lineTo(W * 0.72, H * 0.19); ctx.stroke();
    ctx.setLineDash([]);

    // Zones
    labelsEl.innerHTML = '';
    heatmapZones.forEach(function (zone) {
        var zx = zone.x * W, zy = zone.y * H, zw = zone.w * W, zh = zone.h * H;
        var col = getDensityColor(zone.density);

        // Glow
        var grad = ctx.createRadialGradient(zx + zw / 2, zy + zh / 2, 0, zx + zw / 2, zy + zh / 2, Math.max(zw, zh) * 0.8);
        grad.addColorStop(0, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + col.a + ')');
        grad.addColorStop(0.5, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (col.a * 0.4) + ')');
        grad.addColorStop(1, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',0)');
        ctx.fillStyle = grad;
        ctx.fillRect(zx - zw * 0.15, zy - zh * 0.15, zw * 1.3, zh * 1.3);

        // Zone rect
        ctx.fillStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (col.a * 0.3) + ')';
        ctx.beginPath();
        ctx.roundRect(zx, zy, zw, zh, 5);
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (col.a * 0.6) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(zx, zy, zw, zh, 5);
        ctx.stroke();

        // Label
        var lbl = document.createElement('div');
        lbl.className = 'heatmap-zone-label';
        lbl.style.left = (zone.x * 100 + zone.w * 50) + '%';
        lbl.style.top = (zone.y * 100 + zone.h * 50) + '%';
        lbl.style.transform = 'translate(-50%,-50%)';
        lbl.style.textAlign = 'center';
        lbl.innerHTML = zone.name + '<br><span style="font-size:0.55rem;opacity:0.7">' + (zone.density * 6).toFixed(1) + '/m\u00B2</span>';
        labelsEl.appendChild(lbl);
    });

    // Moving dots
    var t = Date.now() / 1000;
    for (var i = 0; i < 35; i++) {
        var px = W * (0.12 + Math.sin(t * 0.3 + i * 1.7) * 0.04 + (i % 8) * 0.1);
        var py = H * (0.12 + Math.cos(t * 0.2 + i * 2.1) * 0.04 + Math.floor(i / 8) * 0.22);
        var alpha = 0.25 + Math.sin(t * 2 + i) * 0.15;
        ctx.fillStyle = 'rgba(108,92,231,' + alpha + ')';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== GATES =====
function renderGates() {
    var list = document.getElementById('gates-list');
    if (!list) return;
    list.innerHTML = '';
    state.gates.forEach(function (gate) {
        var barColor = gate.occupancy > 85 ? '#d63031' : gate.occupancy > 65 ? '#e17055' : gate.occupancy > 40 ? '#fdcb6e' : '#00b894';
        var occColor = gate.occupancy > 85 ? '#d63031' : gate.occupancy > 65 ? '#e17055' : '#00b894';
        var item = document.createElement('div');
        item.className = 'gate-item';
        item.innerHTML =
            '<div class="gate-icon ' + gate.type + '">' + gate.id + '</div>' +
            '<div class="gate-info">' +
            '<div class="gate-name">' + gate.name + '</div>' +
            '<div class="gate-stats">' +
            '<span class="gate-wait">\u23F1 ' + gate.wait + ' min</span>' +
            '<div class="gate-bar-container"><div class="gate-bar" style="width:' + gate.occupancy + '%;background:' + barColor + '"></div></div>' +
            '</div>' +
            '</div>' +
            '<span class="gate-occupancy" style="color:' + occColor + '">' + gate.occupancy + '%</span>';
        list.appendChild(item);
    });
}

// ===== PRIORITY QUEUE =====
function renderPriority() {
    var container = document.getElementById('priority-breakdown');
    if (!container) return;
    container.innerHTML = '';
    state.priorities.forEach(function (p) {
        var row = document.createElement('div');
        row.className = 'priority-row';
        row.innerHTML =
            '<span style="font-size:1.1rem">' + p.icon + '</span>' +
            '<span class="priority-name">' + p.name + '</span>' +
            '<span class="priority-count" style="color:' + p.color + '">' + p.count.toLocaleString() + '</span>' +
            '<span class="priority-wait">~' + p.wait + '</span>';
        container.appendChild(row);
    });
    renderPriorityChart();
}

function renderPriorityChart() {
    var canvas = document.getElementById('priority-chart');
    if (!canvas) return;
    var container = canvas.parentElement;
    var rect = container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    var cx = rect.width / 2, cy = rect.height / 2;
    var outerR = Math.min(cx, cy) - 10;
    var innerR = outerR * 0.6;
    if (outerR < 5) return;

    var total = 0;
    state.priorities.forEach(function (p) { total += p.count; });
    var startAngle = -Math.PI / 2;

    state.priorities.forEach(function (p) {
        var sliceAngle = (p.count / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        startAngle += sliceAngle;
    });

    ctx.fillStyle = '#f0f0f5';
    ctx.font = '700 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString(), cx, cy - 6);
    ctx.fillStyle = '#6b7084';
    ctx.font = '500 8px Inter, sans-serif';
    ctx.fillText('Total in Queue', cx, cy + 10);
}

// ===== WAIT TIME CHART =====
var waitTimeData = { predicted: [], actual: [], labels: [] };

function generateWaitTimeData() {
    var now = new Date();
    waitTimeData.predicted = [];
    waitTimeData.actual = [];
    waitTimeData.labels = [];
    for (var i = 59; i >= 0; i--) {
        var t = new Date(now.getTime() - i * 60000);
        waitTimeData.labels.push(t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
        var base = 70 + 30 * Math.sin((60 - i) / 60 * Math.PI);
        waitTimeData.predicted.push(base + rand(-5, 5));
        waitTimeData.actual.push(base + rand(-10, 8));
    }
}
generateWaitTimeData();

function drawCanvasLine(ctx, data, padLeft, padTop, chartW, chartH, minVal, range, color, dash) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (var i = 0; i < data.length; i++) {
        var x = padLeft + (i / (data.length - 1)) * chartW;
        var y = padTop + chartH - (chartH * (data[i] - minVal) / range);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
}

function renderWaitTimeChart() {
    var canvas = document.getElementById('waittime-chart');
    if (!canvas) return;
    var container = canvas.parentElement;
    var rect = container.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return;

    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    var W = rect.width, H = rect.height;
    var pad = { top: 20, right: 10, bottom: 30, left: 40 };
    var cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    var allVals = waitTimeData.predicted.concat(waitTimeData.actual);
    var maxVal = Math.ceil(Math.max.apply(null, allVals) / 10) * 10 + 10;
    var minVal = Math.floor(Math.min.apply(null, allVals) / 10) * 10 - 10;
    var range = maxVal - minVal || 1;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.font = '500 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#6b7084';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 5; i++) {
        var val = minVal + (range / 5) * i;
        var gy = pad.top + cH - (cH * (val - minVal) / range);
        ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(W - pad.right, gy); ctx.stroke();
        ctx.fillText(Math.round(val) + 'm', pad.left - 6, gy + 3);
    }

    // X labels
    ctx.textAlign = 'center';
    var labelInt = Math.ceil(waitTimeData.labels.length / 8);
    for (var j = 0; j < waitTimeData.labels.length; j++) {
        if (j % labelInt === 0) {
            var lx = pad.left + (j / (waitTimeData.labels.length - 1)) * cW;
            ctx.fillText(waitTimeData.labels[j], lx, H - 8);
        }
    }

    // Area fill
    ctx.beginPath();
    for (var k = 0; k < waitTimeData.actual.length; k++) {
        var ax = pad.left + (k / (waitTimeData.actual.length - 1)) * cW;
        var ay = pad.top + cH - (cH * (waitTimeData.actual[k] - minVal) / range);
        if (k === 0) ctx.moveTo(ax, ay); else ctx.lineTo(ax, ay);
    }
    ctx.lineTo(pad.left + cW, pad.top + cH);
    ctx.lineTo(pad.left, pad.top + cH);
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
    grad.addColorStop(0, 'rgba(108,92,231,0.2)');
    grad.addColorStop(1, 'rgba(108,92,231,0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Lines
    drawCanvasLine(ctx, waitTimeData.predicted, pad.left, pad.top, cW, cH, minVal, range, '#00b894', [6, 4]);
    drawCanvasLine(ctx, waitTimeData.actual, pad.left, pad.top, cW, cH, minVal, range, '#6c5ce7', []);

    // Legend
    ctx.font = '500 9px Inter, sans-serif';
    ctx.fillStyle = '#6c5ce7';
    ctx.fillRect(pad.left + 10, pad.top + 6, 14, 3);
    ctx.fillStyle = '#a0a3b5';
    ctx.textAlign = 'left';
    ctx.fillText('Actual', pad.left + 30, pad.top + 10);
    ctx.strokeStyle = '#00b894';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(pad.left + 80, pad.top + 8); ctx.lineTo(pad.left + 94, pad.top + 8); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#a0a3b5';
    ctx.fillText('Predicted', pad.left + 100, pad.top + 10);
}

function renderWaitTimeStats() {
    var el = document.getElementById('waittime-stats');
    if (!el) return;
    var g = state.avgWaitMin, p = Math.round(g * 0.22), v = Math.round(g * 0.06);
    el.innerHTML =
        '<div class="wt-stat"><span class="wt-stat-label">General</span><span class="wt-stat-value" style="color:#0984e3">' + g + ' min</span></div>' +
        '<div class="wt-stat"><span class="wt-stat-label">Priority</span><span class="wt-stat-value" style="color:#fd79a8">' + p + ' min</span></div>' +
        '<div class="wt-stat"><span class="wt-stat-label">VIP</span><span class="wt-stat-value" style="color:#fdcb6e">' + v + ' min</span></div>' +
        '<div class="wt-stat"><span class="wt-stat-label">Peak Today</span><span class="wt-stat-value" style="color:#e17055">118 min</span></div>';
}

// ===== ALERTS =====
function renderAlerts() {
    var list = document.getElementById('alerts-list');
    var countEl = document.getElementById('alert-count');
    if (!list || !countEl) return;
    list.innerHTML = '';
    countEl.textContent = state.alerts.length;

    state.alerts.forEach(function (a) {
        var item = document.createElement('div');
        item.className = 'alert-item ' + a.level;
        item.innerHTML =
            '<span class="alert-level-icon">' + a.icon + '</span>' +
            '<div class="alert-body">' +
            '<div class="alert-title">' + a.title + '</div>' +
            '<div class="alert-desc">' + a.desc + '</div>' +
            '<div class="alert-time">' + a.time + '</div>' +
            '</div>';
        list.appendChild(item);
    });

    var banner = document.getElementById('alert-banner');
    var bannerC = document.getElementById('alert-content');
    var warning = null;
    for (var i = 0; i < state.alerts.length; i++) {
        if (state.alerts[i].level === 'warning' || state.alerts[i].level === 'emergency') { warning = state.alerts[i]; break; }
    }
    if (warning && banner && bannerC) {
        bannerC.innerHTML = '\u26A0\uFE0F ACTIVE: ' + warning.title + ' \u2014 ' + warning.desc;
        banner.classList.add('visible');
    } else if (banner) {
        banner.classList.remove('visible');
    }
}

// ===== FACILITIES =====
function renderFacilities() {
    var grid = document.getElementById('facilities-grid');
    if (!grid) return;
    grid.innerHTML = '';
    state.facilities.forEach(function (f) {
        var sc = f.usage > 80 ? '#d63031' : f.usage > 60 ? '#e17055' : '#00b894';
        var card = document.createElement('div');
        card.className = 'facility-card';
        card.innerHTML =
            '<div class="facility-header"><span class="facility-icon">' + f.icon + '</span><span class="facility-status-dot" style="background:' + sc + '"></span></div>' +
            '<div class="facility-name">' + f.name + '</div>' +
            '<div class="facility-bar-bg"><div class="facility-bar" style="width:' + f.usage + '%;background:' + f.color + '"></div></div>' +
            '<div class="facility-detail">' + f.detail + '</div>';
        grid.appendChild(card);
    });
}

// ===== KPIs =====
function renderKPIs(fromZero) {
    var thEl = document.getElementById('kpi-throughput-val');
    var waitEl = document.getElementById('kpi-avg-wait-val');
    var satEl = document.getElementById('kpi-satisfaction-val');
    var densEl = document.getElementById('kpi-density-val');
    var lostEl = document.getElementById('kpi-lost-val');
    var mealEl = document.getElementById('kpi-meals-val');

    if (fromZero) {
        animateValue(thEl, 0, state.throughputPerHour, 1500);
        animateValue(waitEl, 0, state.avgWaitMin, 1200, ' min');
        animateValue(satEl, 0, state.satisfaction, 1400, '%');
        animateValue(mealEl, 0, state.mealsServed, 1600);
    } else {
        // Smooth update from current to new value
        animateValue(thEl, parseDisplayedNumber(thEl), state.throughputPerHour, 2000);
        animateValue(waitEl, parseDisplayedNumber(waitEl), state.avgWaitMin, 2000, ' min');
        animateValue(satEl, parseDisplayedNumber(satEl), state.satisfaction, 2000, '%');
        animateValue(mealEl, parseDisplayedNumber(mealEl), state.mealsServed, 2000);
    }

    if (densEl) {
        densEl.textContent = state.peakDensity.toFixed(1) + '/m\u00B2';
        densEl.style.color = state.peakDensity > 5 ? '#d63031' : state.peakDensity > 3.5 ? '#e17055' : '#00b894';
    }
    if (lostEl) lostEl.textContent = state.lostPersons;
}

// ===== STAFF =====
function renderStaff() {
    var grid = document.getElementById('staff-grid');
    if (!grid) return;
    grid.innerHTML = '';
    state.staff.forEach(function (s) {
        var sc = s.status === 'active' ? '#00b894' : s.status === 'deployed' ? '#e17055' : '#6b7084';
        var bgRgb = s.status === 'active' ? '0,184,148' : s.status === 'deployed' ? '225,112,85' : '107,112,132';
        var card = document.createElement('div');
        card.className = 'staff-card';
        card.innerHTML =
            '<div class="staff-avatar" style="background:rgba(' + bgRgb + ',0.15)">' + s.icon + '</div>' +
            '<div class="staff-info"><div class="staff-role">' + s.role + '</div><div class="staff-zone">' + s.zone + '</div></div>' +
            '<div class="staff-status-indicator" style="background:' + sc + '" title="' + s.status + '"></div>';
        grid.appendChild(card);
    });
    var totalEl = document.getElementById('staff-total');
    if (totalEl) totalEl.textContent = state.staff.length + ' Active';
}

// ===== JOURNEY =====
function renderJourney() {
    var container = document.getElementById('journey-pipeline');
    if (!container) return;
    container.innerHTML = '';
    state.journey.forEach(function (stage) {
        var dot = stage.status === 'completed' ? '\u2713' : stage.status === 'active' ? '\u25CF' : '';
        var div = document.createElement('div');
        div.className = 'journey-stage ' + stage.status;
        div.innerHTML =
            '<div class="journey-dot">' + dot + '</div>' +
            '<div class="journey-info"><div class="journey-stage-name">' + stage.name + '</div><div class="journey-stage-detail">' + stage.detail + '</div></div>' +
            '<span class="journey-count">' + (stage.count / 1000).toFixed(1) + 'K</span>';
        container.appendChild(div);
    });
}

// ===== FLOW CHART =====
var flowData = { inflow: [], outflow: [], labels: [] };

function generateFlowData() {
    var now = new Date();
    flowData.inflow = []; flowData.outflow = []; flowData.labels = [];
    for (var i = 29; i >= 0; i--) {
        var t = new Date(now.getTime() - i * 120000);
        flowData.labels.push(t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
        var pct = (30 - i) / 30;
        var inB = 800 + 600 * Math.sin(pct * Math.PI);
        var outB = inB * (0.7 + 0.2 * pct);
        flowData.inflow.push(Math.round(inB + rand(-80, 80)));
        flowData.outflow.push(Math.round(outB + rand(-60, 60)));
    }
}
generateFlowData();

function renderFlowChart() {
    var canvas = document.getElementById('flow-chart');
    if (!canvas) return;
    var container = canvas.parentElement;
    var rect = container.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return;

    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    var W = rect.width, H = rect.height;
    var pad = { top: 20, right: 10, bottom: 30, left: 40 };
    var cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    var allV = flowData.inflow.concat(flowData.outflow);
    var maxV = Math.ceil(Math.max.apply(null, allV) / 100) * 100 + 100;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.font = '500 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#6b7084';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
        var v = (maxV / 4) * i;
        var gy = pad.top + cH - (cH * v / maxV);
        ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(W - pad.right, gy); ctx.stroke();
        ctx.fillText(Math.round(v), pad.left - 6, gy + 3);
    }

    // X labels
    ctx.textAlign = 'center';
    var lInt = Math.ceil(flowData.labels.length / 6);
    for (var j = 0; j < flowData.labels.length; j++) {
        if (j % lInt === 0) {
            var lx = pad.left + (j / (flowData.labels.length - 1)) * cW;
            ctx.fillText(flowData.labels[j], lx, H - 8);
        }
    }

    // Bars
    var barW = (cW / flowData.inflow.length) * 0.35;
    for (var k = 0; k < flowData.inflow.length; k++) {
        var bx = pad.left + (k / (flowData.inflow.length - 1)) * cW;
        var inH = (flowData.inflow[k] / maxV) * cH;
        var inY = pad.top + cH - inH;

        ctx.fillStyle = 'rgba(108,92,231,0.6)';
        ctx.beginPath();
        ctx.roundRect(bx - barW, inY, barW, inH, [3, 3, 0, 0]);
        ctx.fill();

        var outH = (flowData.outflow[k] / maxV) * cH;
        var outY = pad.top + cH - outH;
        ctx.fillStyle = 'rgba(0,184,148,0.6)';
        ctx.beginPath();
        ctx.roundRect(bx + 2, outY, barW, outH, [3, 3, 0, 0]);
        ctx.fill();
    }

    // Legend
    ctx.font = '500 9px Inter, sans-serif';
    ctx.fillStyle = 'rgba(108,92,231,0.8)';
    ctx.fillRect(pad.left + 10, pad.top + 6, 12, 8);
    ctx.fillStyle = '#a0a3b5';
    ctx.textAlign = 'left';
    ctx.fillText('Inflow', pad.left + 28, pad.top + 14);
    ctx.fillStyle = 'rgba(0,184,148,0.8)';
    ctx.fillRect(pad.left + 80, pad.top + 6, 12, 8);
    ctx.fillStyle = '#a0a3b5';
    ctx.fillText('Outflow', pad.left + 98, pad.top + 14);
}

// ===== LIVE SIMULATION =====
function simulateUpdates() {
    // Gates
    state.gates.forEach(function (g) {
        g.occupancy = clamp(g.occupancy + rand(-4, 4), 10, 98);
        g.wait = clamp(g.wait + rand(-2, 2), 1, 30);
    });

    // Total devotees
    var prevTotal = state.totalDevotees;
    state.totalDevotees = clamp(state.totalDevotees + rand(-200, 300), 30000, 75000);
    var totalEl = document.getElementById('total-devotees');
    animateValue(totalEl, prevTotal, state.totalDevotees, 2500);

    // KPIs
    state.throughputPerHour = clamp(state.throughputPerHour + rand(-100, 100), 3000, 5500);
    state.avgWaitMin = clamp(state.avgWaitMin + rand(-3, 3), 40, 120);
    state.satisfaction = clamp(state.satisfaction + rand(-1, 1), 82, 96);
    state.peakDensity = clamp(state.peakDensity + randFloat(-0.3, 0.3), 1.5, 5.8);
    state.mealsServed = state.mealsServed + rand(10, 60);

    // Wait time data
    var base = state.avgWaitMin;
    waitTimeData.predicted.push(base + rand(-5, 5));
    waitTimeData.actual.push(base + rand(-10, 8));
    waitTimeData.labels.push(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    if (waitTimeData.predicted.length > 60) { waitTimeData.predicted.shift(); waitTimeData.actual.shift(); waitTimeData.labels.shift(); }

    // Flow data
    flowData.inflow.push(rand(600, 1400));
    flowData.outflow.push(rand(500, 1200));
    flowData.labels.push(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    if (flowData.inflow.length > 30) { flowData.inflow.shift(); flowData.outflow.shift(); flowData.labels.shift(); }

    // Heatmap
    heatmapZones.forEach(function (z) { z.density = clamp(z.density + randFloat(-0.08, 0.08), 0.1, 0.98); });

    // Facilities
    state.facilities.forEach(function (f) { f.usage = clamp(f.usage + rand(-3, 3), 5, 95); });

    // Priority
    state.priorities.forEach(function (p) {
        p.count = p.name === 'General'
            ? clamp(p.count + rand(-200, 200), 25000, 45000)
            : clamp(p.count + rand(-30, 30), 100, 6000);
    });

    // Alerts
    if (Math.random() < 0.15) {
        var msgs = [
            { level: 'info', icon: '\u2705', title: 'Queue Optimized', desc: 'Segment ' + rand(1, 9) + ' improved by ' + rand(5, 20) + '%.', time: 'just now' },
            { level: 'advisory', icon: '\u{1F4E2}', title: 'Water Station ' + rand(1, 6), desc: 'Tank at ' + rand(15, 30) + '%. Refill dispatched.', time: 'just now' },
            { level: 'info', icon: '\u{1F50D}', title: 'Scan Anomaly', desc: 'Duplicate scan at Gate G' + rand(1, 8) + '. Denied.', time: 'just now' },
            { level: 'advisory', icon: '\u{1F321}\uFE0F', title: 'Heat Advisory', desc: rand(36, 40) + '\u00B0C. Water carts deployed.', time: 'just now' },
        ];
        state.alerts.unshift(msgs[rand(0, msgs.length - 1)]);
        if (state.alerts.length > 8) state.alerts.pop();
    }

    // Re-render
    renderGates();
    renderPriority();
    renderWaitTimeChart();
    renderWaitTimeStats();
    renderAlerts();
    renderFacilities();
    renderKPIs(false);
    renderStaff();
    renderJourney();
    renderFlowChart();
    renderHeatmap();
}

// ===== TAB SWITCHING =====
document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
    });
});

// ===== INIT =====
function init() {
    try {
        renderGates();
        renderPriority();
        renderWaitTimeChart();
        renderWaitTimeStats();
        renderAlerts();
        renderFacilities();
        renderKPIs(true);
        renderStaff();
        renderJourney();
        renderFlowChart();
        renderHeatmap();
        setInterval(simulateUpdates, 4000);
        setInterval(renderHeatmap, 3000);
        console.log('DarshanFlow Command Center initialized successfully.');
    } catch (e) {
        console.error('DarshanFlow init error:', e);
    }
}

window.addEventListener('load', function () { setTimeout(init, 300); });

var resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        renderHeatmap();
        renderWaitTimeChart();
        renderFlowChart();
        renderPriorityChart();
    }, 200);
});
