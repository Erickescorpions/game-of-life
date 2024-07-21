import {TOTAL_HORIZONTAL_CELLS, TOTAL_VERTICAL_CELLS, CELL_STATE} from './consts'

export class Cell {
  constructor(x, y, width, height, state = CELL_STATE.DEAD) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.state = state
  }

  draw() {
    const rectangle = new Path2D()
    rectangle.rect(this.x, this.y, this.width, this.height)
    return rectangle
  }

  checkCurrentState(board, row, column) {
    let prevRow = row - 1
    let nextRow = row + 1
    let nextCell = column + 1
    let prevCell = column - 1
    let liveCellsFound = 0

    for(let i = prevRow; i <= nextRow; i++) {
      for(let j = prevCell; j <= nextCell; j++) {
        if(i === row && j === column) continue
        if(i < 0 || j < 0 || i > TOTAL_VERTICAL_CELLS - 1 || j > TOTAL_HORIZONTAL_CELLS - 1) continue
        if(board[i][j].state === CELL_STATE.LIVE) {
          liveCellsFound++
        }
      }
    }

    // Reglas del juego de la vida de conway
    // 1. Si una celula muerta tiene exactamente 3 celulas vecinas vivas, nace
    // 2. Si una celula viva tiene mas de tres vecinos al rededos muere
    // 3. Si una celula tiene uno o ningun vecino muere
    // 4. si una celula tiene 2 o 3 vecinos a su alrededor vive

    if (liveCellsFound === 3 && this.state === CELL_STATE.DEAD) {
      return CELL_STATE.LIVE
    } else if ((liveCellsFound < 2 || liveCellsFound > 3) && this.state === CELL_STATE.LIVE) {
      return CELL_STATE.DEAD
    } else {
      return this.state
    }
  }

  setState(state) {
    this.state = state
  }
}