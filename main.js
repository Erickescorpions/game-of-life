import './style.css'
import { Cell } from './src/cell'
import { CELL_SIZE, GAME_STATE, TOTAL_HORIZONTAL_CELLS, TOTAL_VERTICAL_CELLS, WIDTH, HEIGHT, CELL_STATE } from './src/consts'

document.querySelector('#app').innerHTML = `
  <canvas id="board" width=${WIDTH} height=${HEIGHT}></canvas>
  <button id="start">Start game</button>
`

const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
const startButton = document.getElementById('start')

let gameState = GAME_STATE.STOP
let intervalId = null

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

}

const startGame = () => {
  return setInterval(() => {
    window.requestAnimationFrame(generateLife)
  }, 1000 / 2)
}

const stopGame = (intervalId) => clearInterval(intervalId)

startButton.addEventListener('click', () => {

  if(gameState === GAME_STATE.START) {
    gameState = GAME_STATE.STOP
    startButton.innerHTML = "Start game"
    stopGame(intervalId)
  } else {
    gameState = GAME_STATE.START
    startButton.innerHTML = "Stop game"
    intervalId = startGame()
  }
})