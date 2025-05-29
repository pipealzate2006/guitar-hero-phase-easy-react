const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#050510",
  parent: "game",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

let notes;
const lanePositionsX = [355, 420, 490, 560];
const noteScale = 0.1;
const noteSpeed = 100;
const hitZoneHeight = 60;
const hitZoneY = 450;
let hitZone = false;

let score = 0;
let scoreText;

let failedNotes = 0;
let timesEscIsPressed = 0;
let pauseModal;

let hasScored = false;
let gameOverTimer;

let speedMultiplier = 0;
let lastSpeedUpdateScore = 0;
let currentNoteSpeed = noteSpeed;
let delayTimeCreateNote = 1500;

let gameOverModal;

let isModalGameOverOpen = false;

function preload() {
  //load the track
  this.load.image("pista", "assets/pista.png");

  //load the buttons
  this.load.image("button-a", "assets/button-A.png");
  this.load.image("button-s", "assets/button-S.png");
  this.load.image("button-d", "assets/button-D.png");
  this.load.image("button-f", "assets/button-F.png");

  // load the notes
  this.load.image("note-a", "assets/note-A.png");
  this.load.image("note-s", "assets/note-S.png");
  this.load.image("note-d", "assets/note-D.png");
  this.load.image("note-f", "assets/note-F.png");

  //load pause modal
  this.load.image("pause-modal", "assets/pause-modal.png");

  //load game over modal
  this.load.image("game-over-modal", "assets/gameover-modal.png");

  //load audio
  this.load.audio("note-a", "assets/sound-a.wav");
  this.load.audio("note-s", "assets/sound-s.wav");
  this.load.audio("gameover-sound", "assets/gameover-sound.wav");
}

function create() {
  this.add
    .image(config.width / 2, config.height / 2, "pista")
    .setOrigin(0.5, 0.5)
    .setScale(0.5);

  //add the buttons
  this.add
    .image(lanePositionsX[0], 450, "button-a")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[1], 450, "button-s")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[2], 450, "button-d")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[3], 450, "button-f")
    .setOrigin(0, 0)
    .setScale(0.05);

  //create audio
  this.noteSound = {
    a: this.sound.add("note-a"),
    s: this.sound.add("note-s"),
  };

  notes = this.physics.add.group();

  function addNote(laneIndex) {
    let noteKey;
    switch (laneIndex) {
      case 0:
        noteKey = "note-a";
        break;
      case 1:
        noteKey = "note-s";
        break;
      case 2:
        noteKey = "note-d";
        break;
      case 3:
        noteKey = "note-f";
        break;
      default:
        return;
    }
    const note = notes
      .create(lanePositionsX[laneIndex], -50, noteKey)
      .setOrigin(0, 0)
      .setScale(noteScale);

    note.setVelocityY(currentNoteSpeed);
  }

  this.noteEvent = this.time.addEvent({
    delay: delayTimeCreateNote,
    callback: () => {
      const randomLane = Phaser.Math.Between(0, 3);
      addNote(randomLane);
    },
    callbackScope: this,
    loop: true,
  });

  score = 0;
  scoreText = this.add.text(190, 10, "Score: 0", {
    fontSize: "24px",
    fill: "#fff",
  });
}

function update() {
  this.keys = this.input.keyboard.addKeys({
    a: Phaser.Input.Keyboard.KeyCodes.A,
    s: Phaser.Input.Keyboard.KeyCodes.S,
    d: Phaser.Input.Keyboard.KeyCodes.D,
    f: Phaser.Input.Keyboard.KeyCodes.F,
    esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
  });

  const isA = Phaser.Input.Keyboard.JustDown(this.keys.a);
  const isS = Phaser.Input.Keyboard.JustDown(this.keys.s);
  const isD = Phaser.Input.Keyboard.JustDown(this.keys.d);
  const isF = Phaser.Input.Keyboard.JustDown(this.keys.f);
  const isEsc = Phaser.Input.Keyboard.JustDown(this.keys.esc);
  const isEnter = Phaser.Input.Keyboard.JustDown(this.keys.enter);

  if (isEsc) {
    timesEscIsPressed += 1;
    if (timesEscIsPressed === 1) {
      this.noteEvent.paused = true;
      this.physics.world.pause();
      Object.values(this.noteSound).forEach((sound) => {
        sound.pause();
      });
      console.log(timesEscIsPressed);
      pauseModal = this.add.image(480, 270, "pause-modal").setScale(0.7);
    } else if (timesEscIsPressed === 2) {
      this.noteEvent.paused = false;
      this.physics.world.resume();
      Object.values(this.noteSound).forEach((sound) => {
        sound.resume();
      });
      timesEscIsPressed = 0;
      pauseModal.destroy();
      pauseModal = null;
    }
  }

  let didHitNote = false;
  notes.getChildren().forEach((note) => {
    const inHitZone =
      note.y > hitZoneY && note.y < hitZoneY + hitZoneHeight / 2;

    if (inHitZone) {
      console.log("En hit zone");
      if (
        isA &&
        Math.abs(note.x - lanePositionsX[0]) < 30 &&
        note.texture.key === "note-a"
      ) {
        this.noteSound.a.play();
        destroyNote(note);
        addScore();
        hitZone = true;
        didHitNote = true;
      } else if (
        isS &&
        Math.abs(note.x - lanePositionsX[1]) < 30 &&
        note.texture.key === "note-s"
      ) {
        this.noteSound.s.play();
        destroyNote(note);
        addScore();
        hitZone = true;
        didHitNote = true;
      } else if (
        isD &&
        Math.abs(note.x - lanePositionsX[2]) < 30 &&
        note.texture.key === "note-d"
      ) {
        this.noteSound.a.play();
        destroyNote(note);
        addScore();
        hitZone = true;
        didHitNote = true;
      } else if (
        isF &&
        Math.abs(note.x - lanePositionsX[3]) < 30 &&
        note.texture.key === "note-f"
      ) {
        this.noteSound.s.play();
        destroyNote(note);
        addScore();
        hitZone = true;
        didHitNote = true;
      }
    }

    if (note.y > this.cameras.main.height + 50) {
      destroyNote(note);
      removeScore(this, isEnter);
      failedNotes += 1;
      console.log("Nota perdida", failedNotes);
    }
  });

  if (
    (isA && !didHitNote) ||
    (isS && !didHitNote) ||
    (isD && !didHitNote) ||
    (isF && !didHitNote)
  ) {
    console.log("A incorrecto");
    removeScore(this);
  }
  didHitNote = false;

  function destroyNote(note) {
    notes.killAndHide(note);
    note.destroy();
    console.log("Nota destruida");
  }

  if (score % 50 === 0 && score !== 0 && score !== lastSpeedUpdateScore) {
    const levelsPassed = Math.floor(score / 50);
    currentNoteSpeed = noteSpeed + 30 * levelsPassed;
    lastSpeedUpdateScore = score;

    delayTimeCreateNote = 1500 - 80 * levelsPassed;

    console.log("Delay time", delayTimeCreateNote);
    if (delayTimeCreateNote < 600) {
      delayTimeCreateNote = 600;
      console.log("Delay time minimo", delayTimeCreateNote);
    }

    notes.getChildren().forEach((note) => {
      note.setVelocityY(currentNoteSpeed);
    });

    this.noteEvent.remove();
    this.noteEvent = this.time.addEvent({
      delay: delayTimeCreateNote,
      callback: () => {
        const randomLane = Phaser.Math.Between(0, 3);
        const notekey = ["note-a", "note-s", "note-d", "note-f"][randomLane];
        const note = notes
          .create(lanePositionsX[randomLane], -50, notekey)
          .setOrigin(0, 0)
          .setScale(noteScale);
        note.setVelocityY(currentNoteSpeed);
      },
      callbackScope: this,
      loop: true,
    });

    console.log("Aumenta velocidad a", currentNoteSpeed);
  }

  if (score === 0 && hasScored && !gameOverTimer) {
    if (isModalGameOverOpen && isEnter) {
      timesEscIsPressed = 0;
      this.gameOverModal.destroy();
      this.noteEvent.remove();
      this.scene.restart();
      failedNotes = 0;
      score = 0;
      hasScored = false;
      gameOverTimer = null;
      isModalGameOverOpen = false;
    }
  }
}

function addScore() {
  score += 10;
  hasScored = true;
  scoreText.setText("Score: " + score);

  if (gameOverTimer) {
    gameOverTimer.remove();
    gameOverTimer = null;
  }
}

function removeScore(scene) {
  if (score === 0) return;

  score -= 10;
  hasScored = true;
  scoreText.setText("Score: " + score);

  if (score === 100) {
    notes.getChildren().forEach((note) => {
      note.setVelocityY(currentNoteSpeed);
    });

    scene.noteEvent.remove();
    scene.noteEvent = scene.time.addEvent({
      delay: delayTimeCreateNote,
      callback: () => {
        const randomLane = Phaser.Math.Between(0, 3);
        const notekey = ["note-a", "note-s", "note-d", "note-f"][randomLane];
        const note = notes
          .create(lanePositionsX[randomLane], -50, notekey)
          .setOrigin(0, 0)
          .setScale(noteScale);
        note.setVelocityY(currentNoteSpeed);
      },
      callbackScope: scene,
      loop: true,
    });
  }

  if (score === 0 && hasScored && !gameOverTimer) {
    timesEscIsPressed = 3;
    isModalGameOverOpen = true;
    console.log("Game Over");
    Object.values(scene.noteSound).forEach((sound) => {
      if (sound) {
        sound.stop();
      }
      sound.destroy();
    });
    scene.gameOverModal = scene.add
      .image(480, 270, "game-over-modal")
      .setScale(0.7);
    scene.sound.play("gameover-sound");

    scene.physics.world.pause();
  }
}
