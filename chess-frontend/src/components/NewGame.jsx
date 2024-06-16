import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

const NewGame = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const roomId = e.target.roomId.value;
    const playerName = e.target.playerName.value;

    socket.emit("create_room", roomId, playerName, (response) => {
      if (response.success) {
        console.log(response);
        navigate(
          `/play?roomId=${response.roomId}&side=${response.side}&name=${response.name}`
        );
        
      } else {
        console.error(response.message);
      }
    });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        name="playerName"
        id="playerName"
        className="p-2 border-2 border-gray-500 shadow outline-none"
        placeholder="Please Enter Your Name"
        required
      />
      <input
        type="text"
        name="roomId"
        id="roomId"
        className="p-2 border-2 border-gray-500 shadow outline-none"
        placeholder="Please Enter a unique Room Id"
        required
      />
      <div>
        <button
          className="px-4 p-2 bg-gray-900 rounded-md border-none text-white w-[10rem] max-w-[15rem]"
          type="submit"
        >
          Join Game
        </button>
      </div>
    </form>
  );
};

export default NewGame;
