import Phaser from "phaser";
import config from "../game";
import pista from "../../assets/pista.png";
import buttonA from "../../assets/buttons/button-A.png";
import buttonS from "../../assets/buttons/button-S.png";
import buttonD from "../../assets/buttons/button-D.png";
import buttonF from "../../assets/buttons/button-F.png";
import { gameState, lanePositionsX } from "../gameState";
import NoteManager from "../NoteManager";
import noteA from "../../assets/notes/note-A.png";
import noteS from "../../assets/notes/note-S.png";
import noteD from "../../assets/notes/note-D.png";
import noteF from "../../assets/notes/note-F.png";
import gameoverSound from "../../assets/audios/gameover-sound.wav";
import noteSoundA from "../../assets/audios/sound-a.wav";
import noteSoundS from "../../assets/audios/sound-s.wav";

export default function MainSceneFactory(
  onPause: () => void,
  onResume: () => void,
  onLose: () => void,
  onBackToPlay: () => void,
  newPlayer: { name: string; score: number },
  onScoreChange: (score: number) => void
) {
  return class MainScene extends Phaser.Scene {
    onPause = onPause;
    onResume = onResume;
    onLose = onLose;
    onBackToPlay = onBackToPlay;
    onScoreChange = onScoreChange;
    newPlayer = newPlayer;

    notes!: Phaser.GameObjects.Group;
    noteEvent!: Phaser.Time.TimerEvent;

    noteManager!: NoteManager;

    hitZoneY = 450;
    hitZoneHeight = 60;

    noteSound!: {
      a: Phaser.Sound.BaseSound;
      s: Phaser.Sound.BaseSound;
    };

    startGame = newPlayer.name !== "" ? true : false;
    constructor() {
      super("MainScene");
      gameState.score = newPlayer.score;
    }

    preload() {
      //load the track
      this.load.image("pista", pista);

      //load the buttons
      this.load.image("button-a", buttonA);
      this.load.image("button-s", buttonS);
      this.load.image("button-d", buttonD);
      this.load.image("button-f", buttonF);

      //load the notes
      this.load.image("note-a", noteA);
      this.load.image("note-s", noteS);
      this.load.image("note-d", noteD);
      this.load.image("note-f", noteF);

      ///load audio
      this.load.audio("note-a", noteSoundA);
      this.load.audio("note-s", noteSoundS);
      this.load.audio("gameover-sound", gameoverSound);
    }

    create() {
      this.noteManager = new NoteManager();

      this.add
        .image(
          (config.width as number) / 2,
          (config.height as number) / 2,
          "pista"
        )
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

      //create notes
      this.notes = this.physics.add.group();

      //create note event
      if (this.startGame) {
        this.noteEvent = this.time.addEvent({
          delay: gameState.delayTimeCreateNote,
          callback: () => {
            const randomLane = Phaser.Math.Between(0, 3);
            this.noteManager.addNote(randomLane, this.notes);
          },
          callbackScope: this,
          loop: true,
        });
      }

      //create keys
      this.noteManager.addKeys(this);

      //create player
      this.add.text(10, 50, this.newPlayer.name, {
        fontSize: "32px",
        color: "#fff",
      });

      //create score
      gameState.scoreText = this.add.text(10, 10, "Score: " + gameState.score, {
        fontSize: "32px",
        color: "#fff",
      });

      //create audio
      this.noteSound = {
        a: this.sound.add("note-a"),
        s: this.sound.add("note-s"),
      };
    }

    update() {
      const isA = Phaser.Input.Keyboard.JustDown(this.noteManager.keys.a);
      const isS = Phaser.Input.Keyboard.JustDown(this.noteManager.keys.s);
      const isD = Phaser.Input.Keyboard.JustDown(this.noteManager.keys.d);
      const isF = Phaser.Input.Keyboard.JustDown(this.noteManager.keys.f);
      const isEsc = Phaser.Input.Keyboard.JustDown(this.noteManager.keys.esc);
      const isEnter = Phaser.Input.Keyboard.JustDown(
        this.noteManager.keys.enter
      );

      //pause game
      this.noteManager.pausegame(isEsc, this);

      let didHitNote = false;

      this.notes.getChildren().forEach((note) => {
        const sprite = note as Phaser.Physics.Arcade.Image;

        const inHitZone =
          sprite.y > this.hitZoneY &&
          sprite.y < this.hitZoneY + this.hitZoneHeight / 2;

        if (inHitZone) {
          if (
            isA &&
            Math.abs(sprite.x - lanePositionsX[0]) < 30 &&
            sprite.texture.key === "note-a"
          ) {
            this.noteManager.addScore(this.onScoreChange);
            this.noteManager.destroyNote(note);
            this.noteSound.a.play();
            didHitNote = true;
          } else if (
            isS &&
            Math.abs(sprite.x - lanePositionsX[1]) < 30 &&
            sprite.texture.key === "note-s"
          ) {
            this.noteManager.addScore(this.onScoreChange);
            this.noteManager.destroyNote(note);
            this.noteSound.s.play();
            didHitNote = true;
          } else if (
            isD &&
            Math.abs(sprite.x - lanePositionsX[2]) < 30 &&
            sprite.texture.key === "note-d"
          ) {
            this.noteManager.addScore(this.onScoreChange);
            this.noteManager.destroyNote(note);
            this.noteSound.a.play();
            didHitNote = true;
          } else if (
            isF &&
            Math.abs(sprite.x - lanePositionsX[3]) < 30 &&
            sprite.texture.key === "note-f"
          ) {
            this.noteManager.addScore(this.onScoreChange);
            this.noteManager.destroyNote(note);
            this.noteSound.s.play();
            didHitNote = true;
          }
        }

        if (sprite.y > this.cameras.main.height + 50) {
          this.noteManager.destroyNote(note);
          this.noteManager.removeScore(this);
        }
      });

      //check if the player missed a note
      if ((isA || isS || isD || isF) && !didHitNote) {
        this.noteManager.removeScore(this);
      }

      //reset game
      this.noteManager.backToPlay(isEnter, this);
    }
  };
}
