import { Cell } from './cell'
import { CELL_SIZE, TOTAL_HORIZONTAL_CELLS, TOTAL_VERTICAL_CELLS, CELL_STATE } from './constants'

export class Board {
  constructor() {
    this.canvas = document.getElementById('board')
    this.ctx = this.canvas.getContext('2d')

    // creamos la grilla del canvas
    this.cells = []

    for (let i = 0; i < TOTAL_VERTICAL_CELLS; i++) {
      let row = []
      for (let j = 0; j < TOTAL_HORIZONTAL_CELLS; j++) {
        row.push(new Cell(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE, CELL_STATE.DEAD))
      }

      this.cells.push(row)
    }


    this.ctx.fillStyle = 'rgb(256, 256, 256)'
    // registrando eventos
    this.canvas.addEventListener('click', (event) => this.manipulateCells(event))
  }

  draw() {
    // draw the grid
    this.cells.forEach(row => row.forEach(cell => this.ctx.stroke(cell.draw())))
  }

  manipulateCells(event) {
    let xPos = event.offsetX
    let yPos = event.offsetY

    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.x <= xPos && cell.x + CELL_SIZE > xPos && cell.y <= yPos && cell.y + CELL_SIZE > yPos) {
          if (cell.state === CELL_STATE.LIVE) {
            cell.setState(CELL_STATE.DEAD)
            this.ctx.clearRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE)
            this.ctx.stroke(cell.draw())
          } else {
            cell.setState(CELL_STATE.LIVE)
            this.ctx.fill(cell.draw())
            this.ctx.stroke(cell.draw())
          }
        }
      })
    })
  }

  generateLife() {
    let newBoard = this.cells.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        // check state of each cell according the rules
        let newState = cell.checkCurrentState(this.cells, rowIndex, cellIndex)
        return new Cell(cell.x, cell.y, cell.width, cell.height, newState)
      })
    )

    // Update the state of the cells
    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        cell.setState(newBoard[rowIndex][cellIndex].state)
        if (cell.state === CELL_STATE.LIVE) {
          this.ctx.fill(cell.draw())
          this.ctx.stroke(cell.draw())
        } else {
          this.ctx.clearRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE)
          this.ctx.stroke(cell.draw())
        }
      })
    })

  }
}