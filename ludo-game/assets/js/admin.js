// assets/js/admin.js
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
    html += `<label><input type="checkbox" ${window.customRules[i].enabled ? "checked" : ""} onclick="toggleRule(${i + 1})"> ${ruleNames[i]}</label><br>`;
  }
  document.getElementById('rules-list').innerHTML = html;
}

function toggleRule(idx) {
  if (window.customRules && window.customRules[idx - 1]) {
    window.customRules[idx - 1].enabled = !window.customRules[idx - 1].enabled;
    updateRulesList();
  }
}

// Admin Panel visibility
function showAdminPanel() {
  document.getElementById('adminPanel').style.display = 'block';
}
function hideAdminPanel() {
  document.getElementById('adminPanel').style.display = 'none';
}
function setupDiceHold() {
  const diceBtn = document.getElementById('dice');
  let diceHoldTimer = null;

  diceBtn.addEventListener('mousedown', () => {
    diceHoldTimer = setTimeout(showAdminPanel, 5000);
  });
  diceBtn.addEventListener('mouseup', () => clearTimeout(diceHoldTimer));
  diceBtn.addEventListener('mouseleave', () => clearTimeout(diceHoldTimer));
  diceBtn.addEventListener('touchstart', () => {
    diceHoldTimer = setTimeout(showAdminPanel, 5000);
  });
  diceBtn.addEventListener('touchend', () => clearTimeout(diceHoldTimer));
  diceBtn.addEventListener('touchcancel', () => clearTimeout(diceHoldTimer));
}

// Admin Actions (placeholders – implement in logic.js)
function adminSetDice() {}
function adminSetAutoWin() {}
function adminSetInvincible() {}
function adminTeleportToken() {}
function adminFreezePlayer() {}
function adminUnfreezePlayer() {}

function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
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

function adminTaunt() {
  alert("👑 Admin says: You can't beat me!");
}

window.onload = function () {
  updateRulesList();
  setupDiceHold();
  document.getElementById('closeAdminBtn').onclick = hideAdminPanel;
  document.getElementById('customRulesBtn').onclick = () => {
    flashcardVisible = !flashcardVisible;
    document.getElementById('flashcard').style.display = flashcardVisible ? 'block' : 'none';
    updateRulesList();
  };
};
