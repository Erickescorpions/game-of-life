export const WIDTH = 800
export const HEIGHT = 800
export const CELL_SIZE = 20
export const CELL_STATE = {
  DEAD: 0,
  LIVE: 1
}
export const TOTAL_VERTICAL_CELLS = HEIGHT / CELL_SIZE
export const TOTAL_HORIZONTAL_CELLS = WIDTH / CELL_SIZE
export const GAME_STATE = Object.freeze({ START: 0, STOP: 1 })
