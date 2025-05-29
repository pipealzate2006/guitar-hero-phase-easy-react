interface GameOverModalProps {
  loser: boolean;
  score: number;
}

export default function GameOverModal({ loser, score }: GameOverModalProps) {
  return (
    <>
      {loser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="flex flex-col items-center justify-center bg-cyan-900 rounded-3xl border-5 border-orange-500 z-20"
            style={{ padding: "100px 50px" }}
          >
            <p className="text-white text-center text-xl font-bold md:text-4xl sm:text-xl">
              GAME OVER <span className="text-orange-500">:(</span>
            </p>
            <p className="text-white text-center text-xl font-bold md:text-2xl sm:text-xl">
              Your highest score was:{" "}
              <span className="text-orange-500 ">{score}</span>
            </p>
          </div>
          <div className="fixed bg-black opacity-50 z-10 h-screen w-screen"></div>
        </div>
      )}
    </>
  );
}
