
export class UI {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`No canvas found with id ${canvasId}`);
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
