import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Aaron Bruno's Sticker Sketchpad";
document.title = gameName;
const canvasHeight = 256;
const canvasWidth = 256;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.height = canvasHeight;
canvas.width = canvasWidth;

const canvasContext = canvas.getContext("2d");
canvasContext!.fillStyle = "white";
canvasContext?.fillRect(0, 0, 256, 256);

app.append(canvas);

const cursor = { active: false, x: 0, y: 0 };

// const paths = [];

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active) {
    canvasContext?.beginPath();
    canvasContext?.moveTo(cursor.x, cursor.y);
    canvasContext?.lineTo(e.offsetX, e.offsetY);
    canvasContext?.stroke();
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
document.body.append(clearButton);

clearButton.addEventListener("click", () => {
  canvasContext?.clearRect(0, 0, canvas.width, canvas.height);
});
