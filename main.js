import './style.css'
import { GAME_STATE, WIDTH, HEIGHT } from './src/constants'
import { Board } from './src/board'

document.querySelector('#app').innerHTML = `
  <canvas id="board" width=${WIDTH} height=${HEIGHT}></canvas>
  <button id="start">Start game</button>
`

const startButton = document.getElementById('start')

let gameState = GAME_STATE.STOP
let intervalId = null

// creamos la grilla del canvas
let board = new Board()

// draw the grid
board.draw()

const startGame = () => {
  return setInterval(() => {
    window.requestAnimationFrame(() => board.generateLife())
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