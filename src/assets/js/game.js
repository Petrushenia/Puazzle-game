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
    //controls element
    this.controlButtons = ['Shuffle and start', 'Pause', 'Save', 'Results',];
    this.levelButtons = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8',];
    this.numbers = [...Array(64).keys()].map(num => num + 1);
    //setting
    this.nIntervalId;
    this.options = {
      emptyCell: {top: 0, left: 0},
      cells: [],
      level: 4,
      activeGame: false,
      activeTimer: true,
      isPause: false,
      seconds: 1,
      moves: 1,
    };

    document.addEventListener('DOMContentLoaded', this.loadGame)
    this.levelBlock.addEventListener('click', this.toggleButtonClass);
  }
  //create game element
  addGame = (e) => {
    this.addClassMainBlocks();
    this.createControlButton();
    this.createLevelButton();
    this.addFrameSize(this.options.level);
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

  createControlButton = () => {
    const arrFunc = [this.startGame, this.pauseGame, this.saveGame, this.loadGame];
    this.controlButtons.forEach((button, index) => {
      const btn = document.createElement('button');
      btn.textContent = button;
      if (button == this.controlButtons[1]) {btn.classList.add('pause-button')};
      btn.classList.add('button');
      btn.addEventListener('click', arrFunc[index]);
      this.controlBlock.appendChild(btn);
    })
  }

  createLevelButton = () => {
    this.levelButtons.forEach(button => {
      const btn = document.createElement('button');   
      btn.textContent = button;
      btn.className = 'button';
      btn.addEventListener('click', (e) => {
        if (!this.options.isPause) {
          this.options.activeGame = false;
          this.getLevel(e);
          this.setStyleGameField(this.options.level);
          this.addFrameSize(this.options.level);
          this.stopTimer();
          this.removeBlur();
          this.resetGame();
          this.addCell(this.options.level);
        }
      })
      this.levelBlock.appendChild(btn);
    })
  }

  addFrameSize = (level) => {
    if (!level) {
      this.frameSize.textContent = `Frame size: 0x0`;
    }else {
      this.frameSize.textContent = `Frame size: ${level}x${level}`;
    }
  }

  addCell = (level) => {
    this.resetGame();
    for (let i = 0; i < Math.pow(level, 2) - 1; i++) {
      const left = i % level;
      const top = (i - left) / level;
      const cell = {
        top: top,
        left: left,
        number: this.numbers[i],
        class: 'cell',
        element: document.createElement('div')
      };
      this.options.cells.push(cell);
      this.gameField.appendChild(cell.element);
      this.setStyleCell(cell);
      cell.element.addEventListener('click', () => {this.moveCells(i)});
    }
    this.options.emptyCell.top = level - 1;
    this.options.emptyCell.left = level - 1;
    this.gameField.appendChild(this.blur);
  }

  getLevel = (e) => {
    this.options.level = +e.target.textContent[0];
  }
  //functional
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
    cell.element.style.width = `${(this.gameField.offsetWidth - (this.options.level * 10)) / this.options.level}px`;
    cell.element.style.height = `${(this.gameField.offsetWidth - (this.options.level * 10)) / this.options.level}px`;
    cell.element.style.left = `${cell.left * (cell.element.offsetWidth + 10) + 5}px`;
    cell.element.style.top = `${cell.top * (cell.element.offsetWidth + 10) +  5}px`;
    cell.element.textContent = cell.number;
  }

  moveCells = (index) => {
    if (this.options.activeGame) {
      const cell = this.options.cells[index];
      const leftDiv = Math.abs(this.options.emptyCell.left - cell.left);
      const topDiv = Math.abs(this.options.emptyCell.top - cell.top);
      const left = this.options.emptyCell.left;
      const top = this.options.emptyCell.top;
      if (leftDiv + topDiv > 1) {return}
      this.options.emptyCell.top = cell.top;
      this.options.emptyCell.left = cell.left;
      cell.top = top;
      cell.left = left;
      cell.element.style.top = `${cell.top * (cell.element.offsetWidth + 10) + 5}px`;
      cell.element.style.left = `${cell.left * (cell.element.offsetWidth + 10) + 5}px`;
      this.countMove();
      this.checkGame(index);
    }else {
      this.changeColor();
      this.addBlur();
      this.blur.textContent = 'Please click "Shuffle and start"';
    }
  }

  countMove = () => {
    const movesBlock = this.gameCount.querySelector('.move').childNodes[1];
    movesBlock.textContent = this.options.moves;
    this.options.moves += 1;
  }

  shuffle = () => {
    if (this.gameField.hasChildNodes()) {
      const numbers = this.options.cells.map(cell => cell.number);
      for (let i = numbers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      this.options.cells.forEach((cell, index) => {
          cell.number = numbers[index];
          cell.element.textContent = cell.number;
      })
    }
  }

  setStyleGameField = (level) => {
    this.gameField.style.height = `${this.gameField.offsetWidth}px`;
    // switch (level) {
    //   case 3:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-two',
    //       'game-field-active-level-three',
    //       'game-field-active-level-four',
    //       'game-field-active-level-five',
    //       'game-field-active-level-six'
    //     );
    //     this.gameField.classList.add('game-field-active-level-one');
    //     break;
    //   case 4:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-one',
    //       'game-field-active-level-three',
    //       'game-field-active-level-four',
    //       'game-field-active-level-five',
    //       'game-field-active-level-six'
    //     );
    //     this.gameField.classList.add('game-field-active-level-two');
    //     break;
    //   case 5:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-one',
    //       'game-field-active-level-two',
    //       'game-field-active-level-four',
    //       'game-field-active-level-five',
    //       'game-field-active-level-six'
    //     );
    //     this.gameField.classList.add('game-field-active-level-three');
    //     break;
    //   case 6:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-one',
    //       'game-field-active-level-two',
    //       'game-field-active-level-three',
    //       'game-field-active-level-five',
    //       'game-field-active-level-six'
    //     );
    //     this.gameField.classList.add('game-field-active-level-four');
    //     break;
    //   case 7:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-one',
    //       'game-field-active-level-two',
    //       'game-field-active-level-three',
    //       'game-field-active-level-four',
    //       'game-field-active-level-six'
    //     );
    //     this.gameField.classList.add('game-field-active-level-five');
    //     break;
    //   case 8:
    //     this.gameField.classList.remove(
    //       'game-field-active-level-one',
    //       'game-field-active-level-two',
    //       'game-field-active-level-three',
    //       'game-field-active-level-four',
    //       'game-field-active-level-five'
    //     );
    //     this.gameField.classList.add('game-field-active-level-six');
    //     break;
    // }
  }

  timer = () => {
    const time = this.gameCount.querySelector('.time');
    const seconds = time.lastChild;
    const minutes = time.childNodes[1];
    this.options.seconds += 1;
    this.getMinutes();
    minutes.textContent = this.options.minutes;
    if (this.options.seconds == 60) {
      this.options.seconds = 0;
      seconds.textContent = `:0${this.options.seconds}`;
    }else if (this.options.seconds < 10) {
      seconds.textContent = `:0${this.options.seconds}`;
    }else {
      seconds.textContent = `:${this.options.seconds}`;
    }
  }

  getMinutes = () => {
    this.options.minutes = (this.options.minutes + Math.floor((this.options.seconds) / 60)) || Math.floor((this.options.seconds) / 60);
  }

  showMassege = () => {
    if (!this.options.activeGame) {
      this.blur.textContent = 'Please click on "Shuffle and start"';
    }else {
      this.blur.textContent = 'You\'r Win!!!';
    }
  }

  changeColor = () => {
    const startButton = this.controlBlock.firstChild;
    startButton.classList.add('ch-color');
    setTimeout(() => startButton.classList.remove('ch-color'), 2000)
  }

  startGame = () => {
    this.options.activeGame = true;
    this.resetGame();
    this.startTimer();
    this.addCell(this.options.level);
    this.shuffle();
    this.removeBlur(); 
  }

  pauseGame = (e) => {
    const pauseBtn = this.controlBlock.querySelector('.pause-button');
    if (!this.options.isPause) {
      this.options.isPause = true;
      pauseBtn.textContent = 'Continue';
      pauseBtn.classList.add('.pause-button-active');
      this.blur.textContent = 'Click continue';
      this.addBlur();
      this.stopTimer();
    }else {
      this.options.isPause = false;
      this.removeBlur();
      this.startTimer();
      pauseBtn.textContent = 'Pause';
      pauseBtn.classList.remove('pause-button-active');
    }
  }

  checkGame = () => {
    const isEnd = this.options.cells.every(cell => ((cell.top * this.options.level + cell.left + 1) == cell.number))
    if (isEnd) {
      this.finalGame();
    }
  }

  finalGame = () => {
    const blur = this.gameField.querySelector('.blur');
    this.stopTimer();
    this.addBlur();
    this.blur.textContent = `You Win for ${this.options.moves - 1} moves, ${this.options.minutes} minutes and ${this.options.seconds} seconds.`;
    this.options.activeGame = false;
  }

  startTimer = () => {
    if (this.options.activeTimer) {
      this.nIntervalId = setInterval(this.timer, 1000);
      this.options.activeTimer = false;
    }
  }

  stopTimer = () => {
    clearInterval(this.nIntervalId);
    this.nIntervalId = null;
    this.options.activeTimer = true;
  }

  saveGame = () => {
    this.options.isPause = false;
    this.setLocalStorage()
  }

  setLocalStorage = () => {
    localStorage.setItem('options', JSON.stringify(this.options));
    localStorage.setItem('cells', this.gameField.innerHTML);
  }

  loadGame = () => {
    const pauseBtn = this.controlBlock.childNodes[1];
    if (localStorage['options']) {
      const saveOptions = JSON.parse(localStorage.getItem('options'));
      this.options = saveOptions;
    }
    if (localStorage['cells']) {
      this.gameField.innerHTML = localStorage['cells'];
      this.options.cells.forEach((cell, index) => {
        cell.element = this.gameField.childNodes[index];
        cell.element.addEventListener('click', () => this.moveCells(index));
        this.setStyleCell(this.options.cells[index])
      })
      this.setStyleGameField(this.options.level);

      pauseBtn.classList.add('pause-button-active')
      this.timer();
      this.countMove();
      this.pauseGame();
      this.gameField.lastChild.remove()
      this.gameField.append(this.blur);
    }
  }

  resetGame = () => {
    this.options.cells= [];
    this.options.moves = 1;
    this.options.seconds = 0;
    this.options.minutes = 0;
    this.options.emptyCell.left = 2;
    this.options.emptyCell.top = 2;
    this.gameField.innerHTML = '';
    this.gameCount.querySelector('.move').childNodes[1].textContent = 0;
    this.root.querySelector('.time').lastChild.textContent = ':00';
    this.root.querySelector('.time').childNodes[1].textContent = '0';
  }
}

const game = new Game(document.body);
game.addGame();
