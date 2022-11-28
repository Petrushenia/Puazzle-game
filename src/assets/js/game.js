class Game {
  constructor(root) {
    this.root = root;
    this.game = document.createElement('div');
    this.controlBlock = document.createElement('div');
    this.controlButtons = ['Shuffle and start', 'Stop', 'Save', 'Results',];
    this.levelBlocks = document.createElement('div');
    this.levelButtons = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8',];
    this.gameCount = document.createElement('div');
    this.gameMoves = document.createElement('div');
    this.gameTime = document.createElement('div');
    this.gameField = document.createElement('div');
    this.frameSize = document.createElement('div');
  }

  start = () => {
    this.addClassMainBlocks();
    this.createButton();
    this.addMainElement();

  }

  addClassMainBlocks = () => {
    this.game.className = 'game-wrapper';
    this.controlBlock.className = 'button-wrapper';
    this.gameCount.className = 'game-count'
    this.gameField.className = 'game-field';
  }

  addMainElement = () => {
    this.game.append(this.controlBlock, this.gameCount, this.gameField);
    this.root.append(this.game);
  }

  createCountMove = () => {
    const move = document.createElement('span');
    move.className = 'move';
    move.textContent = `Move: ${0}`;
  }

  createTime = () => {
    const time = document.createElement('span');
    time.className = 'time';
  }

  createButton = () => {
    this.controlButtons.forEach(button => {
      const btn = document.createElement('button');
      btn.textContent = button;
      if (button == this.controlButtons[1]) {btn.classList.add('stop-button')};
      btn.classList.add('button-control');
      this.controlBlock.appendChild(btn);
    })
  }
} 

const game = new Game(document.body)

game.start()

