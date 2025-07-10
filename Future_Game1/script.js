let isAdmin = false;
let currentPlayer = 0;
const players = ['Red', 'Blue', 'Green', 'Yellow'];
const playerTokens = [[], [], [], []]; // Store tokens for each player
const diceRolls = [1, 2, 3, 4, 5, 6];

function rollDice() {
    if (!isAdmin) {
        const roll = Math.floor(Math.random() * 6) + 1;
        alert(`You rolled a ${roll}`);
        // Handle token movement based on roll
    } else {
        // Admin logic for forced dice roll
    }
}

function triggerAdminPanel() {
    isAdmin = true;
    document.getElementById('admin-panel').classList.remove('hidden');
}

document.getElementById('game-title').addEventListener('click', function() {
    // Long press detection or Shift + D
    triggerAdminPanel();
});

// Add other admin functions here
function forceDiceRoll() {
    const roll = prompt("Enter dice number (1-6):");
    if (roll >= 1 && roll <= 6) {
        alert(`Dice forced to ${roll}`);
        // Handle token movement based on forced roll
    }
}

function makeTokenUnkillable() {
    // Logic to make a token unkillable
}

function teleportToken() {
    // Logic to teleport a token
}

function skipTurn() {
    // Logic to skip a player's turn
}

function reverseTurnOrder() {
    // Logic to reverse turn order
}

function freezePlayer() {
    // Logic to freeze a player
}

function declareWinner() {
    const winner = prompt("Enter the winner's name:");
    alert(`${winner} has won the game!`);
}

function killAllEnemies() {
    // Logic to kill all opponent tokens
}

function enableHardcoreMode() {
    // Logic to enable hardcore mode
}

function doubleDiceMode() {
    // Logic for double dice mode
}

function stealthMode() {
    // Logic for stealth mode
}
