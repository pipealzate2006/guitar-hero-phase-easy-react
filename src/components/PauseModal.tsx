interface PauseModalProps {
  isPaused: boolean;
}

export default function PauseModal({ isPaused }: PauseModalProps) {
  return (
    <>
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center justify-center bg-cyan-900 p-4 h-1/3 w-1/2 rounded-3xl border-5 border-orange-500 md:w-1/4 z-20">
            <p className="text-white text-center text-xl font-bold md:text-4xl sm:text-xl">
              PRESS <span className="text-orange-500">ESC</span> TO CONTINUE
            </p>
          </div>
          <div className="fixed bg-black opacity-50 z-10 h-screen w-screen"></div>
        </div>
      )}
    </>
  );
}
