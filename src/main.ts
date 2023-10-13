import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

document.title = "Aaron's Game: " + gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
