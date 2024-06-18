import { socket } from "../../socket";

const GameActions = ({ roomId, side }) => {
  return (
    <div className="w-full flex items-center gap-6 mt-4">
      <button className="px-4 p-2 font-bold bg-gray-900 text-white rounded-md">
        Draw
      </button>
      <button
        className="px-4 p-2 font-bold bg-gray-900 text-white rounded-md"
        onClick={() => socket.emit("resign", roomId, side)}
      >
        Resign
      </button>
    </div>
  );
};

export default GameActions;
