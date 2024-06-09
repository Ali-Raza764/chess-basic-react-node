import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const App = () => {
  const [side, setSide] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const roomId = e.target.roomId.value;

    socket.emit("create_room", roomId, (response) => {
      if (response.success) {
        setSide(response.side);

        setRoomId(response.roomId);

        setPlayers(response.usersInRoom);

        alert("Joined You are " + response.side);
      } else {
        alert(response.message || "Failed to join room");
      }
    });
  };

  useEffect(() => {
    socket.on("userconnected", () => {
      console.log(players);
      setPlayers((prevPlayers) => prevPlayers + 1);
    });
    socket.on("user_left", () => {
      console.log(players);
      setPlayers((prevPlayers) => prevPlayers - 1);
    });
  }, []);

  return (
    <main className="w-full min-h-screen flex justify-between">
      {players === 2 && (
        <Board side={side} key={socket.id + side} roomId={roomId} />
      )}
      <section className="w-full p-6">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="p-2 border-2 border-gray-500 shadow outline-none"
          />
          <button className="px-4 p-2 bg-gray-900 rounded-md border-none text-white w-[10rem] max-w-[15rem]">
            Join game
          </button>
        </form>
        <div>{side && <h1>players Joined: {players}</h1>}</div>
      </section>
    </main>
  );
};

export default App;
