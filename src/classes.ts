interface Coordinate {
  x: number;
  y: number;
}

export class Line {
  coords: Coordinate[];
  lineThickness: string;

  constructor(lineThickness = "1") {
    this.coords = [];
    this.lineThickness = lineThickness;
  }

  drag(x: number, y: number) {
    this.coords.push({ x: x, y: y });
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.coords.length == 0) {
      return;
    }

    const lineWidthPrevious = ctx.lineWidth;
    ctx.lineWidth = parseInt(this.lineThickness);
    const first = this.coords[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (const c of this.coords) {
      ctx.lineTo(c.x, c.y);
    }

    ctx.stroke();
    ctx.lineWidth = lineWidthPrevious;
  }
}

export class CursorCommand {
  x: number;
  y: number;
  cursorSymbol: string;

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.cursorSymbol = text;
  }

  // Citation: Credit to Wyatt for help on the offset
  display(ctx: CanvasRenderingContext2D) {
    //16-64 from 1-11
    const outMin = 16;
    const outMax = 64;
    const inMin = 1;
    const inMax = 11;
    const newSize: number =
      ((ctx.lineWidth - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    const xOffset = (4 * newSize) / outMin;
    const yOffset = (8 * newSize) / outMin;

    ctx.font = newSize + "px monospace";
    ctx.fillStyle = "black";

    const fontPrevious = ctx.font;
    const lineWidthPrevious = ctx.lineWidth;
    ctx.fillText(this.cursorSymbol, this.x - xOffset, this.y + yOffset);
    ctx.lineWidth = lineWidthPrevious;
    ctx.font = fontPrevious;
  }
}

export class Sticker {
  coord: Coordinate;
  text: string;
  size: number;
  xOffset: number;
  yOffset: number;

  constructor(x: number, y: number, text: string, size: string) {
    this.coord = { x: x, y: y };
    this.text = text;

    const outMin = 16;
    const outMax = 64;
    const inMin = 1;
    const inMax = 11;
    const newSize: number =
      ((parseInt(size) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    this.xOffset = (4 * newSize) / outMin;
    this.yOffset = (8 * newSize) / outMin;
    this.size = newSize;
  }

  drag(x: number, y: number) {
    this.coord = { x: x, y: y };
  }

  display(ctx: CanvasRenderingContext2D) {
    const fontPrevious: string = ctx.font;

    ctx.font = this.size + "px monospace";
    ctx.fillText(
      this.text,
      this.coord.x - this.xOffset,
      this.coord.y + this.yOffset
    );

    ctx.font = fontPrevious;
  }
}
