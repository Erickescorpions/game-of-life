import { UI } from "./ui"
import { Board } from "./board";
import { CELL_SIZE, TOUCH_DEVICE } from "./constants";
import { bestPatterns } from "./best_patterns";

const sidebarContent = document.querySelector('#sidebar-content')

let patternsInCanvas = []

const closeSidebarMenu = () => {
  const menuButton = document.querySelector('#menu-checkbox')
  menuButton.checked = false
}

function dragAndDrop(mainEvent, pattern) {
  const targetElement = mainEvent.target
  const rect = targetElement.getBoundingClientRect()
  const horizontalDistanceToTargetEdge = Math.abs(rect.left - mainEvent.clientX)
  const verticalDistanceToTargetEdge = Math.abs(rect.top - mainEvent.clientY)

  const emitDragDAndDropEvent = (position, pattern, clickRelease) => {
    const dragPatternEvent = new CustomEvent('dragpattern', {
      detail: {
        position,
        pattern,
        clickRelease
      }
    })
  
    document.dispatchEvent(dragPatternEvent);
  }

  const getPosition = (event) => {
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    } else {
      return {
        x: event.clientX,
        y: event.clientY
      }
    }
  }

  const updateElementPosition = (event, isDrop) => {
    const position = getPosition(event)
    position.x -= horizontalDistanceToTargetEdge
    position.y -= verticalDistanceToTargetEdge

    targetElement.style.left = position.x + 'px'
    targetElement.style.top = position.y + 'px'

    emitDragDAndDropEvent(position, pattern, isDrop)

    if (isDrop) {
      targetElement.remove()
    }
  }

  if (TOUCH_DEVICE) {
    targetElement.ontouchmove = (onTouchMoveEvent) => updateElementPosition(onTouchMoveEvent, false)
    targetElement.ontouchend = (onTouchEndEvent) => updateElementPosition(onTouchEndEvent, true)
  } else {
    targetElement.onmousemove = (onMouseMoveEvent) => updateElementPosition(onMouseMoveEvent, false)
    targetElement.onmouseup = (onMouseUpEvent) => updateElementPosition(onMouseUpEvent, true)
  }
}

bestPatterns.forEach((bestPattern, index) => {
  let height = CELL_SIZE * bestPattern.pattern.length
  let width = CELL_SIZE * bestPattern.pattern[0].length
  let canvasId = `board${index + 1}`;

  let div = document.createElement('div');
  let h3 = document.createElement('h3');
  let canvas = document.createElement('canvas');

  div.classList = "pattern-container";
  h3.textContent = bestPattern.name;
  canvas.id = canvasId;
  canvas.width = width;
  canvas.height = height;
  canvas.classList = "pattern"

  div.appendChild(h3);
  div.appendChild(canvas);

  sidebarContent.appendChild(div);

  const ui = new UI(canvasId)
  const board = new Board(ui, CELL_SIZE, bestPattern.pattern.length, bestPattern.pattern[0].length)
  board.fillBoard(bestPattern.pattern, 'x')

  board.draw()

  const createCopyOfCanvas = (event) => {
    // creamos una copia del canvas y la posicionamos 5 px a la derecha
    let clonedCanvas = canvas.cloneNode()
    let cloneCanvasId = canvasId + '-clone'
    clonedCanvas.id = cloneCanvasId
    clonedCanvas.classList = "copy-pattern"

    // colocamos justo encima el nuevo elemento
    // regresa un objeto DOMRect con la informacion de tam y posicionamiento
    const rect = canvas.getBoundingClientRect();

    clonedCanvas.style.top = rect.top + 'px';
    clonedCanvas.style.left = rect.left + 'px';

    document.body.appendChild(clonedCanvas)

    // creamos una copia del board 
    const copyUi = new UI(cloneCanvasId)
    const copyBoard = new Board(copyUi, CELL_SIZE, bestPattern.pattern.length, bestPattern.pattern[0].length)
    copyBoard.fillBoard(bestPattern.pattern, 'x')

    copyBoard.draw()

    // Registramos el evento 'mousedown' en el canvas clonado
    clonedCanvas.addEventListener('mousedown', (event) => dragAndDrop(event, bestPattern.pattern))

    // Simulamos un evento 'mousedown'
    const cloneEvent = (event) => {
      if (TOUCH_DEVICE) {
        const touch = event.touches[0]
        return new TouchEvent('touchstart', {
          bubbles: false, // para evitar que el evento se propague
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY
        })
      } else {
        return new MouseEvent('mousedown', {
          bubbles: false, // para evitar que el evento se propague
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY
        })
      }
    }

    const clonedEvent = cloneEvent(event)

    clonedCanvas.dispatchEvent(clonedEvent)

    // si esto pasa, cerramos el sidebar automaticamente
    closeSidebarMenu()
  }


  if(TOUCH_DEVICE) {
    canvas.ontouchstart = createCopyOfCanvas
  } else {
    canvas.onmousedown = createCopyOfCanvas
  }

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

