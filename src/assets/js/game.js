class Game {
  constructor(root) {
    //element game
    this.root = root;
    this.game = document.createElement('div');
    this.controlBlock = document.createElement('div');
    this.levelBlock = document.createElement('div');
    this.gameCount = document.createElement('div');
    this.gameTime = document.createElement('div');
    this.gameField = document.createElement('div');
    this.blur = document.createElement('div');
    this.frameSize = document.createElement('div');
    //controls
    this.controlButtons = ['Shuffle and start', 'Pause', 'Save', 'Results',];
    this.levelButtons = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8',];
    this.numbers = [...Array(64).keys()].map(num => num + 1);
    this.emptyCell = {
      top: 0,
      left: 0
    }
    this.cells = [];
    this.level = 0;
    this.activeTimer = true;
    this.activeGame = false;
    this.isPause = false;
    //counts
    this.seconds = 1;
    this.minutes = Math.floor(this.seconds / 60);
    this.moves = 0;

    this.nIntervalId;
    this.arrFunc = [this.startGame, this.pauseGame, this.startGame, this.stopGame];


    this.levelBlock.addEventListener('click', this.toggleButtonClass);
  }

  addGame = (e) => {
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
    this.blur.className = 'blur';
    this.frameSize.className = 'frame'
    this.levelBlock.className = 'level-buttons';
  }

  addMainElement = () => {
    this.createCountMove();
    this.createTime();
    this.game.append(this.controlBlock, this.gameCount, this.gameField, this.frameSize, this.levelBlock);
    this.root.append(this.game);
  }

  createCountMove = () => {
    const move = document.createElement('span');
    const moveCount = document.createElement('span');
    moveCount.innerHTML = 0;
    move.className = 'move';
    move.innerHTML = 'Moves: ';
    move.append(moveCount);
    this.gameCount.appendChild(move);
  }

  createTime = () => {
    const time = document.createElement('span');
    const seconds = document.createElement('span');
    const minutes = document.createElement('span');
    time.className = 'time';
    time.textContent = 'Time ';
    minutes.textContent = '0';
    seconds.textContent = ':00';
    time.append(minutes, seconds);
    this.gameCount.appendChild(time);
  }

  createButton = () => {
    this.controlButtons.forEach((button, index) => {
      const btn = document.createElement('button');
      btn.textContent = button;
      if (button == this.controlButtons[1]) {btn.classList.add('stop-button')};
      btn.classList.add('button');
      btn.addEventListener('click', this.arrFunc[index]);
      this.controlBlock.appendChild(btn);
    })
  }

  createLevelButton = () => {
    this.levelButtons.forEach(button => {
      const btn = document.createElement('button');   
      btn.textContent = button;
      btn.className = 'button';
      btn.addEventListener('click', (e) => {
          if (!this.isPause) {
            this.activeGame = false;
            this.level = this.getLevel(e);
            this.setStyleGameField(this.level);
            this.addFrameSize(e);
            this.resetGame();
            this.createCell(this.level);
          }
        }
      )
      this.levelBlock.appendChild(btn);
    })
  }

  addFrameSize = (e) => {
    if (!e) {
      this.frameSize.textContent = 'Frame size: 0x0';
    }else {
      this.frameSize.textContent = `Frame size: ${e.target.textContent}`;
    }
  }

  createCell = (level) => {
    this.resetGame()
    for (let i = 0; i < Math.pow(level, 2) - 1; i++) {
      const left = i % level;
      const top = (i - left) / level;
      const cell = {
        top: top,
        left: left,
        number: this.numbers[i],
        class: 'cell',
        element: document.createElement('div')
      }
      this.gameField.appendChild(cell.element);
      this.setStyleCell(cell);
      cell.element.addEventListener('click', () => {this.moveCells(i)});
      this.cells.push(cell);
    }
    this.emptyCell.top = level - 1;
    this.emptyCell.left = level - 1;
    this.cells.push(this.emptyCell);
    this.gameField.appendChild(this.blur);
  }

  getLevel = (e) => {
    return +e.target.textContent[0];
  }

  toggleButtonClass = (e) => {
    if (e.target.tagName === 'BUTTON') {
      this.levelBlock.childNodes.forEach(button => {
        button.classList.remove('level-button-active');
      })
      e.target.classList.add('level-button-active');
    }
  }

  addBlur = () => {
    this.blur.classList.add('blur-active');
  }

  removeBlur = () => {
    this.blur.classList.remove('blur-active');
  }
  
  setStyleCell = (cell) => {
    cell.element.className = cell.class;
    cell.element.style.left = `${cell.left * (cell.element.offsetWidth + 5) + 5}px`;
    cell.element.style.top = `${cell.top * (cell.element.offsetWidth + 5) +  5}px`;
    cell.element.textContent = cell.number;
  }

  moveCells = (index) => {
    if (this.activeGame) {
      const cell = this.cells[index];
      const leftDiv = Math.abs(this.emptyCell.left - cell.left);
      const topDiv = Math.abs(this.emptyCell.top - cell.top)
      const left = this.emptyCell.left;
      const top = this.emptyCell.top;
      if (leftDiv + topDiv > 1) {return}
      this.emptyCell.top = cell.top;
      this.emptyCell.left = cell.left;
      cell.top = top;
      cell.left = left;
      cell.element.style.top = `${cell.top * (cell.element.offsetWidth + 5) + 5}px`;
      cell.element.style.left = `${cell.left * (cell.element.offsetWidth + 5) + 5}px`;
      this.countMove();
      this.checkGame();
    }else {
      this.addBlur();
      this.blur.textContent = 'Please click "Shuffle and start"';
    }
  }

  countMove = () => {
    const movesBlock = this.gameCount.querySelector('.move').childNodes[1];
    this.moves += 1;
    movesBlock.textContent = this.moves;
  }

  shuffle = () => {
    if (this.gameField.hasChildNodes()) {
      const numbers = this.cells.map(cellNum => cellNum.number).filter(num => num != undefined);
      for (let i = numbers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      this.cells.forEach((cell, index) => {
        if (cell.number) {
          cell.number = numbers[index];
          cell.element.textContent = cell.number;
        }
      })
    }
  }

  setStyleGameField = (level) => {
    switch (level) {
      case 3:
        this.gameField.classList.remove('game-field-active-level-two', 'game-field-active-level-three', 'game-field-active-level-four', 'game-field-active-level-five', 'game-field-active-level-six');
        this.gameField.classList.add('game-field-active-level-one');
        break;
      case 4:
        this.gameField.classList.remove('game-field-active-level-one', 'game-field-active-level-three', 'game-field-active-level-four', 'game-field-active-level-five', 'game-field-active-level-six');
        this.gameField.classList.add('game-field-active-level-two');
        break;
      case 5:
        this.gameField.classList.remove('game-field-active-level-one', 'game-field-active-level-two', 'game-field-active-level-four', 'game-field-active-level-five', 'game-field-active-level-six');
        this.gameField.classList.add('game-field-active-level-three');
        break;
      case 6:
        this.gameField.classList.remove('game-field-active-level-one', 'game-field-active-level-two', 'game-field-active-level-three', 'game-field-active-level-five', 'game-field-active-level-six');
        this.gameField.classList.add('game-field-active-level-four');
        break;
      case 7:
        this.gameField.classList.remove('game-field-active-level-one', 'game-field-active-level-two', 'game-field-active-level-three', 'game-field-active-level-four', 'game-field-active-level-six');
        this.gameField.classList.add('game-field-active-level-five');
        break;
      case 8:
        this.gameField.classList.remove('game-field-active-level-one', 'game-field-active-level-two', 'game-field-active-level-three', 'game-field-active-level-four', 'game-field-active-level-five');
        this.gameField.classList.add('game-field-active-level-six');
        break;
    }
  }

  resetGame = () => {
    this.cells= [];
    this.moves = 0;
    this.seconds = 0;
    this.minutes = Math.floor(this.seconds / 60)
    this.emptyCell.left = 2;
    this.emptyCell.top = 2;
    this.gameField.innerHTML = '';
    this.gameCount.querySelector('.move').childNodes[1].textContent = 0;
    this.root.querySelector('.time').lastChild.textContent = ':00';
    this.root.querySelector('.time').childNodes[1].textContent = '0';
  }

  timer = () => {
    const time = this.root.querySelector('.time');
    const seconds = time.lastChild;
    const minutes = time.childNodes[1];
    minutes.textContent = this.minutes;
    if (this.seconds == 60) {
      this.seconds = 0;
      seconds.textContent = `:0${this.seconds}`;
    }else if (this.seconds < 10) {
      seconds.textContent = `:0${this.seconds}`;
    }else {
      seconds.textContent = `:${this.seconds}`;
    }
    this.seconds += 1;
    this.minutes = this.minutes + Math.floor(this.seconds / 60);
  }

  showMassege = () => {
    if (!this.activeGame) {
      this.blur.textContent = 'Please click on "Shuffle and start"';
    }else {
      this.blur.textContent = 'You\'r Win!!!';
    }
  }

  startGame = () => {
    this.activeGame = true;
    this.resetGame();
    this.startTimer();
    this.createCell(this.level);
    this.shuffle();
    this.removeBlur(); 
  }

  pauseGame = (e) => {
    if (!this.isPause) {
      this.isPause = true;
      this.addBlur();
      this.stopTimer();
      this.blur.textContent = 'Click continue';
      e.target.textContent = 'Continue';
    }else {
      this.isPause = false;
      this.removeBlur();
      this.startTimer();
      e.target.textContent = 'Pause';
    }
  }

  checkGame = () => {
    const isEnd = this.cells.every(cell => ((cell.top * this.level + cell.left + 1) == (cell.number || this.cells.length)))
    if (isEnd) {
      this.finalGame();
    }
  }

  finalGame = () => {
    this.stopTimer();
    this.addBlur();
    this.blur.textContent = 'You Win!!!';
    this.activeGame = false;
  }

  startTimer = () => {
    if (this.activeTimer) {
      this.nIntervalId = setInterval(this.timer, 1000);
      this.activeTimer = false;
    }
  }

  stopTimer = () => {
    clearInterval(this.nIntervalId);
    this.nIntervalId = null;
    this.activeTimer = true;
  }

} 

const game = new Game(document.body);

game.addGame();

