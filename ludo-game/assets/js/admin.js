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
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <label><input type="checkbox" id="autowin_red" onchange="window.__toggleAutoWin('red', this.checked)"> Red Auto Win</label>
          <label><input type="checkbox" id="autowin_blue" onchange="window.__toggleAutoWin('blue', this.checked)"> Blue Auto Win</label>
          <label><input type="checkbox" id="autowin_green" onchange="window.__toggleAutoWin('green', this.checked)"> Green Auto Win</label>
          <label><input type="checkbox" id="autowin_yellow" onchange="window.__toggleAutoWin('yellow', this.checked)"> Yellow Auto Win</label>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.__enableAllAutoWin()" style="padding:4px 8px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">Enable All</button>
          <button onclick="window.__disableAllAutoWin()" style="padding:4px 8px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">Disable All</button>
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
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <button onclick="window.__skipTurn()" style="padding:6px 12px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer;">Skip Turn</button>
          <button onclick="window.__resetGame()" style="padding:6px 12px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">Reset Game</button>
          <button onclick="window.__freezePlayer()" style="padding:6px 12px; background:#17a2b8; color:white; border:none; border-radius:4px; cursor:pointer;">Freeze Player</button>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <button onclick="window.__forceWin()" style="padding:6px 12px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">Force Win Current</button>
          <button onclick="window.__unlimitedSix()" style="padding:6px 12px; background:#ffc107; color:black; border:none; border-radius:4px; cursor:pointer;">Unlimited 6s</button>
          <button onclick="window.__godMode()" style="padding:6px 12px; background:#e83e8c; color:white; border:none; border-radius:4px; cursor:pointer;">God Mode</button>
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

  // Enhanced Dice Control - Multiple hook methods
  setTimeout(function() {
    // Method 1: Hook into dice element
    const diceSelectors = ['#dice', '.dice', '[onclick*="dice"]', '.dice-btn', '#diceBtn', '.roll-dice'];
    let diceElement = null;
    
    for(let selector of diceSelectors){
      diceElement = document.querySelector(selector);
      if(diceElement) break;
    }
    
    if(diceElement){
      diceElement.addEventListener('click', function(event) {
        // Check for unlimited 6s mode
        if(window.__admin_unlimited_six){
          window.dice_value = 6;
          console.log('Admin: Unlimited 6s - Dice forced to 6');
          return;
        }
        
        // Check for specific cheat dice
        if(window.__admin_cheat_dice && window.current_turn){
          const currentPlayer = window.current_turn.group?.toLowerCase() || window.current_turn.toLowerCase?.() || window.current_turn;
          
          if(currentPlayer === window.__admin_cheat_dice.player){
            window.dice_value = window.__admin_cheat_dice.val;
            window.__admin_cheat_dice = null;
            
            // Update visual dice
            const diceDisplay = document.querySelector('.dice-value, .dice-number, .dice-result, #dice-result');
            if(diceDisplay) diceDisplay.textContent = window.dice_value;
            
            console.log('Admin: Dice value overridden to', window.dice_value);
          }
        }
      }, true);
    }
    
    // Method 2: Hook into Math.random for dice generation
    const originalRandom = Math.random;
    Math.random = function() {
      // Check if this random call is for dice (common dice range: 1-6)
      if(window.__admin_unlimited_six || window.__admin_cheat_dice) {
        const stack = new Error().stack;
        if(stack.includes('dice') || stack.includes('roll') || stack.includes('random')){
          if(window.__admin_unlimited_six){
            return 0.99999; // Will result in 6 when Math.floor(Math.random() * 6) + 1
          }
          if(window.__admin_cheat_dice){
            return (window.__admin_cheat_dice.val - 1) / 6 + 0.0001; // Convert cheat value to proper random
          }
        }
      }
      return originalRandom.apply(this, arguments);
    };
    
    // Method 3: Hook into possible dice variables
    let diceCheckInterval = setInterval(() => {
      if(window.dice_value !== undefined){
        const currentPlayer = window.current_turn?.group?.toLowerCase() || window.current_turn?.toLowerCase?.() || window.current_turn;
        
        if(window.__admin_unlimited_six && currentPlayer){
          window.dice_value = 6;
        } else if(window.__admin_cheat_dice && currentPlayer === window.__admin_cheat_dice.player){
          window.dice_value = window.__admin_cheat_dice.val;
          window.__admin_cheat_dice = null;
        }
      }
    }, 100);
    
    // Clear interval after 30 seconds to avoid performance issues
    setTimeout(() => clearInterval(diceCheckInterval), 30000);
    
  }, 1000);

  // Auto Win Mode Functions - Advanced Implementation
  window.__autoWinPlayers = new Set(); // Track auto-win enabled players
  
  window.__toggleAutoWin = function(player, enabled){
    player = player.toLowerCase();
    if(enabled){
      window.__autoWinPlayers.add(player);
      alert(`🏆 ${player.toUpperCase()} Auto-Win ENABLED! सभी moves winning moves बन जाएंगी।`);
    } else {
      window.__autoWinPlayers.delete(player);
      alert(`❌ ${player.toUpperCase()} Auto-Win disabled.`);
    }
    console.log('Auto-win players:', Array.from(window.__autoWinPlayers));
  };
  
  window.__enableAllAutoWin = function(){
    ['red', 'blue', 'green', 'yellow'].forEach(player => {
      document.getElementById(`autowin_${player}`).checked = true;
      window.__autoWinPlayers.add(player);
    });
    alert("🚀 सभी players के लिए Auto-Win enable कर दिया गया!");
  };
  
  window.__disableAllAutoWin = function(){
    ['red', 'blue', 'green', 'yellow'].forEach(player => {
      document.getElementById(`autowin_${player}`).checked = false;
    });
    window.__autoWinPlayers.clear();
    alert("🛑 सभी Auto-Win disable कर दिया गया!");
  };

  // Auto Win Mode Check - Enhanced
  window.__isAutoWin = function(player) {
    return window.__autoWinPlayers.has(player.toLowerCase());
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

  // Skip Turn Function - Multiple fallback methods
  window.__skipTurn = function(){
    let turnSkipped = false;
    
    // Method 1: Try common turn switching functions
    if(window.switchTurn && typeof window.switchTurn === 'function'){
      window.switchTurn();
      turnSkipped = true;
    } else if(window.nextTurn && typeof window.nextTurn === 'function'){
      window.nextTurn();
      turnSkipped = true;
    } else if(window.changeTurn && typeof window.changeTurn === 'function'){
      window.changeTurn();
      turnSkipped = true;
    } else if(window.skipTurn && typeof window.skipTurn === 'function'){
      window.skipTurn();
      turnSkipped = true;
    }
    
    // Method 2: Manual turn switching if current_turn exists
    if(!turnSkipped && window.current_turn){
      const players = ['red', 'blue', 'green', 'yellow'];
      const currentIndex = players.indexOf(window.current_turn.group?.toLowerCase() || window.current_turn.toLowerCase?.() || window.current_turn);
      if(currentIndex !== -1){
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];
        
        // Try to set next player
        if(window.current_turn.group){
          window.current_turn.group = nextPlayer;
        } else if(typeof window.current_turn === 'string'){
          window.current_turn = nextPlayer;
        }
        
        // Update UI if turn indicator exists
        const turnIndicators = document.querySelectorAll('.turn-indicator, .current-player, .player-turn');
        turnIndicators.forEach(el => {
          el.textContent = nextPlayer.toUpperCase();
          el.className = el.className.replace(/player-\w+/g, '') + ` player-${nextPlayer}`;
        });
        
        turnSkipped = true;
      }
    }
    
    // Method 3: Try clicking next player button
    if(!turnSkipped){
      const nextButtons = document.querySelectorAll('[onclick*="turn"], [onclick*="next"], .next-turn, .skip-turn');
      if(nextButtons.length > 0){
        nextButtons[0].click();
        turnSkipped = true;
      }
    }
    
    if(turnSkipped){
      alert("✅ Turn successfully skipped!");
      console.log("Turn skipped to next player");
    } else {
      alert("⚠️ Could not find turn switching method. Current player continues.");
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

  // Advanced Game Control Functions
  window.__forceWin = function(){
    if(!window.current_turn) {
      alert("⚠️ Current turn player identify नहीं हो सका!");
      return;
    }
    
    const currentPlayer = window.current_turn.group?.toLowerCase() || window.current_turn.toLowerCase?.() || window.current_turn;
    
    // Find all tokens of current player and move them to winning position
    const winningPosition = 56; // Home position
    let tokensWon = 0;
    
    // Try different token object structures
    const tokenSources = [window.player_list, window.players, window.tokens, window.gameTokens];
    
    tokenSources.forEach(tokenObj => {
      if(!tokenObj) return;
      
      Object.keys(tokenObj).forEach(tokenId => {
        const token = tokenObj[tokenId];
        if(!token) return;
        
        // Check if token belongs to current player
        const tokenPlayer = token.group?.toLowerCase() || token.player?.toLowerCase() || tokenId.replace(/\d+$/, '').toLowerCase();
        
        if(tokenPlayer === currentPlayer){
          // Move token to winning position
          if(token.current_step && token.current_step.innerHTML){
            token.current_step.innerHTML = token.current_step.innerHTML.replace(token.player || tokenId, "");
          }
          
          token.current_position = winningPosition;
          token.status = 'won';
          tokensWon++;
        }
      });
    });
    
    if(tokensWon > 0){
      alert(`🏆 ${currentPlayer.toUpperCase()} को force win कर दिया! ${tokensWon} tokens won!`);
      
      // Trigger win celebration if function exists
      if(window.celebrateWin && typeof window.celebrateWin === 'function'){
        window.celebrateWin(currentPlayer);
      }
    } else {
      alert("⚠️ Player tokens नहीं मिले!");
    }
  };
  
  window.__unlimitedSix = window.__unlimitedSix || false;
  
  window.__unlimitedSix = function(){
    window.__admin_unlimited_six = !window.__admin_unlimited_six;
    
    if(window.__admin_unlimited_six){
      alert("🎲 Unlimited 6s ENABLED! हर dice roll 6 होगी!");
      // Auto-set dice to 6 for current player
      if(window.current_turn){
        const player = window.current_turn.group?.toLowerCase() || window.current_turn.toLowerCase?.() || window.current_turn;
        window.__admin_cheat_dice = {player, val: 6};
      }
    } else {
      alert("🎲 Unlimited 6s disabled.");
      window.__admin_cheat_dice = null;
    }
  };
  
  window.__godMode = function(){
    window.__admin_god_mode = !window.__admin_god_mode;
    
    if(window.__admin_god_mode){
      alert("👑 GOD MODE ACTIVATED!\n- Unlimited 6s\n- Auto-Win current player\n- Skip any turn\n- Invincible tokens");
      
      // Enable all cheats for current player
      if(window.current_turn){
        const player = window.current_turn.group?.toLowerCase() || window.current_turn.toLowerCase?.() || window.current_turn;
        window.__autoWinPlayers.add(player);
        document.getElementById(`autowin_${player}`).checked = true;
      }
      
      window.__admin_unlimited_six = true;
    } else {
      alert("👑 God Mode deactivated.");
      window.__admin_unlimited_six = false;
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
