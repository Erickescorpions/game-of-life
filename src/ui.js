
export class UI {
  constructor(canvasId, width, height) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`No canvas found with id ${canvasId}`);
    }

    if(!!width && !!height) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    this.ctx = this.canvas.getContext('2d');
  }

  clearRect(x, y, width, height) {
    this.ctx.clearRect(x, y, width, height)
  }

  fill(rect) {
    this.ctx.fill(rect)
  }

  stroke(rect) {
    this.ctx.stroke(rect)
  }

  setFillStyle(style) {
    this.ctx.fillStyle = style
  }

  addEventListener(event, callback) {
    this.canvas.addEventListener(event, callback)
  }
}
