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
