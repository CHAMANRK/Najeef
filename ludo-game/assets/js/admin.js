// ===== Custom Rules =====
let flashcardVisible = false;

window.customRules = [
  { name: "only1opens", enabled: false },
  { name: "noKills", enabled: false },
  { name: "mustKillHome", enabled: false }
];

function updateRulesList() {
  const ruleNames = [
    "Only 1 opens the token",
    "Don't allow kills",
    "Must kill before reaching home"
  ];
  let html = '';
  for (let i = 0; i < window.customRules.length; i++) {
    html += `<label><input type="checkbox" ${window.customRules[i].enabled ? "checked" : ""} onclick="toggleRule(${i})"> ${ruleNames[i]}</label><br>`;
  }
  document.getElementById('rules-list').innerHTML = html;
}

function toggleRule(idx) {
  if (window.customRules && window.customRules[idx]) {
    window.customRules[idx].enabled = !window.customRules[idx].enabled;
    updateRulesList();
  }
}

// ===== Admin Panel Show/Hide =====
function showAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (panel) panel.style.display = 'block';
}

function hideAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (panel) panel.style.display = 'none';
}

// ===== Long Press Anywhere to Open Admin Panel =====
function setupHoldAnywhere() {
  let holdTimer = null;

  document.addEventListener('mousedown', () => {
    holdTimer = setTimeout(showAdminPanel, 5000);
  });

  document.addEventListener('mouseup', () => clearTimeout(holdTimer));
  document.addEventListener('mouseleave', () => clearTimeout(holdTimer));

  document.addEventListener('touchstart', () => {
    holdTimer = setTimeout(showAdminPanel, 5000);
  });

  document.addEventListener('touchend', () => clearTimeout(holdTimer));
  document.addEventListener('touchcancel', () => clearTimeout(holdTimer));
}

// ===== Confetti Animation =====
function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let confs = [];
  for (let i = 0; i < 120; i++) confs.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 8 + 4,
    c: `hsl(${Math.random() * 360},90%,60%)`,
    v: Math.random() * 2 + 2
  });
  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c of confs) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.fillStyle = c.c;
      ctx.fill();
      c.y += c.v;
      if (c.y > canvas.height) c.y = -c.r;
    }
    time++;
    if (time < 70) requestAnimationFrame(animate);
    else canvas.style.display = 'none';
  }
  animate();
}

// ===== Fun Taunt Alert =====
function adminTaunt() {
  alert("👑 Admin says: You can't beat me!");
}

// ===== Utility: Get Selected Token ID =====
function getSelectedTokenId() {
  return document.getElementById("selectedToken").value; // e.g., "red3"
}

// ===== Admin Functions =====

// Force Dice (for selected token/player)
function adminSetDice() {
  const tokenId = getSelectedTokenId();
  const value = parseInt(document.getElementById("diceValueInput").value);

  if (!tokenId) {
    alert("Please select a token/player first.");
    return;
  }
  if (isNaN(value) || value < 1 || value > 6) {
    alert("Enter a valid dice value (1 to 6).");
    return;
  }

  // Call your game logic function (implement this in logic.js)
  setDiceForToken(tokenId, value);

  $("#dice").html(`<img src='assets/img/dice${value}.png' class='dice'/>`);
  $("#dice").attr("disabled", true);
  $("#dice").css("opacity", "0.5");

  if (typeof dice_sound !== "undefined") dice_sound.play();
  console.log(`🎯 Admin forced dice = ${value} for ${tokenId}`);
}

// Auto Win for selected token
function adminSetAutoWin() {
  const tokenId = getSelectedTokenId();
  if (!tokenId) return alert("Please select a token/player first.");
  autoWinToken(tokenId); // logic.js
  showConfetti();
  alert(`Auto Win applied to ${tokenId}`);
}

// Invincible for selected token
function adminSetInvincible() {
  const tokenId = getSelectedTokenId();
  if (!tokenId) return alert("Please select a token/player first.");
  setTokenInvincible(tokenId); // logic.js
  alert(`${tokenId} is now invincible!`);
}

// Teleport token (to position)
function adminTeleportToken() {
  const tokenId = getSelectedTokenId();
  if (!tokenId) return alert("Please select a token/player first.");
  const pos = prompt("Enter position to teleport to (cell number):");
  if (!pos || isNaN(pos)) return alert("Enter a valid cell number.");
  teleportToken(tokenId, parseInt(pos)); // logic.js
  alert(`${tokenId} teleported to cell ${pos}`);
}

// Freeze selected token
function adminFreezePlayer() {
  const tokenId = getSelectedTokenId();
  if (!tokenId) return alert("Please select a token/player first.");
  freezeToken(tokenId); // logic.js
  alert(`${tokenId} is frozen!`);
}

// Unfreeze selected token
function adminUnfreezePlayer() {
  const tokenId = getSelectedTokenId();
  if (!tokenId) return alert("Please select a token/player first.");
  unfreezeToken(tokenId); // logic.js
  alert(`${tokenId} is now unfrozen!`);
}

// ===== Auto Setup on Page Load =====
window.onload = function () {
  updateRulesList();
  setupHoldAnywhere();

  const closeBtn = document.getElementById('closeAdminBtn');
  if (closeBtn) closeBtn.onclick = hideAdminPanel;

  const rulesBtn = document.getElementById('customRulesBtn');
  if (rulesBtn) {
    rulesBtn.onclick = () => {
      flashcardVisible = !flashcardVisible;
      document.getElementById('flashcard').style.display = flashcardVisible ? 'block' : 'none';
      updateRulesList();
    };
  }
};

// ===== Connect to logic.js =====
// You must implement these functions in your logic.js:
// - setDiceForToken(tokenId, diceValue)
// - autoWinToken(tokenId)
// - setTokenInvincible(tokenId)
// - teleportToken(tokenId, position)
// - freezeToken(tokenId)
// - unfreezeToken(tokenId)
