// assets/js/admin.js

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
    holdTimer = setTimeout(showAdminPanel, 5000); // 5 seconds hold
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

// ===== Placeholder Functions (Connect to logic.js if needed) =====
function adminSetDice() {
  alert("Manual Dice logic not connected.");
}
function adminSetAutoWin() {
  alert("Auto Win logic not connected.");
}
function adminSetInvincible() {
  alert("Invincibility logic not connected.");
}
function adminTeleportToken() {
  alert("Teleport logic not connected.");
}
function adminFreezePlayer() {
  alert("Freeze logic not connected.");
}
function adminUnfreezePlayer() {
  alert("Unfreeze logic not connected.");
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
