class LudoBoard {
    constructor() {
        this.board = document.getElementById('board');
        this.currentPlayer = 'red';
        this.diceValue = 0;
        this.gameState = 'waiting';
        this.soundEnabled = true;
        this.tokens = { red: [], blue: [], green: [], yellow: [] };
        this.stats = { totalMoves: 0, diceRolls: 0, captures: 0, sixes: 0 };
        this.playerScores = {
            red: { home: 4, finished: 0 },
            yellow: { home: 4, finished: 0 },
            blue: { home: 4, finished: 0 },
            green: { home: 4, finished: 0 }
        };
        this.cellsCache = [];
        this.paths = {
            red: this.getRedPath(),
            blue: this.getBluePath(),
            green: this.getGreenPath(),
            yellow: this.getYellowPath()
        };
        this.initializeBoard();
        this.initializeDice();
        this.initializeSoundToggle();
        this.updateCurrentPlayer();
        this.updateScoreBoard();
        window.ludoGame = this;
    }

    getRedPath() {
        let path = [];
        for (let col = 1; col <= 5; col++) path.push([6, col]);
        for (let row = 5; row >= 0; row--) path.push([row, 6]);
        for (let col = 7; col <= 8; col++) path.push([0, col]);
        for (let row = 1; row <= 6; row++) path.push([row, 8]);
        for (let col = 9; col <= 14; col++) path.push([6, col]);
        for (let row = 7; row <= 8; row++) path.push([row, 14]);
        for (let col = 13; col >= 8; col--) path.push([8, col]);
        for (let row = 9; row <= 14; row++) path.push([row, 8]);
        for (let col = 7; col >= 6; col--) path.push([14, col]);
        for (let row = 13; row >= 8; row--) path.push([row, 6]);
        for (let col = 5; col >= 0; col--) path.push([8, col]);
        for (let row = 7; row >= 6; row--) path.push([row, 0]);
        for (let col = 1; col <= 5; col++) path.push([6, col]);
        for (let col = 1; col <= 6; col++) path.push([7, col]);
        return path;
    }

    getBluePath() {
        let path = [];
        for (let row = 13; row >= 9; row--) path.push([row, 6]);
        for (let col = 5; col >= 0; col--) path.push([8, col]);
        for (let row = 7; row >= 0; row--) path.push([row, 0]);
        for (let col = 1; col <= 6; col++) path.push([0, col]);
        for (let row = 1; row <= 6; row++) path.push([row, 6]);
        for (let col = 7; col <= 8; col++) path.push([6, col]);
        for (let row = 5; row >= 0; row--) path.push([row, 8]);
        for (let col = 9; col <= 14; col++) path.push([0, col]);
        for (let row = 1; row <= 8; row++) path.push([row, 14]);
        for (let col = 13; col >= 8; col--) path.push([8, col]);
        for (let row = 9; row <= 14; row++) path.push([row, 8]);
        for (let col = 7; col >= 6; col--) path.push([14, col]);
        for (let row = 13; row >= 9; row--) path.push([row, 6]);
        for (let row = 13; row >= 8; row--) path.push([row, 7]);
        return path;
    }

    getGreenPath() {
        let path = [];
        for (let col = 13; col >= 9; col--) path.push([8, col]);
        for (let row = 9; row <= 14; row++) path.push([row, 8]);
        for (let col = 7; col >= 0; col--) path.push([14, col]);
        for (let row = 13; row >= 8; row--) path.push([row, 0]);
        for (let col = 1; col <= 6; col++) path.push([8, col]);
        for (let row = 7; row >= 6; row--) path.push([row, 6]);
        for (let col = 5; col >= 0; col--) path.push([6, col]);
        for (let row = 5; row >= 0; row--) path.push([row, 6]);
        for (let col = 7; col <= 8; col++) path.push([0, col]);
        for (let row = 1; row <= 6; row++) path.push([row, 8]);
        for (let col = 9; col <= 14; col++) path.push([6, col]);
        for (let row = 7; row <= 8; row++) path.push([row, 14]);
        for (let col = 13; col >= 9; col--) path.push([8, col]);
        for (let col = 13; col >= 8; col--) path.push([7, col]);
        return path;
    }

    getYellowPath() {
        let path = [];
        for (let row = 1; row <= 5; row++) path.push([row, 8]);
        for (let col = 9; col <= 14; col++) path.push([6, col]);
        for (let row = 7; row <= 8; row++) path.push([row, 14]);
        for (let col = 13; col >= 8; col--) path.push([8, col]);
        for (let row = 9; row <= 14; row++) path.push([row, 8]);
        for (let col = 7; col >= 6; col--) path.push([14, col]);
        for (let row = 13; row >= 8; row--) path.push([row, 6]);
        for (let col = 5; col >= 0; col--) path.push([8, col]);
        for (let row = 7; row >= 6; row--) path.push([row, 0]);
        for (let col = 1; col <= 6; col++) path.push([6, col]);
        for (let row = 5; row >= 0; row--) path.push([row, 6]);
        for (let col = 7; col <= 8; col++) path.push([0, col]);
        for (let row = 1; row <= 5; row++) path.push([row, 8]);
        for (let row = 1; row <= 6; row++) path.push([row, 7]);
        return path;
    }

    initializeBoard() {
        this.board.innerHTML = '';
        this.cellsCache = [];
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.setAttribute('aria-label', `cell ${row},${col}`);
                const cellType = this.getCellType(row, col);
                cell.classList.add(cellType);
                this.addSpecialMarkers(cell, row, col);
                this.board.appendChild(cell);
                this.cellsCache.push(cell);
            }
        }
        this.addTokensToHome();
    }

    getCellType(row, col) {
        if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
            if (row === 7 && col === 7) return 'center';
            if (row === 7 && col < 7) return 'path-red';
            if (row === 7 && col > 7) return 'path-green';
            if (col === 7 && row < 7) return 'path-yellow';
            if (col === 7 && row > 7) return 'path-blue';
            return 'path';
        }
        if (row < 6 && col < 6) return 'home-red';
        if (row < 6 && col > 8) return 'home-yellow';
        if (row > 8 && col < 6) return 'home-blue';
        if (row > 8 && col > 8) return 'home-green';
        if (row === 6 && (col < 6 || col > 8)) return 'path';
        if (row === 8 && (col < 6 || col > 8)) return 'path';
        if (col === 6 && (row < 6 || row > 8)) return 'path';
        if (col === 8 && (row < 6 || row > 8)) return 'path';
        return 'path';
    }

    addSpecialMarkers(cell, row, col) {
        const safeZones = [
            [2, 6], [6, 2], [8, 12], [12, 8],
            [6, 12], [12, 6], [8, 2], [2, 8]
        ];
        if (safeZones.some(([r, c]) => r === row && c === col)) {
            cell.classList.add('safe');
        }
        if (row === 1 && col === 6) cell.classList.add('arrow-down');
        if (row === 13 && col === 8) cell.classList.add('arrow-up');
        if (row === 6 && col === 1) cell.classList.add('arrow-right');
        if (row === 8 && col === 13) cell.classList.add('arrow-left');
    }

    addTokensToHome() {
        const homePositions = {
            red: [[1, 1], [1, 4], [4, 1], [4, 4]],
            yellow: [[1, 10], [1, 13], [4, 10], [4, 13]],
            blue: [[10, 1], [10, 4], [13, 1], [13, 4]],
            green: [[10, 10], [10, 13], [13, 10], [13, 13]]
        };
        Object.keys(homePositions).forEach(color => {
            homePositions[color].forEach((pos, index) => {
                const [row, col] = pos;
                const cell = this.cellsCache[row * 15 + col];
                // Home pe pehle se token hai to na daalein
                if (cell.querySelector('.token')) return;
                const token = document.createElement('div');
                token.className = `token token-${color}`;
                token.dataset.color = color;
                token.dataset.id = index;
                token.dataset.position = -1;
                token.dataset.row = row;
                token.dataset.col = col;
                token.setAttribute('aria-label', `${color} token`);
                token.addEventListener('click', () => this.moveToken(token));
                cell.appendChild(token);
                this.tokens[color].push(token);
            });
        });
    }

    initializeDice() {
        document.querySelectorAll('.dice').forEach(dice => {
            dice.addEventListener('click', (e) => {
                const player = e.target.dataset.player;
                if (player === this.currentPlayer && this.gameState === 'waiting') {
                    this.rollDice(e.target);
                }
            });
        });
        // Mobile dice ka bhi event listener
        document.querySelectorAll('.mobile-dice .dice').forEach(dice => {
            dice.addEventListener('click', (e) => {
                const player = e.target.dataset.player;
                if (player === this.currentPlayer && this.gameState === 'waiting') {
                    let mainDice = document.getElementById(`dice-${player}`);
                    if (mainDice) this.rollDice(mainDice);
                }
            });
        });
    }

    initializeSoundToggle() {
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            document.getElementById('sound-toggle').textContent = this.soundEnabled ? '🔊' : '🔇';
        });
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        switch(type) {
            case 'dice': oscillator.frequency.setValueAtTime(800, audioContext.currentTime); oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1); break;
            case 'move': oscillator.frequency.setValueAtTime(600, audioContext.currentTime); break;
            case 'capture': oscillator.frequency.setValueAtTime(300, audioContext.currentTime); oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2); break;
            case 'win': oscillator.frequency.setValueAtTime(523, audioContext.currentTime); oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); break;
        }
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    rollDice(diceElement) {
        this.gameState = 'rolling';
        diceElement.classList.add('rolling');
        this.playSound('dice');
        setTimeout(() => {
            this.diceValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = this.diceValue;
            diceElement.classList.remove('rolling');
            this.gameState = 'rolled';
            this.stats.diceRolls++;
            if (this.diceValue === 6) this.stats.sixes++;
            this.updateStats();
            this.highlightMovableTokens();
            this.updateGameMessage(`You rolled ${this.diceValue}! Select a token to move.`);
        }, 1000);
    }

    highlightMovableTokens() {
        const currentPlayerTokens = this.tokens[this.currentPlayer];
        let hasMovableToken = false;
        currentPlayerTokens.forEach(token => {
            const canMove = this.canTokenMove(token);
            if (canMove) {
                token.classList.add('movable');
                hasMovableToken = true;
            } else {
                token.classList.remove('movable');
            }
        });
        if (!hasMovableToken) {
            // Dice 6 par repeat turn
            if (this.diceValue === 6) {
                this.gameState = 'waiting';
                this.updateGameMessage("No valid moves. Roll again!");
            } else {
                this.updateGameMessage("No valid moves available. Next player's turn.");
                setTimeout(() => this.nextPlayer(), 2000);
            }
        }
    }

    canTokenMove(token) {
        const position = parseInt(token.dataset.position);
        if (position === -1) return this.diceValue === 6;
        const pathLength = this.paths[this.currentPlayer].length;
        return position + this.diceValue <= pathLength;
    }

    moveToken(token) {
        if (this.gameState !== 'rolled' || !token.classList.contains('movable')) return;
        const color = token.dataset.color;
        if (color !== this.currentPlayer) return;
        const currentPosition = parseInt(token.dataset.position);
        let newPosition = currentPosition + this.diceValue;
        if (currentPosition === -1) {
            newPosition = 0;
            this.playerScores[color].home--;
        }
        this.stats.totalMoves++;
        this.updateStats();
        this.playSound('move');
        this.animateTokenMovement(token, newPosition);
        document.querySelectorAll('.token').forEach(t => t.classList.remove('movable'));
        if (newPosition >= this.paths[color].length) {
            this.playerScores[color].finished++;
            this.updateScoreBoard();
            if (this.playerScores[color].finished === 4) {
                this.declareWinner(color);
                return;
            }
        }
        if (this.diceValue === 6 || newPosition >= this.paths[color].length) {
            this.gameState = 'waiting';
            this.updateGameMessage(`${this.currentPlayer.toUpperCase()} gets another turn!`);
        } else {
            this.nextPlayer();
        }
    }

    animateTokenMovement(token, newPosition) {
        const color = token.dataset.color;
        const path = this.paths[color];
        token.remove();
        let targetRow, targetCol;
        if (newPosition >= path.length) {
            targetRow = 7; targetCol = 7;
            token.dataset.position = path.length;
        } else {
            [targetRow, targetCol] = path[newPosition];
            token.dataset.position = newPosition;
        }
        const newCell = this.cellsCache[targetRow * 15 + targetCol];
        newCell.appendChild(token);
        token.dataset.row = targetRow; token.dataset.col = targetCol;
        this.checkForCapture(targetRow, targetCol, color);
    }

    checkForCapture(row, col, currentColor) {
        const cell = this.cellsCache[row * 15 + col];
        // Safe zone pe capture nahi
        if (cell.classList.contains('safe')) return;
        const tokensInCell = cell.querySelectorAll('.token');
        for (let token of tokensInCell) {
            if (token.dataset.color !== currentColor) {
                this.sendTokenHome(token);
                this.stats.captures++;
                this.updateStats();
                this.playSound('capture');
                this.updateGameMessage(`${currentColor.toUpperCase()} captured ${token.dataset.color.toUpperCase()}'s token!`);
                break; // Sirf ek token capture ho
            }
        }
    }

    sendTokenHome(token) {
        const color = token.dataset.color;
        const homePositions = {
            red: [[1, 1], [1, 4], [4, 1], [4, 4]],
            yellow: [[1, 10], [1, 13], [4, 10], [4, 13]],
            blue: [[10, 1], [10, 4], [13, 1], [13, 4]],
            green: [[10, 10], [10, 13], [13, 10], [13, 13]]
        };
        const availablePositions = homePositions[color];
        for (let pos of availablePositions) {
            const [row, col] = pos;
            const homeCell = this.cellsCache[row * 15 + col];
            if (!homeCell.querySelector('.token')) {
                token.remove();
                homeCell.appendChild(token);
                token.dataset.position = -1;
                token.dataset.row = row;
                token.dataset.col = col;
                this.playerScores[color].home++;
                this.updateScoreBoard();
                return;
            }
        }
        // Agar sab home positions full hain, token ko hata dein
        token.remove();
    }

    declareWinner(color) {
        this.playSound('win');
        const winnerModal = document.getElementById('winner-modal');
        const winnerText = document.getElementById('winner-text');
        winnerText.textContent = `🎉 ${color.toUpperCase()} Player Wins! 🎉`;
        winnerText.style.color = this.getColorHex(color);
        winnerModal.style.display = 'flex';
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#ff4444', '#4444ff', '#44ff44', '#ffff44', '#ff44ff', '#44ffff'];
        // Cleanup old confetti styles
        document.querySelectorAll('style[data-confetti]').forEach(style => style.remove());
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                }
            }
        `;
        style.setAttribute('data-confetti', '1');
        document.head.appendChild(style);
        setTimeout(() => style.remove(), 6000);
    }

    getColorHex(color) {
        const colors = {
            red: '#ff4444',
            blue: '#4444ff',
            green: '#44ff44',
            yellow: '#ffff44'
        };
        return colors[color] || '#333';
    }

    updateScoreBoard() {
        Object.keys(this.playerScores).forEach(color => {
            document.getElementById(`${color}-home`).textContent = this.playerScores[color].home;
            document.getElementById(`${color}-finished`).textContent = this.playerScores[color].finished;
        });
    }

    updateStats() {
        document.getElementById('total-moves').textContent = this.stats.totalMoves;
        document.getElementById('dice-rolls').textContent = this.stats.diceRolls;
        document.getElementById('captures').textContent = this.stats.captures;
        document.getElementById('sixes').textContent = this.stats.sixes;
    }

    toggleStats() {
        const statsPanel = document.getElementById('stats-panel');
        statsPanel.classList.toggle('visible');
    }

    resetGame() {
        this.currentPlayer = 'red';
        this.diceValue = 0;
        this.gameState = 'waiting';
        this.stats = { totalMoves: 0, diceRolls: 0, captures: 0, sixes: 0 };
        this.playerScores = {
            red: { home: 4, finished: 0 },
            yellow: { home: 4, finished: 0 },
            blue: { home: 4, finished: 0 },
            green: { home: 4, finished: 0 }
        };
        this.tokens = { red: [], blue: [], green: [], yellow: [] };
        this.initializeBoard();
        this.updateCurrentPlayer();
        this.updateScoreBoard();
        this.updateStats();
        document.querySelectorAll('.dice').forEach(dice => { dice.textContent = '🎲'; });
    }

    nextPlayer() {
        const players = ['red', 'yellow', 'blue', 'green'];
        const currentIndex = players.indexOf(this.currentPlayer);
        this.currentPlayer = players[(currentIndex + 1) % 4];
        this.gameState = 'waiting';
        this.updateCurrentPlayer();
    }

    updateCurrentPlayer() {
        document.querySelectorAll('.dice').forEach(dice => {
            dice.classList.remove('active');
        });
        let activeDice = document.querySelector(`#dice-${this.currentPlayer}`);
        if (activeDice) activeDice.classList.add('active');
        document.getElementById('current-player').textContent =
            `${this.currentPlayer.toUpperCase()} Player's Turn`;
        this.updateGameMessage('Click your dice to roll!');
    }

    updateGameMessage(message) {
        document.getElementById('game-message').textContent = message;
    }
}

// DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new LudoBoard();
});

// Mobile responsive dice display
window.addEventListener('resize', () => {
    if (window.innerWidth <= 600) {
        document.querySelector('.mobile-dice').style.display = 'flex';
        document.querySelectorAll('.board .dice-container').forEach(container => {
            container.style.display = 'none';
        });
    } else {
        document.querySelector('.mobile-dice').style.display = 'none';
        document.querySelectorAll('.board .dice-container').forEach(container => {
            container.style.display = 'flex';
        });
    }
});
