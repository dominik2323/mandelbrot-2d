import { NodeWithTypeArguments } from "typescript";
import { map } from "./helpers/map";

class Mandelbrot {
  containerId: string;
  container: HTMLElement;
  timeInfo: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  wW: number;
  wH: number;
  w: number;
  h: number;
  pixelScale: number;
  maxIterations: number;
  time: number;
  totalIterations: number;
  rafId: number;
  timeEl: HTMLSpanElement;
  iterationsEl: HTMLSpanElement;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.container = document.getElementById(this.containerId);
    this.canvas = document.createElement("canvas");
    this.w = 600;
    this.h = 600;
    this.wW = innerWidth;
    this.wH = innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.pixelScale = 1;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.container.appendChild(this.canvas);
    this.maxIterations = 8;
    this.time = 0;
    this.totalIterations = 0;
    this.timeInfo = document.getElementById("info");
    this.timeEl = this.timeInfo.querySelector(".time");
    this.iterationsEl = this.timeInfo.querySelector(".iterations");
    this.animate();
  }

  drawPixel(x, y, c) {
    this.ctx.beginPath();
    this.ctx.fillStyle = c;
    this.ctx.fillRect(
      x * this.pixelScale - this.pixelScale * 0.5,
      y * this.pixelScale - this.pixelScale * 0.5,
      this.pixelScale,
      this.pixelScale,
    );
    this.ctx.closePath();
  }

  formatNumber(n: number) {
    const formatter = new Intl.NumberFormat("cs-CZ", {});
    return formatter.format(n);
  }

  draw(t) {
    const sPixelsW = (this.w / this.pixelScale) * 0.5;
    const sPixelsH = (this.h / this.pixelScale) * 0.5;

    for (let x = -sPixelsW; x <= sPixelsW; x++) {
      for (let y = -sPixelsH; y <= sPixelsH; y++) {
        let remapX = map(x, -sPixelsW, sPixelsW, -2, 0.47);
        let remapY = map(y, -sPixelsH, sPixelsH, -1.12, 1.12);

        let n = 0;
        let xr = 0;
        let yi = 0;

        while (xr * xr + yi * yi <= 2 * 2 && n <= this.maxIterations) {
          yi = this.time * 2 * xr * yi + remapY;
          xr = xr * xr - yi * yi + remapX;
          n++;
          this.totalIterations++;
        }

        this.drawPixel(
          yi * yi * yi * 700 * t,
          -1 * xr * xr * xr * 700 * t,
          // `rgb(${Math.abs(xr * 150)}, ${Math.abs(yi * 150)}, 0)`,
          "rgba(200,200,200,0.8)",
        );
      }
    }
  }

  animate() {
    this.time += 0.005;
    this.ctx.reset();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.draw(this.time);
    this.timeEl.innerText = `$time ${this.time.toFixed(4)}`;
    this.iterationsEl.innerText = `$iterations ${this.formatNumber(
      this.totalIterations,
    )}`;

    if (this.time < 2) {
      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }
  }
}

new Mandelbrot("container");
