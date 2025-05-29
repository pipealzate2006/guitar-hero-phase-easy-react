import { noteScale, lanePositionsX, gameState } from "./gameState";
import type MainSceneFactory from "./scenes/MainScene";

export default class NoteManager {
  keys!: {
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    f: Phaser.Input.Keyboard.Key;
    esc: Phaser.Input.Keyboard.Key;
    enter: Phaser.Input.Keyboard.Key;
  };

  addNote(laneIndex: number, notes: Phaser.GameObjects.Group) {
    try {
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
      note.setVelocityY(gameState.currentNoteSpeed);
    } catch (error) {
      console.error(error);
    }
  }

  addKeys(scene: Phaser.Scene) {
    try {
      const keys = scene.input?.keyboard?.addKeys({
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        f: Phaser.Input.Keyboard.KeyCodes.F,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      });

      if (keys) {
        this.keys = keys as typeof this.keys;
      }
    } catch (error) {
      console.error(error);
    }
  }

  addScore(onScoreChange: (score: number) => void) {
    try {
      gameState.score += 10;
      gameState.hasScored = true;

      if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
      }
      gameState.scoreText?.setText("Score: " + gameState.score);
      onScoreChange(gameState.highScore);
    } catch (error) {
      console.error(error);
    }
  }

  destroyNote(note: Phaser.GameObjects.GameObject) {
    try {
      note.destroy();
    } catch (error) {
      console.error(error);
    }
  }

  removeScore(scene: Phaser.Scene) {
    try {
      if (gameState.score === 0) return;
      gameState.score -= 10;
      gameState.hasScored = true;
      gameState.scoreText?.setText("Score: " + gameState.score);

      const mainScene = scene as InstanceType<
        ReturnType<typeof MainSceneFactory>
      >;

      if (gameState.score === 0 && gameState.hasScored) {
        gameState.timesEscIsPressed = 3;
        Object.values(mainScene.noteSound).forEach((sound) => {
          if (sound) {
            sound.stop();
          }
          sound.destroy();
        });
        scene.sound.play("gameover-sound");
        mainScene.onLose();
        scene.physics.world.pause();
      }
    } catch (error) {
      console.error(error);
    }
  }

  pausegame(isEsc: boolean, scene: Phaser.Scene) {
    try {
      if (isEsc) {
        gameState.timesEscIsPressed += 1;

        const mainScene = scene as InstanceType<
          ReturnType<typeof MainSceneFactory>
        >;

        if (gameState.timesEscIsPressed === 1) {
          mainScene.noteEvent.paused = true;
          Object.values(mainScene.noteSound).forEach((sound) => {
            if (sound) {
              sound.pause();
            }
          });
          mainScene.physics.world.pause();
          mainScene.onPause();
        } else if (gameState.timesEscIsPressed === 2) {
          mainScene.noteEvent.paused = false;
          Object.values(mainScene.noteSound).forEach((sound) => {
            if (sound) {
              sound.resume();
            }
          });
          mainScene.physics.world.resume();
          gameState.timesEscIsPressed = 0;
          mainScene.onResume();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  backToPlay(isEnter: boolean, scene: Phaser.Scene) {
    try {
      if (gameState.score === 0 && gameState.hasScored) {
        if (isEnter) {
          const mainScene = scene as InstanceType<
            ReturnType<typeof MainSceneFactory>
          >;
          mainScene.onBackToPlay();
          gameState.timesEscIsPressed = 0;
          scene.scene.restart();
          gameState.score = 0;
          gameState.hasScored = false;
          gameState.isModalGameOverOpen = false;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}
