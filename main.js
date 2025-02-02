import './style.css'
import { GAME_STATE, WIDTH, HEIGHT, CELL_SIZE, TOTAL_VERTICAL_CELLS, TOTAL_HORIZONTAL_CELLS } from './src/constants'
import { Board } from './src/board'
import { UI } from './src/ui'
import './src/sidebar'

const startButton = document.getElementById('start')

let gameState = GAME_STATE.STOP
let intervalId = null

let ui = new UI('board', WIDTH, HEIGHT)
let mainBoard = new Board(ui, CELL_SIZE, TOTAL_VERTICAL_CELLS, TOTAL_HORIZONTAL_CELLS)
// draw the grid
mainBoard.draw()
mainBoard.registerDraggingPatternEvent()
mainBoard.registerOnClickEvent()

const startGame = () => {
  return setInterval(() => {
    window.requestAnimationFrame(() => mainBoard.generateLife())
  }, 1000 / 2)
}

const stopGame = (intervalId) => clearInterval(intervalId)

startButton.addEventListener('click', () => {

  if (gameState === GAME_STATE.START) {
    gameState = GAME_STATE.STOP
    startButton.innerHTML = "Start game"
    stopGame(intervalId)

    startButton.style.setProperty('--color', '#4CAF50');
  } else {
    gameState = GAME_STATE.START
    startButton.innerHTML = "Stop game"
    intervalId = startGame()

    startButton.style.setProperty('--color', '#757575');
  }
})