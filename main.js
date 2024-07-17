import './style.css'

const WIDTH = 800
const HEIGHT = 800
const CELL_SIZE = 20
const CELL_STATE = {
  DEAD: 0,
  LIVE: 1
}
const TOTAL_VERTICAL_CELLS = HEIGHT / CELL_SIZE
const TOTAL_HORIZONTAL_CELLS = WIDTH / CELL_SIZE

document.querySelector('#app').innerHTML = `
  <canvas id="board" width=${WIDTH} height=${HEIGHT}></canvas>
  <button id="start">Start game</button>
`

class Cell {
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

let canvas = document.getElementById('board')
let ctx = canvas.getContext('2d')
let startButton = document.getElementById('start')

ctx.fillStyle = 'rgb(256, 256, 256)'

// creamos la grilla del canvas
let board = []

for (let i = 0; i < TOTAL_VERTICAL_CELLS; i++) {
  let row = []
  for (let j = 0; j < TOTAL_HORIZONTAL_CELLS; j++) {
    row.push(new Cell(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE, CELL_STATE.DEAD))
  }
  board.push(row)
}

// draw the grid
board.forEach(row => row.forEach(col => ctx.stroke(col.draw())))

// agragando on click al canvas
canvas.addEventListener('click', (event) => {
  let xPos = event.offsetX
  let yPos = event.offsetY

  board.forEach(row => {
    row.forEach(cell => {
      if(cell.x <= xPos && cell.x + CELL_SIZE > xPos && cell.y <= yPos && cell.y + CELL_SIZE > yPos) {
        cell.setState(CELL_STATE.LIVE)
        ctx.fill(cell.draw())
      }
    })
  })
})

const generateLife = () => {
  let newBoard = board.map((row, rowIndex) => 
    row.map((cell, cellIndex) => {
      let newState = cell.checkCurrentState(board, rowIndex, cellIndex)
      return new Cell(cell.x, cell.y, cell.width, cell.height, newState)
    })
  )

  // Actualizar el estado de la celda
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      cell.setState(newBoard[rowIndex][cellIndex].state)
      if (cell.state === CELL_STATE.LIVE) {
        ctx.fill(cell.draw())
      } else {
        ctx.clearRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE)
        ctx.stroke(cell.draw())
      }
    })
  })

  setTimeout(() => {
    window.requestAnimationFrame(generateLife)
  }, 1000 / 2)
}

startButton.addEventListener('click', () => {
  console.log('click')
  generateLife()
})