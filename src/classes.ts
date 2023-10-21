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
    ctx.lineWidth = parseInt(this.lineThickness);
    const first = this.coords[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (const c of this.coords) {
      ctx.lineTo(c.x, c.y);
    }

    ctx.stroke();
  }
}

export class CursorCommand {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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

    ctx.fillText("*", this.x - xOffset, this.y + yOffset);
  }
}
