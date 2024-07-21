import { UI } from "./ui"
import { Board } from "./board";
import { CELL_SIZE } from "./constants";

const sidebarContent = document.querySelector('#sidebar-content')

const bestPatterns = [
  {
    name: 'block',
    pattern: [
      ['', '', '', ''],
      ['', 'x', 'x', ''],
      ['', 'x', 'x', ''],
      ['', '', '', ''],
    ],
  },
  {
    name: 'bee-hive',
    pattern: [
      ['', '', '', '', '', ''],
      ['', '', 'x', 'x', '', ''],
      ['', 'x', '', '', 'x', ''],
      ['', '', 'x', 'x', '', ''],
      ['', '', '', '', '', ''],
    ]
  },
  {
    name: 'beacon',
    pattern: [
      ['', '', '', '', '', ''],
      ['', 'x', 'x', '', '', ''],
      ['', 'x', '', '', '', ''],
      ['', '', '', '', 'x', ''],
      ['', '', '', 'x', 'x', ''],
      ['', '', '', '', '', ''],
    ]
  }
]

let patternsInCanvas = []

bestPatterns.forEach((bestPattern, index) => {
  let height = CELL_SIZE * bestPattern.pattern.length
  let width = CELL_SIZE * bestPattern.pattern[0].length
  let canvasId = `board${index + 1}`;

  let div = document.createElement('div');
  let h3 = document.createElement('h3');
  let canvas = document.createElement('canvas');

  h3.textContent = bestPattern.name;
  canvas.id = canvasId;
  canvas.width = width;
  canvas.height = height;

  div.appendChild(h3);
  div.appendChild(canvas);

  sidebarContent.appendChild(div);

  const ui = new UI(canvasId)
  const board = new Board(ui, CELL_SIZE, bestPattern.pattern.length, bestPattern.pattern[0].length)
  board.fillBoard(bestPattern.pattern, 'x')

  board.draw()

  patternsInCanvas.push(board)
})

patternsInCanvas.forEach(board => {
  setInterval(() => {
    window.requestAnimationFrame(() => board.generateLife())
  }, 1000 / 2)
})