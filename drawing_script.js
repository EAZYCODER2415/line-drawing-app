const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('saveBtn'); 

let lines = []; // Store line coordinates here
let isDrawing = false;
let startX = 0;
let startY = 0; 

// Conversion factor from pixels to mm
const PIXEL_TO_MM = 25.4 / 96; // ~0.2646 mm per pixel (25.4 mm / 96 dpi)
const MM_UNIT_SCALE = 0.1; // We want 0.1 mm precision

// Convert pixels to 0.1 mm units 
function toMM(value) {
    return Math.round((value * PIXEL_TO_MM) / MM_UNIT_SCALE); 
}

// Mouse event handlers 
canvas.addEventListener('mousedown', (e) => { 
    isDrawing = true; 
    startX = e.offsetX; 
    startY = e.offsetY; 
}); 

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const endX = e.offsetX;
    const endY = e.offsetY; 
    // Clear and redraw line 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawAllLines();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke(); 
}); 

canvas.addEventListener('mouseup', (e) => { 
    if (!isDrawing) return;
    isDrawing = false;
    const endX = e.offsetX;
    const endY = e.offsetY; 
    // Save line coordinates in 0.1 mm units 
    const line = { 
        start: { x: toMM(startX), y: toMM(startY) }, 
        end: { x: toMM(endX),y: toMM(endY) }}; 
    lines.push(line); 
    // Draw the final line 
    drawAllLines(); 
}); 

function drawAllLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.start.x / PIXEL_TO_MM * MM_UNIT_SCALE, line.start.y / PIXEL_TO_MM * MM_UNIT_SCALE);
        ctx.lineTo(line.end.x / PIXEL_TO_MM * MM_UNIT_SCALE, line.end.y / PIXEL_TO_MM * MM_UNIT_SCALE);
        ctx.stroke(); });
}

// Save to JSON file 
saveBtn.addEventListener('click', () => {
    const jsonContent = JSON.stringify(lines, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lines.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); });