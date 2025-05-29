import { useEffect, useRef } from "react";
import Phaser from "phaser";
import phaserConfig from "../phaser/game";
import MainSceneFactory from "../phaser/scenes/MainScene";

interface GameCanvasProps {
  onPause: () => void;
  onResume: () => void;
  onLose: () => void;
  onBackToPlay: () => void;
  newPlayer: { name: string; score: number };
  onScoreChange: (score: number) => void;
}

let game: Phaser.Game | null = null;

export default function GameCanvas({
  onPause,
  onResume,
  onLose,
  onBackToPlay,
  newPlayer,
  onScoreChange,
}: GameCanvasProps) {
  const newPlayerRef = useRef(newPlayer);

  useEffect(() => {
    newPlayerRef.current = newPlayer;
  }, [newPlayer]);

  useEffect(() => {
    if (!newPlayer.name) return;

    const configWithScene = {
      ...phaserConfig,
      scene: [
        MainSceneFactory(
          onPause,
          onResume,
          onLose,
          onBackToPlay,
          newPlayer,
          onScoreChange
        ),
      ],
    };

    if (game) {
      game.destroy(true);
      game = null;
    }

    game = new Phaser.Game(configWithScene);

    return () => {
      game?.destroy(true);
      game = null;
    };
  }, [newPlayer.name]);

  return (
    <div
      id="game"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#050510",
      }}
    ></div>
  );
}
