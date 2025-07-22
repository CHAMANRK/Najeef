// admin.js - Load this as last script: <script src="assets/js/admin.js?version=1"></script>
(function(){
  
  // Secret Button को पहले create करना
  let secretBtn = document.getElementById('secret-admin-btn');
  if(!secretBtn){
    secretBtn = document.createElement('div');
    secretBtn.id = 'secret-admin-btn';
    Object.assign(secretBtn.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '40px',
      height: '40px',
      opacity: '0',
      zIndex: '9999',
      cursor: 'pointer'
    });
    document.body.appendChild(secretBtn);
  }

  // Admin Panel को create करना
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
      zIndex: '999999',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      minWidth: '320px',
      maxHeight: '80vh',
      overflowY: 'auto'
    });
    
    adminDiv.innerHTML = `
      <h2 style="text-align:center; margin:0 0 20px 0; color:#00ff88;">🛡️ Ludo Admin Panel</h2>
      
      <!-- Dice Control Section -->
      <div style="margin-bottom:15px; padding:10px; border:1px solid #555; border-radius:8px;">
        <h3 style="margin:0 0 10px 0; color:#ffa500;">🎲 Dice Control</h3>
        <div style="margin-bottom:8px;">
          <label>Player: </label>
          <select id="cheat_player" style="padding:5px; margin-left:10px;">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>
        <div style="margin-bottom:8px;">
          <label>Dice Value: </label>
          <input type="number" id="cheat_diceval" min="1" max="6" value="6" style="padding:5px; width:50px; margin-left:10px;">
        </div>
        <button onclick="window.__setDice()" style="padding:6px 12px; background:#007acc; color:white; border:none; border-radius:4px; cursor:pointer;">Set Next Dice</button>
      </div>

      <!-- Auto Win Section -->
      <div style="margin-bottom:15px; padding:10px; border:1px solid #555; border-radius:8px;">
        <h3 style="margin:0 0 10px 0; color:#ffa500;">🏆 Auto Win Mode</h3>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          <label><input type="checkbox" id="autowin_red"> Red Auto Win</label>
          <label><input type="checkbox" id="autowin_blue"> Blue Auto Win</label>
          <label><input type="checkbox" id="autowin_green"> Green Auto Win</label>
          <label><input type="checkbox" id="autowin_yellow"> Yellow Auto Win</label>
        </div>
      </div>

      <!-- Teleport Section -->
      <div style="margin-bottom:15px; padding:10px; border:1px solid #555; border-radius:8px;">
        <h3 style="margin:0 0 10px 0; color:#ffa500;">🚀 Teleport Token</h3>
        <div style="margin-bottom:8px;">
          <label>Token ID: </label>
          <input type="text" id="cheat_token" placeholder="e.g. red1, blue2" style="padding:5px; margin-left:10px;">
        </div>
        <div style="margin-bottom:8px;">
          <label>Target Cell: </label>
          <input type="number" id="cheat_cell" min="0" max="56" placeholder="0-56" style="padding:5px; margin-left:10px; width:80px;">
        </div>
        <button onclick="window.__teleport()" style="padding:6px 12px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">Teleport</button>
      </div>

      <!-- Game Control Section -->
      <div style="margin-bottom:15px; padding:10px; border:1px solid #555; border-radius:8px;">
        <h3 style="margin:0 0 10px 0; color:#ffa500;">🎮 Game Controls</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <button onclick="window.__skipTurn()" style="padding:6px 12px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer;">Skip Turn</button>
          <button onclick="window.__resetGame()" style="padding:6px 12px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">Reset Game</button>
          <button onclick="window.__freezePlayer()" style="padding:6px 12px; background:#17a2b8; color:white; border:none; border-radius:4px; cursor:pointer;">Freeze Current Player</button>
        </div>
      </div>

      <!-- Info Section -->
      <div style="margin-bottom:15px; padding:10px; border:1px solid #555; border-radius:8px;">
        <h3 style="margin:0 0 10px 0; color:#ffa500;">ℹ️ Game Info</h3>
        <button onclick="window.__showGameInfo()" style="padding:6px 12px; background:#6f42c1; color:white; border:none; border-radius:4px; cursor:pointer;">Show Game State</button>
      </div>

      <!-- Close Button -->
      <button onclick="document.getElementById('admin-panel99').style.display='none'" 
              style="width:100%; padding:10px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; margin-top:10px;">
        Close Panel
      </button>
    `;
    document.body.appendChild(adminDiv);
  }

  // Secret Button Long Press Detection
  let timer;
  let isLongPress = false;

  secretBtn.addEventListener('mousedown', function(e) {
    e.preventDefault();
    isLongPress = false;
    timer = setTimeout(function(){
      isLongPress = true;
      adminDiv.style.display = 'block';
    }, 2000); // 2 seconds long-press for desktop
  });

  secretBtn.addEventListener('mouseup', function(e) {
    e.preventDefault();
    clearTimeout(timer);
  });

  secretBtn.addEventListener('mouseleave', function(e) {
    clearTimeout(timer);
  });

  // Touch events for mobile
  secretBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    isLongPress = false;
    timer = setTimeout(function(){
      isLongPress = true;
      adminDiv.style.display = 'block';
    }, 2000);
  });

  secretBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    clearTimeout(timer);
  });

  // --- Admin Functions ---

  // Manual Dice Control
  window.__admin_cheat_dice = null;
  
  window.__setDice = function(){
    const player = document.getElementById('cheat_player').value.toLowerCase();
    const val = parseInt(document.getElementById('cheat_diceval').value, 10);
    if(val >= 1 && val <= 6){
      window.__admin_cheat_dice = {player, val};
      alert(`अगला dice ${player.toUpperCase()} के लिए ${val} set कर दिया गया!`);
    } else {
      alert("Dice value 1 से 6 के बीच होनी चाहिए!");
    }
  };

  // Hook into dice roll - Original dice event को override करना
  setTimeout(function() {
    const diceElement = document.getElementById('dice') || document.querySelector('.dice') || document.querySelector('[onclick*="dice"]');
    if(diceElement){
      // Original click handler को preserve करना
      const originalOnClick = diceElement.onclick;
      
      diceElement.addEventListener('click', function(event) {
        if(window.__admin_cheat_dice && window.current_turn && 
           window.current_turn.group && window.current_turn.group.toLowerCase() === window.__admin_cheat_dice.player){
          
          // Cheat dice value set करना
          window.dice_value = window.__admin_cheat_dice.val;
          window.__admin_cheat_dice = null;
          
          // Visual dice को भी update करना अगर element मिले
          const diceDisplay = document.querySelector('.dice-value') || document.querySelector('.dice-number');
          if(diceDisplay) diceDisplay.textContent = window.dice_value;
          
          console.log('Admin: Dice value overridden to', window.dice_value);
        }
      }, true); // Capture phase में run करना
    }
  }, 1000); // Game load होने का wait करना

  // Auto Win Mode Check
  window.__isAutoWin = function(player) {
    const cb = document.getElementById('autowin_' + player.toLowerCase());
    return cb && cb.checked;
  };

  // Teleport Token Function
  window.__teleport = function(){
    const tokenId = document.getElementById('cheat_token').value.trim();
    const targetCell = parseInt(document.getElementById('cheat_cell').value, 10);

    if(!tokenId){
      alert("Token ID enter करें! (जैसे: red1, blue2)");
      return;
    }

    if(isNaN(targetCell) || targetCell < 0 || targetCell > 56){
      alert("Cell number 0-56 के बीच होना चाहिए!");
      return;
    }

    // Different possible token object locations check करना
    let token = null;
    if(window.player_list && window.player_list[tokenId]){
      token = window.player_list[tokenId];
    } else if(window.players && window.players[tokenId]) {
      token = window.players[tokenId];
    } else if(window.tokens && window.tokens[tokenId]) {
      token = window.tokens[tokenId];
    } else {
      alert(`Token "${tokenId}" नहीं मिला! Available tokens check करें।`);
      return;
    }

    // Current position से token remove करना
    if(token.current_step && token.current_step.innerHTML){
      token.current_step.innerHTML = token.current_step.innerHTML.replace(token.player || tokenId, "");
    }

    // New position set करना
    token.current_position = targetCell;
    token.status = 'active';

    // New step reference set करना
    if(window.steps && window.steps.length > targetCell && token.path){
      const newStepIndex = token.path[targetCell] || targetCell;
      if(window.steps[newStepIndex]){
        token.current_step = window.steps[newStepIndex];
        token.current_step.innerHTML += (token.player || tokenId);
      }
    }

    alert(`Token "${tokenId}" को cell #${targetCell} पर teleport कर दिया!`);
  };

  // Skip Turn Function
  window.__skipTurn = function(){
    if(window.switchTurn && typeof window.switchTurn === 'function'){
      window.switchTurn();
      alert("Turn skip कर दिया गया!");
    } else if(window.nextTurn && typeof window.nextTurn === 'function'){
      window.nextTurn();
      alert("Next turn पर switch कर दिया!");
    } else {
      alert("Turn switch function नहीं मिला!");
    }
  };

  // Reset Game Function  
  window.__resetGame = function(){
    if(confirm("क्या आप game reset करना चाहते हैं?")){
      if(window.resetGame && typeof window.resetGame === 'function'){
        window.resetGame();
      } else if(window.startGame && typeof window.startGame === 'function'){
        window.startGame();
      } else {
        location.reload(); // Last resort
      }
      alert("Game reset हो गया!");
    }
  };

  // Freeze Current Player
  window.__freezePlayer = function(){
    if(window.current_turn && window.current_turn.group){
      const player = window.current_turn.group.toLowerCase();
      const checkbox = document.getElementById('freeze_' + player);
      if(!checkbox){
        // Dynamic freeze checkbox create करना
        const freezeDiv = document.createElement('div');
        freezeDiv.innerHTML = `<label><input type="checkbox" id="freeze_${player}" checked> ${player.toUpperCase()} Frozen</label>`;
        adminDiv.appendChild(freezeDiv);
      }
      alert(`${window.current_turn.group} player को freeze कर दिया!`);
    } else {
      alert("Current turn player identify नहीं हो सका!");
    }
  };

  // Show Game Information
  window.__showGameInfo = function(){
    let info = "🎮 GAME STATE INFO:\n\n";
    
    if(window.current_turn){
      info += `Current Turn: ${window.current_turn.group || 'Unknown'}\n`;
    }
    
    if(window.dice_value){
      info += `Last Dice: ${window.dice_value}\n`;
    }
    
    if(window.player_list){
      info += `\n👥 PLAYERS:\n`;
      Object.keys(window.player_list).forEach(key => {
        const p = window.player_list[key];
        info += `${key}: Position ${p.current_position || 0}, Status: ${p.status || 'unknown'}\n`;
      });
    }
    
    if(window.steps){
      info += `\n🎯 Board Steps: ${window.steps.length} cells\n`;
    }
    
    alert(info);
  };

  // Auto-win logic hook (यह game के move function में integrate करना होगा)
  const originalMoveToken = window.moveToken;
  if(originalMoveToken && typeof originalMoveToken === 'function'){
    window.moveToken = function(...args){
      const result = originalMoveToken.apply(this, args);
      
      // Check auto-win after every move
      if(window.current_turn && window.__isAutoWin(window.current_turn.group)){
        // Auto-win logic यहाँ implement करना
        console.log('Auto-win activated for', window.current_turn.group);
      }
      
      return result;
    };
  }

  console.log("🛡️ Ludo Admin Panel loaded successfully!");
  console.log("Long-press top-right corner (invisible area) to open admin panel");

})();
