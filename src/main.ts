import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// Title stuff
const gameName = "Aaron Bruno's Sticker Sketchpad";
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Create the canvas
const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.height = 256;
canvas.width = 256;
app.append(canvas);

// Get canvas context
const canvasContext = canvas.getContext("2d")!;
canvasContext!.fillStyle = "white";
canvasContext?.fillRect(0, 0, 256, 256);

// Citation: https://shoddy-paint.glitch.me/paint1.html
// const drawingChanged = new CustomEvent("drawing-changed");

const lines: any[] = [];
const redoLines: any[] = [];

let currentLine: any = [];

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;

  currentLine = [];
  lines.push(currentLine);
  redoLines.splice(0, redoLines.length);
  currentLine.push({ x: cursor.x, y: cursor.y });

  redraw();
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine.push({ x: cursor.x, y: cursor.y });

    redraw();
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = null;

  redraw();
});

function redraw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > 1) {
      canvasContext.beginPath();
      const { x, y } = line[0];
      canvasContext.moveTo(x, y);
      for (const { x, y } of line) {
        canvasContext.lineTo(x, y);
      }
      canvasContext.stroke();
    }
  }
}

document.body.append(document.createElement("br"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
document.body.append(clearButton);

clearButton.addEventListener("click", () => {
  lines.splice(0, lines.length);
  redraw();
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
document.body.append(undoButton);

undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop());
    redraw();
  }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
document.body.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop());
    redraw();
  }
});
