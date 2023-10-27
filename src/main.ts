// Citation: https://shoddy-paint.glitch.me/paint1.html
import "./style.css";

import { Line } from "./classes.ts";
import { CursorCommand } from "./classes.ts";
import { Sticker } from "./classes.ts";

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
canvas.style.cursor = "none";

// Get canvas context
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 256, 256);

let lines: (Line | Sticker)[] = [];
let redoLines: (Line | Sticker)[] = [];
let currentLine: (Line | Sticker) | null = null;
let currentCursor = "*";
type ClickHandler = () => void;

const cursor = { active: false, x: 0, y: 0 };

const drawingChanged = new CustomEvent("drawing-changed");
const cursorChanged = new CustomEvent("cursor-changed");
let cursorCommand: CursorCommand | null = null;

// Add buttons
app.append(document.createElement("br"));
addCanvasButton(eraseCanvas, "clear");
addCanvasButton(undoCanvas, "undo");
addCanvasButton(redoCanvas, "redo");
// Thickness Slider
app.append(document.createElement("br"));
const lineThicknessSlider = thicknessSlider();

// Add emoji rotation slider
let rotationAngle: number = 0;
app.append(document.createElement("br"));
createRotationSlider();

//Add Emoji Buttons
const emojis = ["🐶", "🍗", "😲", "reset cursor"];
app.append(document.createElement("br"));
emojis.forEach((text) => {
  addEmojiButton(text);
});
addCanvasButton(customEmoji, "Custom emoji");
addCanvasButton(exportPicture, "Export picture");

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

function addEmojiButton(text: string) {
  const button = document.createElement("button");
  button.innerHTML = text;
  app.append(button);

  button.addEventListener("click", () => {
    currentCursor = text;
    if (text == "reset cursor") {
      currentCursor = "*";
    }
    canvas.dispatchEvent(cursorChanged);
  });
}

function customEmoji() {
  const customEmoji = prompt(`Enter your emoji:`);
  if (customEmoji) {
    addEmojiButton(customEmoji);
  }
  return;
}

function addCanvasEvents() {
  canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;

    if (currentCursor == "*") {
      currentLine = new Line(lineThicknessSlider.value);
    } else {
      currentLine = new Sticker(
        cursor.x,
        cursor.y,
        currentCursor,
        lineThicknessSlider.value,
        rotationAngle
      );
    }

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

  canvas.addEventListener("drawing-changed", () => {
    redraw();
  });

  canvas.addEventListener("cursor-changed", () => {
    redraw();
  });

  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = null;
  });

  canvas.addEventListener("mousemove", (e) => {
    cursorCommand = new CursorCommand(e.offsetX, e.offsetY, currentCursor);
    canvas.dispatchEvent(cursorChanged);
  });

  canvas.addEventListener("mouseenter", (e) => {
    cursorCommand = new CursorCommand(e.offsetX, e.offsetY, currentCursor);
    canvas.dispatchEvent(cursorChanged);
  });

  canvas.addEventListener("mouseout", () => {
    cursorCommand = null;
    canvas.dispatchEvent(cursorChanged);
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
  redraw();
}

function createRotationSlider() {
  const rotationSlider = document.createElement("input");
  rotationSlider.type = "range";
  rotationSlider.min = "0";
  rotationSlider.max = "360";
  rotationSlider.value = `{rotationAngle}`;

  rotationSlider.addEventListener("input", () => {
    updateRotationAngle(parseInt(rotationSlider.value));
  });

  const sliderValueLabel = document.createElement("label");
  sliderValueLabel.textContent = "Rotation Angle: ";
  app.append(sliderValueLabel);
  app.append(rotationSlider);

  return rotationSlider;
}

function updateRotationAngle(angle: number) {
  rotationAngle = angle;
  redraw();
}

function redraw() {
  clearCanvas();
  const lineThicknessBefore = ctx.lineWidth;

  lines.forEach((line) => {
    line.display(ctx);
  });
  ctx.lineWidth = lineThicknessBefore;
  if (cursorCommand) {
    cursorCommand.display(ctx);
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

function exportPicture() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width * 4;
  exportCanvas.height = canvas.height * 4;

  const exportCtx = exportCanvas.getContext("2d")!;
  exportCtx.fillStyle = "white";

  exportCtx.scale(4, 4);
  exportCtx.fillRect(0, 0, 256, 256);

  lines.forEach((line) => {
    line.display(exportCtx);
  });

  const anchor = document.createElement("a");
  anchor.href = exportCanvas.toDataURL("image/png");
  anchor.download = "YourSketchpad.png";
  anchor.click();
}
