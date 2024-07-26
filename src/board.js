// board.js
import { Cell } from './cell';
import { CELL_STATE } from './constants';

export class Board {
  constructor(ui, cell_size, num_vertical_cells, num_horizontal_cells) {
    this.ui = ui
    this.cells = []
    this.cell_size = cell_size
    this.num_horizontal_cells = num_horizontal_cells
    this.num_vertical_cells = num_vertical_cells

    for (let i = 0; i < num_vertical_cells; i++) {
      let row = [];
      for (let j = 0; j < num_horizontal_cells; j++) {
        row.push(new Cell(j * cell_size, i * cell_size, cell_size, cell_size, num_vertical_cells, num_horizontal_cells, CELL_STATE.DEAD))
      }
      this.cells.push(row)
    }

    this.ui.setFillStyle('rgb(256, 256, 256)')
  }

  registerOnClickEvent() {
    this.ui.addEventListener('click', (event) => this.manipulateCells(event))
  }

  registerDraggingPatternEvent() {
    document.addEventListener('dragpattern', (event) => {
      const rect = this.ui.canvas.getBoundingClientRect()
      const { position, pattern } = event.detail

      if (position.x <= rect.left || position.y <= rect.top || position.x >= rect.rigth || position.y >= rect.bottom) return
      
      // dependiendo de la posicion de la esquina del board del aside, vamos a buscar
      // la celda que esta en esa posicion
      const canvasPosition = {
        x: position.x - rect.left,
        y: position.y - rect.top
      }

      let startCell = null

      this.cells.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell.x <= canvasPosition.x && canvasPosition.x < (cell.x + this.cell_size) && cell.y <= canvasPosition.y && canvasPosition.y < (cell.y + this.cell_size)) {
            startCell = { rowIndex, cellIndex }
            console.log(rowIndex, cellIndex)
            return
          }
        })
      })

      pattern.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
        let currentBoardCell = this.cells[rowIndex + startCell.rowIndex][cellIndex + startCell.cellIndex]
        if (cell === 'x') {
          this.ui.fill(currentBoardCell.draw())
          this.ui.stroke(currentBoardCell.draw())
        } else {
          this.ui.clearRect(currentBoardCell.x, currentBoardCell.y, this.cell_size, this.cell_size)
          this.ui.stroke(currentBoardCell.draw())
        }
      }))
    })
  }

  draw() {
    this.cells.forEach(row => row.forEach(cell => {
      if (cell.state === CELL_STATE.LIVE) {
        this.ui.fill(cell.draw());
      }
      this.ui.stroke(cell.draw());
    }));
  }

  manipulateCells(event) {
    let xPos = event.offsetX;
    let yPos = event.offsetY;

    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.x <= xPos && cell.x + this.cell_size > xPos && cell.y <= yPos && cell.y + this.cell_size > yPos) {
          if (cell.state === CELL_STATE.LIVE) {
            cell.setState(CELL_STATE.DEAD);
            this.ui.clearRect(cell.x, cell.y, this.cell_size, this.cell_size);
            this.ui.stroke(cell.draw());
          } else {
            cell.setState(CELL_STATE.LIVE);
            this.ui.fill(cell.draw());
            this.ui.stroke(cell.draw());
          }
        }
      });
    });
  }

  generateLife() {
    let newBoard = this.cells.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        let newState = cell.checkCurrentState(this.cells, rowIndex, cellIndex)
        return new Cell(cell.x, cell.y, cell.width, cell.height, this.num_vertical_cells, this.num_horizontal_cells, newState)
      })
    )

    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        cell.setState(newBoard[rowIndex][cellIndex].state)
        if (cell.state === CELL_STATE.LIVE) {
          this.ui.fill(cell.draw())
          this.ui.stroke(cell.draw())
        } else {
          this.ui.clearRect(cell.x, cell.y, this.cell_size, this.cell_size)
          this.ui.stroke(cell.draw())
        }
      })
    })
  }

  fillBoard(pattern, chr) {
    pattern.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
      if (cell === chr) {
        this.cells[rowIndex][cellIndex].setState(CELL_STATE.LIVE)
      }
    }))
  }
}
