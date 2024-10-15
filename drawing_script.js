const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('saveBtn'); 
const clearBtn = document.getElementById('clearBtn'); 

let lines = []; // Store line coordinates here
let isDrawing = false;
let color = false;
let startX = 0;
let startY = 0;
let startDrawing = false;

canvas.addEventListener('click', (e) => {
    if (e.detail === 1) {
        // do something if the element was clicked once.
        if (isDrawing == false) {
            if (!startDrawing) {
                startDrawing = true;
            } else if (startDrawing) {
                const endX = e.offsetX;
                const endY = e.offsetY; 
                // Save line coordinates in 0.1 mm units 
                const line = { 
                    start: { x: startX, y: startY}, 
                    end: { x: endX,y: endY},
                    color: color
                };
                lines.push(line); 
                // fix json file by removing certain lines
                let i = 0;
                while (i < lines.length) {
                    if (lines[i]["start"]["x"] == lines[i]["end"]["x"] && lines[i]["start"]["y"] == lines[i]["end"]["y"]) {
                        lines.pop(i);
                    } else {
                        i++;
                    }
                }
                // Draw the final line 
                drawAllLines();
            }
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
                start: { x: startX, y: startY}, 
                end: { x: endX,y: endY},
                color: color
            };
            lines.push(line); 
            // fix json file by removing certain lines
            let i = 0;
            while (i < lines.length) {
                if (lines[i]["start"]["x"] == lines[i]["end"]["x"] && lines[i]["start"]["y"] == lines[i]["end"]["y"]) {
                    lines.pop(i);
                } else {
                    i++;
                }
            }
            // Draw the final line 
            drawAllLines();
            isDrawing = true;
            color = true;
            startX = endX; 
            startY = endY;
        }
    } else if (e.detail === 2) {
        if (isDrawing == true) {
            isDrawing = false;
            color = false;
            startX = e.offsetX; 
            startY = e.offsetY;
        }
        if (!isDrawing) {return;}
    }
});

canvas.addEventListener('contextmenu', (e) => {
    if (startDrawing) {
        e.preventDefault();
        const endX = e.offsetX;
        const endY = e.offsetY; 
        // Save line coordinates in 0.1 mm units 
        const line = { 
            start: { x: startX, y: startY}, 
            end: { x: endX,y: endY},
            color: color
        };
        lines.push(line); 
        // fix json file by removing certain lines
        let i = 0;
        while (i < lines.length) {
            if (lines[i]["start"]["x"] == lines[i]["end"]["x"] && lines[i]["start"]["y"] == lines[i]["end"]["y"]) {
                lines.pop(i);
            } else {
                i++;
            }
        }
        isDrawing = false;
        // Draw the final line 
        drawAllLines();
        startDrawing = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!startDrawing) {return;}
    // Clear and redraw line 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawAllLines();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
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
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        if (line.color == true) {
            ctx.strokeStyle = "#008000";
        } else {
            ctx.strokeStyle = "#ff0000";
        }
        ctx.stroke(); });
}

// Save to JSON file 
saveBtn.addEventListener('click', () => {
    // add red lines in between disconnected lines
    let i = 0;
    while (i < lines.length-1) {
        if (lines[i]["end"]["x"] != lines[i+1]["start"]["x"] && lines[i]["end"]["y"] != lines[i+1]["start"]["y"]) { // end xy of line 1 is not equal to start xy of line 2
            let newLine = {
                start: { x: lines[i]["end"]["x"], y: lines[i]["end"]["y"]}, 
                end: { x: lines[i+1]["start"]["x"],y: lines[i+1]["start"]["y"]},
                color: false
            }
            lines.splice(i+1, 0, newLine);
            i += 2;
        } else {
            i++;
        }
    }
    // first line from 0,0
    let firstLine = { 
        start: { x: 0, y: 0}, 
        end: { x: lines[0]["start"]["x"],y: lines[0]["start"]["y"]},
        color: false
    };
    lines.unshift(firstLine); 
    // final line to 100,0
    let finalLine = { 
        start: { x: lines[lines.length-1]["end"]["x"],y: lines[lines.length-1]["end"]["y"]},
        end: { x: 600, y: 0},
        color: false
    };
    lines.push(finalLine);
    // convert all coordinates to be relative to a 100x100 px grid
    for (let i = 0; i < lines.length; i++) {
        lines[i]["start"]["x"] /= 6;
        lines[i]["start"]["y"] /= 6;
        lines[i]["end"]["x"] /= 6;
        lines[i]["end"]["y"] /= 6;
    }
    // convert all indexes in list to a specific format
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]["color"] == true) {
            newString = "(t, ";
        } else {
            newString = "(f, ";
        }
        lines[i] = newString + lines[i]["end"]["x"] + ", " + lines[i]["end"]["y"] + ")";
    }
    const jsonContent = JSON.stringify(lines, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lines.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    lines = [];
    drawAllLines();
});
