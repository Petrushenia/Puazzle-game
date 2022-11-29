class Game {
  constructor(root) {
    this.root = root;
    this.game = document.createElement('div');
    this.controlBlock = document.createElement('div');
    this.levelBlock = document.createElement('div');
    this.gameCount = document.createElement('div');
    this.gameTime = document.createElement('div');
    this.gameField = document.createElement('div');
    this.frameSize = document.createElement('div');

    this.controlButtons = ['Shuffle and start', 'Stop', 'Save', 'Results',];
    this.levelButtons = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8',];
    this.cells = [];

    this.levelBlock.addEventListener('click', this.toggleButtonClass)

  }

  start = (e) => {
    this.addClassMainBlocks();
    this.createButton();
    this.createLevelButton();
    this.addFrameSize(e);
    this.addMainElement();

  }

  addClassMainBlocks = () => {
    this.game.className = 'game-wrapper';
    this.controlBlock.className = 'button-wrapper';
    this.gameCount.className = 'game-count'
    this.gameField.className = 'game-field';
    this.frameSize.className = 'frame'
    this.levelBlock.className = 'level-buttons';
  }

  addMainElement = () => {
    this.createCountMove()
    this.createTime()
    this.game.append(this.controlBlock, this.gameCount, this.gameField, this.frameSize, this.levelBlock);
    this.root.append(this.game);
  }

  createCountMove = () => {
    const move = document.createElement('span');
    const moveCount = document.createElement('span');
    moveCount.innerHTML = 0;
    move.className = 'move';
    move.innerHTML = 'Moves: ';
    move.append(moveCount)
    this.gameCount.appendChild(move);
  }

  createTime = () => {
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = 'Time:'
    this.gameCount.appendChild(time);
  }

  createButton = () => {
    this.controlButtons.forEach(button => {
      const btn = document.createElement('button');
      btn.textContent = button;
      if (button == this.controlButtons[1]) {btn.classList.add('stop-button')};
      btn.classList.add('button');
      this.controlBlock.appendChild(btn);
    })
  }

  addFrameSize = (e) => {
    if (!e) {
      this.frameSize.textContent = 'Frame size: 0x0';
    }else {
      this.frameSize.textContent = `Frame size: ${e.target.textContent}`
    }
  }

  createLevelButton = () => {
    this.levelButtons.forEach(button => {
      const btn = document.createElement('button');   
      btn.textContent = button;
      btn.className = 'button';
      btn.addEventListener('click', (e) => {
        this.setStyleGameField(this.setLevel(e))
        this.addFrameSize(e)
        this.createCell(this.setLevel(e))
        }
      )
      this.levelBlock.appendChild(btn)
    })
  }

  createCell = (level) => {
    this.resetGame()
    for (let i = 0; i < Math.pow(level, 2); i++) {
      const left = i % level;
      const top = (i - left) / level;
      const cell = {
        top: top,
        left: left,
        number: i,
        class: 'cell',
        element: document.createElement('div')
      }
      if (i) {
        this.gameField.appendChild(cell.element);
        this.setStyleCell(cell)
        cell.element.addEventListener('click', () => this.moveCells(i))
      }
      this.cells.push(cell);
    }
  }

  setLevel = (e) => {
    return +e.target.textContent[0]
  }

  toggleButtonClass = (e) => {
    if (e.target.tagName === 'BUTTON') {
      this.levelBlock.childNodes.forEach(button => {
        button.classList.remove('level-button-active')
      })
      e.target.classList.add('level-button-active')
    }
  }
  
  setStyleCell = (cell) => {
    cell.element.className = cell.class;
    cell.element.style.left = `${cell.left * (cell.element.offsetWidth + 5) + 5}px`;
    cell.element.style.top = `${cell.top * (cell.element.offsetWidth + 5) +  5}px`;
    cell.element.textContent = cell.number;
  }

  moveCells = (index) => {
    const cell = this.cells[index];
    const leftDiv = Math.abs(this.cells[0].left - cell.left);
    const topDiv = Math.abs(this.cells[0].top - cell.top)
    const left = this.cells[0].left;
    const top = this.cells[0].top;
    if (leftDiv + topDiv > 1) {
      return
    }
    this.cells[0].top = cell.top;
    this.cells[0].left = cell.left;
    cell.top = top;
    cell.left = left
    this.setStyleCell(cell)
    
  }

  shuffleCells = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  setStyleGameField = (level) => {
    this.gameField.style.height = `calc(65px * ${level} + 5px)`;
    this.gameField.style.width = `calc(65px * ${level} + 5px)`
  }

  resetGame = () => {
    this.cells= []
    this.gameField.innerHTML = '';
  }
} 

const game = new Game(document.body)

game.start()

