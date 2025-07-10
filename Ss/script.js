document.getElementById('roll-dice').addEventListener('click', function() {
    const diceResult = Math.floor(Math.random() * 6) + 1; // Roll a dice (1-6)
    document.getElementById('dice-result').textContent = diceResult;
});
