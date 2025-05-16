'use client';

interface MarkerProps {
  innerValue: number;
  values: number[];
  colors: string[];
  radius: number;
  hole?: number;
  stroke?: number;
}

class MarkerCreator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private radius: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.radius = 0;
  }

  createPiechart(options: MarkerProps): HTMLCanvasElement {
    const {
      innerValue,
      values,
      colors,
      radius,
      hole = 0.6,
      stroke = 0,
    } = options;

    // Set canvas dimensions
    this.canvas.width = radius * 2;
    this.canvas.height = radius * 2;
    this.radius = radius;

    if (!this.ctx) {
      throw new Error('Canvas context is not available');
    }

    // Draw outer pie chart
    this.drawPieChart(values, colors, stroke);

    // Draw inner hole
    if (hole > 0) {
      this.drawHole(hole);
    }

    return this.canvas;
  }

  private drawPieChart(
    values: number[],
    colors: string[],
    stroke: number
  ): void {
    if (!this.ctx) return;

    const total = values.reduce((acc, curr) => acc + curr, 0);
    let startAngle = 0;

    values.forEach((value, index) => {
      const sliceAngle = (2 * Math.PI * value) / total;
      const color = colors[index % colors.length];

      this.drawSlice(this.radius, startAngle, startAngle + sliceAngle, color);

      if (stroke > 0 && this.ctx) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = stroke;
        this.ctx.stroke();
      }

      startAngle += sliceAngle;
    });
  }

  private drawSlice(
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string
  ): void {
    if (!this.ctx) return;

    const centerX = this.radius;
    const centerY = this.radius;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawHole(hole: number): void {
    if (!this.ctx) return;

    const holeRadius = this.radius * hole;
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, holeRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

export default MarkerCreator;
