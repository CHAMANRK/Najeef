// admin.js - Load this as last script: <script src="assets/js/admin.js?version=1"></script>
(function(){
  // Admin Panel को पहले से create करना
  let adminDiv = document.getElementById('admin-panel99');
  if(!adminDiv){
    adminDiv = document.createElement('div');
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
      maxWidth: '320px'
    });
    adminDiv.innerHTML = /* ...previous panel HTML... */ `
      <h2>🛡️ Ludo Admin Panel</h2>
      <!-- ...panel content as before... -->
      <button onclick="document.getElementById('admin-panel99').style.display='none'">Close Panel</button>
    `;
    document.body.appendChild(adminDiv);
  }

  // Secret Button Area Detection - Simple Long Press
  let timer;
  document.getElementById('secret-admin-btn').addEventListener('touchstart', function () {
    timer = setTimeout(function(){
      adminDiv.style.display = 'block';
    }, 3000); // 3 seconds long-press
  });

  document.getElementById('secret-admin-btn').addEventListener('touchend', function () {
    clearTimeout(timer);
  });

})
  ();
<div id="secret-admin-btn" style="position:fixed;top:0;right:0;width:40px;height:40px;opacity:0;z-index:9999"></div>

  // --- Admin Panel Creation ---
  
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
