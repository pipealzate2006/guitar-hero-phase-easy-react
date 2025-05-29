import GameCanvas from "./components/GameCanvas";
import "./App.css";
import { useEffect, useState } from "react";
import PauseModal from "./components/PauseModal";
import GameOverModal from "./components/GameOverModal";
import RegisterPlayer from "./components/RegisterPlayer";

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [loser, setLoser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [newPlayer, setNewPlayer] = useState({ name: "", score: 0 });

  useEffect(() => {
    console.log(newPlayer);
  }, [newPlayer]);

  return (
    <>
      <RegisterPlayer
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
      />

      <GameCanvas
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onLose={() => setLoser(true)}
        onBackToPlay={() => setLoser(false)}
        newPlayer={newPlayer}
        onScoreChange={(score: number) => setNewPlayer({ ...newPlayer, score })}
      />
      <PauseModal isPaused={isPaused} />
      <GameOverModal loser={loser} score={newPlayer.score} />
    </>
  );
}

export default App;
