const grid = document.getElementById("grid");
const pixels = [];
let currentColor = "#000000"; // Default color: Black
let isDrawing = false;
let isErasing = false;
let brushSize = 1;
let history = []; // Stores previous pixel states for undo

// Create the grid (40x40 for increased resolution)
for (let i = 0; i < 1600; i++) { 
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    grid.appendChild(pixel);
    pixels.push(pixel);

    pixel.addEventListener("mousedown", () => {
        isDrawing = true;
        applyColor(pixel);
    });

    pixel.addEventListener("mouseenter", () => {
        if (isDrawing) {
            applyColor(pixel);
        }
    });
}

document.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Function to apply color or erase
function applyColor(pixel) {
    let index = pixels.indexOf(pixel);
    let pixelsToColor = getPixelsInBrush(index, brushSize);

    pixelsToColor.forEach((p) => {
        history.push({ pixel: p, previousColor: p.style.backgroundColor });
        p.style.backgroundColor = isErasing ? "white" : currentColor;
    });
}

// Get pixels in the brush size range
function getPixelsInBrush(index, size) {
    let rowSize = 40; // Number of columns in the grid
    let pixelsToColor = [];
    let roundedSize = Math.round(size); // Convert decimals to nearest integer for selection

    let row = Math.floor(index / rowSize);
    let col = index % rowSize;

    for (let i = -roundedSize + 1; i < roundedSize; i++) {
        for (let j = -roundedSize + 1; j < roundedSize; j++) {
            let newRow = row + i;
            let newCol = col + j;
            let newIndex = newRow * rowSize + newCol;

            if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < rowSize) {
                pixelsToColor.push(pixels[newIndex]);
            }
        }
    }

    return pixelsToColor;
}

// Undo function (triggered by pressing "U")
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "u" && history.length > 0) {
        const lastAction = history.pop();
        lastAction.pixel.style.backgroundColor = lastAction.previousColor;
    }
});

// Button Event Listeners
document.getElementById("pencilButton").addEventListener("click", () => {
    isErasing = false;
});

document.getElementById("eraserButton").addEventListener("click", () => {
    isErasing = true;
});

// Color Picker Event Listener
document.getElementById("colorPicker").addEventListener("input", (event) => {
    currentColor = event.target.value;
    isErasing = false; // Ensure it's in drawing mode
});

// Brush Size Slider Event Listener
document.getElementById("brushSize").addEventListener("input", (event) => {
    brushSize = parseFloat(event.target.value);
    document.getElementById("brushSizeValue").innerText = brushSize;
});