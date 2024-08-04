export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight
export const CELL_SIZE = 20
export const CELL_STATE = {
  DEAD: 0,
  LIVE: 1
}
export const TOTAL_VERTICAL_CELLS = Math.floor(HEIGHT / CELL_SIZE)
export const TOTAL_HORIZONTAL_CELLS = Math.floor(WIDTH / CELL_SIZE)
export const GAME_STATE = Object.freeze({ START: 0, STOP: 1 })
export const TOUCH_DEVICE = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
