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

    this.gameMoves = 0;
    this.controlButtons = ['Shuffle and start', 'Stop', 'Save', 'Results',];
    this.levelButtons = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8',];
    this.emptyCell

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
      this.frameSize.textContent = this.levelButtons[0];
    }else {
      this.frameSize.textContent = e.target.textContent
    }
  }

  createLevelButton = () => {
    this.levelButtons.forEach(button => {
      const btn = document.createElement('button');   
      btn.textContent = button;
      btn.className = 'button';
      btn.addEventListener('click', (e) => {
          this.showGame()
          this.setLevel(e)
          this.addFrameSize(e)
        }
      )
      this.levelBlock.appendChild(btn)
    })
  }

  createCell = (level) => {
    for (let i = 0; i < Math.pow(level, 2); i++) {

    }
  }

  setLevel = (e) => {
    return +e.target.textContent[0]
  }

  showGame = () => {
    this.gameField.classList.add('show-game')
  }
  

} 

const game = new Game(document.body)

game.start()

