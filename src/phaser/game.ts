import Phaser from "phaser";
import MainSceneFactory from "./scenes/MainScene.ts";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#050510",
  parent: "game",
  scene: [MainSceneFactory],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};

export default config;
 