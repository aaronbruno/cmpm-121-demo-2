// Citation: https://shoddy-paint.glitch.me/paint1.html
import "./style.css";

import { Line } from "./classes.ts";

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
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 256, 256);

const drawingChanged = new CustomEvent("drawing-changed");

let lines: Line[] = [];
let redoLines: Line[] = [];
let currentLine: Line | null = new Line();
type ClickHandler = () => void;

const cursor = { active: false, x: 0, y: 0 };

// Add buttons
app.append(document.createElement("br"));
addCanvasButton(eraseCanvas, "clear");
addCanvasButton(undoCanvas, "undo");
addCanvasButton(redoCanvas, "redo");
// Thickness Slider
app.append(document.createElement("br"));
const lineThicknessSlider = thicknessSlider();

addCanvasEvents();

// ---------- FUNCTIONS ----------
function addCanvasButton(func: ClickHandler, buttonName: string) {
  const button = document.createElement("button");
  button.innerHTML = buttonName;
  app.append(button);

  button.addEventListener("click", () => {
    func();
  });
}

function addCanvasEvents() {
  canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine = new Line(lineThicknessSlider.value);
    lines.push(currentLine);

    currentLine.drag(cursor.x, cursor.y);

    canvas.dispatchEvent(drawingChanged);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
      currentLine!.drag(cursor.x, cursor.y);
      redoLines = [];

      canvas.dispatchEvent(drawingChanged);
    }
  });

  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = null;
  });

  canvas.addEventListener("drawing-changed", () => {
    redraw();
  });
}

function thicknessSlider() {
  const lineThickness = document.createElement("input");
  lineThickness.type = "range";
  lineThickness.min = "1";
  lineThickness.max = "5";
  lineThickness.value = lineThickness.min;

  lineThickness.addEventListener("input", () => {
    changeLineThickness(parseInt(lineThickness.value));
  });
  const sliderValue = document.createElement("label");
  sliderValue.textContent = "Thickness: ";
  app.append(sliderValue);
  app.append(lineThickness);
  return lineThickness;
}

function changeLineThickness(thickness: number) {
  ctx.lineWidth = thickness;
}

function redraw() {
  clearCanvas();
  for (const line of lines) {
    line.display(ctx);
  }
}

function eraseCanvas() {
  redoLines = lines;
  lines = [];
  clearCanvas();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 256, 256);
}

function undoCanvas() {
  if (lines.length != 0) {
    redoLines.push(lines.pop()!);
    canvas.dispatchEvent(drawingChanged);
  }
  return;
}

function redoCanvas() {
  if (redoLines.length != 0) {
    lines.push(redoLines.pop()!);
    canvas.dispatchEvent(drawingChanged);
  }
  return;
}
