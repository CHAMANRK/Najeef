// admin.js - Load this as last script: <script src="assets/js/admin.js?version=1"></script>
(function(){

  // --- Admin Panel Creation ---
  let adminDiv = document.createElement('div');
  adminDiv.id = 'admin-panel99';
  Object.assign(adminDiv.style, {
    display: 'none',
    position: 'fixed',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30,30,30,0.95)',
    color: '#fff',
    padding: '20px 30px',
    borderRadius: '16px',
    boxShadow: '0 0 30px #000',
    zIndex: 999999,
    fontFamily: 'Arial, sans-serif',
    maxWidth: '320px',
    userSelect: 'none'
  });
  adminDiv.innerHTML = `
    <h2 style="margin-top:0;">🛡️ Ludo Admin Panel</h2>

    <div>
      <label><b>Force Dice Roll:</b></label><br>
      Player: 
      <select id="cheat_player">
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="yellow">Yellow</option>
        <option value="blue">Blue</option>
      </select>
      &nbsp; Value:
      <input type="number" id="cheat_diceval" min="1" max="6" style="width:40px;">
      <button onclick="window.__setDice()">Set</button>
    </div>
    <hr>
    <div>
      <b>Auto Win Mode:</b><br>
      <label><input type="checkbox" id="autowin_red"> Red</label><br>
      <label><input type="checkbox" id="autowin_green"> Green</label><br>
      <label><input type="checkbox" id="autowin_yellow"> Yellow</label><br>
      <label><input type="checkbox" id="autowin_blue"> Blue</label><br>
    </div>
    <hr>
    <div>
      <b>Teleport Token:</b><br>
      Token: <select id="cheat_token"></select><br>
      Cell #: <input type="number" id="cheat_cell" min="0" style="width:60px;" placeholder="0..."><br>
      <button onclick="window.__teleport()">Teleport</button>
    </div>
    <hr>
    <button style="margin-top:15px;" onclick="document.getElementById('admin-panel99').style.display='none'">Close Panel</button>
  `;

  document.body.appendChild(adminDiv);

  // --- Populate Token Dropdown when player_list ready ---
  function fillTokenDropdown() {
    const sel = document.getElementById('cheat_token');
    if (!window.player_list) return;
    sel.innerHTML = "";
    for (const tokenId in window.player_list) {
      sel.innerHTML += `<option value="${tokenId}">${tokenId}</option>`;
    }
  }
  let waitPlayerList = setInterval(()=>{
    if(window.player_list){
      fillTokenDropdown();
      clearInterval(waitPlayerList);
    }
  }, 1000);

  // --- Secret Admin Panel Mobile Touch Gesture ---
  // Step 1: Three taps within 2s on secret corner
  // Step 2: After 1s pause, 5s long press to open panel

  const secretArea = document.createElement('div');
  Object.assign(secretArea.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '32px',
    height: '32px',
    opacity: '0',
    zIndex: 9999999,
    userSelect: 'none',
    touchAction: 'manipulation',
  });
  document.body.appendChild(secretArea);

  let tapCount = 0;
  let tapTimer = null;
  let readyForLongPress = false;
  let longPressTimer = null;

  secretArea.addEventListener('touchend', ()=>{
    tapCount++;
    if(tapCount === 1){
      tapTimer = setTimeout(() => { tapCount=0; }, 2000);
    }
    if(tapCount === 3){
      clearTimeout(tapTimer);
      tapCount = 0;
      // Allow 5s long press after 1s delay window  
      setTimeout(() => { readyForLongPress = true; }, 1000);
      // 4s time to start long press after 1s wait
      setTimeout(() => { readyForLongPress = false; }, 5000);
    }
  });

  secretArea.addEventListener('touchstart', () => {
    if(!readyForLongPress) return;
    longPressTimer = setTimeout(() => {
      if(readyForLongPress) {
        adminDiv.style.display = 'block';
        readyForLongPress = false;
      }
    }, 5000); // 5 seconds hold
  });

  secretArea.addEventListener('touchend', () => {
    clearTimeout(longPressTimer);
  });

  // --- Manual Dice Control ---
  window.__admin_cheat_dice = null; // hold cheat dice info

  window.__setDice = function(){
    const player = document.getElementById('cheat_player').value.toLowerCase();
    const val = parseInt(document.getElementById('cheat_diceval').value, 10);
    if(val >= 1 && val <= 6){
      window.__admin_cheat_dice = {player, val};
      alert(`Next dice for ${player.toUpperCase()} set to ${val}`);
    } else {
      alert("Dice value must be 1 to 6");
    }
  };

  // Hook into existing dice roll event (override dice_value)
  // Assuming your main game logic uses dice_value for dice number
  const originalDiceClick = document.getElementById('dice');
  if(originalDiceClick){
    originalDiceClick.addEventListener('click', event => {
      if(window.__admin_cheat_dice && window.current_turn && window.current_turn.group.toLowerCase() === window.__admin_cheat_dice.player){
        window.dice_value = window.__admin_cheat_dice.val;
        window.__admin_cheat_dice = null;
        // Prevent normal dice roll randomization if needed (depends on your dice logic)
      }
    }, true);
  }

  // --- Auto Win Mode Check Helper ---
  window.__isAutoWin = function(player) {
    let cb = document.getElementById('autowin_' + player.toLowerCase());
    return cb && cb.checked;
  };

  // --- Teleport Token Function ---
  window.__teleport = function(){
    const tokenId = document.getElementById('cheat_token').value;
    const targetCell = parseInt(document.getElementById('cheat_cell').value, 10);

    if(!window.player_list || !window.player_list[tokenId]){
      alert("Token not found");
      return;
    }
    if(isNaN(targetCell) || targetCell < 0){
      alert("Invalid Cell Number");
      return;
    }
    const token = window.player_list[tokenId];

    // Reset current step's HTML removing token display
    if(token.current_step && typeof token.current_step.innerHTML === "string"){
      token.current_step.innerHTML = token.current_step.innerHTML.replace(token.player, "");
    }

    token.current_position = targetCell;
    token.status = 'active'; // forcibly activate token if needed

    // Set new step DOM reference and add token display
    if(window.steps && window.steps.length > targetCell){
      token.current_step = window.steps[token.path[token.current_position]];
      if(token.current_step) token.current_step.innerHTML += token.player;
    }

    alert(`Teleported token "${tokenId}" to cell #${targetCell}`);
  };

  // You can add more admin functions similarly (invincibility, freeze, confetti...)

  // Panel close button handled inside panel HTML

})();
