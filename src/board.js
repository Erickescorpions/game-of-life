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
    this.previousDragPosition = {rowIndex: 0, cellIndex: 0}

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
      const { position, pattern, clickRelease } = event.detail

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
            return
          }
        })
      })

      if(this.previousDragPosition.cellIndex !== null || this.previousDragPosition.rowIndex !== null) {
        // limpiamos la posicion anterior
        const startRow = this.previousDragPosition.rowIndex;
        const startCol = this.previousDragPosition.cellIndex;
        const endRow = startRow + pattern.length;
        const endCol = startCol + pattern[0].length;

        for (let row = startRow; row < endRow; row++) {
          if (row < this.cells.length) {
            for (let col = startCol; col < endCol; col++) {
              if (col < this.cells[row].length) {
                let currentBoardCell = this.cells[row][col]

                if(currentBoardCell.state === CELL_STATE.DEAD) {
                  this.ui.clearRect(currentBoardCell.x, currentBoardCell.y, this.cell_size, this.cell_size)
                  this.ui.stroke(currentBoardCell.draw())
                }
              }
            }
          }
        }
      }

      this.previousDragPosition.rowIndex = startCell.rowIndex
      this.previousDragPosition.cellIndex = startCell.cellIndex


      pattern.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
        let verticalCellPos = rowIndex + startCell.rowIndex
        let horizontalCellPos = cellIndex + startCell.cellIndex
        
        if(verticalCellPos >= this.num_vertical_cells || horizontalCellPos >= this.num_horizontal_cells) return

        let currentBoardCell = this.cells[verticalCellPos][horizontalCellPos]

        if (cell === 'x') {
          this.ui.fill(currentBoardCell.draw())
          this.ui.stroke(currentBoardCell.draw())

          if(clickRelease === true) {
            currentBoardCell.setState(CELL_STATE.LIVE)
            this.previousDragPosition.rowIndex = null
            this.previousDragPosition.cellIndex = null
          }
        } else {
          if(currentBoardCell.state === CELL_STATE.DEAD) {
            this.ui.clearRect(currentBoardCell.x, currentBoardCell.y, this.cell_size, this.cell_size)
            this.ui.stroke(currentBoardCell.draw())
          }
        }
      }))
    })
  }

  draw() {
    this.ui.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);

    this.cells.forEach(row => row.forEach(cell => {
      if (cell.state === CELL_STATE.LIVE) {
        this.ui.fill(cell.draw());
      } else {
        this.ui.clearRect(cell.x, cell.y, this.cell_size, this.cell_size);
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

    this.cells = newBoard

    this.draw()

    // this.cells.forEach((row, rowIndex) => {
    //   row.forEach((cell, cellIndex) => {
    //     cell.setState(newBoard[rowIndex][cellIndex].state)
    //     if (cell.state === CELL_STATE.LIVE) {
    //       this.ui.fill(cell.draw())
    //       this.ui.stroke(cell.draw())
    //     } else {
    //       this.ui.clearRect(cell.x, cell.y, this.cell_size, this.cell_size)
    //       this.ui.stroke(cell.draw())
    //     }
    //   })
    // })
  }

  fillBoard(pattern, chr) {
    pattern.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
      if (cell === chr) {
        this.cells[rowIndex][cellIndex].setState(CELL_STATE.LIVE)
      }
    }))
  }
}
