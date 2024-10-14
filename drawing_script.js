const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('saveBtn'); 
const clearBtn = document.getElementById('clearBtn'); 

let lines = []; // Store line coordinates here
let isDrawing = false;
let color = false;
let startX = 0;
let startY = 0; 

// Conversion factor from pixels to mm
const PIXEL_TO_MM = 25.4 / 96; // ~0.2646 mm per pixel (25.4 mm / 96 dpi)
const MM_UNIT_SCALE = 0.1; // We want 0.1 mm precision

// Convert pixels to 0.1 mm units 
function toMM(value) {
    return Math.round((value * PIXEL_TO_MM) / MM_UNIT_SCALE); 
}

canvas.addEventListener('click', (e) => { 
    if (e.detail === 1) {
        // do something if the element was clicked once.
        if (isDrawing == false) {
            isDrawing = true;
            color = true;
            startX = e.offsetX; 
            startY = e.offsetY;
        } else {
            isDrawing = false;
            const endX = e.offsetX;
            const endY = e.offsetY; 
            // Save line coordinates in 0.1 mm units 
            const line = { 
                start: { x: toMM(startX), y: toMM(startY)}, 
                end: { x: toMM(endX),y: toMM(endY)},
                color: color
            };
            lines.push(line); 
            // Draw the final line 
            drawAllLines();
            isDrawing = true;
            color = true;
            startX = endX; 
            startY = endY;
        }
    } else if (e.detail === 2) {
        // do something else if the element was clicked twice
        if (!isDrawing) return;
        isDrawing = false;
        const endX = e.offsetX;
        const endY = e.offsetY; 
        // Save line coordinates in 0.1 mm units 
        const line = { 
            start: { x: toMM(startX), y: toMM(startY)}, 
            end: { x: toMM(endX),y: toMM(endY)},
            color: color
        };
        lines.push(line); 
        // fix json file by removing certain lines
        if (line.start.x == line.end.x && line.start.y == line.end.y) {
            lines.pop();
        }
        // Draw the final line 
        drawAllLines();
    }
});

canvas.addEventListener('oncontextmenu', (e) => { 
    e.preventDefault();
    if (e.detail === 1) {
        // do something if the element was clicked once.
        if (isDrawing == false) {
            isDrawing = true;
            color = true;
            startX = e.offsetX; 
            startY = e.offsetY;
        } else {
            isDrawing = false;
            const endX = e.offsetX;
            const endY = e.offsetY; 
            // Save line coordinates in 0.1 mm units 
            const line = { 
                start: { x: toMM(startX), y: toMM(startY)}, 
                end: { x: toMM(endX),y: toMM(endY)},
                color: color
            };
            lines.push(line); 
            // Draw the final line 
            drawAllLines();
            isDrawing = true;
            color = true;
            startX = endX; 
            startY = endY;
        }
    } else if (e.detail === 2) {
        // do something else if the element was clicked twice
        if (!isDrawing) return;
        isDrawing = false;
        const endX = e.offsetX;
        const endY = e.offsetY; 
        // Save line coordinates in 0.1 mm units 
        const line = { 
            start: { x: toMM(startX), y: toMM(startY)}, 
            end: { x: toMM(endX),y: toMM(endY)},
            color: color
        };
        lines.push(line); 
        // fix json file by removing certain lines
        if (line.start.x == line.end.x && line.start.y == line.end.y) {
            lines.pop();
        }
        // Draw the final line 
        drawAllLines();
    }
}, false);

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
    if (color == true) {
        ctx.strokeStyle = "#008000";
    } else {
        ctx.strokeStyle = "#ff0000";
    }
    ctx.stroke(); 
});

function drawAllLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.start.x / PIXEL_TO_MM * MM_UNIT_SCALE, line.start.y / PIXEL_TO_MM * MM_UNIT_SCALE);
        ctx.lineTo(line.end.x / PIXEL_TO_MM * MM_UNIT_SCALE, line.end.y / PIXEL_TO_MM * MM_UNIT_SCALE);
        if (line.color == true) {
            ctx.strokeStyle = "#008000";
        } else {
            ctx.strokeStyle = "#ff0000";
        }
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

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    lines = [];
    drawAllLines(); });
