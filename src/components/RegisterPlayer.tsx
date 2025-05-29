import { useState } from "react";

interface IRegisterPlayer {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  newPlayer: { name: string; score: number };
  setNewPlayer: React.Dispatch<
    React.SetStateAction<{
      name: string;
      score: number;
    }>
  >;
}

const RegisterPlayer: React.FC<IRegisterPlayer> = ({
  isModalOpen,
  setIsModalOpen,
  newPlayer,
  setNewPlayer,
}) => {
  const [player, setPlayer] = useState({ name: "", score: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(newPlayer);
      setNewPlayer({ name: player.name, score: 0 });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isModalOpen && (
        <form
          onSubmit={handleSubmit}
          className="fixed flex justify-center items-center flex-col gap-2 h-screen w-screen"
        >
          <div
            className="flex flex-col bg-white rounded-lg text-black gap-10 z-20 p-10 m-10"
            style={{ padding: "20px" }}
          >
            <div className="flex flex-col justify-center items-center gap-2">
              <label htmlFor="name" className="text-xl font-bold">
                Name
              </label>
              <input
                style={{ padding: "5px" }}
                className="border-2 border-gray-400 rounded-lg focus:outline-none"
                placeholder="Enter your name"
                onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                value={player.name}
                name="name"
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                style={{ padding: "7px" }}
                type="submit"
                className="bg-black text-white rounded-lg font-bold m-4 p-2 cursor-pointer"
              >
                Start Game
              </button>
            </div>
          </div>
          <div className="fixed bg-black opacity-50 h-screen w-screen z-10"></div>
        </form>
      )}
    </>
  );
};

export default RegisterPlayer;
