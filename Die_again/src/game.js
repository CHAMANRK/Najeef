import levels from './levels.json' assert { type: "json" };

let currentLevel = 0;
let rageMeter = 0;

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 400,
  parent: 'game',
  backgroundColor: "#222",
  physics: { default: 'arcade', arcade: { gravity: { y: 800 }, debug: false }},
  scene: { preload, create, update }
};

let player, cursors, trapsGroup, deathText, rageText, platform, trapData, arrowGroup;
let deathSound, ouchSound, retrySound;
let rageBar, rageBarBg, rageBarText;
let mobileLeft = false, mobileRight = false, mobileJump = false;

new Phaser.Game(config);

function preload() {
  // Placeholder images for all traps/objects
  this.load.image('cube', 'https://dummyimage.com/32x32/fff/222.png&text=%E2%96%A0');
  this.load.image('spike', 'https://opengameart.org/sites/default/files/spikes_0.png');
  this.load.image('platform', 'https://dummyimage.com/900x40/444/eee.png');
  this.load.image('arrow', 'https://opengameart.org/sites/default/files/arrow_23.png');
  this.load.image('fake', 'https://dummyimage.com/60x32/ccc/888.png&text=FAKE');
  this.load.image('falling', 'https://dummyimage.com/60x32/f44/fff.png&text=FALL');
  // Sounds (from CDN)
  this.load.audio('death', 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4b27.mp3');
  this.load.audio('ouch', 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4b27.mp3');
  this.load.audio('retry', 'https://cdn.pixabay.com/audio/2022/12/19/audio_12b1a7b7f9.mp3');
}

function create() {
  // Platform
  platform = this.physics.add.staticGroup();
  platform.create(450, 380, 'platform');

  // Player
  player = this.physics.add.sprite(50, 320, 'cube');
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platform);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Mobile controls
  setupMobileControls();

  // Traps
  trapsGroup = this.physics.add.staticGroup();
  arrowGroup = this.physics.add.group();
  loadTraps.call(this);

  // UI
  deathText = this.add.text(10, 10, '', { font: '18px monospace', fill: '#fff' });
  rageText = this.add.text(10, 30, 'Rage: 0%', { font: '16px monospace', fill: '#ff4444' });

  // Rage Bar
  rageBarBg = this.add.rectangle(780, 24, 100, 20, 0x333333).setOrigin(0, 0.5);
  rageBar = this.add.rectangle(780, 24, 0, 20, 0xff4444).setOrigin(0, 0.5);
  rageBarText = this.add.text(780, 4, 'Rage', { font: '12px monospace', fill: '#fff' });

  // Sounds
  deathSound = this.sound.add('death');
  ouchSound = this.sound.add('ouch');
  retrySound = this.sound.add('retry');

  // Death collision
  this.physics.add.overlap(player, trapsGroup, onDeath, null, this);
  this.physics.add.overlap(player, arrowGroup, onDeath, null, this);

  // For fake/falling logic
  this.fakeZones = [];
  this.fallingFloors = [];

  // Score milestone bg switch
  this.bgMilestone = 5;
  this.bgLight = false;
}

function loadTraps() {
  trapData = levels[currentLevel].traps;
  trapsGroup.clear(true, true);
  arrowGroup.clear(true, true);
  this.fakeZones = [];
  this.fallingFloors = [];

  trapData.forEach(trap => {
    if (trap.type === "spike") {
      let s = trapsGroup.create(trap.x, 360, "spike");
      s.setData('type', 'spike');
      s.setSize(32, 16);
    } else if (trap.type === "falling") {
      let f = trapsGroup.create(trap.x, 350, "falling");
      f.setData('type', 'falling');
      f.setSize(60, 32);
      this.fallingFloors.push(f);
    } else if (trap.type === "arrow") {
      this.time.addEvent({
        delay: 1200,
        loop: true,
        callback: () => {
          let arrow = arrowGroup.create(trap.x, 340, "arrow");
          arrow.setVelocityX(trap.direction === "left" ? -200 : 200);
          arrow.setData('type', 'arrow');
          arrow.setSize(32, 8);
        }
      });
    } else if (trap.type === "fake_safe") {
      let fake = trapsGroup.create(trap.x, 350, "fake");
      fake.setData('type', 'fake_safe');
      fake.setSize(60, 32);
      this.fakeZones.push(fake);
    }
  });
}

function onDeath(player, trap) {
  if (player.getData('dead')) return;
  player.setData('dead', true);
  deathText.setText('You Died! Press R or Retry');
  rageMeter = Math.min(rageMeter + 15, 100);
  rageText.setText('Rage: ' + rageMeter + '%');
  rageBar.width = rageMeter;
  rageBar.fillColor = rageMeter >= 100 ? 0xffff00 : 0xff4444;
  player.setTint(0xff0000);
  deathSound.play();

  this.physics.pause();

  this.input.keyboard.once('keydown-R', () => {
    retrySound.play();
    restartLevel.call(this);
  });

  // Mobile retry: tap anywhere
  this.input.once('pointerup', () => {
    retrySound.play();
    restartLevel.call(this);
  });
}

function restartLevel() {
  player.clearTint();
  player.x = 50;
  player.y = 320;
  player.setVelocity(0, 0);
  player.setData('dead', false);
  deathText.setText('');
  this.physics.resume();
  // Remove all arrows
  arrowGroup.clear(true, true);
  // Reset falling/fake
  this.fallingFloors.forEach(f => f.enableBody(false, f.x, f.y, true, true));
  this.fakeZones.forEach(f => f.enableBody(false, f.x, f.y, true, true));
}

function update() {
  if (player.getData('dead')) return;
  player.setVelocityX(0);

  // Keyboard controls
  if (cursors.left.isDown || mobileLeft) player.setVelocityX(-160);
  else if (cursors.right.isDown || mobileRight) player.setVelocityX(160);

  if ((cursors.up.isDown || mobileJump) && player.body.touching.down) player.setVelocityY(-350);

  // Falling floor logic
  let self = this;
  this.fallingFloors.forEach(f => {
    if (self.physics.world.overlap(player, f)) {
      self.time.delayedCall(200, () => {
        f.disableBody(true, true);
      }, [], self);
    }
  });

  // Fake zone logic
  this.fakeZones.forEach(f => {
    if (self.physics.world.overlap(player, f)) {
      self.time.delayedCall(100, () => {
        if (self.physics.world.overlap(player, f)) onDeath.call(self, player, f);
      }, [], self);
    }
  });

  // Remove arrows off screen
  arrowGroup.getChildren().forEach(a => {
    if (a.x < -32 || a.x > 950) a.destroy();
  });

  // Rage milestone: bg color switch
  if (rageMeter >= this.bgMilestone * 20 && !this.bgLight) {
    this.cameras.main.setBackgroundColor('#eee');
    this.bgLight = true;
  } else if (rageMeter < this.bgMilestone * 20 && this.bgLight) {
    this.cameras.main.setBackgroundColor('#222');
    this.bgLight = false;
  }
}

// MOBILE CONTROLS
function setupMobileControls() {
  document.getElementById('left-btn').addEventListener('touchstart', () => mobileLeft = true);
  document.getElementById('left-btn').addEventListener('touchend', () => mobileLeft = false);
  document.getElementById('right-btn').addEventListener('touchstart', () => mobileRight = true);
  document.getElementById('right-btn').addEventListener('touchend', () => mobileRight = false);
  document.getElementById('jump-btn').addEventListener('touchstart', () => mobileJump = true);
  document.getElementById('jump-btn').addEventListener('touchend', () => mobileJump = false);
}
