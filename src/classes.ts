interface Coordinate {
  x: number;
  y: number;
}

export class Line {
  coords: Coordinate[];

  constructor() {
    this.coords = [];
  }

  drag(x: number, y: number) {
    this.coords.push({ x: x, y: y });
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.coords.length == 0) {
      return;
    }
    const first = this.coords[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (const c of this.coords) {
      ctx.lineTo(c.x, c.y);
    }

    ctx.stroke();
  }
}
