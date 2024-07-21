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
  canvas.classList = "patterns"

  div.appendChild(h3);
  div.appendChild(canvas);

  sidebarContent.appendChild(div);

  const ui = new UI(canvasId)
  const board = new Board(ui, CELL_SIZE, bestPattern.pattern.length, bestPattern.pattern[0].length)
  board.fillBoard(bestPattern.pattern, 'x')

  board.draw()
  
  // Al presionar el mouse clonamos un nuevo canvas
  canvas.addEventListener('mousedown', (event) => {
    // creamos una copia del canvas y la posicionamos 5 px a la derecha
    let clonedCanvas = canvas.cloneNode()
    clonedCanvas.id = canvasId + 'clone'
    clonedCanvas.classList = "copy-pattern"

    // colocamos justo encima el nuevo elemento
    // regresa un objeto DOMRect con la informacion de tam y posicionamiento
    const rect = canvas.getBoundingClientRect();

    clonedCanvas.style.top = rect.top + 'px';
    clonedCanvas.style.left = rect.left + 'px';

    document.body.appendChild(clonedCanvas)

    // creamos una copia del board 
    const copyUi = new UI(canvasId + 'clone')
    const copyBoard = new Board(copyUi, CELL_SIZE, bestPattern.pattern.length, bestPattern.pattern[0].length)
    copyBoard.fillBoard(bestPattern.pattern, 'x')

    copyBoard.draw()

    // Registramos el evento 'mousedown' en el canvas clonado
    clonedCanvas.addEventListener('mousedown', (copyEvent) => {
      console.log(copyEvent)
    })

    // Simulamos un evento 'mousedown'
    const clonedEvent = new MouseEvent('mousedown', {
      bubbles: false, // para evitar que el evento se propague
      cancelable: true,
      clientX: event.clientX,
      clientY: event.clientY
    })

    clonedCanvas.dispatchEvent(clonedEvent)
  })
  

  patternsInCanvas.push({
    pattern: bestPattern.pattern,
    board,
  })
})

patternsInCanvas.forEach(patternInCanva => {
  setInterval(() => {
    window.requestAnimationFrame(() => patternInCanva.board.generateLife())
  }, 1000 / 2)
})